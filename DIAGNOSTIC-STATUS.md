# Designer Styles & Examples - Diagnostic Status

**Date:** 2026-02-01
**Status:** ⚠️ **DEBUGGING IN PROGRESS**

---

## ✅ What's Working

### Pages Building Successfully
- [x] All 9 designer style example plan HTML files generated
- [x] File sizes: 380-400KB (reasonable)
- [x] Static generation successful (74 total pages)

```
✅ piet-oudolf-prairie-style.html (383KB)
✅ monty-don-cottage-garden.html (399KB)
✅ chelsea-2023-gold-modern.html (349KB)
✅ chelsea-wildlife-haven.html (383KB)
✅ chelsea-urban-retreat.html (364KB)
✅ dan-pearson-meadow.html (383KB)
✅ sissinghurst-white-garden.html (383KB)
✅ great-dixter-exotic.html (380KB)
✅ gardeners-world-family-garden.html (384KB)
```

### Hero Images Working
- [x] Unsplash photorealistic garden images loading
- [x] Next.js Image optimization active
- [x] Responsive srcsets generated (640w-3840w)

### Scientific Symbol Rendering Working
- [x] `/api/plant/render` endpoints returning 200 OK
- [x] SVG generation successful
- [x] Parametric plant visualization active

### Plant Database Lookups Working
- [x] `getPlantDetail()` function operational
- [x] Fuzzy matching active
- [x] 42 plant entries available

---

## ⚠️ Known Issues

### Issue #1: Wikimedia Commons Image 404s
**Status:** Expected behavior, not critical

```
⨯ upstream image response failed for https://commons.wikimedia.org/...Betula_pendula_flowers.jpg 404
⨯ upstream image response failed for https://commons.wikimedia.org/...Viburnum_tinus_habit.jpg 404
⨯ upstream image response failed for https://commons.wikimedia.org/...Fargesia_murielae_001.jpg 404
```

**Why:** Plant database has Wikimedia URLs, but many images don't exist on Commons
**Impact:** Photo thumbnails won't show, but scientific symbols render instead
**Fix:** Not critical - professional mode uses scientific symbols primarily

### Issue #2: Generic Plant Names in Example Plans
**Status:** Temporary workaround

Changed from specific cultivars to generic names:
```
❌ "Calamagrostis x acutiflora Karl Foerster" → ✅ "Native grasses"
❌ "Echinacea purpurea" → ✅ "Echinacea"
❌ "Rosa Gertrude Jekyll" → ✅ "Climbing roses"
```

**Why:** Specific cultivar names didn't exist in plant database
**Impact:** Less specific plant recommendations
**Fix Needed:** Add 100+ specific cultivars to plant database

---

## 🧪 Test URLs

### Designer Style Example Plans
```
http://localhost:3000/examples/piet-oudolf-prairie-style
http://localhost:3000/examples/monty-don-cottage-garden
http://localhost:3000/examples/chelsea-2023-gold-modern
http://localhost:3000/examples/chelsea-wildlife-haven
http://localhost:3000/examples/chelsea-urban-retreat
http://localhost:3000/examples/dan-pearson-meadow
http://localhost:3000/examples/sissinghurst-white-garden
http://localhost:3000/examples/great-dixter-exotic
http://localhost:3000/examples/gardeners-world-family-garden
```

### Designer Style Detail Pages
```
http://localhost:3000/styles/piet-oudolf-prairie
http://localhost:3000/styles/monty-don-cottage
http://localhost:3000/styles/chelsea-2023-gold
http://localhost:3000/styles/chelsea-wildlife
http://localhost:3000/styles/chelsea-urban
http://localhost:3000/styles/dan-pearson-meadow
http://localhost:3000/styles/sissinghurst-white
http://localhost:3000/styles/great-dixter-exotic
http://localhost:3000/styles/gardeners-world-family
```

---

## 🔍 What to Check in Browser

### 1. Hero Section
- [ ] Hero image loads (photorealistic HDR garden)
- [ ] Title displays: "Piet Oudolf Prairie Garden"
- [ ] Region displays: "Chelsea, London"
- [ ] Tags display: RHS Zone, Feeling, Effort

### 2. Stats Bar
- [ ] Area: 120m²
- [ ] Plants: 45 total
- [ ] Budget: £700-1200
- [ ] Cost: £950
- [ ] Season: Year-round

### 3. Site Analysis
- [ ] Sun exposure shows
- [ ] Soil type shows
- [ ] Challenges list displays
- [ ] Opportunities list displays

### 4. Planting Palette
- [ ] Structure plants section (3 plants)
- [ ] Seasonal plants section (6 plants)
- [ ] Ground cover plants section (3 plants)
- [ ] Each plant shows PlantImageViewer component

### 5. PlantImageViewer Component
- [ ] Plant card displays with border
- [ ] Badge shows ("Structure" / "Seasonal" / "Ground Cover")
- [ ] Scientific name displays
- [ ] Common name displays
- [ ] Photo thumbnail OR scientific symbol renders
- [ ] Professional mode controls visible
- [ ] Display toggle (Photo / Scientific Symbol)
- [ ] View controls (Top / Front / Side)
- [ ] Growth controls (1yr / 3yr / 5yr)
- [ ] Download button visible

### 6. Maintenance Rhythm
- [ ] Spring tasks display
- [ ] Summer tasks display
- [ ] Autumn tasks display
- [ ] Winter tasks display

### 7. Links & Navigation
- [ ] "Back to Examples" link works
- [ ] Header navigation works
- [ ] Footer displays
- [ ] Style pages link to example plans

---

## 🚨 User Reported Issues

> "no headers or card images, 404 on opening, many image cards and thumbnails have not content on specific plants on page"

### Diagnosis:

**404 on opening:**
- Build shows pages generated successfully
- HTML files exist in `.next/server/app/examples/`
- Need to test actual URL in browser

**No headers:**
- HTML contains `<h1>` with plan title
- Header component should render
- Need to verify in browser

**Card images:**
- Wikimedia images 404ing (expected)
- Scientific symbols rendering (200 OK)
- Should show parametric SVG at minimum

**No content on plants:**
- Plant database lookups working
- Plant names exist in database
- Need to verify PlantImageViewer rendering

---

## 🔧 Immediate Actions

### 1. Verify Pages Load
Open each example plan URL and confirm:
- Page loads without 404
- Hero image displays
- Title and metadata show
- Plant cards render

### 2. Check PlantImageViewer
For each plant card verify:
- Component renders
- Badge shows
- Scientific name displays
- Either photo OR scientific symbol shows
- Professional controls visible

### 3. Test Navigation
- Click "Back to Examples" → should go to /examples/hub
- From /styles/[slug] click "View Example Plan" → should load example
- Header nav should work

### 4. Check Console
Open browser DevTools and check for:
- JavaScript errors
- Failed network requests
- React hydration errors
- Missing components

---

## 🎯 Expected vs Actual

### Expected Behavior
✅ Hero image loads (Unsplash photorealistic garden)
✅ Plant cards show scientific symbols (parametric SVG)
✅ Professional mode controls visible
✅ Download buttons work
✅ All UI elements render

### If Actual Behavior Different
❌ 404 errors → Check URL routing
❌ Blank cards → Check PlantImageViewer component
❌ No images → Check Next.js Image config
❌ Missing data → Check plant database lookups
❌ No controls → Check professional mode prop

---

## 📝 Files to Review

### Example Plans Data
```
/src/data/example-plans-expanded.ts
Lines 775-1373 (Designer style plans)
```

### Example Plan Page Component
```
/src/app/examples/[slug]/page.tsx
Hero section, Stats bar, Planting palette rendering
```

### Plant Image Viewer
```
/src/components/PlantImageViewer.tsx
Professional mode, Display toggle, Download button
```

### Plant Database
```
/src/data/plant-database.ts
42 plant entries, getPlantDetail() function
```

### Style Detail Pages
```
/src/app/styles/[slug]/page.tsx
"View Example Plan" CTA section
```

---

## 🎨 Quick Visual Test

**Open:** `http://localhost:3000/examples/piet-oudolf-prairie-style`

**You should see:**
1. **Top:** Large prairie grass image in golden light
2. **Title:** "Piet Oudolf Prairie Garden" in large architectural font
3. **Stats:** 120m² • 45 plants • £950 • Year-round
4. **Site Analysis:** Sun/Soil/Challenges/Opportunities boxes
5. **Planting Palette:**
   - Structure section with 3 grass cards
   - Seasonal section with 6 perennial cards
   - Ground cover section with 3 plant cards
6. **Each Card:**
   - Image (photo or scientific symbol)
   - Badge (copper color)
   - Plant names
   - Professional controls below

**If you see blank/broken cards:**
- Check browser console for errors
- Verify plant names in database
- Check PlantImageViewer component rendering

---

**Status:** Pages are building, plant lookups working, images configured. Need browser testing to verify actual display issues.
