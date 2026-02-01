import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { searchCrocusPlant } from '@/lib/plant-data/crocus-scraper';

interface PlantData {
  id: string;
  botanical_name: string;
  common_name: string;
  crocus_fetched_at: string | null;
}

interface PlantRecommendation {
  id: string;
  plants: PlantData[];
}

export async function POST(request: NextRequest) {
  try {
    const { planId, limit } = await request.json();

    console.log('🛒 Fetching Crocus retail data for plan:', planId);

    // Fetch plan with plant recommendations
    const { data: plan, error: planError } = await supabaseAdmin
      .from('planting_plans')
      .select(`
        id,
        plant_recommendations (
          id,
          plants (
            id,
            botanical_name,
            common_name,
            crocus_fetched_at
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

    console.log(`🛒 Processing ${plantsToProcess.length} plants for Crocus data`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const rec of plantsToProcess) {
      const plant = rec.plants[0];

      try {
        // Skip if fetched recently (within last 7 days)
        if (plant.crocus_fetched_at) {
          const fetchedDate = new Date(plant.crocus_fetched_at);
          const daysSinceFetch = (Date.now() - fetchedDate.getTime()) / (1000 * 60 * 60 * 24);

          if (daysSinceFetch < 7) {
            console.log(`⏭️  Skipping ${plant.botanical_name} (fetched ${daysSinceFetch.toFixed(1)} days ago)`);
            skippedCount++;
            continue;
          }
        }

        console.log(`\n🛒 Fetching Crocus data for ${plant.botanical_name}...`);

        // Search Crocus
        const crocusData = await searchCrocusPlant(plant.botanical_name);

        if (!crocusData) {
          console.log(`❌ No Crocus data found for ${plant.botanical_name}`);
          errorCount++;

          results.push({
            plant_id: plant.id,
            botanical_name: plant.botanical_name,
            success: false,
            error: 'Not found on Crocus.co.uk',
          });

          continue;
        }

        // Update plant record with Crocus data
        const { error: updateError } = await supabaseAdmin
          .from('plants')
          .update({
            crocus_product_name: crocusData.product_name,
            crocus_product_url: crocusData.product_url,
            crocus_image_url: crocusData.image_url,
            crocus_price_gbp: crocusData.price_gbp,
            crocus_original_price_gbp: crocusData.original_price_gbp,
            crocus_availability: crocusData.availability,
            crocus_pot_size: crocusData.pot_size,
            crocus_rating: crocusData.rating,
            crocus_review_count: crocusData.review_count,
            crocus_fetched_at: crocusData.fetched_at.toISOString(),
          })
          .eq('id', plant.id);

        if (updateError) {
          console.error(`⚠️ Failed to update database for ${plant.botanical_name}:`, updateError);
        } else {
          console.log(`✅ Updated Crocus data for ${plant.botanical_name}`);
        }

        successCount++;

        results.push({
          plant_id: plant.id,
          botanical_name: plant.botanical_name,
          crocus_data: crocusData,
          success: true,
        });

        // Rate limiting: wait 2 seconds between requests
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

    console.log(`\n✅ Crocus data fetch complete: ${successCount} success, ${errorCount} errors, ${skippedCount} skipped`);

    return NextResponse.json({
      success: true,
      planId,
      results,
      summary: {
        total: plantsToProcess.length,
        success: successCount,
        errors: errorCount,
        skipped: skippedCount,
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching Crocus data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
