#!/usr/bin/env node
/**
 * Import Common Names from WFO vernacularName.txt
 *
 * Download first:
 * https://zenodo.org/records/15704590/files/DarwinCore.zip
 * Extract vernacularName.txt
 *
 * File format (tab-delimited):
 * taxonID  vernacularName  language  countryCode
 */

import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Add common_names column if it doesn't exist
async function setupCommonNamesColumn() {
  console.log('📋 Setting up common_names column...');

  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE wfo_taxonomy
        ADD COLUMN IF NOT EXISTS common_names JSONB DEFAULT '{}';

      CREATE INDEX IF NOT EXISTS idx_wfo_common_names
        ON wfo_taxonomy USING gin(common_names);
    `
  });

  if (error) {
    console.error('❌ Column setup failed:', error);
    throw error;
  }

  console.log('✅ Column ready\n');
}

async function importCommonNames(filePath) {
  console.log('🌿 Importing Common Names\n');
  console.log('================================================\n');

  const fileStream = createReadStream(filePath);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  let headers = null;
  const commonNamesByWfoId = new Map();

  console.log('📖 Reading vernacularName.txt...');

  for await (const line of rl) {
    lineCount++;

    if (lineCount === 1) {
      headers = line.split('\t');
      continue;
    }

    const values = line.split('\t');
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || null;
    });

    const wfoId = record.taxonID;
    const name = record.vernacularName;
    const language = record.language || 'en';

    if (!wfoId || !name) continue;

    if (!commonNamesByWfoId.has(wfoId)) {
      commonNamesByWfoId.set(wfoId, {});
    }

    const names = commonNamesByWfoId.get(wfoId);
    if (!names[language]) {
      names[language] = [];
    }

    if (!names[language].includes(name)) {
      names[language].push(name);
    }

    if (lineCount % 100000 === 0) {
      process.stdout.write(`\r  Processed: ${lineCount.toLocaleString()} lines`);
    }
  }

  console.log(`\n✅ Parsed ${lineCount.toLocaleString()} lines`);
  console.log(`📊 Found common names for ${commonNamesByWfoId.size.toLocaleString()} taxa\n`);

  // Update database in batches
  console.log('⏳ Updating database...');

  const entries = Array.from(commonNamesByWfoId.entries());
  let updated = 0;

  for (let i = 0; i < entries.length; i += 500) {
    const batch = entries.slice(i, i + 500);

    for (const [wfoId, commonNames] of batch) {
      const { error } = await supabase
        .from('wfo_taxonomy')
        .update({ common_names: commonNames })
        .eq('wfo_id', wfoId);

      if (!error) {
        updated++;
      }
    }

    process.stdout.write(`\r  Updated: ${updated.toLocaleString()}/${commonNamesByWfoId.size.toLocaleString()}`);
  }

  console.log('\n\n✅ Import complete!\n');
}

async function main() {
  const filePath = '/Users/ianstone/Downloads/vernacularName.txt';

  try {
    await setupCommonNamesColumn();
    await importCommonNames(filePath);

    // Test
    console.log('🔍 Testing common names...\n');

    const { data } = await supabase
      .from('wfo_taxonomy')
      .select('scientific_name, common_names')
      .eq('scientific_name', 'Betula pendula')
      .single();

    if (data && data.common_names) {
      console.log(`Betula pendula common names:`);
      console.log(JSON.stringify(data.common_names, null, 2));
    }

  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    console.error('\n💡 Download vernacularName.txt first:');
    console.error('   wget https://zenodo.org/records/15704590/files/DarwinCore.zip');
    console.error('   unzip DarwinCore.zip vernacularName.txt\n');
    process.exit(1);
  }
}

main();
