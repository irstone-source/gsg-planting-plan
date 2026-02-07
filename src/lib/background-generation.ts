import { supabase } from './supabase';
import { analyzeSitePhotos } from './vision-analysis';
import { generatePlantRecommendations } from './recommendations';
import type { PlantMatchCriteria } from './plant-matching';
import type { VisionAnalysisResult } from './vision-analysis';

interface BackgroundGenerationOptions {
  hasImages: boolean;
  imageUrls: string[];
  designerStyle?: string;
  selectedStyleSlug?: string;
}

/**
 * Trigger background generation for a plan via webhook
 * This function returns immediately and the webhook processes async in separate function
 */
export function triggerBackgroundGeneration(
  planId: string,
  options: BackgroundGenerationOptions
) {
  // Call webhook in separate serverless function - fire and forget
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  fetch(`${baseUrl}/api/process-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, options }),
  }).catch((error) => {
    console.error(`❌ Failed to trigger background generation for plan ${planId}:`, error);
  });

  // Return immediately
  console.log(`✓ Background generation webhook triggered for plan ${planId}`);
}

/**
 * Process plan generation in the background
 * This function runs in a separate serverless function with longer timeout
 * EXPORTED for use by /api/process-plan webhook
 */
export async function processGenerationInBackground(
  planId: string,
  options: BackgroundGenerationOptions
) {
  console.log(`🚀 Starting background generation for plan ${planId}`);
  const startTime = Date.now();

  // 1. Fetch plan and site data
  console.log(`📥 Fetching plan data for ${planId}...`);
  const { data: plan, error: planError } = await supabase
    .from('planting_plans')
    .select(`
      *,
      site_analyses (*)
    `)
    .eq('id', planId)
    .single();

  if (planError || !plan) {
    throw new Error(`Plan not found: ${planError?.message || 'Unknown error'}`);
  }

  const siteAnalysis = plan.site_analyses;
  let visionAnalysis: VisionAnalysisResult | null = null;

  // 2. Vision analysis if images provided
  if (options.hasImages && options.imageUrls.length > 0) {
    console.log(`👁️ Running vision analysis for plan ${planId} (${options.imageUrls.length} images)...`);
    const visionStartTime = Date.now();

    try {
      // Fetch images from Supabase Storage and convert to base64
      const imagesForVision = await Promise.all(
        options.imageUrls.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.statusText}`);
            }

            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');

            // Determine media type from URL extension
            const ext = url.split('.').pop()?.toLowerCase() || 'jpeg';
            const mediaType = ext === 'png' ? 'image/png' as const : 'image/jpeg' as const;

            return { data: base64, mediaType };
          } catch (error) {
            console.error(`❌ Failed to process image ${url}:`, error);
            throw error;
          }
        })
      );

      visionAnalysis = await analyzeSitePhotos(imagesForVision);

      // Update site analysis with vision results
      const { error: visionUpdateError } = await supabase
        .from('site_analyses')
        .update({
          vision_analysis: visionAnalysis,
          sun_exposure: visionAnalysis.sunExposure.assessment,
        })
        .eq('id', siteAnalysis.id);

      if (visionUpdateError) {
        console.warn(`⚠️ Failed to update site analysis with vision results:`, visionUpdateError);
      }

      const visionDuration = Date.now() - visionStartTime;
      console.log(`✓ Vision analysis complete for plan ${planId} (${visionDuration}ms)`);
    } catch (error) {
      console.warn(`⚠️ Vision analysis failed for plan ${planId}:`, error);
      // Continue without vision - use form data
      visionAnalysis = null;
    }
  } else {
    console.log(`ℹ️ No images provided for plan ${planId}, skipping vision analysis`);
  }

  // 3. Generate plant recommendations
  console.log(`🌿 Generating plant recommendations for plan ${planId}...`);
  const recsStartTime = Date.now();

  try {
    // Prepare matching criteria
    const criteria: PlantMatchCriteria = {
      rhsZone: siteAnalysis.rhs_zone,
      sunExposure: siteAnalysis.sun_exposure,
      soilType: siteAnalysis.soil_type,
      moisture: siteAnalysis.moisture,
      style: plan.style,
      maintenanceLevel: plan.maintenance_level,
      budgetMin: plan.budget_min,
      budgetMax: plan.budget_max,
      areaSqm: siteAnalysis.area_sqm,
    };

    // Generate recommendations
    const result = await generatePlantRecommendations(criteria, visionAnalysis, {
      style: plan.style,
      maintenanceLevel: plan.maintenance_level,
      specialRequirements: plan.special_requirements,
    });

    console.log(`✓ Generated ${result.recommendations.length} plant recommendations`);

    // Insert recommendations into database
    const recommendationsToInsert = result.recommendations.map(rec => ({
      planting_plan_id: planId,
      plant_id: rec.plant_id,
      quantity: rec.quantity,
      position: rec.position,
      rationale: rec.rationale,
    }));

    const { error: insertError } = await supabase
      .from('plant_recommendations')
      .insert(recommendationsToInsert);

    if (insertError) {
      throw new Error(`Failed to insert recommendations: ${insertError.message}`);
    }

    console.log(`✓ Recommendations stored for plan ${planId}`);

    // Update plan status to complete with results
    const { error: updateError } = await supabase
      .from('planting_plans')
      .update({
        status: 'complete',
        total_cost: result.total_cost,
        design_rationale: result.design_notes || visionAnalysis?.overallAssessment || `${options.designerStyle ? options.designerStyle + ' style plan' : 'Planting plan'} based on site conditions and preferences.`,
      })
      .eq('id', planId);

    if (updateError) {
      throw new Error(`Failed to update plan status: ${updateError.message}`);
    }

    const recsDuration = Date.now() - recsStartTime;
    console.log(`✓ Recommendations generation complete for plan ${planId} (${recsDuration}ms)`);
  } catch (error) {
    console.error(`❌ Recommendations failed for plan ${planId}:`, error);
    throw error;
  }

  const totalDuration = Date.now() - startTime;
  console.log(`✅ Plan ${planId} generation complete! Total time: ${totalDuration}ms`);
}
