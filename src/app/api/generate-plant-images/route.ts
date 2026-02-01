import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import OpenAI from 'openai';
import { removeBackground } from '@imgly/background-removal-node';
import sharp from 'sharp';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    console.log('🎨 Generating plant images for plan:', planId);

    // Fetch plan with recommendations
    const { data: plan, error: planError } = await supabase
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

    console.log(`📊 Found ${recommendations.length} plants total`);
    console.log(`🎨 Generating transparent images for ${plantsToProcess.length} plants${limit ? ' (limited)' : ''}`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Generate images for each unique plant
    for (const rec of plantsToProcess) {
      const plant = rec.plants[0];

      try {
        console.log(`🎨 Generating images for ${plant.botanical_name}...`);

        // Helper function to generate and process one image
        async function generatePlantImage(viewType: 'front' | 'topdown') {
          const viewLabel = viewType === 'front' ? 'Front-on botanical' : 'Top-down architectural';
          console.log(`  🎨 ${viewLabel}: Generating...`);

          // Create appropriate prompt based on view type
          const prompt = viewType === 'front'
            ? `A detailed botanical illustration of ${plant.botanical_name} (${plant.common_name}),
professional scientific drawing showing the plant isolated on white background.
Clear, crisp edges. Show characteristic features including flowers, leaves, and overall form.
Watercolor and ink botanical illustration style, suitable for transparent background extraction.`
            : `A detailed botanical illustration of ${plant.botanical_name} (${plant.common_name}) seen from directly above,
professional scientific drawing showing the plant canopy structure from overhead perspective.
Bird's eye view plan illustration isolated on white background.
Clear, crisp edges showing foliage pattern, branch arrangement, and crown shape as viewed from above.
Scientific botanical illustration style with precise detail of leaf structure and branching pattern.
Watercolor and ink botanical illustration style, suitable for transparent background extraction and use as landscape design stencil.`;

          // Generate image with DALL-E 3
          const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024', // Square for both views
            quality: 'hd',
            style: 'natural',
          });

          const imageUrl = response.data?.[0]?.url;
          if (!imageUrl) {
            throw new Error(`No ${viewType} image URL returned from DALL-E`);
          }

          console.log(`  ✅ ${viewLabel}: Image generated`);
          console.log(`  🔄 ${viewLabel}: Removing background...`);

          // Remove background directly from URL
          const transparentBlob = await removeBackground(imageUrl, {
            debug: false,
            progress: (key, current, total) => {
              console.log(`     Progress: ${key} ${current}/${total}`);
            }
          });

          const transparentBuffer = Buffer.from(await transparentBlob.arrayBuffer());

          // Optimize with sharp
          const optimizedBuffer = await sharp(transparentBuffer)
            .png({ quality: 90, compressionLevel: 9 })
            .toBuffer();

          console.log(`  ✅ ${viewLabel}: Background removed`);
          console.log(`  💾 ${viewLabel}: Uploading...`);

          // Upload to Supabase Storage
          const filename = `${plant.id}-${plant.botanical_name.toLowerCase().replace(/\s+/g, '-')}-${viewType}.png`;
          const { error: uploadError } = await supabaseAdmin.storage
            .from('plant-images')
            .upload(filename, optimizedBuffer, {
              contentType: 'image/png',
              upsert: true,
            });

          if (uploadError) {
            throw new Error(`Failed to upload ${viewType}: ${uploadError.message}`);
          }

          // Get public URL
          const { data: urlData } = supabaseAdmin.storage
            .from('plant-images')
            .getPublicUrl(filename);

          console.log(`  ✅ ${viewLabel}: Complete`);
          return urlData.publicUrl;
        }

        // Generate both views
        const [frontViewUrl, topDownUrl] = await Promise.all([
          generatePlantImage('front'),
          generatePlantImage('topdown')
        ]);

        // Update plant record with both URLs
        const { error: updateError } = await supabase
          .from('plants')
          .update({
            front_view_image_url: frontViewUrl,
            top_down_image_url: topDownUrl,
            generated_image_url: frontViewUrl // Keep for backward compatibility
          })
          .eq('id', plant.id);

        if (updateError) {
          console.error(`⚠️  Failed to save URLs for ${plant.botanical_name}:`, updateError);
        } else {
          console.log(`✅ ✨ ${plant.botanical_name} - COMPLETE (both views)`);
          successCount++;
        }

        results.push({
          plant_id: plant.id,
          botanical_name: plant.botanical_name,
          front_view_url: frontViewUrl,
          top_down_url: topDownUrl,
          transparent: true,
          success: true,
        });

        // Add delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

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

    console.log(`\n✅ Generation complete: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      planId,
      results,
      summary: {
        total: recommendations.length,
        success: successCount,
        errors: errorCount,
      },
    });

  } catch (error: any) {
    console.error('❌ Error generating plant images:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
