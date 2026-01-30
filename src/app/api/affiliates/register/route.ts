import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Generate unique affiliate code
 * Format: NAME30 (name + commission rate)
 */
function generateAffiliateCode(name: string): string {
  const cleanName = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 8);

  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${cleanName}${random}30`; // 30 for 30% founding rate
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, channels, audienceSize, message } = data;

    // Validation
    if (!name || !email || !channels || !audienceSize) {
      return NextResponse.json(
        { success: false, error: 'Name, email, channels, and audience size are required' },
        { status: 400 }
      );
    }

    // Generate unique code
    const code = generateAffiliateCode(name);

    // Check if code already exists
    const { data: existingCode } = await supabase
      .from('affiliates')
      .select('code')
      .eq('code', code)
      .single();

    if (existingCode) {
      // Add more randomness if code exists
      const extraRandom = Math.random().toString(36).substring(2, 4).toUpperCase();
      const uniqueCode = `${code.substring(0, code.length - 2)}${extraRandom}`;

      return createAffiliate({
        name,
        email,
        code: uniqueCode,
        channels,
        audienceSize,
        message,
      });
    }

    return createAffiliate({
      name,
      email,
      code,
      channels,
      audienceSize,
      message,
    });
  } catch (error: any) {
    console.error('Affiliate registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register affiliate' },
      { status: 500 }
    );
  }
}

async function createAffiliate(params: {
  name: string;
  email: string;
  code: string;
  channels: string;
  audienceSize: string;
  message?: string;
}) {
  const { name, email, code, channels, audienceSize, message } = params;

  // Calculate founding expiry (30 days from now)
  const foundingExpiresAt = new Date();
  foundingExpiresAt.setDate(foundingExpiresAt.getDate() + 30);

  // Create affiliate record
  const { data: affiliate, error } = await supabase
    .from('affiliates')
    .insert({
      code,
      name,
      email,
      commission_rate: 30, // Founding creator rate
      is_founding_creator: true,
      founding_expires_at: foundingExpiresAt.toISOString(),
      status: 'pending',
      total_clicks: 0,
      total_conversions: 0,
      total_earnings_pence: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Database error creating affiliate:', error);
    throw new Error('Failed to create affiliate record');
  }

  // Send approval email to admin
  if (resend) {
    try {
      await resend.emails.send({
        from: 'PlantingPlans <noreply@plantingplans.uk>',
        to: process.env.ADMIN_EMAIL || 'admin@plantingplans.uk',
        subject: `New Affiliate Application: ${name}`,
        html: `
          <h2>New Affiliate Application</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Referral Code:</strong> ${code}</p>
          <p><strong>Channels:</strong></p>
          <pre>${channels}</pre>
          <p><strong>Audience Size:</strong> ${audienceSize}</p>
          ${message ? `<p><strong>Message:</strong></p><pre>${message}</pre>` : ''}
          <p><strong>Commission Rate:</strong> 30% (Founding Creator - expires ${foundingExpiresAt.toDateString()})</p>
          <hr>
          <p>Review in dashboard: <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/affiliates/${affiliate.id}">View Application</a></p>
        `,
      });
    } catch (emailError) {
      console.warn('Failed to send affiliate notification email:', emailError);
      // Continue anyway - affiliate is created
    }
  }

  // Send confirmation to applicant
  if (resend) {
    try {
      await resend.emails.send({
        from: 'PlantingPlans <noreply@plantingplans.uk>',
        to: email,
        subject: 'Your PlantingPlans Affiliate Application',
        html: `
          <h2>Thanks for applying to PlantingPlans Founding Creator Program!</h2>
          <p>Hi ${name},</p>
          <p>We received your application and will review it within 24 hours.</p>
          <p><strong>Your Referral Code:</strong> <code>${code}</code></p>
          <p><strong>Commission Rate:</strong> 30% for the first 30 days (Founding Creator bonus), then 20% ongoing</p>
          <p>Once approved, you'll receive:</p>
          <ul>
            <li>Your unique referral link</li>
            <li>Access to your affiliate dashboard</li>
            <li>Marketing materials and swipe copy</li>
          </ul>
          <p>Questions? Reply to this email.</p>
          <p>Best,<br>The PlantingPlans Team</p>
        `,
      });
    } catch (emailError) {
      console.warn('Failed to send applicant confirmation email:', emailError);
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Application submitted successfully. We will review it within 24 hours.',
    code,
    status: 'pending',
  });
}
