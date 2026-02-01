#!/usr/bin/env node
/**
 * Rasterize SVG Symbols to PNG
 * Uses @resvg/resvg-js for high-quality rendering
 * Usage: node scripts/rasterize-symbols.mjs <svg-dir> [size]
 * Example: node scripts/rasterize-symbols.mjs ./symbols 4096
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, parse } from 'path';
import { Resvg } from '@resvg/resvg-js';

// Parse command line args
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node scripts/rasterize-symbols.mjs <svg-dir> [size]');
  console.error('Example: node scripts/rasterize-symbols.mjs ./symbols 4096');
  console.error('Sizes: 2048, 4096 (default: 4096 for Procreate/Morpholio)');
  process.exit(1);
}

const svgDir = args[0];
const targetSize = parseInt(args[1] || '4096', 10);

console.log(`🎨 Rasterizing SVG Symbols to PNG`);
console.log(`================================================\n`);
console.log(`SVG Directory: ${svgDir}`);
console.log(`Target Size: ${targetSize}px\n`);

try {
  // Find all SVG files
  const files = readdirSync(svgDir).filter(f => f.endsWith('.svg'));

  if (files.length === 0) {
    console.error('❌ No SVG files found in directory');
    process.exit(1);
  }

  console.log(`Found ${files.length} SVG files\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const svgPath = join(svgDir, file);
    const { name } = parse(file);

    try {
      // Read SVG
      const svg = readFileSync(svgPath, 'utf-8');

      // Parse with resvg
      const resvg = new Resvg(svg, {
        fitTo: {
          mode: 'width',
          value: targetSize
        },
        background: 'rgba(0,0,0,0)', // Transparent background
        font: {
          loadSystemFonts: false // Faster, symbols don't use fonts
        }
      });

      // Render to PNG
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      // Write PNG with size suffix
      const pngFilename = `${name}__${targetSize}.png`;
      const pngPath = join(svgDir, pngFilename);
      writeFileSync(pngPath, pngBuffer);

      successCount++;
      console.log(`✅ ${pngFilename} (${(pngBuffer.length / 1024).toFixed(1)}KB)`);

    } catch (error) {
      errorCount++;
      console.error(`❌ ${file}: ${error.message}`);
    }
  }

  console.log(`\n================================================`);
  console.log(`✅ Successfully rasterized: ${successCount}`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount}`);
  }
  console.log(`📁 Output directory: ${svgDir}\n`);

  // Print usage instructions
  console.log('PNG Export Complete!');
  console.log(`\nThese PNGs are optimized for:`);
  console.log(`  - Procreate (iPad illustration)`);
  console.log(`  - Morpholio Trace (landscape design)`);
  console.log(`  - High-resolution print work`);
  console.log(`\nTransparent background allows layering over site plans.\n`);

} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
