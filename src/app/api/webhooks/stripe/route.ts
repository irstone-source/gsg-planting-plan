import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/lib/email-templates';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, tier, affiliateCode, partnerCode } = session.metadata!;

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3); // 3 months from now

    const priceConfig = tier === 'diy'
      ? { credits: 5, vaultSlots: 1, price: 7900 }
      : { credits: 20, vaultSlots: 5, price: 24900 };

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Create activation pass
    const { error } = await supabase
      .from('activation_passes')
      .insert({
        user_id: userId,
        tier,
        price_paid: priceConfig.price,
        credits_total: priceConfig.credits,
        credits_remaining: priceConfig.credits,
        vault_slots: priceConfig.vaultSlots,
        expires_at: expiresAt.toISOString(),
        status: 'active',
        stripe_payment_intent: session.payment_intent as string,
        stripe_session_id: session.id,
        affiliate_code: affiliateCode || null,
        partner_code: partnerCode || null
      });

    if (error) {
      console.error('Failed to create activation pass:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Track affiliate conversion (if applicable)
    if (affiliateCode) {
      await supabase
        .from('affiliate_clicks')
        .update({ converted: true, conversion_id: userId })
        .eq('affiliate_code', affiliateCode)
        .order('clicked_at', { ascending: false })
        .limit(1);
    }

    // Send immediate welcome email
    try {
      // Get user profile for email
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      if (profile?.email) {
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'PlantingPlans <hello@plantingplans.co.uk>',
          to: [profile.email],
          subject: `Welcome to PlantingPlans! Your ${tier.toUpperCase()} Pass is Active 🎉`,
          react: WelcomeEmail({
            name: profile.full_name || '',
            tier: tier as 'diy' | 'pro',
            credits: priceConfig.credits,
            vaultSlots: priceConfig.vaultSlots,
            expiresAt: expiresAt.toISOString(),
          }),
        });

        if (!emailError) {
          // Log welcome email sent
          await supabase.from('email_onboarding_log').insert({
            user_id: userId,
            email_type: 'welcome',
            resend_id: emailData?.id || '',
            status: 'sent',
          });

          console.log(`Welcome email sent to ${profile.email}`);
        } else {
          console.error('Failed to send welcome email:', emailError);
        }
      }
    } catch (emailErr: any) {
      console.error('Welcome email error:', emailErr);
      // Don't fail the webhook if email fails - activation pass is still created
    }

    console.log(`Activation pass created for user ${userId} (${tier})`);
  }

  return NextResponse.json({ received: true });
}
