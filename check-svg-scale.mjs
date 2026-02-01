import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get plant with image URL
const { data: plants } = await supabase
  .from('plants')
  .select('botanical_name, mature_height_cm, front_view_image_url')
  .in('botanical_name', ['Betula pendula', 'Viburnum tinus'])
  .not('front_view_image_url', 'is', null)
  .limit(2);

console.log('🔍 Checking SVG scale boxes...\n');

for (const plant of plants) {
  console.log(`\n📏 ${plant.botanical_name} (${plant.mature_height_cm}cm height)`);
  console.log(`   Image URL: ${plant.front_view_image_url}`);

  // Fetch the SVG content
  const response = await fetch(plant.front_view_image_url);
  const svgText = await response.text();

  // Extract scale metadata
  const viewBoxMatch = svgText.match(/viewBox="0 0 (\d+) (\d+)"/);
  const scaleMatch = svgText.match(/data-scale="([^"]+)"/);
  const scaleSizeMatch = svgText.match(/data-scale-size="(\d+)"/);

  if (viewBoxMatch) {
    console.log(`   ✅ ViewBox: ${viewBoxMatch[1]} × ${viewBoxMatch[2]}cm`);
  }
  if (scaleMatch) {
    console.log(`   ✅ Scale Label: ${scaleMatch[1]}`);
  }
  if (scaleSizeMatch) {
    console.log(`   ✅ Scale Size: ${scaleSizeMatch[1]}cm box`);
  }

  // Check for grid lines
  const hasGrid = svgText.includes('id="scale-grid"');
  console.log(`   ${hasGrid ? '✅' : '❌'} Scale Grid: ${hasGrid ? 'Present' : 'Missing'}`);

  // Check for scale annotation
  const hasScaleText = svgText.includes('Scale Box:');
  console.log(`   ${hasScaleText ? '✅' : '❌'} Scale Annotation: ${hasScaleText ? 'Present' : 'Missing'}`);
}

console.log('\n✨ Done!');
