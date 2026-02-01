# Professional Plant Rendering System

## Overview

Complete rewrite of plant visualization using **cluster-based rendering** instead of heavy SVG filters. Based on professional landscape architecture standards with scientifically honest botanical data.

---

## 1. Data Model Corrections

### New Fields (src/lib/plant-data/types.ts)

```typescript
export type LeafHabit = 'deciduous' | 'evergreen' | 'semi_evergreen';
export type CrownTexture = 'fine' | 'medium' | 'coarse' | 'needle';
export type WinterInterest = 'red_stems' | 'white_bark' | 'flowers' | 'berries' | 'evergreen' | null;

interface BotanicalCharacteristics {
  // ... existing fields ...

  // NEW: Professional rendering parameters
  leaf_habit: LeafHabit;           // Authoritative seasonal behavior (NOT evergreen boolean)
  crown_texture: CrownTexture;     // Visual texture for cluster rendering
  crown_density_value: number;     // 0..1 precise value (0.2=airy, 0.85=dense)
  winter_interest?: WinterInterest; // Special winter features
}
```

### Example Plant Settings

**Betula pendula (Silver Birch)**
- `leaf_habit: "deciduous"`
- `crown_texture: "fine"`
- `crown_density_value: 0.35` (airy, light filtering)
- `winter_interest: "white_bark"`

**Viburnum tinus (Laurustinus)**
- `leaf_habit: "evergreen"` ✅ (database `evergreen: false` is WRONG)
- `crown_texture: "medium"`
- `crown_density_value: 0.85` (dense, dark mass)
- `winter_interest: null`

**Cornus alba (Red-barked Dogwood)**
- `leaf_habit: "deciduous"`
- `crown_texture: "medium"`
- `crown_density_value: 0.65`
- `winter_interest: "red_stems"` (special winter overlay)

---

## 2. Professional Symbol Construction

### 4-Layer Stack

Every symbol is built from:

1. **Canopy mass** (base fill OR radial gradient for watercolor)
2. **Texture layer** (cluster blobs/dots/hatch) clipped to polygon
3. **Edge treatment** (subtle, minimal)
4. **Spread outline** (optional dashed circle)

### No Heavy Filters

❌ **Removed**: `feTurbulence`, `feDisplacementMap`, `feGaussianBlur`
✅ **Uses**: Solid fills, radial gradients, simple patterns, overlapping blobs

---

## 3. Scale Correctness

### True-to-Scale SVG Export

```typescript
// Formula: printed size in mm
sizeMm = (spreadCm * 10) / scale

// Example: 10m spread at 1:50
sizeMm = (1000 * 10) / 50 = 200mm (20cm on paper)
```

SVG uses **real physical units**:
```xml
<svg width="200mm" height="200mm" viewBox="0 0 1000 1000">
```

### Canonical ViewBox

All plants render in **0..1000 internal units**, then export to real mm:

```typescript
function normalizeToViewBox(outlineCm: Pt[], boxCm: number): Pt[] {
  const scale = 1000 / boxCm;
  return outlineCm.map(p => ({ x: p.x * scale, y: p.y * scale }));
}
```

---

## 4. Cluster Blob Method

### Why Clusters (not stipple dots)?

- **Faster**: 60-220 blobs vs thousands of dots
- **Professional**: Matches Morpholio/Procreate landscape assets
- **Natural**: Organic "leaf mass" appearance
- **Vector-friendly**: Clean SVG paths, no raster noise

### Poisson Disk Sampling

Uses `poisson-disk-sampling` library for even distribution:

```typescript
const minDist = texture === 'fine' ? 28 : texture === 'medium' ? 36 : 48;
const pds = new PoissonDiskSampling({
  shape: [1000, 1000],
  minDistance: minDist,
  tries: 20,
  rng: seedrandom(seed) // Deterministic!
});

const points = pds.fill()
  .filter(p => pointInPoly(p, canopyPolygon));
```

### Cluster Count Formula

```typescript
baseCount = texture === 'fine' ? 180 : texture === 'medium' ? 120 : 70;
target = Math.round(baseCount * (0.55 + density));
```

- Fine texture + low density (Betula): ~163 clusters
- Medium texture + high density (Viburnum): ~168 clusters
- Medium texture + medium density (Cornus): ~144 clusters

---

## 5. Rendering Styles

### Scientific (baseline)
- Clean solid fill (`fill-opacity="0.85"`)
- Dashed spread outline
- No texture overlay
- **Use for**: Technical drawings, construction documents

### Watercolor
- Radial gradient canopy mass
- 60-220 overlapping blob clusters
- Multi-tone (base/deep/highlight colors)
- **Use for**: Client presentations, design proposals

### Marker
- Bold solid fill
- Dot pattern overlay (`opacity="0.55"`)
- Thick edge line
- **Use for**: Hand-drawn aesthetic, sketch plans

### Hand-Drawn
- Soft fill
- Hatching pattern overlay (25° rotation)
- Irregular edge
- **Use for**: Conceptual designs, preliminary sketches

---

## 6. Seasonal Color System

### Palette Logic

Colors driven by **leaf_habit** (not broken `evergreen` boolean):

```typescript
function palette(leafHabit: LeafHabit, season: Season) {
  if (leafHabit === 'evergreen') {
    // Spring: bright green (#4E8F38)
    // Summer: standard green (#228B22)
    // Autumn: green + bronze accent (#CD7F32)
    // Winter: bronzed green (#637E68)
  } else { // deciduous
    // Spring: fresh yellow-green (#7CBB5D)
    // Summer: deep green (#2E7D4F)
    // Autumn: orange/red/golden (#FE7126, #D00127, #FCB829)
    // Winter: brown/bare (#BBA89A, #644A2A)
  }
}
```

### Winter Interest Overlays

Special features rendered **on top** of canopy in winter:

- **Cornus alba**: Red stem overlay (3 bold strokes)
- **Betula pendula**: Could add white bark texture
- **Evergreens**: Same canopy, slightly bronzed palette

---

## 7. Export Pipeline

### Formats

1. **SVG** (vector truth) - for web designer, PDF plans
2. **PNG** (transparent, crisp) - for Procreate, Morpholio

### PNG Export (using @resvg/resvg-js)

```typescript
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

export async function svgToPng(svg: string, px: number): Promise<Buffer> {
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: px }
  });
  const pngData = r.render().asPng();

  return sharp(pngData)
    .png({ compressionLevel: 9 })
    .toBuffer();
}
```

### Recommended Sizes

- **Web preview**: 512px
- **Print quality**: 2048px
- **Procreate brushes**: 4096px
- **Morpholio Trace**: 2048px

---

## 8. File Structure

```
src/lib/plant-rendering/
├── professional-renderer.ts    # Main cluster renderer
├── png-export.ts               # Rasterization utilities
└── artistic-renderer.ts        # OLD SYSTEM (deprecated)

generate-professional-symbols.mjs  # Standalone demo generator
professional-symbols.html          # Output: 48 symbols (4 styles × 4 seasons × 3 plants)
```

---

## 9. Usage Example

```typescript
import { buildTopDownSymbolSVG, normalizeToViewBox, generateOutline48 } from './professional-renderer';

// 1. Generate or fetch outline
const outlineCm = generateOutline48(
  boxCm: 2500,
  centerCm: 1250,
  spreadCm: 1000,
  seed: 12345
);

// 2. Normalize to canonical viewBox
const outline = normalizeToViewBox(outlineCm, 2500);

// 3. Render symbol
const svg = buildTopDownSymbolSVG({
  outline,
  spreadCm: 1000,
  scale: 50,              // 1:50
  leafHabit: 'deciduous',
  density: 0.35,
  texture: 'fine',
  season: 'summer',
  style: 'watercolor',
  seed: 12345,
  showSpreadOutline: false,
  winterInterest: null
});

// 4. Export to PNG
const png = await svgToPng(svg, 2048);
writeFileSync('betula-summer-watercolor.png', png);
```

---

## 10. Key Improvements Over Old System

| Aspect | Old System | New System |
|--------|-----------|------------|
| **Data** | Broken `evergreen` boolean | Authoritative `leaf_habit` |
| **Rendering** | Heavy SVG filters (messy) | Clean cluster blobs |
| **Performance** | Slow, random results | Fast, deterministic |
| **Quality** | Amateur, chaotic | Professional, landscape office standard |
| **Scale** | Approximate | True-to-scale mm export |
| **Exports** | Web only | SVG + PNG (Procreate/Morpholio) |
| **Seasons** | Basic color swap | Full palette system with winter interest |
| **Texture** | Uniform | Fine/medium/coarse differentiation |

---

## 11. Next Steps

1. **Update Database**: Add `leaf_habit`, `crown_texture`, `crown_density_value`, `winter_interest` to Supabase
2. **Migrate Plant Data**: Correct Viburnum (evergreen) and add rendering params to all plants
3. **Build UI**: Season + style selector buttons
4. **Batch Export**: Generate full symbol packs (16 PNGs per plant)
5. **Visual Planting Designer**: Drag-and-drop canvas with these symbols

---

## 12. Scientific Honesty Checklist

✅ Render seasons from `leaf_habit` (not broken boolean)
✅ Use precise `crown_density_value` (not crude enum)
✅ Differentiate identical geometry via render params
✅ True-to-scale exports (mm units)
✅ Deterministic output (same seed = same symbol)
✅ Winter interest features accurate to species
✅ Cluster count matches botanical density
✅ Color palettes based on real foliage behavior

---

## Dependencies

```json
{
  "poisson-disk-sampling": "^2.3.1",
  "robust-point-in-polygon": "^1.0.3",
  "seedrandom": "^3.0.5",
  "@resvg/resvg-js": "^2.6.0",
  "sharp": "^0.33.1",
  "@types/seedrandom": "^3.0.5"
}
```

---

**Status**: ✅ Core system implemented
**Demo**: `professional-symbols.html` (48 symbols)
**Next**: UI integration + batch PNG export
