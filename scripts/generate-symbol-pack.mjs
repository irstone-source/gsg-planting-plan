#!/usr/bin/env node
/**
 * Generate Symbol Pack from Plant Data JSON
 * Usage: node scripts/generate-symbol-pack.mjs <input-json> [output-dir] [scale]
 * Example: node scripts/generate-symbol-pack.mjs betula-outline-data.json ./output 1:50
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

// Import rendering functions (using dynamic import for ESM)
const renderModule = await import('../src/lib/symbols/renderSymbol.ts');
const { generateSymbolPack } = renderModule;

// Parse command line args
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node scripts/generate-symbol-pack.mjs <input-json> [output-dir] [scale]');
  console.error('Example: node scripts/generate-symbol-pack.mjs betula-outline-data.json ./symbols 1:50');
  process.exit(1);
}

const inputFile = args[0];
const outputDir = args[1] || './symbols';
const scale = args[2] || '1:50';

console.log(`🌿 Generating Symbol Pack`);
console.log(`================================================\n`);
console.log(`Input: ${inputFile}`);
console.log(`Output: ${outputDir}`);
console.log(`Scale: ${scale}\n`);

try {
  // Read plant data
  const plantData = JSON.parse(readFileSync(inputFile, 'utf-8'));
  const botanicalName = plantData.species || plantData.botanical_name;

  if (!botanicalName) {
    throw new Error('Plant data must include "species" or "botanical_name" field');
  }

  console.log(`📋 Plant: ${botanicalName}`);
  console.log(`   Common: ${plantData.common_name || 'N/A'}`);
  console.log(`   Spread: ${plantData.botanical_params.spread_cm}cm`);
  console.log(`   Leaf habit: ${plantData.botanical_params.leaf_habit}`);
  console.log(`   Texture: ${plantData.botanical_params.crown_texture}`);
  console.log(`   Density: ${plantData.botanical_params.crown_density_value}\n`);

  // Create output directory
  mkdirSync(outputDir, { recursive: true });

  // Generate symbol pack (4 styles × 4 seasons = 16 SVGs)
  console.log('🎨 Generating symbols...\n');
  const pack = generateSymbolPack(plantData, scale);

  let count = 0;
  const styles = ['scientific', 'watercolor', 'marker', 'hand-drawn'];
  const seasons = ['spring', 'summer', 'autumn', 'winter'];

  for (const style of styles) {
    for (const season of seasons) {
      const svg = pack[style][season];
      const safeName = botanicalName.replace(/ /g, '_');
      const filename = `${safeName}__${style}__${season}__${scale.replace(':', '-')}.svg`;
      const filepath = join(outputDir, filename);

      writeFileSync(filepath, svg);
      count++;

      console.log(`✅ ${filename}`);
    }
  }

  console.log(`\n================================================`);
  console.log(`✅ Generated ${count} SVG symbols`);
  console.log(`📁 Output directory: ${outputDir}\n`);

  // Print summary stats
  console.log('Symbol Pack Contents:');
  console.log(`  Styles: ${styles.join(', ')}`);
  console.log(`  Seasons: ${seasons.join(', ')}`);
  console.log(`  Total files: ${count}`);
  console.log(`\nNext step: Run rasterization script to generate PNGs`);
  console.log(`  node scripts/rasterize-symbols.mjs ${outputDir}\n`);

} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
