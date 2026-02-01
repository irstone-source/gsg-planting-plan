# Artistic Plant Rendering - Implementation Guide

## Quick Start

This document provides a roadmap for implementing artistic plant rendering alongside the existing scientific visualization system.

**Created:** February 1, 2026
**Status:** Research Complete - Ready for Implementation

---

## 📁 Deliverables Summary

### 1. **RENDERING-RESEARCH.md** (42KB)
Comprehensive research document covering:
- Professional landscape architecture rendering techniques (watercolor, marker, sketch)
- Grant Reid's "Landscape Graphics" standards
- Time-Saver Standards for Landscape Architecture
- Seasonal color systems with 60+ hex codes
- SVG technical implementation (feTurbulence, feDisplacementMap, etc.)
- Professional references with sources

### 2. **artistic-renderer-spec.ts** (20KB)
Complete TypeScript interface definitions:
- Type definitions for all rendering styles
- Seasonal color palettes (Spring, Summer, Autumn, Winter)
- SVG filter configurations (watercolor, marker, sketch presets)
- Pattern definitions for foliage textures
- Rendering pipeline interfaces
- Utility functions

### 3. **watercolor-samples.svg** (21KB)
Visual demonstrations including:
- 4 rendering styles (scientific, watercolor, marker, sketch)
- 8 seasonal progressions (deciduous + evergreen)
- 4 foliage pattern examples
- Before/after comparison
- All filters fully implemented and working

---

## 🎨 Key Research Findings

### Rendering Style Characteristics

| Style | Edges | Texture | Opacity | Best For |
|-------|-------|---------|---------|----------|
| **Scientific** | Sharp, clean | None | 90-100% | Technical precision |
| **Watercolor** | Soft, bleeding | Paper texture | 70-85% | Artistic presentation |
| **Marker** | Clean, slight warp | Minimal stroke | 85-95% | Bold graphics |
| **Sketch** | Irregular, organic | Heavy texture | 70-80% | Hand-drawn feel |

### Seasonal Color Palettes (Deciduous)

**Spring:** #C9DC87, #7CBB5D, #5B9E48, #177245 (light yellow-greens)
**Summer:** #228B22, #2E6F40, #155724 (deep mature greens)
**Autumn:** #FCB829, #FE7126, #D00127, #644A2A (yellows → reds → browns)
**Winter:** #BBA89A, #875D4A, #644A2A, #3E2723 (bark colors only)

### Seasonal Color Palettes (Evergreen)

**Spring:** #89FFC4, #00FF7F, #008944, #003B1D (bright greens with new growth)
**Summer:** #228B22, #2E6F40, #336739 (standard deep greens)
**Autumn:** #228B22, #2E6F40, #CD7F32 (greens with bronze tones)
**Winter:** #05472A, #4E8F38, #637E68, #CD7F32 (dark greens with bronzing)

---

## 🔧 SVG Filter Techniques

### Core Primitives Used

1. **feTurbulence** - Perlin noise for organic texture
   - `type="fractalNoise"` for smooth watercolor
   - `type="turbulence"` for chaotic edges
   - `baseFrequency` 0.02-0.05 for plant-scale effects

2. **feDisplacementMap** - Warp edges for hand-drawn feel
   - `scale` 5-10 for watercolor
   - `scale` 15-20 for sketch

3. **feGaussianBlur** - Soft edges and bleeding
   - `stdDeviation` 2-5 for watercolor
   - Lower values for subtle effects

4. **feBlend** - Layer combination
   - `mode="multiply"` for texture overlay
   - `mode="overlay"` for color variation

5. **feColorMatrix** - Color adjustments
   - `type="saturate"` for desaturation
   - `type="hueRotate"` for color shifts

### Performance Guidelines

- Keep `numOctaves` ≤ 3 for fast rendering
- Use filter extent padding (-50% margin for watercolor)
- Cache filter definitions (don't regenerate per plant)
- Consider fallback for mobile devices

---

## 🏗️ Proposed File Structure

```
/src/lib/rendering/
  ├── filters/
  │   ├── watercolor.ts      # Watercolor filter factory
  │   ├── marker.ts          # Marker filter factory
  │   ├── sketch.ts          # Sketch filter factory
  │   └── index.ts           # Main filter generator
  ├── colors/
  │   ├── palettes.ts        # Seasonal color definitions
  │   ├── extractor.ts       # Extract colors from Crocus images
  │   └── selector.ts        # Choose palette by season + type
  ├── patterns/
  │   ├── foliage.ts         # Leaf cluster patterns
  │   ├── hatching.ts        # Line patterns for depth
  │   └── stippling.ts       # Dot patterns
  ├── generators/
  │   ├── artistic-plant.ts  # Main renderer
  │   ├── seasonal.ts        # Season-specific logic
  │   └── batch.ts           # Batch rendering
  └── utils/
      ├── svg-builder.ts     # SVG string construction
      ├── color-utils.ts     # RGB/Hex conversion
      └── hash.ts            # Seed generation from plant ID
```

---

## 📋 Implementation Phases

### Phase 1: Foundation (Week 1-2)
**Goal:** Basic infrastructure

- [ ] Create file structure
- [ ] Implement color palette system
- [ ] Build TypeScript interfaces from spec
- [ ] Create SVG filter generators (watercolor, marker, sketch)
- [ ] Unit tests for color utilities

**Deliverables:**
- Working filter generator functions
- Color palette selector
- Test suite

### Phase 2: Core Rendering (Week 3-4)
**Goal:** Generate artistic plant visualizations

- [ ] Implement main renderer (artistic-plant.ts)
- [ ] Add seasonal color selection logic
- [ ] Integrate with existing plant database
- [ ] Generate unique seeds from plant IDs
- [ ] Add shadow/highlight overlays
- [ ] Test with 10-20 sample plants

**Deliverables:**
- Functional artistic renderer
- Sample outputs for all styles and seasons

### Phase 3: Crocus Integration (Week 5)
**Goal:** Extract real seasonal colors

- [ ] Connect to Crocus API for seasonal images
- [ ] Implement color extraction algorithm
- [ ] Build color quantization (5-10 dominant colors)
- [ ] Create fallback to default palettes
- [ ] Cache extracted colors in database

**Deliverables:**
- Color extraction service
- Database schema for cached colors
- Documentation

### Phase 4: User Interface (Week 6-7)
**Goal:** User-facing features

- [ ] Add season selector to download modal
- [ ] Add style selector (scientific/watercolor/marker/sketch)
- [ ] Create preview thumbnails (4 seasons × 4 styles)
- [ ] Implement batch download (ZIP package)
- [ ] Add "Download All Seasons" button
- [ ] Progress indicators for batch operations

**Deliverables:**
- Updated UI components
- Download modal with previews
- ZIP packaging service

### Phase 5: Optimization (Week 8)
**Goal:** Performance and polish

- [ ] Optimize filter rendering performance
- [ ] Add caching for rendered images
- [ ] Implement progressive loading for previews
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness
- [ ] Accessibility audit

**Deliverables:**
- Performance metrics report
- Browser compatibility matrix
- Accessibility compliance

### Phase 6: Advanced Features (Week 9-10)
**Goal:** Power user features

- [ ] Custom color picker (override defaults)
- [ ] Filter intensity slider
- [ ] Export to multiple formats (PNG, SVG, PDF)
- [ ] Batch edit (apply style to all plants in plan)
- [ ] Gallery view of all artistic renderings
- [ ] Share artistic plan as portfolio

**Deliverables:**
- Advanced UI controls
- Multi-format export
- Gallery feature

---

## 🧪 Testing Strategy

### Unit Tests
- Color utilities (hex ↔ RGB conversion)
- Hash functions (reproducible seeds)
- Filter generation (valid SVG output)
- Palette selection (correct season/type mapping)

### Integration Tests
- End-to-end rendering pipeline
- Crocus API color extraction
- Database storage and retrieval
- ZIP packaging

### Visual Regression Tests
- Compare rendered outputs against baseline
- Ensure filters produce consistent results
- Test across different plant types

### User Acceptance Tests
- Season selector usability
- Download performance (< 3s per plant)
- Preview quality (sufficient for decision-making)
- Batch download reliability

---

## 📊 Success Metrics

### Technical Metrics
- Rendering time < 2 seconds per plant
- Filter cache hit rate > 80%
- Zero rendering errors in production
- Browser support: 95%+ of users

### User Metrics
- 30%+ of users try artistic rendering
- 15%+ downloads include artistic styles
- Average 2.5 styles downloaded per plant
- User satisfaction rating > 4.5/5

### Quality Metrics
- Accurate seasonal colors (validated by landscape architects)
- Recognizable plant forms
- Professional appearance suitable for client presentations
- Consistent with landscape architecture conventions

---

## 🎓 Key Concepts to Understand

### Canopy vs. Spread
- **Canopy:** Dense foliage mass (solid or filled)
- **Spread/Dripline:** Outermost extent (dashed outline)
- In plan view, typically same diameter at maturity
- Differentiation is visual (solid vs. dashed)

### Foliage Type Behavior
- **Deciduous:** Dramatic seasonal color changes
- **Evergreen:** Subtle changes, winter bronzing
- **Deciduous Conifer:** Acts like deciduous (larch, tamarack)
- **Semi-evergreen:** Mixed behavior, partial leaf retention

### Filter Stacking Order
1. Base shape (circle with seasonal color)
2. Apply artistic filter (watercolor/marker/sketch)
3. Add foliage pattern (optional)
4. Add shadow (bottom-right)
5. Add highlight (top-left)
6. Add spread outline (dashed)

### Reproducible Randomness
- Use plant ID hash as filter seed
- Same plant always renders identically
- Different plants have unique organic edges
- Maintains consistency across regenerations

---

## 🔗 Professional References

### Books
- **Landscape Graphics** by Grant W. Reid (Watson-Guptill)
- **Time-Saver Standards for Landscape Architecture** by Harris & Dines (McGraw-Hill)

### Online Resources
- [Paper Garden Workshop - Rendering Tutorials](https://www.papergardenworkshop.com/blog/)
- [DRAFTSCAPES - How To Draw Trees](https://draftscapes.com/how-to-draw-trees-in-plan-1/)
- [Codrops - SVG Filter Effects Series](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/)
- [Smashing Magazine - SVG Displacement Filtering](https://www.smashingmagazine.com/2021/09/deep-dive-wonderful-world-svg-displacement-filtering/)

### Color References
- [Color Meanings - Fall Palettes](https://www.color-meanings.com/fall-color-palettes/)
- [SchemeColor - Seasonal Palettes](https://www.schemecolor.com/)

---

## 🚀 Getting Started

### For Developers

1. **Review Research:**
   ```bash
   open /Users/ianstone/gsg-planting-plan/RENDERING-RESEARCH.md
   ```

2. **Study Interfaces:**
   ```bash
   open /Users/ianstone/gsg-planting-plan/artistic-renderer-spec.ts
   ```

3. **View Visual Examples:**
   ```bash
   open /Users/ianstone/gsg-planting-plan/watercolor-samples.svg
   ```

4. **Read Implementation Guide:**
   ```bash
   open /Users/ianstone/gsg-planting-plan/ARTISTIC-RENDERING-IMPLEMENTATION-GUIDE.md
   ```

### Sample Code Snippet

```typescript
import {
  PlantRenderParams,
  RenderResult,
  getDefaultPalette,
  WATERCOLOR_FILTER,
  getCurrentSeason
} from './artistic-renderer-spec';

// Render a plant in watercolor style with seasonal colors
async function renderArtisticPlant(plantId: string): Promise<RenderResult> {
  const plant = await fetchPlantData(plantId);
  const season = getCurrentSeason();
  const palette = getDefaultPalette(season, plant.foliageType);

  const params: PlantRenderParams = {
    plantId,
    scientificName: plant.scientificName,
    foliageType: plant.foliageType,
    canopyDiameter: plant.spread_m,
    style: 'watercolor',
    season,
    customPalette: palette,
    applyShading: true,
    outputFormat: 'png',
    outputResolution: 300,
    transparentBackground: true,
  };

  return await generateArtisticPlant(params);
}
```

---

## ❓ FAQ

### Q: Do artistic renderings replace scientific ones?
**A:** No. Both are available. Scientific remains the default, artistic is an optional download.

### Q: How are seasonal colors determined?
**A:** Primary: Extract from Crocus seasonal images. Fallback: Use research-based default palettes.

### Q: Can users customize colors?
**A:** Phase 6 includes custom color picker. Initial release uses automatic selection.

### Q: What file formats are supported?
**A:** PNG (transparent) and SVG. Phase 6 adds PDF export.

### Q: How long does rendering take?
**A:** Target: < 2 seconds per plant. Filters are cached for efficiency.

### Q: Are filters accessible?
**A:** Yes. All renderings maintain sufficient contrast and include alt text describing style/season.

### Q: Can users download multiple styles at once?
**A:** Yes. Batch download creates organized ZIP with folders for each style and season.

---

## 📝 Next Actions

1. **Review all three deliverables** with team
2. **Validate color palettes** with landscape architect consultant
3. **Prioritize features** for MVP vs. future phases
4. **Assign developers** to implementation phases
5. **Set up test environment** for visual regression testing
6. **Create project board** tracking implementation tasks

---

## 📞 Support & Questions

For questions about this research or implementation:

- **Technical questions:** Review RENDERING-RESEARCH.md sections 7-8 (SVG implementation)
- **Color questions:** See RENDERING-RESEARCH.md sections 5-6 (seasonal palettes)
- **Design questions:** See watercolor-samples.svg for visual examples
- **Type definitions:** Consult artistic-renderer-spec.ts

---

**Document Version:** 1.0
**Last Updated:** February 1, 2026
**Research by:** Landscape Illustration Agent - Plant Rendering Specialist
**Status:** ✅ Research Complete - Ready for Development
