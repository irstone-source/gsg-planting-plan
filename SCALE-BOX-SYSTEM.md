# Scale Box System - True-to-Scale Plant Visualizations

## Overview

The PlantingPlans visualization system generates PNG plant images with **true-to-scale** dimensions, allowing direct import into professional CAD software, Procreate, and Morpholio Trace without resizing.

## Scale Box Categories

Plants are rendered in standardized scale boxes based on their mature height:

| Scale Box | Mature Height Range | Canvas Size | Example Plants |
|-----------|---------------------|-------------|----------------|
| **Shrubs** | 0-5m | 500×500cm (500×500px) | Viburnum tinus, Cornus alba, Lavandula |
| **Small Trees** | 5-10m | 1000×1000cm (1000×1000px) | Malus, Prunus, Amelanchier |
| **Medium Trees** | 10-15m | 1500×1500cm (1500×1500px) | Acer campestre, Carpinus betulus |
| **Large Trees** | 15-25m | 2500×2500cm (2500×2500px) | Betula pendula, Quercus robur |
| **Extra Large** | >25m | 4000×4000cm (4000×4000px) | Pinus sylvestris, Fagus sylvatica |

## Scaling Ratio: 1px = 1cm

Every PNG is generated at **1 pixel = 1 centimeter** real-world scale:

- A 500×500px shrub = 5m × 5m in real life
- A 2500×2500px tree = 25m × 25m in real life
- A 25m tree is exactly **5× larger** than a 5m shrub (2500px vs 500px)

## Professional Workflow

### Step 1: Export from PlantingPlans
1. Visit `/examples/scientific-viz` to view plant visualizations
2. Right-click and **Save Image** for any plant
3. Each PNG is already scaled correctly with transparent background

### Step 2: Import into CAD/Design Software

#### Procreate / Morpholio Trace
1. Drag PNG into canvas
2. **No resizing needed** - plants are automatically to scale
3. Place multiple plants and they maintain size relationships
4. A 25m tree will be 5× larger than a 5m shrub

#### AutoCAD / Vectorworks
1. Set drawing units to centimeters
2. Import PNG at 1:1 scale (1 unit = 1cm)
3. Plant images align with architectural plans
4. Use for site layouts and spacing calculations

#### SketchUp
1. Import PNG as image
2. Set scale to 1cm = 1 unit
3. Plants maintain real-world proportions
4. Useful for 3D garden mockups

### Step 3: Scale Verification
Use the **scale grid** visible in visualizations (1m intervals) to verify accuracy before importing into your design software.

## Technical Implementation

### SVG Generation
File: `/src/lib/plant-data/svg-generator.ts`

```typescript
function getScaleBox(heightCm: number): { size: number; label: string } {
  if (heightCm <= 500) return { size: 500, label: '5m × 5m (Shrubs)' };
  else if (heightCm <= 1000) return { size: 1000, label: '10m × 10m (Small Trees)' };
  else if (heightCm <= 1500) return { size: 1500, label: '15m × 15m (Medium Trees)' };
  else if (heightCm <= 2500) return { size: 2500, label: '25m × 25m (Large Trees)' };
  else return { size: 4000, label: '40m × 40m (Extra Large)' };
}
```

### PNG Conversion
File: `/src/app/api/generate-scientific-plant-viz/route.ts`

```typescript
// Extract scale box size from SVG for true-to-scale PNG sizing
const scaleSizeMatch = svg.match(/data-scale-size="(\d+)"/);
const scaleSize = scaleSizeMatch ? parseInt(scaleSizeMatch[1]) : 800;

// Convert SVG to PNG at real-world scale (1px = 1cm)
const pngBuffer = await sharp(Buffer.from(svg))
  .resize(scaleSize, scaleSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toBuffer();
```

## Visual Features

Each PNG includes:
- ✅ **Transparent background** for layering
- ✅ **1m grid overlay** for scale reference
- ✅ **Scale annotations** showing box size and plant spread
- ✅ **Parametric canopy rendering** based on crown shape
- ✅ **Canopy density** (sparse, medium, dense, very-dense)
- ✅ **Foliage type coloring** (evergreen vs deciduous)

## Size Comparison Examples

### Betula pendula (Silver Birch) - 25m tree
- **Scale Box:** 25m × 25m (2500×2500px)
- **Actual Spread:** 10m
- **PNG Size:** 2500×2500px
- **File Size:** ~150KB

### Viburnum tinus (Laurustinus) - 3m shrub
- **Scale Box:** 5m × 5m (500×500px)
- **Actual Spread:** 3m
- **PNG Size:** 500×500px
- **File Size:** ~30KB

### Size Ratio
The 25m tree PNG is **5× larger** than the 5m shrub PNG, maintaining true proportions for professional design work.

## Verification Script

Check PNG dimensions:
```bash
node check-png-dimensions.mjs
```

Output:
```
✅ Betula pendula: 2500×2500px (25m × 25m scale box)
✅ Acer campestre: 1500×1500px (15m × 15m scale box)
✅ Viburnum tinus: 500×500px (5m × 5m scale box)
✅ Cornus alba: 500×500px (5m × 5m scale box)
```

## Benefits for Professional Designers

1. **No Manual Scaling** - Import and place directly
2. **Consistent Proportions** - All plants scaled relative to each other
3. **Space Planning** - Accurate spacing calculations
4. **Client Presentations** - True-to-scale mockups
5. **Construction Documents** - CAD-ready for contractors
6. **Time Savings** - No need to measure/resize each plant
7. **Quality Assurance** - Grid overlays for verification

## Future Enhancements

- [ ] Add human figure for scale reference (1.7m silhouette)
- [ ] Export scale-aware SVG versions for vector workflows
- [ ] Batch export with custom scale ratios (e.g., 1:50, 1:100)
- [ ] Integration with Vectorworks/AutoCAD plant libraries
- [ ] Season-specific renderings (spring bloom, autumn color)

---

**Updated:** 2026-02-01
**System Version:** 1.0
**Status:** ✅ Production Ready
