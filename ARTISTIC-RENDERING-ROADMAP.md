# Artistic Rendering & Visual Planting Plan Designer - Roadmap

## Vision

Transform PlantingPlans into a complete visual design platform where customers can:
1. View plants in both **scientific** and **artistic** styles
2. Adjust **seasonal colors** before download
3. Create **planting plans visually** by dragging plants onto uploaded/drawn borders
4. Export professional-grade plans at any scale

---

## Phase 1: Artistic Plant Rendering System (4 weeks)

### Week 1: Research & Design
**Goal:** Establish rendering principles and style guidelines

#### Landscape Architecture Rendering Research
- [ ] Study professional landscape architecture rendering techniques:
  - Watercolor rendering (loose, organic)
  - Marker rendering (bold, architectural)
  - Colored pencil (detailed, botanical)
  - Digital mixed media
- [ ] Analyze traditional plant symbols from:
  - Time Saver Standards for Landscape Architecture
  - Landscape Graphics by Grant Reid
  - Professional landscape architects' portfolios
- [ ] Document rendering conventions:
  - Canopy texture patterns (stippling, hatching, organic shapes)
  - Shadow/highlight placement
  - Seasonal color palettes
  - Line weight variations
  - Transparency and layering

#### Style Development
- [ ] Define 3 artistic styles to implement:
  1. **Watercolor Botanical** - Soft edges, transparent washes, organic
  2. **Architectural Rendering** - Bold lines, clean shapes, professional
  3. **Hand-Drawn Sketch** - Loose linework, hatching, artistic
- [ ] Create style specification documents for each

### Week 2: Seasonal Color System
**Goal:** Accurate seasonal color variations based on plant phenology

#### Color Palette Development
- [ ] Research seasonal plant colors:
  - **Spring:** New growth greens, blossom colors
  - **Summer:** Deep mature greens, flowering
  - **Autumn:** Yellows, oranges, reds, browns
  - **Winter:** Bare branches, evergreen colors, structure
- [ ] Create color palettes by foliage type:
  - Deciduous spring/summer/autumn/winter
  - Evergreen subtle variations
  - Semi-evergreen transitions
- [ ] Reference Crocus images for actual plant colors
- [ ] Build color mapping system:
  ```typescript
  interface SeasonalColor {
    spring: { base: string; accent: string; shade: string };
    summer: { base: string; accent: string; shade: string };
    autumn: { base: string; accent: string; shade: string };
    winter: { base: string; accent: string; shade: string };
  }
  ```

#### Implementation
- [ ] Add seasonal color data to plant database
- [ ] Create SVG color transformation functions
- [ ] Build season selector UI component
- [ ] Generate 4 versions of each plant (one per season)

### Week 3: Artistic Rendering Engine
**Goal:** Generate artistic plant visualizations

#### Rendering System
- [ ] Create `artistic-renderer.ts`:
  - Watercolor texture generation (organic blobs, soft edges)
  - Stippling patterns for canopy texture
  - Hatching lines for shadows
  - Organic edge variations
- [ ] Implement style-specific renderers:
  - `renderWatercolor()` - SVG filters for watercolor effect
  - `renderArchitectural()` - Clean shapes with bold outlines
  - `renderHandDrawn()` - Irregular lines, sketch marks
- [ ] Add texture libraries:
  - Foliage patterns (leaf clusters, branch structures)
  - Ground textures (grass, mulch, paving)
  - Shadow patterns

#### Canvas/SVG Generation
- [ ] Modify SVG generator to support artistic modes
- [ ] Add SVG filters for artistic effects:
  - `<filter id="watercolor">` - Blur, turbulence, displacement
  - `<filter id="stipple">` - Noise patterns
  - `<filter id="sketch">` - Line variation, imperfection
- [ ] Generate artistic PNGs alongside scientific versions

### Week 4: UI Integration
**Goal:** User-facing controls for artistic rendering

#### Plant Library Enhancements
- [ ] Add style selector dropdown:
  - Scientific (current clean version)
  - Watercolor Botanical
  - Architectural Rendering
  - Hand-Drawn Sketch
- [ ] Add season selector:
  - Spring, Summer, Autumn, Winter buttons
  - Live preview of color changes
- [ ] Update download system:
  - Generate filename with style and season: `betula-pendula-plan-watercolor-autumn-1-50.png`
  - Export at selected scale and style
- [ ] Add side-by-side comparison view:
  - Scientific vs Artistic toggle
  - Before/after slider

#### UI Components
```typescript
// Season Selector Component
<div className="season-selector">
  <button onClick={() => setSeason('spring')}>
    🌸 Spring
  </button>
  <button onClick={() => setSeason('summer')}>
    ☀️ Summer
  </button>
  <button onClick={() => setSeason('autumn')}>
    🍂 Autumn
  </button>
  <button onClick={() => setSeason('winter')}>
    ❄️ Winter
  </button>
</div>

// Style Selector Component
<select onChange={(e) => setRenderStyle(e.target.value)}>
  <option value="scientific">Scientific (Clean)</option>
  <option value="watercolor">Watercolor Botanical</option>
  <option value="architectural">Architectural Rendering</option>
  <option value="sketch">Hand-Drawn Sketch</option>
</select>
```

---

## Phase 2: Visual Planting Plan Designer (6 weeks)

### Week 5-6: Canvas Framework
**Goal:** Interactive drag-and-drop planting plan builder

#### Core Canvas System
- [ ] Implement canvas framework:
  - HTML5 Canvas or SVG-based workspace
  - Pan and zoom controls
  - Grid overlay with configurable spacing
  - Ruler/measurement tools
- [ ] Build boundary system:
  - Upload image as background (site survey, satellite view)
  - Draw borders tool (polygon drawing)
  - Import CAD/DXF boundaries
  - Scale calibration (user sets known dimension)

#### Plant Palette
- [ ] Create plant library sidebar:
  - Search and filter plants
  - Thumbnail previews at current scale
  - Drag from library to canvas
  - Recently used plants
- [ ] Display plants with:
  - Current scale setting (1:10 to 1:200)
  - Selected style (scientific/artistic)
  - Selected season
  - Year selector (Year 1, 3, 5, 10, Mature)

### Week 7-8: Planting Plan Tools
**Goal:** Professional planting plan features

#### Placement Tools
- [ ] Plant placement:
  - Drag and drop from library
  - Rotate plants
  - Scale individual instances
  - Copy/paste (with spacing)
  - Array tool (repeat with spacing)
- [ ] Smart guides:
  - Spacing indicators (min/recommended/max)
  - Snap to grid
  - Alignment guides
  - Spacing circles (mature spread)
- [ ] Layers:
  - Background layer (site image)
  - Border layer
  - Ground cover layer
  - Shrub layer
  - Tree layer
  - Annotation layer

#### Annotation Tools
- [ ] Add text labels:
  - Plant botanical/common names
  - Quantity indicators
  - Dimensions
  - Notes
- [ ] Drawing tools:
  - Lines (paths, edges)
  - Shapes (planting beds, lawn areas)
  - Arrows (circulation)
- [ ] Legend builder:
  - Auto-generate plant key
  - Symbol references
  - Scale bar

### Week 9-10: Export & Collaboration
**Goal:** Professional output formats

#### Export System
- [ ] Export formats:
  - PNG (high resolution)
  - PDF (vector-based, scalable)
  - SVG (editable)
  - DXF/DWG (CAD compatibility)
- [ ] Export options:
  - Select layers to export
  - Choose scale
  - Include/exclude annotations
  - Render style (scientific/artistic)
  - Season selection
- [ ] Print templates:
  - Title blocks
  - Drawing frames
  - Professional layouts

#### Collaboration Features
- [ ] Save/load projects:
  - Save plan to database
  - Load previous plans
  - Version history
- [ ] Sharing:
  - Share link to view plan
  - Export to client (read-only)
  - Comments/feedback system

---

## Technical Architecture

### Database Schema Extensions

```sql
-- Artistic rendering data
ALTER TABLE plants ADD COLUMN artistic_watercolor_url TEXT;
ALTER TABLE plants ADD COLUMN artistic_architectural_url TEXT;
ALTER TABLE plants ADD COLUMN artistic_sketch_url TEXT;

-- Seasonal colors
ALTER TABLE plants ADD COLUMN spring_color_hex TEXT;
ALTER TABLE plants ADD COLUMN summer_color_hex TEXT;
ALTER TABLE plants ADD COLUMN autumn_color_hex TEXT;
ALTER TABLE plants ADD COLUMN winter_color_hex TEXT;

-- Planting plans
CREATE TABLE visual_planting_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  site_image_url TEXT,
  boundary_data JSONB, -- Polygon coordinates
  scale_ratio INTEGER, -- 10, 20, 50, 100, 200
  canvas_width REAL,
  canvas_height REAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE visual_plan_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES visual_planting_plans(id),
  plant_id UUID REFERENCES plants(id),
  x_position REAL,
  y_position REAL,
  rotation REAL, -- Degrees
  scale_factor REAL DEFAULT 1.0,
  growth_stage TEXT, -- 'year_1', 'year_3', 'mature', etc.
  render_style TEXT, -- 'scientific', 'watercolor', 'architectural', 'sketch'
  season TEXT, -- 'spring', 'summer', 'autumn', 'winter'
  quantity INTEGER DEFAULT 1,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### File Structure

```
/src/lib/plant-rendering/
  ├── artistic-renderer.ts      # Main artistic rendering engine
  ├── watercolor-filter.ts      # Watercolor SVG filters
  ├── architectural-style.ts    # Architectural rendering
  ├── hand-drawn-style.ts       # Sketch rendering
  ├── seasonal-colors.ts        # Color transformation by season
  ├── texture-library.ts        # Foliage/ground textures
  └── crocus-reference.ts       # Pull colors from Crocus images

/src/app/plan-designer/
  ├── page.tsx                  # Main visual designer interface
  ├── components/
  │   ├── Canvas.tsx            # Main drawing canvas
  │   ├── PlantPalette.tsx      # Plant library sidebar
  │   ├── ToolPanel.tsx         # Drawing tools
  │   ├── LayersPanel.tsx       # Layer management
  │   ├── PropertiesPanel.tsx   # Selected item properties
  │   └── ExportDialog.tsx      # Export options modal
  └── hooks/
      ├── useCanvas.ts          # Canvas interaction logic
      ├── usePlantPlacement.ts  # Drag/drop plant logic
      └── useExport.ts          # Export logic
```

---

## Research References

### Landscape Architecture Rendering
1. **Books:**
   - "Landscape Graphics" by Grant W. Reid
   - "Drawing and Designing with Confidence" by Mike Lin
   - "Time-Saver Standards for Landscape Architecture"

2. **Online Resources:**
   - Landscape Architecture Magazine rendering articles
   - ASLA (American Society of Landscape Architects) portfolios
   - Behance/Dribbble landscape architecture projects

3. **Color Reference:**
   - RHS Plant Colour Chart
   - Crocus.co.uk plant images (seasonal photos)
   - Kew Gardens botanical illustrations

### SVG Artistic Filters
- `feTurbulence` for watercolor texture
- `feDisplacementMap` for organic edges
- `feGaussianBlur` for soft effects
- `feMorphology` for stippling
- Custom patterns for hatching/stippling

---

## Success Metrics

### Phase 1 (Artistic Rendering)
- [ ] 3 artistic styles implemented
- [ ] 4 seasonal variations per plant
- [ ] 100% of plants have artistic versions
- [ ] User feedback: "looks professional"
- [ ] Download rate increases 50%

### Phase 2 (Visual Designer)
- [ ] Users create 100+ visual plans in first month
- [ ] Average plan creation time: <30 minutes
- [ ] Export formats work in AutoCAD/Vectorworks
- [ ] Conversion rate: 25% of free users → paid
- [ ] Customer testimonials: "replaces my CAD workflow"

---

## Business Impact

### Customer Value Proposition
1. **For DIY Gardeners:**
   - Visualize garden before planting
   - See seasonal changes
   - Share plans with family/contractors

2. **For Landscape Designers:**
   - Rapid concept development
   - Client presentations (artistic renderings)
   - Production drawings (scientific + CAD export)
   - Eliminate manual plant symbol drawing

3. **For Garden Centres:**
   - Create visual plans for customers
   - Upsell planting services
   - Generate shopping lists from plans

### Revenue Enhancement
- **DIY Pass (£79):** Visual designer access
- **Pro Pass (£249):** Unlimited plans, all styles, CAD export
- **Designer Marketplace:** Sell custom plant symbol packs
- **Print Services:** Professional plan printing/delivery

---

## Timeline Summary

**Month 1:** Artistic rendering system + seasonal colors
**Month 2:** Visual planting plan designer MVP
**Month 3:** Polish, export, collaboration features
**Month 4:** Beta testing with landscape designers
**Month 5:** Public launch

**Total Investment:** ~5 months development time
**Expected ROI:** 3× increase in Pro Pass conversions

---

## Next Actions

1. **Research Phase (This Week):**
   - Launch landscape illustration agent
   - Analyze 50+ professional landscape renderings
   - Document rendering patterns and conventions
   - Create style specification documents

2. **Prototype (Week 2):**
   - Generate first watercolor plant rendering
   - Implement seasonal color system
   - Test with 10 plants

3. **MVP (Week 4):**
   - Complete artistic rendering for all plants
   - Build season selector UI
   - User testing with 5 landscape designers

---

**Status:** Ready to launch research phase
**Next Step:** Deploy landscape illustration agent for rendering research
