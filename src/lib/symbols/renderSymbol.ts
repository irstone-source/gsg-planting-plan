/**
 * Professional Plant Symbol Renderer
 * 4-Layer Stack: canopy mass + cluster blobs + texture overlay + spread outline
 * NO heavy SVG filters - clean fills, patterns, gradients only
 * True-to-scale exports in mm units
 */

import seedrandom from 'seedrandom';
import { getSeasonalPalette, applyWinterInterest, type Season } from './palettes';
import { getPlantPreset } from './presets';
import type { LeafHabit, CrownTexture, WinterInterest } from '../plant-data/types';

export type RenderStyle = 'scientific' | 'watercolor' | 'marker' | 'hand-drawn';
export type Scale = '1:10' | '1:20' | '1:50' | '1:100' | '1:200';

export interface PlantSymbolData {
  botanical_name: string;
  common_name: string;
  botanical_params: {
    spread_cm: number;
    height_cm: number;
    scale_box_cm: number;
    center_cm: { x: number; y: number };
    leaf_habit: LeafHabit;
    crown_texture: CrownTexture;
    crown_density_value: number;
    winter_interest?: WinterInterest;
  };
  outline_cm: Array<{ x: number; y: number }>;
}

export interface RenderOptions {
  style: RenderStyle;
  season: Season;
  scale: Scale;
  seed?: number;
}

interface ClusterPoint {
  x: number;
  y: number;
  radius: number;
}

/**
 * Poisson disk sampling for cluster placement
 * Ensures even distribution without clustering overlap
 */
function poissonDiskSampling(
  width: number,
  height: number,
  minDist: number,
  maxPoints: number,
  outline: Array<{ x: number; y: number }>,
  rng: () => number
): ClusterPoint[] {
  const points: ClusterPoint[] = [];
  const grid: Map<string, ClusterPoint> = new Map();
  const cellSize = minDist / Math.SQRT2;

  // Start with center point if inside outline
  const startX = width / 2;
  const startY = height / 2;

  if (isInsidePolygon({ x: startX, y: startY }, outline)) {
    const radius = minDist * (0.5 + rng() * 0.5);
    const start = { x: startX, y: startY, radius };
    points.push(start);
    addToGrid(start, grid, cellSize);
  }

  const active: ClusterPoint[] = [...points];
  let attempts = 0;
  const maxAttempts = 10000;

  while (active.length > 0 && points.length < maxPoints && attempts < maxAttempts) {
    attempts++;
    const idx = Math.floor(rng() * active.length);
    const point = active[idx];
    let found = false;

    for (let i = 0; i < 30; i++) {
      const angle = rng() * Math.PI * 2;
      const distance = minDist * (1 + rng());
      const newX = point.x + Math.cos(angle) * distance;
      const newY = point.y + Math.sin(angle) * distance;
      const newPoint = {
        x: newX,
        y: newY,
        radius: minDist * (0.5 + rng() * 0.5)
      };

      if (
        newX >= 0 && newX < width &&
        newY >= 0 && newY < height &&
        isInsidePolygon({ x: newX, y: newY }, outline) &&
        !hasNearbyPoint(newPoint, grid, cellSize, minDist)
      ) {
        points.push(newPoint);
        addToGrid(newPoint, grid, cellSize);
        active.push(newPoint);
        found = true;
        break;
      }
    }

    if (!found) {
      active.splice(idx, 1);
    }
  }

  return points;
}

function isInsidePolygon(point: { x: number; y: number }, polygon: Array<{ x: number; y: number }>): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function addToGrid(point: ClusterPoint, grid: Map<string, ClusterPoint>, cellSize: number) {
  const x = Math.floor(point.x / cellSize);
  const y = Math.floor(point.y / cellSize);
  grid.set(`${x},${y}`, point);
}

function hasNearbyPoint(
  point: ClusterPoint,
  grid: Map<string, ClusterPoint>,
  cellSize: number,
  minDist: number
): boolean {
  const x = Math.floor(point.x / cellSize);
  const y = Math.floor(point.y / cellSize);

  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      const neighbor = grid.get(`${x + dx},${y + dy}`);
      if (neighbor) {
        const dist = Math.sqrt((point.x - neighbor.x) ** 2 + (point.y - neighbor.y) ** 2);
        if (dist < minDist) return true;
      }
    }
  }
  return false;
}

/**
 * Scale numerical value to match output scale
 */
function getScaleRatio(scale: Scale): number {
  switch (scale) {
    case '1:10': return 10;
    case '1:20': return 20;
    case '1:50': return 50;
    case '1:100': return 100;
    case '1:200': return 200;
  }
}

/**
 * Main rendering function - generates SVG for a plant symbol
 */
export function renderPlantSymbol(
  plant: PlantSymbolData,
  options: RenderOptions
): string {
  const { style, season, scale, seed = 12345 } = options;
  const rng = seedrandom(String(seed));

  // Get preset and palette
  const preset = getPlantPreset(plant.botanical_name);
  let palette = getSeasonalPalette(preset.leaf_habit, season);

  // Apply winter interest if applicable
  if (season === 'winter' && preset.winter_interest) {
    palette = applyWinterInterest(palette, preset.winter_interest);
  }

  // Calculate true-to-scale dimensions in mm
  const scaleRatio = getScaleRatio(scale);
  const spreadM = plant.botanical_params.spread_cm / 100;
  const widthMm = (spreadM * 1000) / scaleRatio;
  const heightMm = widthMm; // Circular spread assumption

  // Normalize outline to viewBox (0..1000)
  const vb = 1000;
  const scaleBoxCm = plant.botanical_params.scale_box_cm;
  const normalizeCoord = (val: number) => (val / scaleBoxCm) * vb;

  const outline = plant.outline_cm.map(pt => ({
    x: normalizeCoord(pt.x),
    y: normalizeCoord(pt.y)
  }));

  const outlinePath = outline.map((pt, i) =>
    `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`
  ).join(' ') + ' Z';

  // Generate cluster points (count based on density and texture)
  const baseCount = preset.crown_texture === 'fine' ? 180 :
    preset.crown_texture === 'medium' ? 120 : 70;
  const target = Math.round(baseCount * (0.55 + preset.crown_density_value * 0.45));
  const minDist = vb / Math.sqrt(target) * 1.8;

  const clusters = poissonDiskSampling(vb, vb, minDist, target, outline, () => rng());

  // Render based on style
  switch (style) {
    case 'scientific':
      return renderScientific(
        widthMm,
        heightMm,
        vb,
        outlinePath,
        palette,
        preset.leaf_habit === 'deciduous' && season === 'winter'
      );

    case 'watercolor':
      return renderWatercolor(
        widthMm,
        heightMm,
        vb,
        outlinePath,
        clusters,
        palette,
        preset.leaf_habit === 'deciduous' && season === 'winter'
      );

    case 'marker':
      return renderMarker(
        widthMm,
        heightMm,
        vb,
        outlinePath,
        palette,
        preset.leaf_habit === 'deciduous' && season === 'winter'
      );

    case 'hand-drawn':
      return renderHandDrawn(
        widthMm,
        heightMm,
        vb,
        outlinePath,
        palette,
        preset.leaf_habit === 'deciduous' && season === 'winter'
      );

    default:
      return renderScientific(widthMm, heightMm, vb, outlinePath, palette, false);
  }
}

/**
 * SCIENTIFIC STYLE: Clean baseline with dashed spread outline
 */
function renderScientific(
  widthMm: number,
  heightMm: number,
  vb: number,
  outlinePath: string,
  palette: any,
  isWinterBare: boolean
): string {
  const canopyFill = isWinterBare ? 'none' : palette.canopy_fill;
  const canopyOpacity = isWinterBare ? 0 : 0.3;

  return `<svg width="${widthMm}mm" height="${heightMm}mm" viewBox="0 0 ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="canopy-clip">
      <path d="${outlinePath}" />
    </clipPath>
  </defs>

  <!-- Layer 1: Canopy Mass (subtle fill) -->
  <path d="${outlinePath}" fill="${canopyFill}" opacity="${canopyOpacity}" />

  <!-- Layer 4: Spread Outline (dashed) -->
  <path d="${outlinePath}" fill="none" stroke="${palette.outline_stroke}" stroke-width="2" stroke-dasharray="10,5" opacity="${palette.outline_opacity}" />
</svg>`;
}

/**
 * WATERCOLOR STYLE: Radial gradient canopy + cluster blobs
 */
function renderWatercolor(
  widthMm: number,
  heightMm: number,
  vb: number,
  outlinePath: string,
  clusters: ClusterPoint[],
  palette: any,
  isWinterBare: boolean
): string {
  const canopyOpacity = isWinterBare ? 0.15 : 0.4;
  const clusterOpacity = isWinterBare ? 0 : 0.6;

  const clusterCircles = clusters.map((c, i) => `
    <circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${c.radius.toFixed(2)}"
      fill="${palette.cluster_fill}" opacity="${clusterOpacity}" />`
  ).join('');

  return `<svg width="${widthMm}mm" height="${heightMm}mm" viewBox="0 0 ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="canopy-clip">
      <path d="${outlinePath}" />
    </clipPath>
    <radialGradient id="canopy-gradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${palette.canopy_gradient_start}" />
      <stop offset="100%" stop-color="${palette.canopy_gradient_end}" />
    </radialGradient>
  </defs>

  <!-- Layer 1: Canopy Mass (radial gradient) -->
  <path d="${outlinePath}" fill="url(#canopy-gradient)" opacity="${canopyOpacity}" />

  <!-- Layer 2: Cluster Blobs (clipped to canopy) -->
  <g clip-path="url(#canopy-clip)">
    ${clusterCircles}
  </g>

  <!-- Layer 4: Spread Outline -->
  <path d="${outlinePath}" fill="none" stroke="${palette.outline_stroke}" stroke-width="1.5" opacity="${palette.outline_opacity}" />
</svg>`;
}

/**
 * MARKER STYLE: Bold solid fill + dot pattern overlay
 */
function renderMarker(
  widthMm: number,
  heightMm: number,
  vb: number,
  outlinePath: string,
  palette: any,
  isWinterBare: boolean
): string {
  const canopyFill = isWinterBare ? palette.canopy_fill : palette.canopy_fill;
  const canopyOpacity = isWinterBare ? 0.25 : 0.75;
  const patternOpacity = isWinterBare ? 0 : 0.4;

  return `<svg width="${widthMm}mm" height="${heightMm}mm" viewBox="0 0 ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="canopy-clip">
      <path d="${outlinePath}" />
    </clipPath>
    <pattern id="dot-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="3" fill="${palette.texture_color}" />
    </pattern>
  </defs>

  <!-- Layer 1: Canopy Mass (bold fill) -->
  <path d="${outlinePath}" fill="${canopyFill}" opacity="${canopyOpacity}" />

  <!-- Layer 3: Texture Overlay (dot pattern, clipped) -->
  <g clip-path="url(#canopy-clip)">
    <rect x="0" y="0" width="${vb}" height="${vb}" fill="url(#dot-pattern)" opacity="${patternOpacity}" />
  </g>

  <!-- Layer 4: Spread Outline -->
  <path d="${outlinePath}" fill="none" stroke="${palette.outline_stroke}" stroke-width="2" opacity="${palette.outline_opacity}" />
</svg>`;
}

/**
 * HAND-DRAWN STYLE: Soft fill + hatch overlay
 */
function renderHandDrawn(
  widthMm: number,
  heightMm: number,
  vb: number,
  outlinePath: string,
  palette: any,
  isWinterBare: boolean
): string {
  const canopyOpacity = isWinterBare ? 0.2 : 0.5;
  const hatchOpacity = isWinterBare ? 0.4 : 0.3;

  return `<svg width="${widthMm}mm" height="${heightMm}mm" viewBox="0 0 ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="canopy-clip">
      <path d="${outlinePath}" />
    </clipPath>
    <pattern id="hatch-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="20" stroke="${palette.texture_color}" stroke-width="1.5" />
    </pattern>
  </defs>

  <!-- Layer 1: Canopy Mass (soft fill) -->
  <path d="${outlinePath}" fill="${palette.canopy_fill}" opacity="${canopyOpacity}" />

  <!-- Layer 3: Texture Overlay (hatch, clipped) -->
  <g clip-path="url(#canopy-clip)">
    <rect x="0" y="0" width="${vb}" height="${vb}" fill="url(#hatch-pattern)" opacity="${hatchOpacity}" />
  </g>

  <!-- Layer 4: Spread Outline -->
  <path d="${outlinePath}" fill="none" stroke="${palette.outline_stroke}" stroke-width="1.5" opacity="${palette.outline_opacity}" />
</svg>`;
}

/**
 * Generate complete symbol pack (all styles × all seasons)
 */
export function generateSymbolPack(
  plant: PlantSymbolData,
  scale: Scale = '1:50',
  seed?: number
): Record<string, Record<string, string>> {
  const styles: RenderStyle[] = ['scientific', 'watercolor', 'marker', 'hand-drawn'];
  const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];

  const pack: Record<string, Record<string, string>> = {};

  for (const style of styles) {
    pack[style] = {};
    for (const season of seasons) {
      pack[style][season] = renderPlantSymbol(plant, { style, season, scale, seed });
    }
  }

  return pack;
}
