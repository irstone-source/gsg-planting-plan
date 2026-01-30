import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { affiliateCode, ipAddress, userAgent } = await request.json();

    if (!affiliateCode) {
      return NextResponse.json(
        { success: false, error: 'Affiliate code required' },
        { status: 400 }
      );
    }

    // Verify affiliate exists and is active
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id, code, status')
      .eq('code', affiliateCode)
      .single();

    if (affiliateError || !affiliate) {
      console.warn('Invalid affiliate code:', affiliateCode);
      return NextResponse.json(
        { success: false, error: 'Invalid affiliate code' },
        { status: 404 }
      );
    }

    if (affiliate.status !== 'active') {
      console.warn('Inactive affiliate:', affiliateCode);
      return NextResponse.json(
        { success: false, error: 'Affiliate not active' },
        { status: 403 }
      );
    }

    // Record click
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        affiliate_code: affiliateCode,
        ip_address: ipAddress,
        user_agent: userAgent,
        clicked_at: new Date().toISOString(),
        converted: false,
      });

    if (clickError) {
      console.error('Failed to record affiliate click:', clickError);
      throw new Error('Failed to record click');
    }

    // Increment click count
    await supabase
      .from('affiliates')
      .update({
        total_clicks: affiliate.id ? supabase.rpc('increment', { row_id: affiliate.id }) : 0,
      })
      .eq('code', affiliateCode);

    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully',
    });
  } catch (error: any) {
    console.error('Track click error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to track click' },
      { status: 500 }
    );
  }
}
