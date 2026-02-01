/**
 * PNG Export Utilities
 * Clean rasterization of SVG symbols for Procreate/Morpholio
 * Uses @resvg/resvg-js for crisp, transparent output
 */

import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

/**
 * Convert SVG to transparent PNG at specified pixel width
 * Optimized for plant symbol packs (2048px or 4096px recommended)
 *
 * @param svg - SVG string
 * @param px - Output width in pixels (height will match)
 * @returns PNG buffer
 */
export async function svgToPng(svg: string, px: number): Promise<Buffer> {
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: px },
    font: {
      loadSystemFonts: false // Faster, no text in plant symbols
    }
  });

  const pngData = r.render().asPng();

  // Run through sharp for optimization and metadata
  return sharp(pngData)
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true
    })
    .toBuffer();
}

/**
 * Export symbol pack (all 4 styles × 4 seasons)
 * Creates 16 PNGs per plant
 */
export async function exportSymbolPack(
  svgGenerator: (style: string, season: string) => string,
  outputSize: number = 2048
): Promise<Map<string, Buffer>> {
  const styles = ['scientific', 'watercolor', 'marker', 'hand-drawn'];
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const pack = new Map<string, Buffer>();

  for (const style of styles) {
    for (const season of seasons) {
      const svg = svgGenerator(style, season);
      const png = await svgToPng(svg, outputSize);
      const key = `${style}-${season}`;
      pack.set(key, png);
    }
  }

  return pack;
}

/**
 * Recommended export settings
 */
export const EXPORT_PRESETS = {
  web: 512,           // Web designer preview
  print: 2048,        // Standard print quality
  procreate: 4096,    // High-res Procreate brushes
  morpholio: 2048     // Morpholio Trace assets
};
