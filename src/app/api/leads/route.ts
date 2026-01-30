import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

// Rate limiting (simple in-memory for now)
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now]);
    return true;
  }

  const timestamps = rateLimitMap.get(ip)!;
  const recentTimestamps = timestamps.filter(t => now - t < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return false;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { type, name, email, message, ...rest } = body;

    // Validation
    if (!type || !['pricing', 'partner', 'designer', 'affiliate', 'supplier'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid lead type' },
        { status: 400 }
      );
    }

    // Try Supabase storage first
    try {
      const { error: dbError } = await supabase
        .from('inbound_leads')
        .insert({
          type,
          name: name || null,
          email: email || null,
          message: message || null,
          metadata: rest,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Supabase error:', dbError);
        // Fall through to email fallback
        throw new Error('Database insert failed');
      }

      // Success - send notification email if Resend is configured
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'leads@plantingplans.co.uk',
          to: process.env.ADMIN_EMAIL || 'admin@plantingplans.co.uk',
          subject: `New ${type} lead from ${name || 'Unknown'}`,
          html: `
            <h2>New ${type} Lead</h2>
            <p><strong>Name:</strong> ${name || 'Not provided'}</p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>Message:</strong> ${message || 'Not provided'}</p>
            <p><strong>Additional Data:</strong></p>
            <pre>${JSON.stringify(rest, null, 2)}</pre>
          `
        }).catch((emailError) => {
          // Log but don't fail the request
          console.error('Email notification failed:', emailError);
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Lead submitted successfully'
      });
    } catch (dbError) {
      // Fallback: send email only if Resend is configured
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'leads@plantingplans.co.uk',
          to: process.env.ADMIN_EMAIL || 'admin@plantingplans.co.uk',
          subject: `New ${type} lead from ${name || 'Unknown'} [NO DB]`,
          html: `
            <h2>New ${type} Lead (Database Storage Failed)</h2>
            <p><strong>Name:</strong> ${name || 'Not provided'}</p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>Message:</strong> ${message || 'Not provided'}</p>
            <p><strong>Additional Data:</strong></p>
            <pre>${JSON.stringify(rest, null, 2)}</pre>
          `
        });

        return NextResponse.json({
          success: true,
          message: 'Lead submitted successfully'
        });
      }

      // Final fallback: just log
      console.log('New lead (no storage):', { type, name, email, message, rest });
      return NextResponse.json({
        success: true,
        message: 'Lead submitted successfully'
      });
    }
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
