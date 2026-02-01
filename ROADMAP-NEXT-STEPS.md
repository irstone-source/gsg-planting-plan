# PlantingPlans Roadmap - Next Steps

**Date:** 2026-02-01
**Current Status:** Designer Styles MVP + Professional Mode LIVE ✅

---

## 🎯 Mission

Transform PlantingPlans from "AI garden planner" to **"Professional landscape design platform with Chelsea Flower Show styling"**

**Revenue Target:** £50K in 3 months
**Key Metric:** 1000+ customers with Activation Passes

---

## ✅ What's Complete (Today)

### Phase 1: Designer Styles Foundation ✅
- [x] Database schema (9 styles)
- [x] Designer styles gallery page (`/styles`)
- [x] Individual style detail pages (`/styles/[slug]`)
- [x] Integration with plan generator (`?style=slug`)
- [x] Featured Collections in examples hub
- [x] Professional mode with scientific symbols
- [x] Download capability for plant symbols
- [x] Images optional with designer style selected
- [x] **9 complete example plans created** (NEW!)
- [x] **Style pages linked to example plans** (NEW!)

**Total Time:** ~12 hours
**Lines of Code:** ~2,600+
**Static Pages:** 74 (up from 65)
**Impact:** Complete conversion funnel (Style → Example → Custom)

---

## 🔥 IMMEDIATE PRIORITY (Next 2-4 Hours)

### ✅ Task #58: Create Designer Style Example Plans - COMPLETE

**Problem:** Designer style pages exist, but there are no example planting plans showing each style in action.

**Current State:**
- `/styles/piet-oudolf-prairie` - ✅ Style description exists
- `/examples/piet-oudolf-prairie-style` - ✅ Complete example plan created
- **All 9 designer styles now have example plans!**

**Completed:**
- [x] Created 9 complete example plans in `example-plans-expanded.ts`
- [x] Added "View Example Plan" section to style detail pages
- [x] Created slug mapping function (style → example)
- [x] Verified build passes (74 static pages)
- [x] Committed changes (commit 3546340)

**See:** `/DESIGNER-STYLES-EXAMPLES-COMPLETE.md` for full details

---

## 🔥 NEW IMMEDIATE PRIORITY

### Task #59: Add Hero Images to Example Plans (1-2 Hours)

Each designer style needs a matching example plan with:
- Plant palette reflecting the style's aesthetic
- Design principles applied to a real scenario
- Appropriate location/context
- Full plant details with scientific symbols

**Example: Piet Oudolf Prairie Style**
```typescript
{
  id: 'designer-piet-oudolf-prairie',
  slug: 'piet-oudolf-prairie-style',
  title: 'Piet Oudolf Prairie Garden',
  postcode: 'SW7 2RL', // Chelsea area
  region: 'South London',
  rhsZone: 'H4',
  area: 120,
  budget: '£700-1200',
  totalPlants: 45,
  totalCost: 950,

  description: 'Naturalistic prairie planting inspired by Piet Oudolf\'s Chelsea gardens. Grasses provide structure while perennials create seasonal waves of color.',

  designConcept: 'Matrix planting with 60% grasses as structure, 40% perennials for color. Plants selected for winter silhouette and year-round interest.',

  highlights: [
    'Signature Oudolf grasses (Molinia, Calamagrostis)',
    'Perennials with strong form (Echinacea, Rudbeckia)',
    'Winter structure focus',
    'Self-seeding informal aesthetic'
  ],

  plantingPalette: {
    structure: [
      'Calamagrostis x acutiflora Karl Foerster',
      'Molinia caerulea Transparent',
      'Miscanthus sinensis Morning Light'
    ],
    seasonal: [
      'Echinacea purpurea',
      'Rudbeckia fulgida',
      'Sanguisorba officinalis',
      'Veronicastrum virginicum'
    ],
    groundCover: [
      'Geranium Rozanne',
      'Nepeta Six Hills Giant',
      'Alchemilla mollis'
    ]
  },

  siteAnalysis: {
    sun: 'Full sun (6+ hours)',
    soil: 'Free-draining loam',
    moisture: 'Moist but well-drained',
    challenges: ['Wind exposure', 'Need for year-round structure'],
    opportunities: ['Space for drift planting', 'Sunlight for grasses', 'Winter garden interest']
  },

  maintenanceRhythm: {
    'Spring': ['Cut back winter stems in late March', 'Apply mulch'],
    'Summer': ['Deadhead Echinacea for prolonged flowering', 'Water during dry spells'],
    'Autumn': ['Leave grasses for winter interest', 'Cut back perennials selectively'],
    'Winter': ['Enjoy structural silhouettes', 'Plan next season']
  },

  tags: {
    place: ['London'],
    gardenType: ['New-build', 'Family lawn'],
    feeling: ['Wild & natural', 'Modern-minimal'],
    useCase: ['Wildlife', 'Low-water'],
    effort: 'Weekend gardener',
    constraint: []
  },

  season: 'Year-round',
  heroImage: '/covers/piet-oudolf-prairie-style.jpg'
}
```

#### Step 2: Create 9 Example Plans (2 hours)

**Add to `/src/data/example-plans-expanded.ts`:**

1. **Piet Oudolf Prairie Style**
   - Location: Chelsea, London
   - 120m² prairie garden
   - Grasses + perennials
   - £700-1200 budget

2. **Monty Don Cottage Garden**
   - Location: Longmeadow-inspired, Herefordshire
   - 150m² cottage borders
   - Traditional cottage plants
   - £600-1000 budget

3. **Chelsea 2023 Gold Modern Minimalist**
   - Location: Urban London
   - 80m² modern courtyard
   - Architectural plants
   - £800-1500 budget

4. **Chelsea Wildlife Garden**
   - Location: Suburban garden
   - 100m² wildlife haven
   - Native plants + pollinators
   - £400-800 budget

5. **Chelsea Urban Oasis**
   - Location: City courtyard
   - 60m² small space
   - Vertical planting
   - £600-1000 budget

6. **Dan Pearson Wildflower Meadow**
   - Location: Rural edge
   - 200m² meadow
   - Native wildflowers
   - £400-700 budget

7. **Sissinghurst White Garden**
   - Location: Kent-inspired formal
   - 100m² white border
   - All-white palette
   - £700-1200 budget

8. **Great Dixter Exotic Garden**
   - Location: East Sussex style
   - 120m² bold planting
   - Tropical feel, hardy plants
   - £800-1400 budget

9. **Gardeners' World Family Garden**
   - Location: Midlands family space
   - 180m² play + planting
   - Child-friendly plants
   - £500-900 budget

#### Step 3: Update Routes (15 min)

Plans will auto-generate routes via existing `/examples/[slug]/page.tsx` because they're added to `examplePlansExpanded` array.

**Verify routes work:**
```
/examples/piet-oudolf-prairie-style
/examples/monty-don-cottage-garden
/examples/chelsea-2023-gold-modern
... etc
```

#### Step 4: Link from Designer Style Pages (30 min)

**Update `/src/app/styles/[slug]/page.tsx`:**

Add "View Example Plan" button that links to the matching example:

```typescript
// After design principles section, before CTA
<div className="bg-moss/10 border border-moss/30 p-8 mb-12">
  <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-4">
    See This Style in Action
  </h3>
  <p className="text-stone mb-6">
    View a complete planting plan designed in this style, with full plant palette and maintenance guide.
  </p>
  <Link
    href={`/examples/${style.slug}-style`}
    className="inline-block px-8 py-4 bg-moss text-dark font-heading text-sm uppercase tracking-wider font-bold hover:bg-moss/80 transition-colors"
  >
    View Example Plan →
  </Link>
</div>
```

**Expected User Flow:**
```
/styles/piet-oudolf-prairie
  ↓ "View Example Plan" button
/examples/piet-oudolf-prairie-style
  ↓ See full plan with plants
  ↓ Download symbols (professional mode)
  ↓ "Create My Custom Plan" CTA
/create?style=piet-oudolf-prairie
  ↓ Generate personalized version
```

#### Step 5: Add Hero Images (1 hour)

**Option A: Unsplash Placeholders (Quick)**
```typescript
const styleHeroImages = {
  'piet-oudolf-prairie-style': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200',
  'monty-don-cottage-garden': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  // ... etc
}
```

**Option B: AI-Generated (Better)**
- Use DALL-E 3 or Midjourney
- Generate hero images for each style
- Store in `/public/covers/`

**Option C: Real Photos (Best)**
- Source from Unsplash with proper attribution
- RHS image library
- Chelsea Flower Show archive (with permission)

---

## 📋 Next Priority: Task #56 & #57 (1 Hour)

### Task #56: Add Styles to Sitemap

**File:** `/src/app/sitemap.ts`

```typescript
import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  // Fetch designer styles
  const { data: styles } = await supabase
    .from('designer_styles')
    .select('slug, updated_at');

  return [
    // Existing pages
    {
      url: 'https://plantingplans.co.uk',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://plantingplans.co.uk/styles',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Designer style pages
    ...(styles || []).map(style => ({
      url: `https://plantingplans.co.uk/styles/${style.slug}`,
      lastModified: new Date(style.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // Designer style example plans
    ...(styles || []).map(style => ({
      url: `https://plantingplans.co.uk/examples/${style.slug}-style`,
      lastModified: new Date(style.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
```

**Impact:**
- ✅ Google indexes all designer style pages
- ✅ SEO benefit from 18+ new pages (9 styles + 9 examples)
- ✅ Long-tail keywords: "Piet Oudolf garden UK", "Monty Don planting plan"

### Task #57: Add Analytics Tracking

**File:** `/src/app/styles/[slug]/page.tsx`

Make it a client component wrapper:

```typescript
'use client';
import { useEffect } from 'react';
import posthog from 'posthog-js';

export function StylePageClient({ style }) {
  useEffect(() => {
    // Track page view
    posthog.capture('style_viewed', {
      style_slug: style.slug,
      style_name: style.name,
      designer: style.designer_name,
      category: style.style_category,
    });
  }, [style]);

  const handleCTAClick = () => {
    posthog.capture('style_to_plan', {
      style_slug: style.slug,
      conversion_funnel: 'designer_styles',
    });
  };

  const handleExampleClick = () => {
    posthog.capture('style_to_example', {
      style_slug: style.slug,
      example_path: `/examples/${style.slug}-style`,
    });
  };

  // ... rest of component
}
```

**Track:**
- `style_viewed` - User lands on style page
- `style_to_plan` - User clicks "Create My Custom Plan"
- `style_to_example` - User clicks "View Example Plan"
- `example_to_plan` - User clicks CTA from example page
- `plan_generated` - Plan actually generated
- `plan_purchased` - User completes purchase

**Funnel Analysis:**
```
Designer Style → Example Plan → Generator → Purchase
    100%             60%           40%          5%

Expected: 1000 style views → 600 example → 400 plans → 20 purchases (£1,580)
```

---

## 🎨 Medium-Term Enhancements (Week 2-3)

### 1. Expand Designer Styles Library

**Goal:** 18-27 total styles

**Add:**
- 5 more Show Gardens (Hampton Court, Tatton Park, etc.)
- 4 more Famous Designers (Tom Stuart-Smith, Cleve West, etc.)
- 3 more Historic Gardens (Hidcote, Gertrude Jekyll, etc.)
- 3 more BBC styles (Small Space Balcony, Joe Swift, etc.)

**Process:**
1. Research each style
2. Write descriptions + design principles
3. Create example plans
4. Seed database
5. Generate hero images

**Time:** 8-10 hours
**Impact:** 2x SEO surface area, 2x organic traffic

### 2. Add Filtering to Styles Gallery

**Features:**
- Filter by category (Show Garden, Designer, Historic, BBC)
- Filter by difficulty (Beginner, Intermediate, Advanced)
- Filter by budget (Under £500, £500-£1000, Over £1000)
- Filter by maintenance (Low, Medium, High)
- Search by designer name or keyword

**UI:**
```
[All] [Show Gardens] [Famous Designers] [Historic] [BBC]

Budget: [Under £500] [£500-£1000] [Over £1000]
Difficulty: [Beginner] [Intermediate] [Advanced]

Search: [____________] 🔍
```

**Time:** 3-4 hours
**Impact:** Better UX, easier discovery, higher engagement

### 3. Add "Popular This Week" Section

**Track views and show trending styles:**
```
Popular This Week
┌─────────────────┐
│ 1. Piet Oudolf  │
│ 2. Monty Don    │
│ 3. Chelsea 2023 │
└─────────────────┘
```

**Implementation:**
- Track `view_count` in database
- Order by views in last 7 days
- Show top 5 on `/styles` page

**Time:** 2 hours
**Impact:** Social proof, drives traffic to popular styles

### 4. Add User Reviews/Ratings

**Let users rate styles:**
```
★★★★☆ 4.5/5 (127 reviews)

"Perfect for my small London garden!"
— Sarah M., verified customer
```

**Implementation:**
- Add `style_reviews` table
- Only verified customers can review
- Show average rating + recent reviews

**Time:** 4-5 hours
**Impact:** Social proof, conversion boost

---

## 🚀 Long-Term Vision (Month 2-3)

### 1. Designer Marketplace

**Goal:** Real designers sell custom plans on the platform

**Flow:**
```
Browse Designer Profiles → Request Quote → Designer Creates Plan → Customer Purchases
```

**Revenue Model:**
- Platform fee: 20% of designer sales
- Designer keeps 80%
- Minimum plan price: £150

**Expected:** 10 designers × 5 plans/month × £200 avg = £8,000/month revenue

### 2. Style Quiz

**Interactive quiz to match users with styles:**

```
Question 1: What's your garden vibe?
○ Calm & zen
○ Bold & colorful
○ Wild & natural
○ Tidy & structured

Question 2: Maintenance commitment?
○ Minimal (I do nothing)
○ Weekend gardener
○ Enthusiast

... 5-7 questions total

Result: "You're a Piet Oudolf Prairie person!"
```

**Impact:** Engagement, email capture, personalization

### 3. Seasonal Collections

**Curated style bundles:**
- "Spring Burst" - 3 styles focusing on spring color
- "Summer Abundance" - 3 styles with summer flowers
- "Autumn Glow" - 3 styles with fall foliage
- "Winter Structure" - 3 styles with winter interest

**Marketing angle:** "Get 3 seasonal plans for £199 (save £38)"

### 4. Video Integration

**Add video tours of each style:**
- Designer interview (if famous designer)
- Garden walkthrough showing the style
- Plant close-ups
- Seasonal changes

**Platforms:**
- YouTube channel
- Embed on style pages
- Share on social media

**Impact:** Trust, education, virality

---

## 📊 Success Metrics

### Week 1 Targets (Designer Styles + Examples Live)
- 200+ style page views
- 100+ example plan views
- 30+ style → plan conversions
- 5+ purchases from styles
- £395+ revenue attributed to styles

### Month 1 Targets
- 2,000+ style page views
- 800+ example plan views
- 150+ style → plan conversions
- 25+ purchases from styles
- £1,975+ revenue attributed to styles
- Top 5 styles ranking on Google for designer names

### Month 3 Targets
- 10,000+ style page views
- 4,000+ example plan views
- 600+ style → plan conversions
- 100+ purchases from styles
- £7,900+ revenue attributed to styles
- 50+ long-tail keywords ranking
- 5+ active designers in marketplace

---

## 🎯 Today's Sprint (Next 4 Hours)

**Priority Order:**

1. **Create 9 Designer Style Example Plans** (2 hours)
   - Define plant palettes for each style
   - Write descriptions + design concepts
   - Add to `example-plans-expanded.ts`
   - Test routes work

2. **Link Examples from Style Pages** (30 min)
   - Add "View Example Plan" button
   - Update UI to show connection
   - Test user flow

3. **Add Hero Images** (1 hour)
   - Source Unsplash images
   - Or generate with AI
   - Add to `/public/covers/`

4. **Update Sitemap** (15 min)
   - Add designer styles
   - Add example plans
   - Deploy

5. **Add Analytics** (30 min)
   - Track style_viewed
   - Track style_to_plan
   - Track style_to_example
   - Set up PostHog funnel

---

## ✅ Definition of Done

**Designer Styles MVP Complete When:**
- [x] 9 designer styles live
- [x] Integration with plan generator
- [x] Featured in examples hub
- [x] Professional mode active
- [ ] 9 example plans created
- [ ] Examples linked from style pages
- [ ] Sitemap updated
- [ ] Analytics tracking
- [ ] Hero images added

**Then:**
- Deploy to production
- Monitor analytics
- Gather user feedback
- Iterate based on data

---

## 🎓 Why This Roadmap Matters

**Strategic Value:**
1. **SEO Surface Area:** 18+ new indexed pages (9 styles + 9 examples)
2. **Educational Content:** Try-before-you-buy browsing model
3. **Professional Credibility:** Famous designer names build trust
4. **Conversion Funnel:** Browse → Example → Generate → Purchase
5. **Organic Growth:** Long-tail keywords drive free traffic

**Competitive Differentiation:**
- ✅ "Get the Chelsea Flower Show look for £79"
- ✅ "Plant like Piet Oudolf in your own garden"
- ✅ "Monty Don's cottage style, personalized for your space"

**Foundation for Marketplace:**
- Proven style browsing works
- Example plans show what's possible
- User journey tested and optimized
- Ready to add real designers

---

**Next up: Let's build those 9 designer style example plans!** 🎨🌿✨
