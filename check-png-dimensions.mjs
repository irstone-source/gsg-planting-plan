import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get plants with image URLs
const { data: plants } = await supabase
  .from('plants')
  .select('botanical_name, mature_height_cm, mature_spread_cm, front_view_image_url')
  .in('botanical_name', ['Betula pendula', 'Acer campestre', 'Viburnum tinus', 'Cornus alba'])
  .not('front_view_image_url', 'is', null)
  .order('mature_height_cm', { ascending: false });

console.log('📏 Checking PNG dimensions for scale accuracy...\n');

const expectedScales = {
  500: '5m × 5m (Shrubs)',
  1000: '10m × 10m (Small Trees)',
  1500: '15m × 15m (Medium Trees)',
  2500: '25m × 25m (Large Trees)',
  4000: '40m × 40m (Extra Large)'
};

for (const plant of plants) {
  // Fetch the image
  const response = await fetch(plant.front_view_image_url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Get image metadata
  const metadata = await sharp(buffer).metadata();

  // Determine expected scale box
  const heightCm = plant.mature_height_cm;
  let expectedSize;
  if (heightCm <= 500) expectedSize = 500;
  else if (heightCm <= 1000) expectedSize = 1000;
  else if (heightCm <= 1500) expectedSize = 1500;
  else if (heightCm <= 2500) expectedSize = 2500;
  else expectedSize = 4000;

  const isCorrect = metadata.width === expectedSize && metadata.height === expectedSize;
  const icon = isCorrect ? '✅' : '❌';

  console.log(`${icon} ${plant.botanical_name}`);
  console.log(`   Mature size: ${heightCm}cm height × ${plant.mature_spread_cm}cm spread`);
  console.log(`   Expected scale box: ${expectedScales[expectedSize]} (${expectedSize}×${expectedSize}px)`);
  console.log(`   Actual PNG size: ${metadata.width}×${metadata.height}px`);
  console.log(`   ${isCorrect ? '✅ CORRECT - True to scale!' : '❌ INCORRECT - Needs regeneration'}\n`);
}

console.log('🎯 Scale Verification Complete!');
console.log('\n📐 What this means:');
console.log('   - Each PNG is sized at 1px = 1cm');
console.log('   - A 2500px tree is exactly 5× larger than a 500px shrub');
console.log('   - When dragged into Procreate/CAD, they maintain true scale');
console.log('   - Plants can be directly compared by size');
