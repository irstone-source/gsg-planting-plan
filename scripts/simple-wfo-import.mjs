#!/usr/bin/env node
/**
 * Simple WFO Import - Direct table creation + CSV import
 * No RPC calls needed
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function parseWFOCSV(filePath) {
  console.log(`📖 Reading ${filePath}...`);
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());

  const headers = lines[0].split('\t').map(h => h.replace(/^"/, '').replace(/"$/, ''));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.replace(/^"/, '').replace(/"$/, ''));
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || null;
    });
    records.push(record);

    if (i % 100000 === 0) {
      process.stdout.write(`\r  Parsing: ${i.toLocaleString()}/${lines.length.toLocaleString()} lines...`);
    }
  }

  console.log(`\n✅ Parsed ${records.length.toLocaleString()} records`);
  return records;
}

function filterRelevantPlants(records) {
  console.log('\n🔍 Filtering to accepted species...');

  const relevantFamilies = new Set([
    'Betulaceae', 'Caprifoliaceae', 'Cornaceae', 'Rosaceae', 'Fagaceae',
    'Pinaceae', 'Salicaceae', 'Sapindaceae', 'Ericaceae', 'Oleaceae',
    'Cupressaceae', 'Taxaceae', 'Aquifoliaceae', 'Malvaceae', 'Hydrangeaceae',
    'Berberidaceae', 'Lamiaceae', 'Asteraceae', 'Ranunculaceae', 'Papaveraceae',
    'Scrophulariaceae', 'Geraniaceae', 'Primulaceae', 'Saxifragaceae',
    'Crassulaceae', 'Boraginaceae', 'Liliaceae', 'Iridaceae', 'Amaryllidaceae',
    'Poaceae', 'Cyperaceae'
  ]);

  const filtered = records.filter(r => {
    if (r.taxonomicStatus !== 'Accepted') return false;
    if (r.taxonRank !== 'species') return false;
    if (!r.family) return false;
    if (!relevantFamilies.has(r.family)) return false;
    return true;
  });

  console.log(`  Found ${filtered.length.toLocaleString()} accepted species in ${relevantFamilies.size} families`);
  return filtered;
}

function transformRecord(r) {
  const year = r.namePublishedIn ? r.namePublishedIn.match(/\b(1[6-9]\d{2}|20\d{2})\b/) : null;

  return {
    wfo_id: r.taxonID,
    ipni_id: r.scientificNameID,
    scientific_name: r.scientificName,
    scientific_name_authorship: r.scientificNameAuthorship,
    family: r.family,
    subfamily: r.subfamily,
    tribe: r.tribe,
    genus: r.genus,
    species: r.specificEpithet,
    infraspecific_epithet: r.infraspecificEpithet,
    rank: r.taxonRank?.toLowerCase(),
    taxonomic_status: r.taxonomicStatus?.toLowerCase(),
    nomenclatural_status: r.nomenclaturalStatus,
    name_published_in: r.namePublishedIn,
    name_published_year: year ? parseInt(year[0]) : null,
    accepted_name_wfo_id: r.acceptedNameUsageID,
    parent_name_wfo_id: r.parentNameUsageID,
    taxon_remarks: r.taxonRemarks,
    reference_url: r.references,
    major_group: r.majorGroup
  };
}

async function batchInsert(records) {
  console.log('\n⏳ Importing to Supabase...');

  const batchSize = 500; // Smaller batches for stability
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize).map(transformRecord);

    const { error } = await supabase
      .from('wfo_taxonomy')
      .upsert(batch, { onConflict: 'wfo_id', ignoreDuplicates: false });

    if (error) {
      console.error(`\n❌ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
      errors++;
      continue;
    }

    imported += batch.length;
    const percent = ((imported / records.length) * 100).toFixed(1);
    process.stdout.write(`\r  Progress: ${imported.toLocaleString()}/${records.length.toLocaleString()} (${percent}%)`);
  }

  console.log('\n');
  return { imported, errors };
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
    const { data, error } = await supabase
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
  console.log('🌿 WFO Taxonomy Import\n');
  console.log('================================================\n');

  const startTime = Date.now();

  try {
    console.log('⚠️  NOTE: Run supabase-wfo-setup.sql in Supabase SQL Editor first!\n');

    // Parse CSV
    const allRecords = parseWFOCSV('/Users/ianstone/Downloads/classification.csv');

    // Filter
    const relevantRecords = filterRelevantPlants(allRecords);

    // Import
    const { imported, errors } = await batchInsert(relevantRecords);

    console.log(`✅ Import complete!`);
    console.log(`   Imported: ${imported.toLocaleString()} species`);
    if (errors > 0) console.log(`   Errors: ${errors} batches`);

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
