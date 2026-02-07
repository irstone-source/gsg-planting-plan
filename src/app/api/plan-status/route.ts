import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/plan-status?planId=xxx
 * Returns the current generation status of a plan
 */
export async function GET(request: NextRequest) {
  try {
    const planId = request.nextUrl.searchParams.get('planId');

    if (!planId) {
      return NextResponse.json(
        { error: 'Missing planId parameter' },
        { status: 400 }
      );
    }

    // Fetch plan status
    const { data: plan, error } = await supabase
      .from('planting_plans')
      .select('id, status, design_rationale')
      .eq('id', planId)
      .single();

    if (error || !plan) {
      console.error(`❌ Plan not found: ${planId}`, error);
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      planId: plan.id,
      status: plan.status, // 'draft', 'generating', 'complete', 'error'
      message: plan.design_rationale || 'Processing...',
    });
  } catch (error) {
    console.error('❌ Error fetching plan status:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch plan status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
