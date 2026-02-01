/**
 * Admin Plant Evidence Update API
 * POST /api/admin/plant-evidence/update
 * Update verification status of plant evidence
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/supabase-auth';
import { sendEvidenceVerifiedEmail, sendEvidenceRejectedEmail } from '@/lib/email-notifications';

export const runtime = 'nodejs';

interface UpdateRequest {
  evidence_id: string;
  status: 'verified' | 'rejected' | 'needs_review';
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
    if (!body.evidence_id) {
      return NextResponse.json(
        { error: 'Missing evidence_id in request body' },
        { status: 400 }
      );
    }

    if (!body.status || !['verified', 'rejected', 'needs_review'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: verified, rejected, or needs_review' },
        { status: 400 }
      );
    }

    // Update evidence status
    const { data: updatedEvidence, error: updateError } = await supabase
      .from('plant_evidence')
      .update({
        verification_status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.evidence_id)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update evidence status', details: updateError.message },
        { status: 500 }
      );
    }

    // Get uploader email for notifications
    const { data: uploaderData } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', updatedEvidence.uploaded_by)
      .single();

    const uploaderEmail = uploaderData?.email;

    // If verified, trigger verification API runs and send email
    if (body.status === 'verified') {
      // Trigger verification API (async, don't wait)
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/plant/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidence_id: updatedEvidence.id,
          botanical_name_hint: updatedEvidence.botanical_name
        })
      }).catch(err => console.error('Verification trigger failed:', err));

      // Send email notification
      if (uploaderEmail) {
        sendEvidenceVerifiedEmail(
          uploaderEmail,
          updatedEvidence.botanical_name,
          updatedEvidence.evidence_type,
          updatedEvidence.image_url
        ).catch(err => console.error('Email notification failed:', err));
      }
    }

    // If rejected, send email
    if (body.status === 'rejected' && uploaderEmail) {
      sendEvidenceRejectedEmail(
        uploaderEmail,
        updatedEvidence.botanical_name,
        updatedEvidence.evidence_type,
        body.review_notes
      ).catch(err => console.error('Email notification failed:', err));
    }

    return NextResponse.json({
      success: true,
      evidence: updatedEvidence,
      message: `Evidence marked as ${body.status}`
    });

  } catch (error: any) {
    console.error('Admin evidence update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update evidence',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
