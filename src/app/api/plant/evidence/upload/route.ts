/**
 * Plant Evidence Upload API
 * POST /api/plant/evidence/upload
 * Handles user-submitted plant reference photos for verification and improvement
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/supabase-auth';
import { sendNewEvidenceNotification } from '@/lib/email-notifications';

export const runtime = 'nodejs';

interface UploadRequest {
  botanical_name: string;
  wfo_id?: string;
  evidence_type: 'leaf' | 'bark' | 'habit' | 'winter' | 'flower' | 'fruit' | 'overall';
  image_data: string; // base64 encoded image
  metadata?: {
    season?: string;
    location?: string;
    date_taken?: string;
    notes?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    const body: UploadRequest = await request.json();

    // Validate required fields
    if (!body.botanical_name) {
      return NextResponse.json(
        { error: 'Missing botanical_name in request body' },
        { status: 400 }
      );
    }

    if (!body.evidence_type || !['leaf', 'bark', 'habit', 'winter', 'flower', 'fruit', 'overall'].includes(body.evidence_type)) {
      return NextResponse.json(
        { error: 'Invalid evidence_type. Must be: leaf, bark, habit, winter, flower, fruit, or overall' },
        { status: 400 }
      );
    }

    if (!body.image_data) {
      return NextResponse.json(
        { error: 'Missing image_data in request body' },
        { status: 400 }
      );
    }

    // Decode base64 image
    const base64Data = body.image_data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Validate file size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = body.image_data.match(/^data:image\/(\w+);/)?.[1] || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${user.id}/${body.botanical_name.replace(/ /g, '_')}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('plant-evidence')
      .upload(filePath, buffer, {
        contentType: `image/${fileExt}`,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image', details: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('plant-evidence')
      .getPublicUrl(filePath);

    // Insert evidence record
    const { data: evidence, error: dbError } = await supabase
      .from('plant_evidence')
      .insert({
        wfo_id: body.wfo_id || null,
        botanical_name: body.botanical_name,
        evidence_type: body.evidence_type,
        image_url: urlData.publicUrl,
        uploaded_by: user.id,
        upload_source: 'manual',
        metadata: body.metadata || {},
        verification_status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);

      // Clean up uploaded file if database insert fails
      await supabase.storage.from('plant-evidence').remove([filePath]);

      return NextResponse.json(
        { error: 'Failed to create evidence record', details: dbError.message },
        { status: 500 }
      );
    }

    // Send notification to admin (async, don't wait)
    sendNewEvidenceNotification(
      body.botanical_name,
      body.evidence_type,
      urlData.publicUrl,
      user.email || 'unknown'
    ).catch(err => console.error('Email notification failed:', err));

    // Return evidence record
    return NextResponse.json({
      evidence_id: evidence.id,
      image_url: urlData.publicUrl,
      verification_status: 'pending',
      message: 'Evidence uploaded successfully. Verification will run automatically.'
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error('Evidence upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload evidence',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/plant/evidence/upload',
    method: 'POST',
    description: 'Upload plant reference photos for verification and improvement',
    authentication: 'Required (Supabase Auth)',
    request_body: {
      botanical_name: 'string (required) - Plant species name',
      wfo_id: 'string (optional) - WFO taxonomy ID',
      evidence_type: '"leaf" | "bark" | "habit" | "winter" | "flower" | "fruit" | "overall" (required)',
      image_data: 'string (required) - base64 encoded image data',
      metadata: {
        season: 'string (optional) - When photo was taken',
        location: 'string (optional) - Geographic location',
        date_taken: 'string (optional) - ISO date string',
        notes: 'string (optional) - Additional notes'
      }
    },
    response: {
      evidence_id: 'UUID',
      image_url: 'string (Supabase Storage URL)',
      verification_status: 'string',
      message: 'string'
    },
    limits: {
      max_file_size: '10MB',
      allowed_types: ['image/jpeg', 'image/png', 'image/webp']
    }
  });
}
