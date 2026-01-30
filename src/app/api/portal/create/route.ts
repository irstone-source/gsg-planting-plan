import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateShareId, hashPassword, calculateExpiryDate } from '@/lib/portal-utils';

export async function POST(request: NextRequest) {
  try {
    const { planId, password, expiryDays, allowComments } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'planId is required' },
        { status: 400 }
      );
    }

    // Generate unique share ID
    const shareId = generateShareId();

    // Hash password if provided
    const passwordHash = password ? await hashPassword(password) : null;

    // Calculate expiry date
    const expiresAt = expiryDays ? calculateExpiryDate(expiryDays) : null;

    // Insert into database
    const { data, error } = await supabase
      .from('shared_plan_links')
      .insert({
        share_id: shareId,
        plan_id: planId,
        password_hash: passwordHash,
        expires_at: expiresAt?.toISOString(),
        allow_comments: allowComments ?? true,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      shareId: data.share_id,
      expiresAt: data.expires_at
    });
  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
