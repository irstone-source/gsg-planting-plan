/**
 * Admin Plant Suggestions API
 * GET /api/admin/plant-suggestions
 * Fetch all plant preset suggestions for admin review
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

    // Fetch all suggestions
    const { data: suggestions, error: fetchError } = await supabase
      .from('plant_preset_suggestions')
      .select('*')
      .order('confidence_score', { ascending: false })
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch suggestions', details: fetchError.message },
        { status: 500 }
      );
    }

    // Group by status for statistics
    const statistics = {
      total: suggestions?.length || 0,
      pending: suggestions?.filter(s => s.status === 'pending').length || 0,
      approved: suggestions?.filter(s => s.status === 'approved').length || 0,
      rejected: suggestions?.filter(s => s.status === 'rejected').length || 0,
      deferred: suggestions?.filter(s => s.status === 'deferred').length || 0,
      high_confidence: suggestions?.filter(s => s.confidence_score >= 0.8).length || 0
    };

    return NextResponse.json({
      suggestions: suggestions || [],
      statistics
    });

  } catch (error: any) {
    console.error('Admin suggestions fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch suggestions',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
