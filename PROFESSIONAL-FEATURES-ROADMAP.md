# Professional Designer Features - Implementation Roadmap

**Source**: Professional garden designer feedback, January 2026
**Status**: Validated requirements for professional use

---

## Critical Missing Features (Designer Feedback)

### ✅ **What's Working**
- Year 1 → Year 3 → Mature progression (solves client expectation problem)
- Spacing recommendations included
- Data source citations add credibility
- Core concept is solid

### ❌ **What's Missing (Prevents Professional Use)**

---

## Feature 1: Growing Conditions Panel

### **Requirements**

```typescript
interface GrowingConditions {
  // Light Requirements
  sun_tolerance: 'full-sun' | 'partial-shade' | 'full-shade' | 'any';
  light_hours_min: number; // e.g., 6 hours

  // Soil Requirements
  soil_ph_min: number; // e.g., 5.5
  soil_ph_max: number; // e.g., 7.5
  soil_ph_preference: 'acid' | 'neutral' | 'alkaline' | 'any';
  soil_types: ('clay' | 'loam' | 'sand' | 'chalk')[];

  // Moisture
  moisture_requirement: 'dry' | 'moist' | 'wet' | 'any';
  drainage: 'well-drained' | 'tolerates-wet' | 'bog';

  // Hardiness
  rhs_hardiness: 'H1a' | 'H1b' | 'H1c' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'H7';
  usda_zone_min: number; // e.g., 5
  usda_zone_max: number; // e.g., 9

  // Exposure Tolerance
  wind_tolerance: 'exposed' | 'sheltered' | 'any';
  coastal_tolerance: boolean;
  pollution_tolerance: 'high' | 'moderate' | 'low';
  urban_tolerance: boolean;
}
```

### **UI Design**

```tsx
<div className="border-l-4 border-purple-600 pl-4 bg-purple-50 p-4 rounded-r">
  <h3>🌍 Growing Conditions</h3>

  {/* Light */}
  <div className="flex items-center gap-2">
    <span>☀️ Light:</span>
    <Badge>Full Sun</Badge>
    <Badge>Partial Shade</Badge>
  </div>

  {/* Soil */}
  <div>
    <span>🪨 Soil pH:</span> 5.5-7.5 (Acid to Neutral)
    <span>Soil Types:</span> Clay, Loam
  </div>

  {/* Moisture */}
  <div>
    <span>💧 Moisture:</span> Moist but well-drained
  </div>

  {/* Hardiness */}
  <div>
    <span>❄️ Hardiness:</span> RHS H5 (Hardy down to -15°C)
    <span>USDA:</span> Zones 5-9
  </div>

  {/* Exposure */}
  <div>
    <span>🌬️ Exposure:</span>
    ✅ Wind tolerant
    ✅ Coastal suitable
    ✅ Urban pollution tolerant
  </div>
</div>
```

### **Data Sources**
1. **RHS Plant Finder** (scrape or API)
2. **Kew POWO** (botanical database)
3. **USDA Plants Database** (hardiness zones)
4. **Manual curation** (for accuracy)

### **Implementation**
- Week 1: Database schema + migration
- Week 2: Data scraping/curation for top 100 plants
- Week 3: UI components
- Week 4: Integration + testing

---

## Feature 2: Seasonal Interest Timeline

### **Requirements**

```typescript
interface SeasonalInterest {
  // Flowering
  flowering_months: number[]; // [3,4,5] = March-May
  flower_color: string[]; // ['white', 'pink']
  flower_description: string; // "Catkins in early spring"

  // Foliage
  spring_foliage_color: string; // "Bright green"
  summer_foliage_color: string; // "Mid-green"
  autumn_foliage_color: string; // "Golden yellow"

  // Winter Interest
  winter_interest: boolean;
  winter_features: string[]; // ["White bark", "Structural form"]

  // Fruiting
  fruiting_months: number[];
  fruit_color: string;
  fruit_ornamental: boolean;

  // Overall Interest
  interest_score_spring: number; // 1-5
  interest_score_summer: number;
  interest_score_autumn: number;
  interest_score_winter: number;
}
```

### **UI Design - 12-Month Timeline**

```tsx
<div className="border-l-4 border-pink-600 pl-4 bg-pink-50 p-4 rounded-r">
  <h3>🌸 Seasonal Interest</h3>

  {/* Visual Timeline */}
  <div className="grid grid-cols-12 gap-1 mb-4">
    {months.map(month => (
      <div className="text-center">
        <div className={`h-20 rounded ${getMonthColor(month)}`}>
          {/* Icons for features */}
          {flowering(month) && <span>🌸</span>}
          {fruiting(month) && <span>🍒</span>}
          {autumnColor(month) && <span>🍂</span>}
        </div>
        <span className="text-xs">{month}</span>
      </div>
    ))}
  </div>

  {/* Key Features */}
  <div className="space-y-2">
    <div>🌸 <strong>Flowering:</strong> March-May, white catkins</div>
    <div>🍂 <strong>Autumn Color:</strong> Golden yellow (October)</div>
    <div>❄️ <strong>Winter Interest:</strong> White peeling bark, architectural form</div>
    <div>⭐ <strong>Best Seasons:</strong> Spring (5/5), Autumn (4/5), Winter (4/5)</div>
  </div>
</div>
```

### **Color Coding**
- 🟢 **Green**: Foliage interest
- 🌸 **Pink**: Flowering
- 🟠 **Orange**: Autumn color
- 🔵 **Blue**: Winter structure
- 🟣 **Purple**: Fruiting

### **Data Sources**
1. **RHS Plant Finder** (seasonal data)
2. **Beth Chatto Gardens** (planting combinations)
3. **Great Dixter** (seasonal schemes)
4. **Designer knowledge base** (manual curation)

---

## Feature 3: Practical Specifications

### **Requirements**

```typescript
interface PracticalSpecs {
  // Supply Sizes
  common_supply_sizes: {
    container: string; // "60-80cm container"
    bare_root: string; // "150-175cm feathered"
    standard: string; // "8-10cm girth standard"
    whip: string; // "40-60cm whip"
  };

  // Pricing
  cost_band: '£' | '££' | '£££' | '££££';
  typical_price_range: {
    small: number; // £24.99
    medium: number; // £49.99
    large: number; // £99.99
  };

  // Growth Classification
  growth_rate_classification: 'slow' | 'medium' | 'fast';
  growth_rate_cm_per_year: number; // 45cm/year

  // Maintenance
  maintenance_level: 'low' | 'medium' | 'high';
  pruning_requirements: string; // "Minimal; remove dead wood"
  pruning_season: string; // "Late winter"

  // Planting
  best_planting_season: string; // "November-March"
  container_size_for_instant_impact: string; // "45-60 litre"
}
```

### **UI Design**

```tsx
<div className="border-l-4 border-amber-600 pl-4 bg-amber-50 p-4 rounded-r">
  <h3>📋 Practical Specifications</h3>

  {/* Supply Sizes */}
  <div>
    <strong>Common Supply Sizes:</strong>
    <ul className="text-sm">
      <li>Container: 60-80cm (£24.99)</li>
      <li>Feathered: 150-175cm (£49.99)</li>
      <li>Standard: 8-10cm girth (£149.99)</li>
    </ul>
  </div>

  {/* Cost Band */}
  <div className="flex items-center gap-2">
    <strong>Cost Band:</strong>
    <span className="text-2xl">££</span>
    <span className="text-sm text-gray-600">(Moderate)</span>
  </div>

  {/* Growth Rate */}
  <div>
    <strong>Growth Rate:</strong> Fast (45cm/year)
    <div className="text-xs text-gray-600">
      Reaches 2m in 4-5 years
    </div>
  </div>

  {/* Maintenance */}
  <div>
    <strong>Maintenance:</strong> Low
    <div className="text-xs">
      • Prune: Minimal (remove dead wood only)
      • Season: Late winter
      • Frequency: Annual check
    </div>
  </div>

  {/* Planting */}
  <div>
    <strong>Best Planting:</strong> November-March (bare root season)
    <div className="text-xs text-gray-600">
      For instant impact: Use 45-60L container
    </div>
  </div>
</div>
```

### **Cost Band Reference**
- **£** = Budget (<£30): Common natives, easy propagation
- **££** = Moderate (£30-60): Standard nursery stock
- **£££** = Premium (£60-150): Mature specimens, slower growers
- **££££** = Luxury (>£150): Large specimens, rare cultivars

---

## Feature 4: Design Context

### **Requirements**

```typescript
interface DesignContext {
  // Layer Classification
  layer: 'canopy-tree' | 'understory-tree' | 'large-shrub' | 'medium-shrub' | 'small-shrub' | 'perennial' | 'ground-cover';
  layer_height_range: string; // "15-25m"

  // Design Uses
  suitable_for: (
    'specimen' |
    'mass-planting' |
    'hedging' |
    'screening' |
    'woodland-edge' |
    'formal-garden' |
    'naturalistic' |
    'wildlife-garden' |
    'container'
  )[];

  // Planting Style
  styles: ('contemporary' | 'cottage' | 'formal' | 'naturalistic' | 'woodland')[];

  // Good Companions (2-3 species)
  companions: {
    botanical_name: string;
    common_name: string;
    reason: string; // "Contrasting bark texture"
  }[];

  // Ecological Value
  wildlife_value: {
    pollinators: boolean;
    birds: boolean; // Nesting, berries
    mammals: boolean;
    biodiversity_score: number; // 1-5
  };

  // Design Notes
  designer_notes: string; // Professional tips
}
```

### **UI Design**

```tsx
<div className="border-l-4 border-teal-600 pl-4 bg-teal-50 p-4 rounded-r">
  <h3>🎨 Design Context</h3>

  {/* Layer Classification */}
  <div>
    <Badge variant="primary">Canopy Tree</Badge>
    <span className="text-sm text-gray-600">(15-25m height)</span>
  </div>

  {/* Suitable For */}
  <div>
    <strong>Suitable For:</strong>
    <div className="flex flex-wrap gap-2 mt-1">
      <Badge>Specimen Planting</Badge>
      <Badge>Woodland Edge</Badge>
      <Badge>Naturalistic Schemes</Badge>
      <Badge>Wildlife Gardens</Badge>
    </div>
  </div>

  {/* Planting Styles */}
  <div>
    <strong>Design Styles:</strong>
    <span>Contemporary, Naturalistic, Woodland</span>
  </div>

  {/* Good Companions */}
  <div>
    <strong>Good Companions:</strong>
    <div className="space-y-1 text-sm">
      <div>
        • <strong>Cornus alba</strong> (Red-barked Dogwood)
        <br />
        <span className="text-gray-600">→ Contrasting white bark with red winter stems</span>
      </div>
      <div>
        • <strong>Viburnum opulus</strong> (Guelder Rose)
        <br />
        <span className="text-gray-600">→ Understory shrub for woodland edge</span>
      </div>
      <div>
        • <strong>Anemone nemorosa</strong> (Wood Anemone)
        <br />
        <span className="text-gray-600">→ Spring ground cover beneath canopy</span>
      </div>
    </div>
  </div>

  {/* Wildlife Value */}
  <div>
    <strong>Wildlife Value:</strong> ⭐⭐⭐⭐ (4/5)
    <div className="flex gap-3 mt-1 text-sm">
      <span>🐝 Pollinators</span>
      <span>🐦 Nesting birds</span>
      <span>🦋 Host plant (moths)</span>
    </div>
  </div>

  {/* Designer Notes */}
  <div className="bg-white border border-teal-200 rounded p-3 mt-2">
    <strong className="text-sm">💡 Designer Notes:</strong>
    <p className="text-sm text-gray-700 mt-1">
      "Excellent specimen for open lawns. Fast-growing for screening but prone to self-seeding.
      Best planted where fallen catkins/seeds aren't an issue (avoid formal paving).
      White bark shows best against dark evergreen backdrop (yew, holly)."
    </p>
  </div>
</div>
```

---

## Implementation Priority

### **Phase 1: Minimum Viable Professional (4 weeks)**

**Week 1: Growing Conditions**
- Database schema
- Scrape RHS Plant Finder for top 100 UK plants
- UI components

**Week 2: Practical Specs**
- Supply sizes from Crocus data
- Cost bands calculated from price ranges
- Maintenance requirements (manual curation)

**Week 3: Design Context**
- Layer classification (automated from height)
- Suitable uses (manual curation)
- Good companions (research phase)

**Week 4: Seasonal Interest**
- Basic flowering/autumn color data
- 12-month timeline UI
- RHS data integration

### **Phase 2: Professional Plus (4 weeks)**

**Week 5-6: Companion Planting Engine**
- Research Beth Chatto/Great Dixter combinations
- Build companion recommendation algorithm
- Curate 500+ proven combinations

**Week 7: Wildlife & Ecology**
- RSPB data integration
- Pollinator value ratings
- Native/non-native tagging

**Week 8: Designer Notes**
- Interview 10 RHS designers
- Curate professional tips per plant
- Add "Design Ideas" gallery

---

## Data Sources Required

### **Existing (Free)**
- ✅ Trefle API (dimensions, basic data)
- ✅ Perenual API (dimensions, basic data)
- ✅ Crocus.co.uk (images, pricing, supply sizes)

### **New Integrations Needed**

1. **RHS Plant Finder** (£500/year API access?)
   - Growing conditions
   - Hardiness ratings
   - Seasonal interest
   - Supply sizes

2. **Kew POWO** (Free, needs scraping)
   - Botanical accuracy
   - Native range data
   - Climate zones

3. **USDA Plants Database** (Free API)
   - US hardiness zones
   - Native/invasive status
   - Growth characteristics

4. **RSPB Garden Plants for Wildlife** (Manual curation)
   - Wildlife value ratings
   - Pollinator importance
   - Bird feeding/nesting

### **Manual Curation Required**
- **Designer notes** (interview RHS designers)
- **Companion planting** (research proven combinations)
- **Cost bands** (analyze supplier pricing)
- **Maintenance requirements** (gardening books + experience)

---

## Professional Validation Checklist

Before claiming "professional-grade", validate with:

### **RHS Qualified Designers (5-10 testers)**
- Can you use this for client presentations?
- Does data accuracy match your reference books?
- What's missing that you'd need?

### **Landscape Architecture Firms (3-5)**
- Would you pay £249/year for this?
- What would make it essential?
- Integration needs? (Vectorworks, AutoCAD)

### **Garden Centre Buyers (2-3)**
- Accurate supply sizes?
- Pricing realistic?
- Would you use for customer advice?

### **Horticultural Colleges (1-2)**
- Suitable as teaching tool?
- Data accuracy for student projects?
- Would you license for courses?

---

## Success Metrics

| Metric | Current | Target (MVP) | Target (Professional) |
|--------|---------|--------------|----------------------|
| **Data Completeness** | 50% | 80% | 95% |
| **Professional Features** | 3/7 | 5/7 | 7/7 |
| **Designer Approval Rating** | N/A | 7/10 | 9/10 |
| **RHS Designer Usage** | 0% | 10% | 60% |
| **Accuracy Complaints** | N/A | <5% | <1% |

---

## Technical Debt to Address

1. **Data Quality**
   - Verify Cornus alba dimensions (mentioned as accurate)
   - Check all cultivar data (currently generic species)
   - Add size variation ranges (not just single values)

2. **UI/UX**
   - Mobile-responsive design
   - Print-friendly layouts
   - PDF export with all data

3. **Performance**
   - Cache growing conditions (expensive to scrape)
   - Lazy-load seasonal timeline
   - Optimize image loading

---

## Designer Feedback: Response Plan

**Immediate Actions:**
1. ✅ Acknowledge feedback publicly (shows we listen)
2. ✅ Create this roadmap document
3. 📋 Implement Phase 1 (4 weeks)
4. 📋 Beta test with 5 RHS designers
5. 📋 Iterate based on professional feedback

**Communication:**
> "Thank you for this incredibly valuable feedback. You've identified exactly what we need to go from 'interesting concept' to 'professional tool'.
>
> We're implementing all four critical features:
> - Growing Conditions Panel (Week 1)
> - Practical Specifications (Week 2)
> - Design Context (Week 3)
> - Seasonal Interest Timeline (Week 4)
>
> Would you be willing to beta test the professional version in 4 weeks? We'd love your feedback on whether we've nailed it."

---

## Competitive Advantage After Implementation

**With these features, we become:**

1. **Only tool with scientific accuracy + professional context**
   - Competitors have one or the other, not both

2. **Designer's reference database**
   - Like RHS Plant Finder but with visualizations

3. **Client communication tool**
   - Growing conditions explain "why this plant here"

4. **Procurement shortcut**
   - Supply sizes + pricing + buy links = instant BOQ

**This transforms us from:**
- "Nice plant visualizer" (current)
- → "Essential professional tool" (with these features)

---

**Next Step**: Implement Phase 1, validate with professionals, iterate.

This feedback is gold. It's the difference between a demo and a product.
