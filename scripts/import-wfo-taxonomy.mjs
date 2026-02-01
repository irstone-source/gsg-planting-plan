#!/usr/bin/env node
/**
 * WFO Taxonomy Import Script
 * Parses Darwin Core Archive and loads into Supabase
 *
 * Darwin Core files:
 * - taxon.txt: Main taxonomic data (tab-delimited)
 * - vernacularName.txt: Common names in multiple languages
 * - distribution.txt: Geographic distribution
 */

import { readFileSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations
);

/**
 * Parse tab-delimited Darwin Core file
 */
function parseDarwinCore(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());

  // First line is headers
  const headers = lines[0].split('\t');
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || null;
    });
    records.push(record);
  }

  return records;
}

/**
 * Create WFO taxonomy table if it doesn't exist
 */
async function createWFOTable() {
  console.log('Creating wfo_taxonomy table...');

  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS wfo_taxonomy (
        wfo_id TEXT PRIMARY KEY,
        scientific_name TEXT NOT NULL,
        family TEXT,
        genus TEXT,
        species TEXT,
        infraspecific_epithet TEXT,
        rank TEXT,
        taxonomic_status TEXT,
        accepted_name_wfo_id TEXT,
        nomenclatural_status TEXT,
        name_published_in_year INTEGER,
        taxon_remarks TEXT,
        references TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_wfo_scientific ON wfo_taxonomy(scientific_name);
      CREATE INDEX IF NOT EXISTS idx_wfo_family ON wfo_taxonomy(family);
      CREATE INDEX IF NOT EXISTS idx_wfo_genus ON wfo_taxonomy(genus);
      CREATE INDEX IF NOT EXISTS idx_wfo_status ON wfo_taxonomy(taxonomic_status);
    `
  });

  if (error) {
    console.error('Table creation error:', error);
    throw error;
  }

  console.log('✅ Table ready');
}

/**
 * Import taxon records in batches
 */
async function importTaxonomy() {
  console.log('\n📖 Reading taxon.txt...');
  const records = parseDarwinCore('data/wfo/taxon.txt');
  console.log(`Found ${records.length.toLocaleString()} taxonomic records`);

  // Filter to accepted species only (for initial import)
  // You can remove this filter later to include synonyms
  const acceptedSpecies = records.filter(r =>
    r.taxonomicStatus === 'Accepted' &&
    r.taxonRank === 'SPECIES'
  );

  console.log(`Filtering to ${acceptedSpecies.length.toLocaleString()} accepted species`);

  // Transform to our schema
  const transformedRecords = acceptedSpecies.map(r => ({
    wfo_id: r.taxonID,
    scientific_name: r.scientificName,
    family: r.family,
    genus: r.genus,
    species: r.specificEpithet,
    infraspecific_epithet: r.infraspecificEpithet,
    rank: r.taxonRank?.toLowerCase(),
    taxonomic_status: r.taxonomicStatus?.toLowerCase(),
    accepted_name_wfo_id: r.acceptedNameUsageID,
    nomenclatural_status: r.nomenclaturalStatus,
    name_published_in_year: r.namePublishedInYear ? parseInt(r.namePublishedInYear) : null,
    taxon_remarks: r.taxonRemarks,
    references: r.references
  }));

  // Batch insert
  const batchSize = 1000;
  let imported = 0;

  console.log('\n⏳ Importing to Supabase...');

  for (let i = 0; i < transformedRecords.length; i += batchSize) {
    const batch = transformedRecords.slice(i, i + batchSize);

    const { error } = await supabase
      .from('wfo_taxonomy')
      .upsert(batch, { onConflict: 'wfo_id' });

    if (error) {
      console.error(`Batch ${i / batchSize + 1} error:`, error);
      continue;
    }

    imported += batch.length;
    const percent = ((imported / transformedRecords.length) * 100).toFixed(1);
    process.stdout.write(`\r  Progress: ${imported.toLocaleString()}/${transformedRecords.length.toLocaleString()} (${percent}%)`);
  }

  console.log('\n');
  return imported;
}

/**
 * Validate known plants exist
 */
async function validateKnownPlants() {
  console.log('\n🔍 Validating known plants...');

  const knownPlants = [
    'Betula pendula',
    'Viburnum tinus',
    'Cornus alba',
    'Acer platanoides',
    'Quercus robur'
  ];

  for (const name of knownPlants) {
    const { data, error } = await supabase
      .from('wfo_taxonomy')
      .select('wfo_id, scientific_name, family')
      .eq('scientific_name', name)
      .single();

    if (data) {
      console.log(`  ✅ ${data.scientific_name} (${data.family}) - ${data.wfo_id}`);
    } else {
      console.log(`  ❌ ${name} not found`);
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🌿 WFO Taxonomy Import\n');
  console.log('================================================\n');

  try {
    // Step 1: Create table
    await createWFOTable();

    // Step 2: Import taxonomy
    const count = await importTaxonomy();
    console.log(`✅ Imported ${count.toLocaleString()} species`);

    // Step 3: Validate
    await validateKnownPlants();

    console.log('\n🎉 Import complete!');
    console.log('\nNext steps:');
    console.log('  1. Update planting_plans table to reference wfo_id');
    console.log('  2. Build search endpoint with WFO as backbone');
    console.log('  3. Add common names from vernacularName.txt\n');

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

main();
