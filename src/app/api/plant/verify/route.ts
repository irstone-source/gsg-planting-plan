/**
 * Plant Verification API
 * POST /api/plant/verify
 * Runs species identification via iNaturalist CV and GBIF Backbone
 * Aggregates confidence scores and creates verification runs
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/supabase-auth';
import { identifySpecies } from '@/lib/verification/inaturalist';
import { matchTaxonomy } from '@/lib/verification/gbif';

export const runtime = 'nodejs';
export const maxDuration = 30; // Allow up to 30 seconds for API calls

interface VerifyRequest {
  evidence_id: string;
  botanical_name_hint?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication and admin role (only admins can trigger verification)
    const user = await requireAuth();

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required to run verification' },
        { status: 403 }
      );
    }

    const body: VerifyRequest = await request.json();

    // Validate evidence_id
    if (!body.evidence_id) {
      return NextResponse.json(
        { error: 'Missing evidence_id in request body' },
        { status: 400 }
      );
    }

    // Fetch evidence record
    const { data: evidence, error: fetchError } = await supabase
      .from('plant_evidence')
      .select('*')
      .eq('id', body.evidence_id)
      .single();

    if (fetchError || !evidence) {
      return NextResponse.json(
        { error: 'Evidence not found', details: fetchError?.message },
        { status: 404 }
      );
    }

    const botanicalHint = body.botanical_name_hint || evidence.botanical_name;
    const results: any[] = [];

    // 1. Run iNaturalist Computer Vision
    let inaturalistResult = null;
    try {
      const inatData = await identifySpecies(evidence.image_url, botanicalHint);

      // Create verification run record
      const { data: inatRun, error: inatError } = await supabase
        .from('plant_verification_runs')
        .insert({
          evidence_id: evidence.id,
          verification_backend: 'inaturalist_cv',
          input_data: {
            image_url: evidence.image_url,
            botanical_name_hint: botanicalHint
          },
          output_data: inatData,
          candidate_taxa: inatData.taxa.map((t: any) => ({
            name: t.name,
            confidence: t.score / 100,
            rank: t.rank,
            source: 'inaturalist_cv',
            common_name: t.common_name
          })),
          top_match: inatData.taxa[0]?.name || null,
          confidence_score: inatData.taxa[0]?.score / 100 || 0,
          processing_time_ms: inatData.processing_time_ms,
          provenance: {
            api_version: inatData.api_version,
            endpoint: 'computervision/score_image',
            taxa_count: inatData.taxa.length
          }
        })
        .select()
        .single();

      if (!inatError && inatRun) {
        inaturalistResult = inatRun;
        results.push(inaturalistResult);
      }
    } catch (error: any) {
      console.error('iNaturalist verification failed:', error);
      // Continue with other verifications even if this one fails
    }

    // 2. Run GBIF Backbone Taxonomy Match
    let gbifResult = null;
    try {
      const gbifData = await matchTaxonomy(botanicalHint, false);

      if (gbifData.match) {
        // Create verification run record
        const { data: gbifRun, error: gbifError } = await supabase
          .from('plant_verification_runs')
          .insert({
            evidence_id: evidence.id,
            verification_backend: 'gbif_backbone',
            input_data: {
              botanical_name: botanicalHint,
              strict: false
            },
            output_data: gbifData,
            candidate_taxa: [
              {
                name: gbifData.match.scientificName,
                confidence: gbifData.match.confidence / 100,
                rank: gbifData.match.rank,
                source: 'gbif_backbone',
                status: gbifData.match.status
              },
              ...gbifData.alternatives.map((alt: any) => ({
                name: alt.scientificName,
                confidence: alt.confidence / 100,
                rank: alt.rank,
                source: 'gbif_backbone',
                status: alt.status
              }))
            ],
            top_match: gbifData.match.canonicalName,
            confidence_score: gbifData.match.confidence / 100,
            accepted_name: gbifData.match.acceptedScientificName || gbifData.match.scientificName,
            taxonomic_status: gbifData.match.status.toLowerCase(),
            processing_time_ms: gbifData.processing_time_ms,
            provenance: {
              api_version: gbifData.api_version,
              match_type: gbifData.match.matchType,
              usage_key: gbifData.match.usageKey
            }
          })
          .select()
          .single();

        if (!gbifError && gbifRun) {
          gbifResult = gbifRun;
          results.push(gbifResult);
        }
      }
    } catch (error: any) {
      console.error('GBIF verification failed:', error);
      // Continue even if GBIF fails
    }

    // 3. Calculate aggregated confidence
    const confidenceScores = results
      .map(r => r.confidence_score)
      .filter(s => s !== null && s !== undefined);

    const aggregatedConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0;

    // 4. Determine consensus botanical name
    const topMatches = results.map(r => r.top_match).filter(Boolean);
    const consensusName = topMatches.length > 0 ? topMatches[0] : botanicalHint;

    // 5. Check if suggestion should be created
    const shouldCreateSuggestion = aggregatedConfidence >= 0.6 && consensusName !== evidence.botanical_name;

    if (shouldCreateSuggestion) {
      // Create species correction suggestion
      const { error: suggestionError } = await supabase
        .from('plant_preset_suggestions')
        .insert({
          botanical_name: evidence.botanical_name,
          wfo_id: evidence.wfo_id,
          evidence_ids: [evidence.id],
          verification_run_ids: results.map(r => r.id),
          suggestion_type: 'species_correction',
          current_value: JSON.stringify({ botanical_name: evidence.botanical_name }),
          suggested_value: JSON.stringify({ botanical_name: consensusName }),
          confidence_score: aggregatedConfidence,
          rationale: `Verification APIs suggest "${consensusName}" instead of "${evidence.botanical_name}". Based on ${results.length} verification backends with ${(aggregatedConfidence * 100).toFixed(0)}% average confidence.`,
          status: aggregatedConfidence >= 0.8 ? 'approved' : 'pending' // Auto-approve high confidence
        });

      if (suggestionError) {
        console.error('Failed to create suggestion:', suggestionError);
      }
    }

    // Return verification results
    return NextResponse.json({
      success: true,
      evidence_id: evidence.id,
      verification_runs: results.length,
      backends_used: results.map(r => r.verification_backend),
      aggregated_confidence: aggregatedConfidence,
      consensus_name: consensusName,
      matches_original: consensusName === evidence.botanical_name,
      suggestion_created: shouldCreateSuggestion,
      results: results.map(r => ({
        id: r.id,
        backend: r.verification_backend,
        top_match: r.top_match,
        confidence: r.confidence_score,
        processing_time_ms: r.processing_time_ms
      }))
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      {
        error: 'Verification failed',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/plant/verify',
    method: 'POST',
    description: 'Run species verification via iNaturalist CV and GBIF Backbone',
    authentication: 'Required (Admin role)',
    request_body: {
      evidence_id: 'UUID (required) - Evidence record to verify',
      botanical_name_hint: 'string (optional) - Hint to improve accuracy'
    },
    response: {
      success: 'boolean',
      evidence_id: 'UUID',
      verification_runs: 'number - Count of backends run',
      backends_used: 'string[] - Backend names',
      aggregated_confidence: 'number - 0..1',
      consensus_name: 'string - Most likely botanical name',
      matches_original: 'boolean - Whether consensus matches original',
      suggestion_created: 'boolean - Whether preset suggestion was created',
      results: 'Array<{ backend, top_match, confidence, processing_time_ms }>'
    },
    verification_backends: [
      {
        name: 'inaturalist_cv',
        description: 'iNaturalist Computer Vision - Species ID from photo',
        api_url: 'https://api.inaturalist.org/v1/computervision/score_image'
      },
      {
        name: 'gbif_backbone',
        description: 'GBIF Backbone Taxonomy - Taxonomic validation',
        api_url: 'https://api.gbif.org/v1/species/match'
      }
    ],
    confidence_thresholds: {
      auto_approve: 0.8,
      create_suggestion: 0.6,
      needs_review: 0.4
    }
  });
}
