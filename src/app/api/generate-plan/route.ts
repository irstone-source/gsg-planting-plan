import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@/lib/supabase-auth';
import { checkEntitlements, consumeCredit } from '@/lib/entitlements';
import { analyzeSitePhotos } from '@/lib/vision-analysis';
import { getLocationData, validatePostcode } from '@/lib/location';
import { fileToBase64, getMediaType } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check authentication (optional for immediate mode)
    const authSupabase = createServerClient();
    const { data: { user } } = await authSupabase.auth.getUser();

    // If user is authenticated, check entitlements and consume credit
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
    // If no user, allow immediate free generation (no credit consumption)

    const formData = await request.formData();
    const data = JSON.parse(formData.get('data') as string);
    const imageFiles = formData.getAll('images') as File[];

    console.log('📥 Received plan generation request:', {
      dataFields: Object.keys(data),
      imageCount: imageFiles.length,
      postcode: data.postcode,
      authenticated: !!user,
    });

    // Validate inputs
    if (!data.postcode || !validatePostcode(data.postcode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid UK postcode' },
        { status: 400 }
      );
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // Step 1: Get location data
    console.log('📍 Processing location data...');
    const locationData = await getLocationData(data.postcode);
    console.log(`✓ Location: ${locationData.region}, RHS Zone: ${locationData.rhsZone}`);

    // Step 2: Convert images to base64 for Claude Vision
    console.log('🖼️  Converting images...');
    const imagesForVision = await Promise.all(
      imageFiles.map(async (file) => ({
        data: await fileToBase64(file),
        mediaType: getMediaType(file),
      }))
    );
    console.log(`✓ Converted ${imagesForVision.length} images`);

    // Step 3: Analyze images with Claude Vision
    console.log('👁️  Analyzing site with Claude Vision...');
    const visionAnalysis = await analyzeSitePhotos(imagesForVision);
    console.log('✓ Vision analysis complete:', {
      sunExposure: visionAnalysis.sunExposure.assessment,
      confidence: visionAnalysis.sunExposure.confidence,
      existingPlants: visionAnalysis.existingPlants.length,
    });

    // Step 4: Create site analysis record
    console.log('💾 Storing site analysis...');
    const { data: siteAnalysisData, error: siteError } = await supabase
      .from('site_analyses')
      .insert({
        postcode: locationData.postcode,
        rhs_zone: locationData.rhsZone,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        sun_exposure: visionAnalysis.sunExposure.assessment,
        soil_type: data.soilType || 'unknown',
        moisture: data.moisture || 'moist',
        area_sqm: data.areaSqm,
        vision_analysis: visionAnalysis,
        image_urls: [], // Would store uploaded image URLs here
      })
      .select()
      .single();

    if (siteError) {
      console.error('❌ Site analysis error:', siteError);
      throw new Error(`Failed to create site analysis: ${siteError.message}`);
    }

    console.log('✓ Site analysis stored:', siteAnalysisData.id);

    // Step 5: Create planting plan record
    console.log('📋 Creating planting plan...');
    const { data: planData, error: planError } = await supabase
      .from('planting_plans')
      .insert({
        user_id: user?.id || null,
        site_analysis_id: siteAnalysisData.id,
        style: data.style,
        maintenance_level: data.maintenanceLevel,
        budget_min: data.budgetMin,
        budget_max: data.budgetMax,
        special_requirements: data.description || data.specialRequirements, // Use description field
        status: 'draft',
        design_rationale: visionAnalysis.overallAssessment,
      })
      .select()
      .single();

    if (planError) {
      console.error('❌ Plan creation error:', planError);
      throw new Error(`Failed to create planting plan: ${planError.message}`);
    }

    console.log('✓ Planting plan created:', planData.id);

    // Consume credit after successful plan creation (only if authenticated)
    if (user) {
      console.log('💳 Consuming credit...');
      const creditConsumed = await consumeCredit(user.id);
      if (!creditConsumed) {
        console.warn('⚠️ Failed to consume credit, but plan was created');
      } else {
        console.log('✓ Credit consumed successfully');
      }
    } else {
      console.log('ℹ️ No authentication - free plan generation (no credit consumed)');
    }

    // Step 6: Generate plant recommendations
    console.log('🌿 Generating plant recommendations...');
    try {
      // Call the recommendations API internally
      const recommendationsResponse = await fetch(
        `${request.nextUrl.origin}/api/generate-recommendations`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: planData.id }),
        }
      );

      if (recommendationsResponse.ok) {
        const recData = await recommendationsResponse.json();
        console.log('✓ Recommendations generated:', recData.totalPlants, 'plants');
      } else {
        console.warn('⚠️ Recommendations generation failed, but plan is created');
      }
    } catch (recError) {
      console.warn('⚠️ Recommendations generation error:', recError);
      // Continue anyway - user can retry recommendations later
    }

    console.log('✅ Plan generation complete!');

    return NextResponse.json({
      success: true,
      planId: planData.id,
      message: 'Plan generated successfully',
      analysis: {
        sunExposure: visionAnalysis.sunExposure.assessment,
        rhsZone: locationData.rhsZone,
        region: locationData.region,
        challenges: visionAnalysis.challenges,
        opportunities: visionAnalysis.opportunities,
      },
    });
  } catch (error) {
    console.error('❌ Error generating plan:', error);

    // Return detailed error in development
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate plan';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
