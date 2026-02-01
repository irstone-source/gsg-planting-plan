/**
 * Admin Plant Evidence API
 * GET /api/admin/plant-evidence
 * Fetch all plant evidence for admin review
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/supabase-auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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

    // Fetch all evidence
    const { data: evidence, error: fetchError } = await supabase
      .from('plant_evidence')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch evidence', details: fetchError.message },
        { status: 500 }
      );
    }

    // Group by status for statistics
    const statistics = {
      total: evidence?.length || 0,
      pending: evidence?.filter(e => e.verification_status === 'pending').length || 0,
      verified: evidence?.filter(e => e.verification_status === 'verified').length || 0,
      rejected: evidence?.filter(e => e.verification_status === 'rejected').length || 0,
      needs_review: evidence?.filter(e => e.verification_status === 'needs_review').length || 0
    };

    return NextResponse.json({
      evidence: evidence || [],
      statistics
    });

  } catch (error: any) {
    console.error('Admin evidence fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch evidence',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
