#!/usr/bin/env node
/**
 * Link Existing Plants to WFO IDs
 * Matches botanical_name in planting_plans to scientific_name in wfo_taxonomy
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function linkPlants() {
  console.log('🔗 Linking Plants to WFO IDs\n');
  console.log('================================================\n');

  try {
    // Get all plants with botanical names but no WFO ID
    const { data: plants, error: fetchError } = await supabase
      .from('planting_plans')
      .select('id, botanical_name, common_name')
      .not('botanical_name', 'is', null)
      .is('wfo_id', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!plants || plants.length === 0) {
      console.log('✅ No plants need linking (all already have WFO IDs)\n');
      return;
    }

    console.log(`Found ${plants.length} plants to link\n`);

    let matched = 0;
    let notFound = 0;

    for (const plant of plants) {
      // Try exact match first
      const { data: wfoMatch } = await supabase
        .from('wfo_taxonomy')
        .select('wfo_id, scientific_name, family')
        .eq('scientific_name', plant.botanical_name)
        .maybeSingle();

      if (wfoMatch) {
        // Update plant with WFO ID
        const { error: updateError } = await supabase
          .from('planting_plans')
          .update({ wfo_id: wfoMatch.wfo_id })
          .eq('id', plant.id);

        if (!updateError) {
          console.log(`✅ ${plant.botanical_name} → ${wfoMatch.wfo_id} (${wfoMatch.family})`);
          matched++;
        }
      } else {
        console.log(`❌ ${plant.botanical_name} - not found in WFO`);
        notFound++;
      }
    }

    console.log('\n================================================');
    console.log(`✅ Matched: ${matched}`);
    console.log(`❌ Not found: ${notFound}`);
    console.log(`📊 Total: ${plants.length}\n`);

    if (notFound > 0) {
      console.log('💡 Tip: Plants not found may use:');
      console.log('   - Outdated synonyms (check WFO for accepted name)');
      console.log('   - Common names instead of botanical names');
      console.log('   - Misspellings\n');
    }

  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

linkPlants();
