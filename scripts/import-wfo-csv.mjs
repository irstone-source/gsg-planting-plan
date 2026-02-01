#!/usr/bin/env node
/**
 * WFO Taxonomy CSV Import Script
 * Fast import from classification.csv (1.6M records)
 *
 * Imports only:
 * - Accepted species (taxonomicStatus = "Accepted")
 * - Rank = "species" (ignores varieties, forms, subspecies for now)
 * - Families relevant to UK horticulture
 *
 * Run time: ~5-10 minutes for filtered dataset
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Parse tab-delimited CSV (WFO uses tabs, not commas)
 */
function parseWFOCSV(filePath) {
  console.log(`📖 Reading ${filePath}...`);
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());

  // First line is headers
  const headers = lines[0].split('\t').map(h => h.replace(/^"/, '').replace(/"$/, ''));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.replace(/^"/, '').replace(/"$/, ''));
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || null;
    });
    records.push(record);

    // Progress indicator
    if (i % 100000 === 0) {
      process.stdout.write(`\r  Parsing: ${i.toLocaleString()}/${lines.length.toLocaleString()} lines...`);
    }
  }

  console.log(`\n✅ Parsed ${records.length.toLocaleString()} records`);
  return records;
}

/**
 * Filter to relevant horticulture families + accepted species
 */
function filterRelevantPlants(records) {
  console.log('\n🔍 Filtering to accepted species...');

  // UK horticulture families (expand this list as needed)
  const relevantFamilies = new Set([
    'Betulaceae',    // Birch, Alder, Hazel
    'Caprifoliaceae', // Viburnum, Honeysuckle
    'Cornaceae',     // Dogwood
    'Rosaceae',      // Rose, Apple, Cherry, Hawthorn
    'Fagaceae',      // Oak, Beech
    'Pinaceae',      // Pine, Spruce, Fir
    'Salicaceae',    // Willow, Poplar
    'Aceraceae',     // Maple (now in Sapindaceae)
    'Sapindaceae',   // Maple, Horse Chestnut
    'Ericaceae',     // Heather, Rhododendron, Azalea
    'Oleaceae',      // Ash, Lilac, Privet
    'Cupressaceae',  // Cypress, Juniper
    'Taxaceae',      // Yew
    'Aquifoliaceae', // Holly
    'Tiliaceae',     // Lime (Linden)
    'Ulmaceae',      // Elm
    'Juglandaceae',  // Walnut
    'Malvaceae',     // Lime (now includes Tiliaceae)
    'Hydrangeaceae', // Hydrangea
    'Berberidaceae', // Barberry, Mahonia
    'Lamiaceae',     // Lavender, Rosemary
    'Asteraceae',    // Daisy, Aster, Echinacea
    'Ranunculaceae', // Clematis, Delphinium
    'Papaveraceae',  // Poppy
    'Scrophulariaceae', // Foxglove
    'Geraniaceae',   // Geranium
    'Primulaceae',   // Primrose
    'Saxifragaceae', // Saxifrage
    'Crassulaceae',  // Sedum
    'Boraginaceae',  // Forget-me-not
    'Liliaceae',     // Lily
    'Iridaceae',     // Iris, Crocus
    'Amaryllidaceae', // Daffodil, Snowdrop
    'Poaceae',       // Grasses
    'Cyperaceae'     // Sedges
  ]);

  const filtered = records.filter(r => {
    // Must be accepted species
    if (r.taxonomicStatus !== 'Accepted') return false;
    if (r.taxonRank !== 'species') return false;

    // Must have a family
    if (!r.family) return false;

    // Must be in relevant families (or accept all for comprehensive DB)
    // Comment out this check to import ALL accepted species
    if (!relevantFamilies.has(r.family)) return false;

    return true;
  });

  console.log(`  Found ${filtered.length.toLocaleString()} accepted species in ${relevantFamilies.size} families`);
  return filtered;
}

/**
 * Create WFO table if not exists
 */
async function ensureWFOTable() {
  console.log('\n📋 Creating wfo_taxonomy table...');

  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS wfo_taxonomy (
        wfo_id TEXT PRIMARY KEY,
        ipni_id TEXT,
        scientific_name TEXT NOT NULL,
        scientific_name_authorship TEXT,
        family TEXT,
        subfamily TEXT,
        tribe TEXT,
        genus TEXT,
        species TEXT,
        infraspecific_epithet TEXT,
        rank TEXT,
        taxonomic_status TEXT,
        nomenclatural_status TEXT,
        name_published_in TEXT,
        name_published_year INTEGER,
        accepted_name_wfo_id TEXT,
        parent_name_wfo_id TEXT,
        taxon_remarks TEXT,
        references TEXT,
        major_group TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Indexes for fast search
      CREATE INDEX IF NOT EXISTS idx_wfo_scientific ON wfo_taxonomy(scientific_name);
      CREATE INDEX IF NOT EXISTS idx_wfo_family ON wfo_taxonomy(family);
      CREATE INDEX IF NOT EXISTS idx_wfo_genus ON wfo_taxonomy(genus);
      CREATE INDEX IF NOT EXISTS idx_wfo_status ON wfo_taxonomy(taxonomic_status);
      CREATE INDEX IF NOT EXISTS idx_wfo_rank ON wfo_taxonomy(rank);

      -- Full text search index
      CREATE INDEX IF NOT EXISTS idx_wfo_search ON wfo_taxonomy USING gin(to_tsvector('english', scientific_name));
    `
  });

  if (error) {
    console.error('❌ Table creation failed:', error);
    throw error;
  }

  console.log('✅ Table ready');
}

/**
 * Transform WFO record to our schema
 */
function transformRecord(r) {
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
    name_published_year: r.namePublishedIn ? extractYear(r.namePublishedIn) : null,
    accepted_name_wfo_id: r.acceptedNameUsageID,
    parent_name_wfo_id: r.parentNameUsageID,
    taxon_remarks: r.taxonRemarks,
    references: r.references,
    major_group: r.majorGroup
  };
}

/**
 * Extract publication year from citation
 */
function extractYear(citation) {
  if (!citation) return null;
  const match = citation.match(/\b(1[6-9]\d{2}|20\d{2})\b/);
  return match ? parseInt(match[0]) : null;
}

/**
 * Batch insert to Supabase
 */
async function batchInsert(records) {
  console.log('\n⏳ Importing to Supabase...');

  const batchSize = 1000;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize).map(transformRecord);

    const { error } = await supabase
      .from('wfo_taxonomy')
      .upsert(batch, { onConflict: 'wfo_id' });

    if (error) {
      console.error(`\n❌ Batch ${i / batchSize + 1} error:`, error.message);
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

/**
 * Validate known plants
 */
async function validateKnownPlants() {
  console.log('🔍 Validating known plants...\n');

  const knownPlants = [
    { name: 'Betula pendula', expected_family: 'Betulaceae' },
    { name: 'Viburnum tinus', expected_family: 'Caprifoliaceae' },
    { name: 'Cornus alba', expected_family: 'Cornaceae' },
    { name: 'Quercus robur', expected_family: 'Fagaceae' },
    { name: 'Acer platanoides', expected_family: 'Sapindaceae' },
    { name: 'Taxus baccata', expected_family: 'Taxaceae' },
    { name: 'Lavandula angustifolia', expected_family: 'Lamiaceae' },
    { name: 'Rosa canina', expected_family: 'Rosaceae' }
  ];

  let found = 0;

  for (const plant of knownPlants) {
    const { data, error } = await supabase
      .from('wfo_taxonomy')
      .select('wfo_id, scientific_name, family, scientific_name_authorship')
      .eq('scientific_name', plant.name)
      .single();

    if (data) {
      const familyMatch = data.family === plant.expected_family ? '✅' : '⚠️';
      console.log(`  ${familyMatch} ${data.scientific_name} ${data.scientific_name_authorship || ''}`);
      console.log(`     Family: ${data.family} | WFO ID: ${data.wfo_id}`);
      found++;
    } else {
      console.log(`  ❌ ${plant.name} - NOT FOUND`);
    }
  }

  console.log(`\n  Found ${found}/${knownPlants.length} known plants`);
  return found;
}

/**
 * Show statistics
 */
async function showStats() {
  console.log('\n📊 Database Statistics:\n');

  // Total count
  const { count: total } = await supabase
    .from('wfo_taxonomy')
    .select('*', { count: 'exact', head: true });

  console.log(`  Total species: ${total?.toLocaleString() || 0}`);

  // Top families
  const { data: families } = await supabase
    .from('wfo_taxonomy')
    .select('family')
    .not('family', 'is', null);

  if (families) {
    const familyCounts = {};
    families.forEach(f => {
      familyCounts[f.family] = (familyCounts[f.family] || 0) + 1;
    });

    const topFamilies = Object.entries(familyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    console.log('\n  Top 10 families:');
    topFamilies.forEach(([family, count]) => {
      console.log(`    ${family.padEnd(20)} ${count.toLocaleString()}`);
    });
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🌿 WFO Taxonomy Import (CSV)\n');
  console.log('================================================\n');

  const startTime = Date.now();

  try {
    // Check environment
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }

    // Step 1: Create table
    await ensureWFOTable();

    // Step 2: Parse CSV
    const allRecords = parseWFOCSV('/Users/ianstone/Downloads/classification.csv');

    // Step 3: Filter to relevant species
    const relevantRecords = filterRelevantPlants(allRecords);

    // Step 4: Import
    const { imported, errors } = await batchInsert(relevantRecords);

    console.log(`✅ Import complete!`);
    console.log(`   Imported: ${imported.toLocaleString()} species`);
    if (errors > 0) console.log(`   Errors: ${errors} batches failed`);

    // Step 5: Validate
    await validateKnownPlants();

    // Step 6: Statistics
    await showStats();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n⏱️  Total time: ${duration}s`);

    console.log('\n🎉 Next steps:');
    console.log('   1. Update planting_plans schema: ALTER TABLE planting_plans ADD COLUMN wfo_id TEXT;');
    console.log('   2. Link existing plants to WFO IDs');
    console.log('   3. Build search API endpoint\n');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

main();
