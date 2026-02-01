#!/usr/bin/env node
/**
 * Professional Plant Symbol Generator
 * Demonstrates cluster-based rendering with correct botanical parameters
 *
 * Example plants:
 * - Betula pendula (airy, fine texture, deciduous)
 * - Viburnum tinus (dense, evergreen)
 * - Cornus alba (winter red stems, deciduous)
 */

import { writeFileSync } from 'fs';
import seedrandom from 'seedrandom';

// === TYPES ===
const LeafHabit = {
  DECIDUOUS: 'deciduous',
  EVERGREEN: 'evergreen',
  SEMI_EVERGREEN: 'semi_evergreen'
};

const CrownTexture = {
  FINE: 'fine',
  MEDIUM: 'medium',
  COARSE: 'coarse',
  NEEDLE: 'needle'
};

// === NORMALIZE TO VIEWBOX ===
function normalizeToViewBox(outlineCm, boxCm, vb = 1000) {
  const s = vb / boxCm;
  return outlineCm.map(p => ({ x: p.x * s, y: p.y * s }));
}

// === GENERATE OUTLINE ===
function generateOutline48(boxCm, centerCm, spreadCm, seed) {
  const rng = seedrandom(String(seed));
  const pts = [];
  const steps = 48;
  const r = spreadCm / 2;

  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const j = (rng() + rng() + rng()) / 3;
    const k = 0.88 + j * 0.24;
    const rr = r * k;
    pts.push({
      x: centerCm + Math.cos(t) * rr,
      y: centerCm + Math.sin(t) * rr,
    });
  }
  return pts;
}

// === POINT IN POLYGON ===
function pointInPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > p.y) !== (yj > p.y))
      && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// === BBOX ===
function bbox(poly) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of poly) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}

// === PATH STRING ===
function ptsToPath(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';
}

// === JITTER BLOB ===
function jitterBlobPath(cx, cy, r, rng) {
  const steps = 20;
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const j = 0.80 + 0.35 * rng();
    const rr = r * j;
    pts.push({ x: cx + Math.cos(t) * rr, y: cy + Math.sin(t) * rr });
  }
  return ptsToPath(pts);
}

// === POISSON DISK SAMPLING (SIMPLE VERSION) ===
function poissonDiskSampling(width, height, minDist, rng, tries = 20) {
  const cellSize = minDist / Math.sqrt(2);
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid = Array(gridWidth * gridHeight).fill(null);
  const points = [];
  const active = [];

  const sample = { x: rng() * width, y: rng() * height };
  points.push(sample);
  active.push(sample);

  while (active.length > 0) {
    const idx = Math.floor(rng() * active.length);
    const point = active[idx];
    let found = false;

    for (let k = 0; k < tries; k++) {
      const angle = rng() * 2 * Math.PI;
      const radius = minDist + rng() * minDist;
      const candidate = {
        x: point.x + radius * Math.cos(angle),
        y: point.y + radius * Math.sin(angle)
      };

      if (candidate.x >= 0 && candidate.x < width && candidate.y >= 0 && candidate.y < height) {
        const gx = Math.floor(candidate.x / cellSize);
        const gy = Math.floor(candidate.y / cellSize);
        let valid = true;

        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = gx + dx;
            const ny = gy + dy;
            if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
              const neighbor = grid[ny * gridWidth + nx];
              if (neighbor) {
                const d = Math.sqrt((candidate.x - neighbor.x) ** 2 + (candidate.y - neighbor.y) ** 2);
                if (d < minDist) {
                  valid = false;
                  break;
                }
              }
            }
          }
          if (!valid) break;
        }

        if (valid) {
          points.push(candidate);
          active.push(candidate);
          grid[gy * gridWidth + gx] = candidate;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      active.splice(idx, 1);
    }
  }

  return points;
}

// === PALETTE ===
function palette(leafHabit, season) {
  if (leafHabit === 'evergreen') {
    if (season === 'spring') return { base: '#4E8F38', deep: '#1F5A3A', hi: '#6FBF7E', accent: '#000000' };
    if (season === 'summer') return { base: '#228B22', deep: '#155724', hi: '#43AC78', accent: '#000000' };
    if (season === 'autumn') return { base: '#228B22', deep: '#155724', hi: '#43AC78', accent: '#CD7F32' };
    return { base: '#637E68', deep: '#2E4D3A', hi: '#7C8E80', accent: '#CD7F32' };
  } else {
    if (season === 'spring') return { base: '#7CBB5D', deep: '#3F7F4D', hi: '#C9DC87', accent: '#000000' };
    if (season === 'summer') return { base: '#2E7D4F', deep: '#1F5A3A', hi: '#6FBF7E', accent: '#000000' };
    if (season === 'autumn') return { base: '#FE7126', deep: '#644A2A', hi: '#FCB829', accent: '#D00127' };
    return { base: '#BBA89A', deep: '#6E6A63', hi: '#C9C4BB', accent: '#644A2A' };
  }
}

// === BUILD SYMBOL ===
function buildTopDownSymbolSVG(params) {
  const rng = seedrandom(String(params.seed));
  const pal = palette(params.leafHabit, params.season);

  const spreadM = params.spreadCm / 100;
  const sizeMm = (spreadM * 1000) / params.scale;

  const vb = 1000;
  const outlineD = ptsToPath(params.outline);

  // Cluster count
  const baseCount = params.texture === 'fine' ? 180 : params.texture === 'medium' ? 120 : 70;
  const target = Math.round(baseCount * (0.55 + params.density));

  // Poisson disk
  const minDist = params.texture === 'fine' ? 28 : params.texture === 'medium' ? 36 : 48;

  const pts = poissonDiskSampling(vb, vb, minDist, rng, 20)
    .filter(p => pointInPoly(p, params.outline));

  const clusters = pts.slice(0, Math.min(target, pts.length)).map((p, i) => {
    const r = params.texture === 'fine' ? (10 + 10 * rng()) : params.texture === 'medium' ? (14 + 14 * rng()) : (20 + 18 * rng());
    return { ...p, r, i };
  });

  const dotPattern = `
    <pattern id="dot" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="${pal.deep}" fill-opacity="0.25"/>
    </pattern>`;

  const hatchPattern = `
    <pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
      <line x1="0" y1="0" x2="0" y2="12" stroke="${pal.deep}" stroke-opacity="0.22" stroke-width="2"/>
    </pattern>`;

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

  const clusterLayer = params.style === 'watercolor'
    ? clusters.map(c => {
        const d = jitterBlobPath(c.x, c.y, c.r, rng);
        const fill = (c.i % 9 === 0) ? pal.deep : (c.i % 7 === 0 ? pal.hi : pal.base);
        const op = (c.i % 11 === 0) ? 0.20 : 0.12;
        return `<path d="${d}" fill="${fill}" fill-opacity="${op}"/>`;
      }).join('\n')
    : '';

  const textureOverlay = params.style === 'marker'
    ? `<path d="${outlineD}" fill="url(#dot)" opacity="0.55"/>`
    : params.style === 'hand-drawn'
    ? `<path d="${outlineD}" fill="url(#hatch)" opacity="0.65"/>`
    : '';

  const spreadOutline = params.showSpreadOutline
    ? `<path d="${outlineD}" fill="none" stroke="#333" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="10 8"/>`
    : '';

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

// === PLANT CONFIGURATIONS ===
const PLANTS = {
  betula: {
    name: 'Betula pendula',
    common: 'Silver Birch',
    spreadCm: 1000,
    heightCm: 2500,
    boxCm: 2500,
    centerCm: 1250,
    leafHabit: 'deciduous',
    density: 0.35,
    texture: 'fine',
    winterInterest: null
  },
  viburnum: {
    name: 'Viburnum tinus',
    common: 'Laurustinus',
    spreadCm: 200,
    heightCm: 300,
    boxCm: 500,
    centerCm: 250,
    leafHabit: 'evergreen',
    density: 0.85,
    texture: 'medium',
    winterInterest: null
  },
  cornus: {
    name: 'Cornus alba',
    common: 'Red-barked Dogwood',
    spreadCm: 200,
    heightCm: 250,
    boxCm: 500,
    centerCm: 250,
    leafHabit: 'deciduous',
    density: 0.65,
    texture: 'medium',
    winterInterest: 'red_stems'
  }
};

// === GENERATE COMPARISON SHEET ===
console.log('Generating professional plant symbols...\n');

const styles = ['scientific', 'watercolor', 'marker', 'hand-drawn'];
const seasons = ['spring', 'summer', 'autumn', 'winter'];

let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Professional Plant Symbols - Cluster Rendering</title>
    <style>
        body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Arial, sans-serif; }
        .container { max-width: 1600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; margin-bottom: 10px; }
        .description { color: #666; margin-bottom: 30px; line-height: 1.6; }
        .plant-section { margin-bottom: 50px; border-top: 2px solid #e0e0e0; padding-top: 20px; }
        .plant-title { font-size: 24px; font-weight: bold; color: #2d5016; margin-bottom: 5px; }
        .plant-subtitle { color: #666; margin-bottom: 20px; }
        .style-row { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
        .style-group { flex: 1; min-width: 300px; }
        .style-header { font-weight: bold; color: #444; margin-bottom: 10px; padding: 5px; background: #f0f0f0; border-radius: 4px; }
        .season-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .season-card { text-align: center; border: 1px solid #ddd; border-radius: 4px; padding: 10px; background: white; }
        .season-label { font-size: 12px; color: #666; margin-top: 5px; }
        svg { width: 100%; height: auto; max-width: 150px; }
        .specs { font-size: 12px; color: #999; margin-top: 5px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Professional Plant Symbols - Cluster-Based Rendering</h1>
        <p class="description">
            <strong>Scientific honesty meets landscape architecture aesthetics.</strong><br>
            4-layer stack: canopy mass + cluster blobs + texture overlay + optional spread outline.<br>
            No heavy SVG filters - just clean fills, patterns, and gradients.<br>
            True-to-scale export (1:50 shown) with seasonal color accuracy based on leaf habit.
        </p>
`;

for (const [key, plant] of Object.entries(PLANTS)) {
  console.log(`Processing ${plant.name}...`);

  // Generate outline
  const outlineCm = generateOutline48(plant.boxCm, plant.centerCm, plant.spreadCm, 12345);
  const outline = normalizeToViewBox(outlineCm, plant.boxCm);

  html += `
        <div class="plant-section">
            <div class="plant-title">${plant.name}</div>
            <div class="plant-subtitle">${plant.common} | Spread: ${plant.spreadCm}cm | Leaf habit: ${plant.leafHabit} | Density: ${plant.density} | Texture: ${plant.texture}</div>
`;

  for (const style of styles) {
    html += `
            <div class="style-group">
                <div class="style-header">${style.toUpperCase()}</div>
                <div class="season-grid">
`;

    for (const season of seasons) {
      const svg = buildTopDownSymbolSVG({
        outline,
        spreadCm: plant.spreadCm,
        scale: 50, // 1:50
        leafHabit: plant.leafHabit,
        density: plant.density,
        texture: plant.texture,
        season,
        style,
        seed: 12345,
        showSpreadOutline: style === 'scientific',
        winterInterest: plant.winterInterest
      });

      html += `
                    <div class="season-card">
                        ${svg}
                        <div class="season-label">${season}</div>
                    </div>
`;
    }

    html += `
                </div>
            </div>
`;
  }

  html += `
        </div>
`;
}

html += `
    </div>
</body>
</html>
`;

writeFileSync('professional-symbols.html', html);
console.log('\n✅ Generated: professional-symbols.html');
console.log('Open in browser to see all 4 styles × 4 seasons × 3 plants = 48 symbols\n');
