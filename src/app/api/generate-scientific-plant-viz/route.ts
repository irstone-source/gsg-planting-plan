import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { aggregatePlantData } from '@/lib/plant-data/aggregator';
import { generatePlanViewSVG, generateElevationSVG } from '@/lib/plant-data/svg-generator';
import sharp from 'sharp';

interface PlantData {
  id: string;
  botanical_name: string;
  common_name: string;
}

interface PlantRecommendation {
  id: string;
  plants: PlantData[];
}

export async function POST(request: NextRequest) {
  try {
    const { planId, limit } = await request.json();

    console.log('🔬 Generating scientific plant visualizations for plan:', planId);

    // Fetch plan with recommendations
    const { data: plan, error: planError } = await supabaseAdmin
      .from('planting_plans')
      .select(`
        id,
        plant_recommendations (
          id,
          plants (
            id,
            botanical_name,
            common_name
          )
        )
      `)
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    const recommendations = (plan.plant_recommendations || []) as PlantRecommendation[];
    const plantsToProcess = limit ? recommendations.slice(0, limit) : recommendations;

    console.log(`📊 Processing ${plantsToProcess.length} plants with scientific data`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const rec of plantsToProcess) {
      const plant = rec.plants[0];

      try {
        console.log(`\n🔬 Step 1/4: Aggregating scientific data for ${plant.botanical_name}...`);

        // Fetch scientific data from multiple sources
        const scientificData = await aggregatePlantData(plant.botanical_name);

        if (!scientificData) {
          throw new Error('No scientific data found');
        }

        console.log(`✅ Step 1/4: Data quality score: ${scientificData.data_quality_score}%`);
        console.log(`🎨 Step 2/4: Generating parametric visualizations...`);

        // Generate visualizations for each growth stage
        const visualizations: {
          year_1: string | null;
          year_3: string | null;
          mature: string | null;
          elevation?: string | null;
        } = {
          year_1: null,
          year_3: null,
          mature: null,
        };

        for (const stage of ['year_1', 'year_3', 'mature'] as const) {
          const dimensions = scientificData.growth_progression[stage];

          if (dimensions && scientificData.botanical_characteristics && dimensions.height_cm > 0 && dimensions.spread_cm > 0) {
            try {
              // Generate PLAN VIEW (top-down)
              const planSvg = generatePlanViewSVG({
                shape: scientificData.botanical_characteristics.crown_shape,
                dimensions,
                density: scientificData.botanical_characteristics.canopy_density,
                foliage_type: scientificData.botanical_characteristics.foliage_type,
              });

              // Extract scale box size for PNG sizing
              const scaleSizeMatch = planSvg.match(/data-scale-size="(\d+)"/);
              const scaleSize = scaleSizeMatch ? parseInt(scaleSizeMatch[1]) : 800;

              // Convert plan view to PNG at real-world scale (1px = 1cm)
              const planPngBuffer = await sharp(Buffer.from(planSvg))
                .resize(scaleSize, scaleSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .png({ compressionLevel: 9 })
                .toBuffer();

              // Upload plan view
              const planFilename = `${plant.id}-${plant.botanical_name
                .toLowerCase()
                .replace(/\s+/g, '-')}-${stage}-plan.png`;

              await supabaseAdmin.storage
                .from('plant-images')
                .upload(planFilename, planPngBuffer, {
                  contentType: 'image/png',
                  upsert: true,
                });

              const { data: planUrlData } = supabaseAdmin.storage
                .from('plant-images')
                .getPublicUrl(planFilename);

              visualizations[stage] = planUrlData.publicUrl;
              console.log(`  ✅ ${stage} plan view: Generated and uploaded`);

              // Generate ELEVATION VIEW (side view) - only for mature stage
              if (stage === 'mature') {
                const elevationSvg = generateElevationSVG({
                  shape: scientificData.botanical_characteristics.crown_shape,
                  dimensions,
                  density: scientificData.botanical_characteristics.canopy_density,
                  foliage_type: scientificData.botanical_characteristics.foliage_type,
                });

                // Convert elevation to PNG
                const elevationPngBuffer = await sharp(Buffer.from(elevationSvg))
                  .resize(scaleSize, scaleSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                  .png({ compressionLevel: 9 })
                  .toBuffer();

                // Upload elevation view
                const elevationFilename = `${plant.id}-${plant.botanical_name
                  .toLowerCase()
                  .replace(/\s+/g, '-')}-mature-elevation.png`;

                await supabaseAdmin.storage
                  .from('plant-images')
                  .upload(elevationFilename, elevationPngBuffer, {
                    contentType: 'image/png',
                    upsert: true,
                  });

                const { data: elevationUrlData } = supabaseAdmin.storage
                  .from('plant-images')
                  .getPublicUrl(elevationFilename);

                // Store elevation in a separate property (we'll update the DB later to add this field)
                visualizations['elevation'] = elevationUrlData.publicUrl;
                console.log(`  ✅ ${stage} elevation view: Generated and uploaded`);
              }
            } catch (svgError: any) {
              console.error(`⚠️ SVG generation error for ${stage}:`, svgError.message);
            }
          }
        }

        console.log(`✅ Step 2/4: Visualizations complete`);
        console.log(`💾 Step 3/4: Storing scientific data in database...`);

        // Update plant record with scientific data
        const updateData: any = {
          // Image URLs
          front_view_image_url: visualizations.elevation || null, // Elevation (side view)
          top_down_image_url: visualizations.mature || null,      // Plan view (top-down)

          // Update timestamp
          updated_at: new Date().toISOString(),
        };

        // Only add growth data if it exists
        if (scientificData.growth_progression) {
          const gp = scientificData.growth_progression;
          if (gp.year_1) {
            updateData.year_1_height_cm = gp.year_1.height_cm || null;
            updateData.year_1_spread_cm = gp.year_1.spread_cm || null;
          }
          if (gp.year_3) {
            updateData.year_3_height_cm = gp.year_3.height_cm || null;
            updateData.year_3_spread_cm = gp.year_3.spread_cm || null;
          }
          if (gp.mature) {
            updateData.mature_height_cm = gp.mature.height_cm || null;
            updateData.mature_spread_cm = gp.mature.spread_cm || null;
          }
        }

        const { error: updateError } = await supabaseAdmin
          .from('plants')
          .update(updateData)
          .eq('id', plant.id);

        if (updateError) {
          console.error(`⚠️ Failed to update database for ${plant.botanical_name}:`, updateError);
        } else {
          console.log(`✅ Step 3/4: Database updated`);
        }

        console.log(`📊 Step 4/4: Calculating metrics...`);

        const metrics = {
          data_quality_score: scientificData.data_quality_score,
          data_sources: Object.keys(scientificData.data_sources).filter(
            (k) => scientificData.data_sources[k as keyof typeof scientificData.data_sources]
          ),
          growth_rate: scientificData.botanical_characteristics.growth_rate,
          years_to_maturity: scientificData.growth_progression.years_to_maturity,
          spacing_distance_cm: scientificData.spacing_distance_cm,
        };

        console.log(`✅ ✨ ${plant.botanical_name} - COMPLETE`);
        console.log(`📈 Metrics:`, metrics);

        successCount++;

        results.push({
          plant_id: plant.id,
          botanical_name: plant.botanical_name,
          scientific_data: scientificData,
          visualizations,
          metrics,
          success: true,
        });

        // Add delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error: any) {
        console.error(`❌ Failed for ${plant.botanical_name}:`, error.message);
        errorCount++;

        results.push({
          plant_id: plant.id,
          botanical_name: plant.botanical_name,
          error: error.message,
          success: false,
        });
      }
    }

    console.log(`\n✅ Scientific visualization complete: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      planId,
      results,
      summary: {
        total: plantsToProcess.length,
        success: successCount,
        errors: errorCount,
        average_data_quality: Math.round(
          results
            .filter((r) => r.success && r.metrics)
            .reduce((sum, r) => sum + (r.metrics?.data_quality_score || 0), 0) / successCount
        ),
      },
    });
  } catch (error: any) {
    console.error('❌ Error generating scientific plant visualizations:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
