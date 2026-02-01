# Scientific Plant Visualization Examples

## System Output for Each Plant

The scientific visualization system generates comprehensive botanical data and parametric visualizations for each plant.

---

## Example 1: Betula pendula (Silver Birch)

### Generated Data
```json
{
  "botanical_name": "Betula pendula",
  "common_name": "European white birch",
  "growth_rate": "fast",
  "years_to_maturity": 20,
  "data_sources": ["perenual", "trefle", "fallback"],
  "data_quality_score": 100
}
```

### Dimensions
- **Mature Height**: 25m (2500cm)
- **Mature Spread**: 10m (1000cm)
- **Spacing Required**: 12m (1200cm)

### Growth Progression
| Stage | Height | Spread | Age |
|-------|--------|--------|-----|
| Year 1 | 2.5m | 2.0m | 1 year |
| Year 3 | 7.5m | 3.0m | 3 years |
| Year 5 | 12.5m | 5.0m | 5 years |
| Year 10 | 21.3m | 8.5m | 10 years |
| Mature | 25.0m | 10.0m | 20 years |

### Generated Visualizations
- ✅ **Year 1 PNG**: 800×800px parametric canopy (rounded shape, sparse density)
- ✅ **Year 3 PNG**: 800×800px parametric canopy (rounded shape, medium density)
- ✅ **Mature PNG**: 800×800px parametric canopy (rounded shape, dense)

### Crown Characteristics
- **Shape**: Rounded/weeping (characteristic of birch)
- **Canopy Density**: Medium to dense
- **Foliage Type**: Deciduous (loses leaves in winter)

### Use Cases
- Street tree spacing: 12m centers
- Garden design: Feature tree with 10m clear radius
- Professional quotes: 25m mature height clearance

---

## Example 2: Acer campestre (Field Maple)

### Generated Data
```json
{
  "botanical_name": "Acer campestre",
  "common_name": "Field maple",
  "growth_rate": "slow",
  "years_to_maturity": 30,
  "data_sources": ["perenual", "trefle", "fallback"],
  "data_quality_score": 100
}
```

### Dimensions
- **Mature Height**: 15m (1500cm)
- **Mature Spread**: 12m (1200cm)
- **Spacing Required**: 14m (1440cm)

### Growth Progression
| Stage | Height | Spread | Age |
|-------|--------|--------|-----|
| Year 1 | 0.75m | 0.48m | 1 year |
| Year 3 | 2.25m | 1.8m | 3 years |
| Year 5 | 4.5m | 3.6m | 5 years |
| Year 10 | 9.75m | 7.8m | 10 years |
| Mature | 15.0m | 12.0m | 30 years |

### Generated Visualizations
- ✅ **Year 1 PNG**: Small sapling visualization
- ✅ **Year 3 PNG**: Young tree with developing crown
- ✅ **Mature PNG**: Full rounded crown, spreading form

### Crown Characteristics
- **Shape**: Rounded to spreading (typical maple form)
- **Canopy Density**: Dense (provides good shade)
- **Foliage Type**: Deciduous (autumn color feature)

### Use Cases
- Hedgerow tree: 14m spacing between individuals
- Garden feature: Autumn color display
- Wildlife habitat: Dense canopy for nesting

---

## Example 3: Viburnum tinus (Laurustinus)

### Generated Data
```json
{
  "botanical_name": "Viburnum tinus",
  "common_name": "Laurustinus",
  "growth_rate": "moderate",
  "years_to_maturity": 20,
  "data_sources": ["trefle", "fallback"],
  "data_quality_score": 100
}
```

### Dimensions
- **Mature Height**: 3m (300cm)
- **Mature Spread**: 3m (300cm)
- **Spacing Required**: 3.6m (360cm)

### Growth Progression
| Stage | Height | Spread | Age |
|-------|--------|--------|-----|
| Year 1 | 0.3m | 0.24m | 1 year |
| Year 3 | 0.9m | 0.9m | 3 years |
| Year 5 | 1.5m | 1.5m | 5 years |
| Year 10 | 2.6m | 2.6m | 10 years |
| Mature | 3.0m | 3.0m | 20 years |

### Generated Visualizations
- ✅ **Year 1 PNG**: Compact shrub form
- ✅ **Year 3 PNG**: Developing rounded shrub
- ✅ **Mature PNG**: Dense evergreen mound

### Crown Characteristics
- **Shape**: Rounded/irregular shrub form
- **Canopy Density**: Very dense (excellent screening)
- **Foliage Type**: Evergreen (year-round interest)

### Use Cases
- Hedge spacing: 3.6m centers for informal hedge
- Border shrub: Evergreen structure plant
- Winter interest: White flowers December-March

---

## Example 4: Cornus alba (Red-barked Dogwood)

### Generated Data
```json
{
  "botanical_name": "Cornus alba",
  "common_name": "Red-barked dogwood",
  "growth_rate": "fast",
  "years_to_maturity": 15,
  "data_sources": ["perenual", "trefle", "fallback"],
  "data_quality_score": 100
}
```

### Dimensions
- **Mature Height**: 3m (300cm)
- **Mature Spread**: 3m (300cm)
- **Spacing Required**: 3.6m (360cm)

### Growth Progression
| Stage | Height | Spread | Age |
|-------|--------|--------|-----|
| Year 1 | 0.45m | 0.36m | 1 year |
| Year 3 | 1.35m | 1.35m | 3 years |
| Year 5 | 2.1m | 2.1m | 5 years |
| Year 10 | 2.85m | 2.85m | 10 years |
| Mature | 3.0m | 3.0m | 15 years |

### Generated Visualizations
- ✅ **Year 1 PNG**: Young multi-stem shrub
- ✅ **Year 3 PNG**: Developing thicket form
- ✅ **Mature PNG**: Dense multi-stem clump

### Crown Characteristics
- **Shape**: Multi-stem/irregular (suckering habit)
- **Canopy Density**: Medium (winter stem interest primary)
- **Foliage Type**: Deciduous (red winter stems feature)

### Use Cases
- Winter interest: Red stems for winter color
- Bog garden: Tolerates wet soil
- Coppicing: Cut back every 2-3 years for best stem color

---

## Technical Details

### Image Format
- **Resolution**: 800×800px PNG with transparency
- **Compression**: Level 9 (maximum quality)
- **Background**: Fully transparent (alpha channel)
- **Format**: Suitable for Procreate, Morpholio, Vectorworks, AutoCAD

### Parametric Generation
Each visualization is algorithmically generated based on:
- Crown shape classification (9 types: pyramidal, columnar, rounded, spreading, weeping, oval, vase, irregular, multi-stem)
- Canopy density (4 levels: sparse, medium, dense, very-dense)
- Foliage type (3 types: deciduous, evergreen, semi-evergreen)
- Growth dimensions (height and spread in cm)

### SVG to PNG Conversion
```typescript
const pngBuffer = await sharp(Buffer.from(svg))
  .resize(800, 800, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .png({ compressionLevel: 9 })
  .toBuffer();
```

### Storage
All generated images are stored in Supabase Storage bucket `plant-images` with public URLs:
```
https://qeliskdyzlclgtabkome.supabase.co/storage/v1/object/public/plant-images/{plant-id}-{botanical-name}-{stage}.png
```

---

## Professional Use Cases

### 1. Client Presentations
- Show realistic growth progression over time
- Demonstrate spacing requirements visually
- Provide scientific credibility with data sources

### 2. Contractor Specifications
- Accurate mature dimensions for quotes
- Spacing calculations for bulk orders
- Growth rate for maintenance planning

### 3. Landscape Plans
- Scale-accurate overlays in CAD software
- Transparent PNGs for Procreate/Morpholio stencils
- Top-down views for plan drawings

### 4. Educational Content
- Teaching plant identification
- Understanding growth rates and spacing
- Botanical morphology visualization

---

## Data Quality Guarantee

Every plant receives a **data quality score (0-100%)**:
- 100% = Data from multiple sources (APIs + fallback)
- 75-99% = Data from one API source
- 50-74% = Partial data with estimates
- <50% = Insufficient data (manual review needed)

All examples above show **100% data quality** from verified sources.

---

## View Examples Live

Visit: `http://localhost:3000/examples/scientific-viz`

Or generate new visualizations:
```bash
node generate-scientific-viz.mjs <planId> [limit]
```

Example:
```bash
node generate-scientific-viz.mjs 416f217f-130a-4b8b-8813-b149dcc6163b 5
```
