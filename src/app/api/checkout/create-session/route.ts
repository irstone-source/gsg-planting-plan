import { NextRequest, NextResponse } from 'next/server';
import { stripe, ACTIVATION_PASS_PRICES } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get user from Supabase auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }

    const { tier, affiliateCode, partnerCode } = await request.json();

    if (!['diy', 'pro'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const priceConfig = ACTIVATION_PASS_PRICES[tier as 'diy' | 'pro'];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `${tier.toUpperCase()} Activation Pass`,
            description: `3 months access + ${priceConfig.credits} plan credits + ${priceConfig.vaultSlots} vault slot${priceConfig.vaultSlots > 1 ? 's' : ''}`
          },
          unit_amount: priceConfig.amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        tier,
        affiliateCode: affiliateCode || '',
        partnerCode: partnerCode || ''
      }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
