/**
 * Professional Landscape Architecture Plant Renderer
 * Based on industry standards: clean fills, cluster blobs, simple patterns
 *
 * NO heavy SVG filters - uses 4-layer stack:
 * 1. Canopy mass (base fill or gradient)
 * 2. Texture layer (clusters/dots/hatch) clipped to polygon
 * 3. Edge treatment (subtle)
 * 4. Spread outline (optional dashed)
 */

import PoissonDiskSampling from 'poisson-disk-sampling';
import classifyPoint from 'robust-point-in-polygon';
import seedrandom from 'seedrandom';
import type { LeafHabit, CrownTexture, WinterInterest } from '../plant-data/types';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type RenderStyle = 'scientific' | 'watercolor' | 'marker' | 'hand-drawn';

type Pt = { x: number; y: number };

/**
 * Normalize outline from cm coordinates to canonical viewBox (0..1000)
 */
export function normalizeToViewBox(outlineCm: Pt[], boxCm: number, vb = 1000): Pt[] {
  const s = vb / boxCm;
  return outlineCm.map(p => ({ x: p.x * s, y: p.y * s }));
}

/**
 * Calculate true-to-scale SVG physical size in mm
 * Formula: sizeMm = (spreadCm * 10) / scale
 */
export function svgSizeMm(spreadCm: number, scale: number): number {
  return (spreadCm * 10) / scale;
}

/**
 * Generate deterministic 48-point organic outline
 * Uses smooth noise (averaged randoms) to avoid spiky "gear teeth"
 */
export function generateOutline48(boxCm: number, centerCm: number, spreadCm: number, seed: number): Pt[] {
  const rng = seedrandom(String(seed));
  const pts: Pt[] = [];
  const steps = 48;
  const r = spreadCm / 2;

  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;

    // Smooth jitter: average three randoms to reduce spikiness
    const j = (rng() + rng() + rng()) / 3; // 0..1
    const k = 0.88 + j * 0.24;              // 0.88..1.12

    const rr = r * k;
    pts.push({
      x: centerCm + Math.cos(t) * rr,
      y: centerCm + Math.sin(t) * rr,
    });
  }
  return pts;
}

/**
 * Check if point is inside polygon
 */
function pointInPoly(p: Pt, poly: Pt[]): boolean {
  // robust-point-in-polygon: -1 outside, 0 on edge, 1 inside
  return classifyPoint(poly.map(q => [q.x, q.y]), [p.x, p.y]) >= 0;
}

/**
 * Get bounding box of polygon
 */
function bbox(poly: Pt[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of poly) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Convert points array to SVG path string
 */
function ptsToPath(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';
}

/**
 * Generate irregular blob path (for watercolor clusters)
 */
function jitterBlobPath(cx: number, cy: number, r: number, rng: () => number): string {
  const steps = 20;
  const pts: Pt[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const j = 0.80 + 0.35 * rng(); // 0.80..1.15
    const rr = r * j;
    pts.push({ x: cx + Math.cos(t) * rr, y: cy + Math.sin(t) * rr });
  }
  return ptsToPath(pts);
}

/**
 * Seasonal color palettes based on leaf habit
 * Matches professional landscape architecture color theory
 */
function palette(leafHabit: LeafHabit, season: Season) {
  if (leafHabit === 'evergreen') {
    if (season === 'spring') return { base: '#4E8F38', deep: '#1F5A3A', hi: '#6FBF7E', accent: '#000000' };
    if (season === 'summer') return { base: '#228B22', deep: '#155724', hi: '#43AC78', accent: '#000000' };
    if (season === 'autumn') return { base: '#228B22', deep: '#155724', hi: '#43AC78', accent: '#CD7F32' };
    return { base: '#637E68', deep: '#2E4D3A', hi: '#7C8E80', accent: '#CD7F32' }; // winter
  } else {
    if (season === 'spring') return { base: '#7CBB5D', deep: '#3F7F4D', hi: '#C9DC87', accent: '#000000' };
    if (season === 'summer') return { base: '#2E7D4F', deep: '#1F5A3A', hi: '#6FBF7E', accent: '#000000' };
    if (season === 'autumn') return { base: '#FE7126', deep: '#644A2A', hi: '#FCB829', accent: '#D00127' };
    return { base: '#BBA89A', deep: '#6E6A63', hi: '#C9C4BB', accent: '#644A2A' }; // winter
  }
}

export interface RenderParams {
  outline: Pt[];                    // Canopy polygon points (in viewBox coords)
  spreadCm: number;                 // Real-world spread
  scale: number;                    // e.g. 50 for 1:50
  leafHabit: LeafHabit;             // Authoritative seasonal behavior
  density: number;                  // 0..1 (0.2=airy birch, 0.85=dense viburnum)
  texture: CrownTexture;            // Visual texture
  season: Season;                   // Current season
  style: RenderStyle;               // Rendering style
  seed: number;                     // For deterministic randomness
  showSpreadOutline?: boolean;      // Show dashed spread circle
  winterInterest?: WinterInterest;  // Special winter features
}

/**
 * Main professional SVG renderer
 * Implements 4-layer stack for landscape architecture quality
 */
export function buildTopDownSymbolSVG(params: RenderParams): string {
  const rng = seedrandom(String(params.seed));
  const pal = palette(params.leafHabit, params.season);

  // SVG physical size in mm (true-to-scale export)
  const spreadM = params.spreadCm / 100;
  const sizeMm = (spreadM * 1000) / params.scale;

  // Internal viewBox (canonical 1000×1000)
  const vb = 1000;
  const outlineD = ptsToPath(params.outline);

  // === LAYER 2: TEXTURE (Cluster blobs) ===
  // Cluster count scales with density + texture
  const baseCount = params.texture === 'fine' ? 180
                  : params.texture === 'medium' ? 120
                  : params.texture === 'needle' ? 200
                  : 70; // coarse
  const target = Math.round(baseCount * (0.55 + params.density));

  // Poisson disk radius (bigger radius = fewer clusters)
  const minDist = params.texture === 'fine' ? 28
                : params.texture === 'medium' ? 36
                : params.texture === 'needle' ? 24
                : 48; // coarse

  const bb = bbox(params.outline);
  const pds = new PoissonDiskSampling({
    shape: [vb, vb],
    minDistance: minDist,
    tries: 20,
    rng: rng
  });

  // Generate points, keep only those inside canopy polygon
  const pts = pds.fill()
    .map(([x, y]: number[]) => ({ x, y }))
    .filter((p: Pt) => pointInPoly(p, params.outline));

  // Downsample to target count (deterministic)
  const clusters = pts.slice(0, Math.min(target, pts.length)).map((p: Pt, i: number) => {
    const r = params.texture === 'fine' ? (10 + 10 * rng())
            : params.texture === 'medium' ? (14 + 14 * rng())
            : params.texture === 'needle' ? (8 + 8 * rng())
            : (20 + 18 * rng()); // coarse
    return { ...p, r, i };
  });

  // === PATTERN DEFINITIONS ===
  const dotPattern = `
    <pattern id="dot" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="${pal.deep}" fill-opacity="0.25"/>
    </pattern>`;

  const hatchPattern = `
    <pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
      <line x1="0" y1="0" x2="0" y2="12" stroke="${pal.deep}" stroke-opacity="0.22" stroke-width="2"/>
    </pattern>`;

  // === LAYER 1: CANOPY MASS ===
  const canopyMass = params.style === 'watercolor'
    ? `
      <defs>
        <radialGradient id="wcGrad" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stop-color="${pal.hi}" stop-opacity="0.55"/>
          <stop offset="55%" stop-color="${pal.base}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${pal.deep}" stop-opacity="0.35"/>
        </radialGradient>
      </defs>
      <path d="${outlineD}" fill="url(#wcGrad)" />
    `
    : `<path d="${outlineD}" fill="${pal.base}" fill-opacity="0.85"/>`;

  // === LAYER 2: CLUSTER LAYER (watercolor only) ===
  const clusterLayer = params.style === 'watercolor'
    ? clusters.map((c: Pt & { r: number; i: number }) => {
        const d = jitterBlobPath(c.x, c.y, c.r, rng);
        const fill = (c.i % 9 === 0) ? pal.deep : (c.i % 7 === 0 ? pal.hi : pal.base);
        const op = (c.i % 11 === 0) ? 0.20 : 0.12;
        return `<path d="${d}" fill="${fill}" fill-opacity="${op}"/>`;
      }).join('\n')
    : '';

  // === LAYER 3: TEXTURE OVERLAY (marker/hand-drawn) ===
  const textureOverlay = params.style === 'marker'
    ? `<path d="${outlineD}" fill="url(#dot)" opacity="0.55"/>`
    : params.style === 'hand-drawn'
    ? `<path d="${outlineD}" fill="url(#hatch)" opacity="0.65"/>`
    : '';

  // === LAYER 4: SPREAD OUTLINE (optional) ===
  const spreadOutline = params.showSpreadOutline
    ? `<path d="${outlineD}" fill="none" stroke="#333" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="10 8"/>`
    : '';

  // === WINTER INTEREST (Cornus alba red stems example) ===
  const winterInterest = params.season === 'winter' && params.winterInterest === 'red_stems'
    ? `<g opacity="0.9">
         <path d="M500 520 L500 340" stroke="#D00127" stroke-width="6" stroke-linecap="round"/>
         <path d="M500 440 L430 380" stroke="#D00127" stroke-width="5" stroke-linecap="round"/>
         <path d="M500 460 L575 395" stroke="#D00127" stroke-width="5" stroke-linecap="round"/>
       </g>`
    : '';

  const defs = `<defs>${dotPattern}${hatchPattern}<clipPath id="c"><path d="${outlineD}"/></clipPath></defs>`;

  return `<svg xmlns="http://www.w3.org/2000/svg"
     width="${sizeMm.toFixed(2)}mm" height="${sizeMm.toFixed(2)}mm"
     viewBox="0 0 ${vb} ${vb}"
     data-spread-cm="${params.spreadCm}"
     data-scale="1:${params.scale}"
     data-season="${params.season}"
     data-style="${params.style}">
  ${defs}
  ${canopyMass}
  <g clip-path="url(#c)">
    ${clusterLayer}
    ${textureOverlay}
  </g>
  ${winterInterest}
  ${spreadOutline}
</svg>`.trim();
}
