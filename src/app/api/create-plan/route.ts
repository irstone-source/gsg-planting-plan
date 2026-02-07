import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@/lib/supabase-auth';
import { checkEntitlements, consumeCredit } from '@/lib/entitlements';
import { getLocationData, validatePostcode } from '@/lib/location';
import { triggerBackgroundGeneration } from '@/lib/background-generation';

export const dynamic = 'force-dynamic';

/**
 * Fast plan creation endpoint - returns immediately with planId
 * Background job handles vision analysis and plant recommendations
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication (optional for immediate mode)
    const authSupabase = createServerClient();
    const { data: { user } } = await authSupabase.auth.getUser();

    // If user is authenticated, check entitlements
    if (user) {
      const entitlements = await checkEntitlements(user.id);

      if (!entitlements.hasAccess) {
        return NextResponse.json(
          { success: false, error: 'Active Activation Pass required' },
          { status: 403 }
        );
      }

      if (entitlements.creditsRemaining <= 0) {
        return NextResponse.json(
          { success: false, error: 'No credits remaining. Please upgrade your pass.' },
          { status: 403 }
        );
      }
    }

    // 2. Parse and validate input - HANDLE BOTH JSON AND FORMDATA
    const contentType = request.headers.get('content-type') || '';
    let data: any;
    let imageFiles: File[] = [];

    if (contentType.includes('application/json')) {
      // DIY track - JSON body (no images initially)
      data = await request.json();
      imageFiles = [];
      console.log('📥 DIY track (JSON) plan creation request:', {
        dataFields: Object.keys(data),
        sourceTrack: data.sourceTrack,
        selectedStyleSlug: data.selectedStyleSlug,
        postcode: data.postcode,
        authenticated: !!user,
      });
    } else {
      // Professional track - FormData (with images)
      const formData = await request.formData();
      data = JSON.parse(formData.get('data') as string);
      imageFiles = formData.getAll('images') as File[];
      console.log('📥 Professional track (FormData) plan creation request:', {
        dataFields: Object.keys(data),
        imageCount: imageFiles.length,
        postcode: data.postcode,
        authenticated: !!user,
      });
    }

    // Validate postcode
    if (!data.postcode || !validatePostcode(data.postcode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid UK postcode' },
        { status: 400 }
      );
    }

    // Validate that we have enough information
    const hasImages = imageFiles.length > 0;
    const hasDesignerStyle = !!data.designerStyle;
    const hasSelectedStyle = !!data.selectedStyleSlug; // NEW: DIY track style selection
    const hasDescription = !!data.description && data.description.length >= 20;

    if (!hasImages && !hasDesignerStyle && !hasSelectedStyle && !hasDescription) {
      return NextResponse.json(
        { success: false, error: 'Please provide either site photos, a designer style, or describe what you want (minimum 20 characters)' },
        { status: 400 }
      );
    }

    // 3. Get location data
    console.log('📍 Getting location data...');
    const locationData = await getLocationData(data.postcode);
    console.log(`✓ Location: ${locationData.region}, RHS Zone: ${locationData.rhsZone}`);

    // 4. Store images in Supabase Storage if provided
    const imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      console.log(`🖼️ Uploading ${imageFiles.length} images...`);
      try {
        for (const file of imageFiles) {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('site-photos')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.warn(`⚠️ Failed to upload image ${file.name}:`, uploadError);
            continue; // Skip this image but continue with others
          }

          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('site-photos')
              .getPublicUrl(uploadData.path);
            imageUrls.push(publicUrl);
            console.log(`✓ Uploaded: ${fileName}`);
          }
        }
        console.log(`✓ ${imageUrls.length} images uploaded successfully`);
      } catch (storageError) {
        console.error('❌ Image upload error:', storageError);
        // Continue without images - not a fatal error
      }
    }

    // 5. Create minimal site analysis record
    console.log('💾 Creating site analysis...');
    const { data: siteData, error: siteError } = await supabase
      .from('site_analyses')
      .insert({
        postcode: locationData.postcode,
        rhs_zone: locationData.rhsZone,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        sun_exposure: data.sunExposure || 'mixed',
        soil_type: data.soilType || 'unknown',
        moisture: data.moisture || 'moist',
        area_sqm: data.areaSqm,
        image_urls: imageUrls,
        vision_analysis: null, // Will be populated by background job
      })
      .select()
      .single();

    if (siteError) {
      console.error('❌ Site analysis error:', siteError);
      throw new Error(`Failed to create site analysis: ${siteError.message}`);
    }

    console.log('✓ Site analysis created:', siteData.id);

    // 6. Create planting plan record with 'generating' status
    console.log('📋 Creating planting plan...');
    const { data: planData, error: planError } = await supabase
      .from('planting_plans')
      .insert({
        user_id: user?.id || null,
        site_analysis_id: siteData.id,
        style: data.style || 'mixed',
        maintenance_level: data.maintenanceLevel || 'medium',
        budget_min: data.budgetMin,
        budget_max: data.budgetMax,
        special_requirements: data.description || data.specialRequirements || '',
        status: 'generating', // KEY: Indicates background processing
        design_rationale: 'Plan generation in progress...',
        // NEW FIELDS FOR DUAL-TRACK:
        selected_style_slug: data.selectedStyleSlug || null,
        source_track: data.sourceTrack || 'professional',
        is_finalized: false,
      })
      .select()
      .single();

    if (planError) {
      console.error('❌ Plan creation error:', planError);
      throw new Error(`Failed to create planting plan: ${planError.message}`);
    }

    console.log('✓ Planting plan created:', planData.id);

    // 7. Trigger background job (fire and forget)
    console.log('🚀 Triggering background generation...');
    triggerBackgroundGeneration(planData.id, {
      hasImages: imageUrls.length > 0,
      imageUrls,
      designerStyle: data.designerStyle,
      selectedStyleSlug: data.selectedStyleSlug, // NEW: For style-specific recommendations
    });

    // 8. Consume credit if authenticated
    if (user) {
      console.log('💳 Consuming credit...');
      const creditConsumed = await consumeCredit(user.id);
      if (!creditConsumed) {
        console.warn('⚠️ Failed to consume credit, but plan was created');
      } else {
        console.log('✓ Credit consumed successfully');
      }
    } else {
      console.log('ℹ️ No authentication - free plan generation');
    }

    // 9. Return immediately with planId
    console.log('✅ Fast plan creation complete! Returning planId immediately.');

    return NextResponse.json({
      success: true,
      planId: planData.id,
      status: 'generating',
      message: 'Plan creation started. Generating recommendations in background...',
    });

  } catch (error) {
    console.error('❌ Error creating plan:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to create plan';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
