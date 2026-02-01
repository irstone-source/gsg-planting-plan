import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import {
  WelcomeEmail,
  QuickWinEmail,
  InspirationEmail,
  UrgencyEmail,
} from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = {
    quickWin: { sent: 0, errors: 0 },
    inspiration: { sent: 0, errors: 0 },
    urgency: { sent: 0, errors: 0 },
  };

  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Day 1: Quick Win Email (24h after purchase)
    const { data: day1Users } = await supabase
      .from('activation_passes')
      .select('user_id, tier, credits_remaining, purchased_at, user:user_profiles!inner(email, full_name)')
      .eq('status', 'active')
      .gte('purchased_at', oneDayAgo.toISOString())
      .lt('purchased_at', new Date(oneDayAgo.getTime() - 1 * 60 * 60 * 1000).toISOString()); // 23-24 hours ago

    if (day1Users) {
      for (const pass of day1Users) {
        try {
          // Type assertion for Supabase relation
          const user = pass.user as unknown as { email: string; full_name: string | null } | null;

          // Check if email already sent
          const { data: existing } = await supabase
            .from('email_onboarding_log')
            .select('id')
            .eq('user_id', pass.user_id)
            .eq('email_type', 'quick_win_day1')
            .single();

          if (!existing && user?.email) {
            const { data, error } = await resend.emails.send({
              from: 'PlantingPlans <hello@plantingplans.co.uk>',
              to: [user.email],
              subject: 'Quick Win: Create Your First Plan in 3 Minutes ⚡',
              react: QuickWinEmail({
                name: user.full_name || '',
                credits: pass.credits_remaining,
              }),
            });

            if (error) {
              throw error;
            }

            // Log email sent
            await supabase.from('email_onboarding_log').insert({
              user_id: pass.user_id,
              email_type: 'quick_win_day1',
              resend_id: data?.id || '',
              status: 'sent',
            });

            results.quickWin.sent++;
          }
        } catch (error: any) {
          console.error('Quick win email error:', error);
          results.quickWin.errors++;

          // Log failure
          await supabase.from('email_onboarding_log').insert({
            user_id: pass.user_id,
            email_type: 'quick_win_day1',
            status: 'failed',
            error_message: error.message || 'Unknown error',
          });
        }
      }
    }

    // Day 3: Inspiration Email
    const { data: day3Users } = await supabase
      .from('activation_passes')
      .select('user_id, tier, purchased_at, user:user_profiles!inner(email, full_name)')
      .eq('status', 'active')
      .gte('purchased_at', threeDaysAgo.toISOString())
      .lt('purchased_at', new Date(threeDaysAgo.getTime() - 1 * 60 * 60 * 1000).toISOString()); // 71-72 hours ago

    if (day3Users) {
      for (const pass of day3Users) {
        try {
          // Type assertion for Supabase relation
          const user = pass.user as unknown as { email: string; full_name: string | null } | null;

          // Check if email already sent
          const { data: existing } = await supabase
            .from('email_onboarding_log')
            .select('id')
            .eq('user_id', pass.user_id)
            .eq('email_type', 'inspiration_day3')
            .single();

          // Check if user has created a plan
          const { data: plans } = await supabase
            .from('planting_plans')
            .select('id')
            .eq('user_id', pass.user_id)
            .limit(1);

          if (!existing && user?.email) {
            const { data, error } = await resend.emails.send({
              from: 'PlantingPlans <hello@plantingplans.co.uk>',
              to: [user.email],
              subject: 'Inspiration from Real Gardens 🌿',
              react: InspirationEmail({
                name: user.full_name || '',
                hasCreatedPlan: (plans?.length || 0) > 0,
              }),
            });

            if (error) {
              throw error;
            }

            // Log email sent
            await supabase.from('email_onboarding_log').insert({
              user_id: pass.user_id,
              email_type: 'inspiration_day3',
              resend_id: data?.id || '',
              status: 'sent',
            });

            results.inspiration.sent++;
          }
        } catch (error: any) {
          console.error('Inspiration email error:', error);
          results.inspiration.errors++;

          // Log failure
          await supabase.from('email_onboarding_log').insert({
            user_id: pass.user_id,
            email_type: 'inspiration_day3',
            status: 'failed',
            error_message: error.message || 'Unknown error',
          });
        }
      }
    }

    // Day 7: Urgency Email (only if credits remain and pass hasn't expired)
    const { data: day7Users } = await supabase
      .from('activation_passes')
      .select('user_id, tier, credits_remaining, expires_at, purchased_at, user:user_profiles!inner(email, full_name)')
      .eq('status', 'active')
      .gt('credits_remaining', 0)
      .gte('purchased_at', sevenDaysAgo.toISOString())
      .lt('purchased_at', new Date(sevenDaysAgo.getTime() - 1 * 60 * 60 * 1000).toISOString()); // 167-168 hours ago

    if (day7Users) {
      for (const pass of day7Users) {
        try {
          // Type assertion for Supabase relation
          const user = pass.user as unknown as { email: string; full_name: string | null } | null;

          // Check if email already sent
          const { data: existing } = await supabase
            .from('email_onboarding_log')
            .select('id')
            .eq('user_id', pass.user_id)
            .eq('email_type', 'urgency_day7')
            .single();

          if (!existing && user?.email) {
            const daysUntilExpiry = Math.ceil(
              (new Date(pass.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            const { data, error } = await resend.emails.send({
              from: 'PlantingPlans <hello@plantingplans.co.uk>',
              to: [user.email],
              subject: `Don't Lose Your ${pass.credits_remaining} Credits ⚠️`,
              react: UrgencyEmail({
                name: user.full_name || '',
                creditsRemaining: pass.credits_remaining,
                daysUntilExpiry,
              }),
            });

            if (error) {
              throw error;
            }

            // Log email sent
            await supabase.from('email_onboarding_log').insert({
              user_id: pass.user_id,
              email_type: 'urgency_day7',
              resend_id: data?.id || '',
              status: 'sent',
            });

            results.urgency.sent++;
          }
        } catch (error: any) {
          console.error('Urgency email error:', error);
          results.urgency.errors++;

          // Log failure
          await supabase.from('email_onboarding_log').insert({
            user_id: pass.user_id,
            email_type: 'urgency_day7',
            status: 'failed',
            error_message: error.message || 'Unknown error',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    console.error('Onboarding email cron error:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
