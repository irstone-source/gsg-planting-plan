import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase
  .from('plants')
  .select('botanical_name, front_view_image_url, mature_height_cm, mature_spread_cm')
  .in('botanical_name', ['Betula pendula', 'Acer campestre', 'Viburnum tinus', 'Cornus alba']);

console.log('Query error:', error);
console.log('Found plants:', data?.length || 0);
console.log('\nPlant data:');
data?.forEach(plant => {
  console.log(`\n${plant.botanical_name}:`);
  console.log(`  Height: ${plant.mature_height_cm}cm`);
  console.log(`  Spread: ${plant.mature_spread_cm}cm`);
  console.log(`  Image: ${plant.front_view_image_url ? 'YES' : 'NO'}`);
});
