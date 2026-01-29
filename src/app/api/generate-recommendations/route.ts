import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generatePlantRecommendations } from '@/lib/recommendations';
import type { PlantMatchCriteria } from '@/lib/plant-matching';
import type { VisionAnalysisResult } from '@/lib/vision-analysis';

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();

    console.log('🌿 Generating recommendations for plan:', planId);

    // Step 1: Fetch plan with site analysis
    const { data: plan, error: planError } = await supabase
      .from('planting_plans')
      .select(`
        *,
        site_analyses (*)
      `)
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    const siteAnalysis = plan.site_analyses;
    const visionData: VisionAnalysisResult = siteAnalysis.vision_analysis;

    console.log('✓ Plan loaded:', {
      postcode: siteAnalysis.postcode,
      rhsZone: siteAnalysis.rhs_zone,
      style: plan.style,
    });

    // Step 2: Prepare matching criteria
    const criteria: PlantMatchCriteria = {
      rhsZone: siteAnalysis.rhs_zone,
      sunExposure: siteAnalysis.sun_exposure,
      soilType: siteAnalysis.soil_type,
      moisture: siteAnalysis.moisture,
      style: plan.style,
      maintenanceLevel: plan.maintenance_level,
      budgetMin: plan.budget_min,
      budgetMax: plan.budget_max,
      areaSqm: siteAnalysis.area_sqm,
    };

    // Step 3: Generate recommendations
    console.log('🤖 Generating AI recommendations...');
    const result = await generatePlantRecommendations(criteria, visionData, {
      style: plan.style,
      maintenanceLevel: plan.maintenance_level,
      specialRequirements: plan.special_requirements,
    });

    console.log('✓ Generated recommendations:', {
      count: result.recommendations.length,
      totalPlants: result.total_plants,
      totalCost: result.total_cost,
    });

    // Step 4: Store recommendations in database
    console.log('💾 Storing recommendations...');
    const recommendationsToInsert = result.recommendations.map(rec => ({
      planting_plan_id: planId,
      plant_id: rec.plant_id,
      quantity: rec.quantity,
      position: rec.position,
      rationale: rec.rationale,
    }));

    const { error: insertError } = await supabase
      .from('plant_recommendations')
      .insert(recommendationsToInsert);

    if (insertError) {
      console.error('❌ Failed to insert recommendations:', insertError);
      throw new Error(`Failed to store recommendations: ${insertError.message}`);
    }

    console.log('✓ Recommendations stored');

    // Step 5: Update plan with cost and status
    console.log('📊 Updating plan...');
    const { error: updateError } = await supabase
      .from('planting_plans')
      .update({
        total_cost: result.total_cost,
        design_rationale: result.design_notes,
        status: 'completed',
      })
      .eq('id', planId);

    if (updateError) {
      console.error('❌ Failed to update plan:', updateError);
      throw new Error(`Failed to update plan: ${updateError.message}`);
    }

    console.log('✅ Recommendations generation complete!');

    return NextResponse.json({
      success: true,
      planId,
      recommendations: result.recommendations,
      totalPlants: result.total_plants,
      totalCost: result.total_cost,
      designNotes: result.design_notes,
      plantingZones: result.planting_zones,
      maintenanceAdvice: result.maintenance_advice,
    });
  } catch (error) {
    console.error('❌ Error generating recommendations:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate recommendations';

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
