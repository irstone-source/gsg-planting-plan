#!/usr/bin/env node
/**
 * Streaming WFO Import - Handles large CSV files
 * Processes line-by-line to avoid memory issues
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

// UK horticulture families
const relevantFamilies = new Set([
  'Betulaceae', 'Caprifoliaceae', 'Cornaceae', 'Rosaceae', 'Fagaceae',
  'Pinaceae', 'Salicaceae', 'Sapindaceae', 'Ericaceae', 'Oleaceae',
  'Cupressaceae', 'Taxaceae', 'Aquifoliaceae', 'Malvaceae', 'Hydrangeaceae',
  'Berberidaceae', 'Lamiaceae', 'Asteraceae', 'Ranunculaceae', 'Papaveraceae',
  'Scrophulariaceae', 'Geraniaceae', 'Primulaceae', 'Saxifragaceae',
  'Crassulaceae', 'Boraginaceae', 'Liliaceae', 'Iridaceae', 'Amaryllidaceae',
  'Poaceae', 'Cyperaceae'
]);

function extractYear(citation) {
  if (!citation) return null;
  const match = citation.match(/\b(1[6-9]\d{2}|20\d{2})\b/);
  return match ? parseInt(match[0]) : null;
}

function transformRecord(values, headers) {
  const record = {};
  headers.forEach((header, idx) => {
    record[header] = values[idx] || null;
  });

  // Filter criteria
  if (record.taxonomicStatus !== 'Accepted') return null;
  if (record.taxonRank !== 'species') return null;
  if (!record.family) return null;
  if (!relevantFamilies.has(record.family)) return null;

  return {
    wfo_id: record.taxonID,
    ipni_id: record.scientificNameID,
    scientific_name: record.scientificName,
    scientific_name_authorship: record.scientificNameAuthorship,
    family: record.family,
    subfamily: record.subfamily,
    tribe: record.tribe,
    genus: record.genus,
    species: record.specificEpithet,
    infraspecific_epithet: record.infraspecificEpithet,
    rank: record.taxonRank?.toLowerCase(),
    taxonomic_status: record.taxonomicStatus?.toLowerCase(),
    nomenclatural_status: record.nomenclaturalStatus,
    name_published_in: record.namePublishedIn,
    name_published_year: extractYear(record.namePublishedIn),
    accepted_name_wfo_id: record.acceptedNameUsageID,
    parent_name_wfo_id: record.parentNameUsageID,
    taxon_remarks: record.taxonRemarks,
    reference_url: record.references,
    major_group: record.majorGroup
  };
}

async function batchInsert(batch) {
  const { error } = await supabase
    .from('wfo_taxonomy')
    .upsert(batch, { onConflict: 'wfo_id', ignoreDuplicates: false });

  if (error) throw error;
}

async function validateKnownPlants() {
  console.log('\n🔍 Validating known plants...\n');

  const knownPlants = [
    'Betula pendula',
    'Viburnum tinus',
    'Cornus alba',
    'Quercus robur',
    'Acer platanoides',
    'Taxus baccata',
    'Lavandula angustifolia',
    'Rosa canina'
  ];

  let found = 0;

  for (const name of knownPlants) {
    const { data } = await supabase
      .from('wfo_taxonomy')
      .select('wfo_id, scientific_name, family, scientific_name_authorship')
      .eq('scientific_name', name)
      .maybeSingle();

    if (data) {
      console.log(`  ✅ ${data.scientific_name} ${data.scientific_name_authorship || ''}`);
      console.log(`     ${data.family} | ${data.wfo_id}`);
      found++;
    } else {
      console.log(`  ❌ ${name} - NOT FOUND`);
    }
  }

  console.log(`\n  Found ${found}/${knownPlants.length} known plants`);
  return found;
}

async function main() {
  console.log('🌿 WFO Taxonomy Import (Streaming)\n');
  console.log('================================================\n');

  const startTime = Date.now();
  const filePath = '/Users/ianstone/Downloads/classification.csv';

  try {
    const fileStream = createReadStream(filePath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let headers = null;
    let lineCount = 0;
    let batch = [];
    let imported = 0;
    let filtered = 0;
    const batchSize = 500;

    console.log('📖 Streaming CSV file...');

    for await (const line of rl) {
      lineCount++;

      if (lineCount === 1) {
        // Parse headers
        headers = line.split('\t').map(h => h.replace(/^"/, '').replace(/"$/, ''));
        continue;
      }

      // Parse line
      const values = line.split('\t').map(v => v.replace(/^"/, '').replace(/"$/, ''));
      const record = transformRecord(values, headers);

      if (record) {
        batch.push(record);
        filtered++;

        // Batch insert when batch is full
        if (batch.length >= batchSize) {
          await batchInsert(batch);
          imported += batch.length;
          process.stdout.write(`\r  Processed: ${lineCount.toLocaleString()} lines | Imported: ${imported.toLocaleString()} species`);
          batch = [];
        }
      }

      // Progress indicator every 100k lines
      if (lineCount % 100000 === 0) {
        process.stdout.write(`\r  Processed: ${lineCount.toLocaleString()} lines | Filtered: ${filtered.toLocaleString()} species`);
      }
    }

    // Insert remaining batch
    if (batch.length > 0) {
      await batchInsert(batch);
      imported += batch.length;
    }

    console.log(`\n\n✅ Import complete!`);
    console.log(`   Total lines: ${lineCount.toLocaleString()}`);
    console.log(`   Filtered species: ${filtered.toLocaleString()}`);
    console.log(`   Imported: ${imported.toLocaleString()}`);

    // Validate
    await validateKnownPlants();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n⏱️  Total time: ${duration}s\n`);

  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  }
}

main();
