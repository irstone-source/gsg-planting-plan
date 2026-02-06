import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getLocationData, validatePostcode } from '@/lib/location';

export const dynamic = 'force-dynamic';

/**
 * Minimal test endpoint - creates plan without AI/vision
 * Tests database connectivity and basic operations only
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = JSON.parse(formData.get('data') as string);

    console.log('Test plan request:', data);

    // Validate postcode
    if (!data.postcode || !validatePostcode(data.postcode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid UK postcode' },
        { status: 400 }
      );
    }

    // Get location data
    const locationData = await getLocationData(data.postcode);

    // Create site analysis (minimal)
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
        area_sqm: data.areaSqm || 30,
      })
      .select()
      .single();

    if (siteError) {
      return NextResponse.json(
        { success: false, error: `Site analysis failed: ${siteError.message}` },
        { status: 500 }
      );
    }

    // Create planting plan (minimal)
    const { data: planData, error: planError } = await supabase
      .from('planting_plans')
      .insert({
        site_analysis_id: siteData.id,
        style: data.style || 'mixed',
        maintenance_level: data.maintenanceLevel || 'medium',
        budget_min: data.budgetMin,
        budget_max: data.budgetMax,
        special_requirements: data.description || 'Test plan',
        status: 'draft',
        design_rationale: 'Test plan - no AI generation',
      })
      .select()
      .single();

    if (planError) {
      return NextResponse.json(
        { success: false, error: `Plan creation failed: ${planError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      planId: planData.id,
      message: 'Test plan created (no AI)',
      note: 'This is a test endpoint - plan has no plant recommendations',
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
