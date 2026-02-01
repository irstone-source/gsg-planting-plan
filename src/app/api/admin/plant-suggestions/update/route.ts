/**
 * Admin Plant Suggestions Update API
 * POST /api/admin/plant-suggestions/update
 * Approve, reject, or defer plant preset suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/supabase-auth';
import { sendSuggestionApprovedEmail } from '@/lib/email-notifications';

export const runtime = 'nodejs';

interface UpdateRequest {
  suggestion_id: string;
  status: 'approved' | 'rejected' | 'deferred';
  review_notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication and admin role
    const user = await requireAuth();

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body: UpdateRequest = await request.json();

    // Validate required fields
    if (!body.suggestion_id) {
      return NextResponse.json(
        { error: 'Missing suggestion_id in request body' },
        { status: 400 }
      );
    }

    if (!body.status || !['approved', 'rejected', 'deferred'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: approved, rejected, or deferred' },
        { status: 400 }
      );
    }

    // Fetch the suggestion to get botanical name and values
    const { data: suggestion, error: fetchError } = await supabase
      .from('plant_preset_suggestions')
      .select('*')
      .eq('id', body.suggestion_id)
      .single();

    if (fetchError || !suggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found', details: fetchError?.message },
        { status: 404 }
      );
    }

    // Update suggestion status
    const { data: updatedSuggestion, error: updateError } = await supabase
      .from('plant_preset_suggestions')
      .update({
        status: body.status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: body.review_notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.suggestion_id)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update suggestion status', details: updateError.message },
        { status: 500 }
      );
    }

    // If approved, apply changes to presets.ts and create audit log
    if (body.status === 'approved') {
      // Create audit log entry
      const { error: auditError } = await supabase
        .from('plant_preset_audit')
        .insert({
          botanical_name: suggestion.botanical_name,
          wfo_id: suggestion.wfo_id,
          suggestion_id: suggestion.id,
          change_type: 'preset_update',
          previous_values: suggestion.current_value ? JSON.parse(suggestion.current_value) : null,
          new_values: JSON.parse(suggestion.suggested_value),
          applied_by: user.id,
          applied_at: new Date().toISOString(),
          rollback_possible: true
        });

      if (auditError) {
        console.error('Audit log error:', auditError);
        // Continue despite audit error
      }

      // Trigger preset regeneration (async, don't wait)
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/plant-presets/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion_id: suggestion.id })
      }).catch(err => console.error('Preset regeneration failed:', err));

      // Send email notification
      sendSuggestionApprovedEmail(
        suggestion.botanical_name,
        suggestion.suggestion_type,
        suggestion.current_value || 'Not set',
        suggestion.suggested_value,
        suggestion.confidence_score
      ).catch(err => console.error('Email notification failed:', err));
    }

    return NextResponse.json({
      success: true,
      suggestion: updatedSuggestion,
      message: `Suggestion ${body.status}${body.status === 'approved' ? ' and queued for preset update' : ''}`
    });

  } catch (error: any) {
    console.error('Admin suggestion update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update suggestion',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
