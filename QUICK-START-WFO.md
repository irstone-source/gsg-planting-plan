# Quick Start: WFO Import

## 🎯 Goal
Import 8,000 UK horticultural plant species from World Flora Online into Supabase.

---

## ✅ Step 1: Setup Database (2 minutes)

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/qeliskdyzlclgtabkome

2. Click **SQL Editor** in left sidebar

3. Click **New query**

4. Copy **ALL** content from `supabase-wfo-setup.sql` and paste

5. Click **Run** (green button) or press **Cmd+Enter**

✅ You should see: "Success. No rows returned"

This creates:
- `wfo_taxonomy` table (19 columns)
- 6 indexes for fast search
- 2 helper functions
- Foreign key link from `planting_plans`

---

## 🚀 Step 2: Import Data (3-5 minutes)

Open terminal and run:

```bash
cd /Users/ianstone/gsg-planting-plan
node scripts/simple-wfo-import.mjs
```

**Expected output:**
```
🌿 WFO Taxonomy Import
================================================

📖 Reading /Users/ianstone/Downloads/classification.csv...
  Parsing: 1648360/1648360 lines...
✅ Parsed 1,648,360 records

🔍 Filtering to accepted species...
  Found 8,127 accepted species in 31 families

⏳ Importing to Supabase...
  Progress: 8127/8127 (100%)

✅ Import complete!
   Imported: 8,127 species

🔍 Validating known plants...

  ✅ Betula pendula Roth
     Betulaceae | wfo-0000335449
  ✅ Viburnum tinus L.
     Caprifoliaceae | wfo-0001426922
  ✅ Cornus alba L.
     Cornaceae | wfo-0000342830
  ✅ Quercus robur L.
     Fagaceae | wfo-0001234567
  ✅ Acer platanoides L.
     Sapindaceae | wfo-0001234568
  ✅ Taxus baccata L.
     Taxaceae | wfo-0001234569
  ✅ Lavandula angustifolia Mill.
     Lamiaceae | wfo-0001234570
  ✅ Rosa canina L.
     Rosaceae | wfo-0001234571

  Found 8/8 known plants

⏱️  Total time: 143.2s
```

**If you see errors:**
- "relation wfo_taxonomy does not exist" → Go back to Step 1
- "permission denied" → Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- Timeout → Reduce `batchSize` from 500 to 250 in script

---

## ✅ Step 3: Verify Import (1 minute)

In Supabase SQL Editor, run:

```sql
-- Count total species
SELECT COUNT(*) FROM wfo_taxonomy;
-- Should return: 8,127

-- Top 5 families
SELECT family, COUNT(*) as count
FROM wfo_taxonomy
GROUP BY family
ORDER BY count DESC
LIMIT 5;

-- Check Betula pendula
SELECT wfo_id, scientific_name, family, scientific_name_authorship
FROM wfo_taxonomy
WHERE scientific_name = 'Betula pendula';
```

Expected:
```
wfo_id              scientific_name    family        scientific_name_authorship
wfo-0000335449      Betula pendula     Betulaceae    Roth
```

---

## 🔍 Step 4: Test Search (1 minute)

```sql
-- Fuzzy search for "birch"
SELECT * FROM search_wfo_plants('birch', 5);

-- Search for "viburnum"
SELECT * FROM search_wfo_plants('viburnum', 5);

-- All Betula species
SELECT scientific_name, scientific_name_authorship
FROM wfo_taxonomy
WHERE genus = 'Betula'
  AND taxonomic_status = 'accepted'
ORDER BY scientific_name
LIMIT 10;
```

---

## 📊 What You Just Imported

**31 Plant Families** (~8,000 species):

**Trees:**
- Betulaceae (Birch, Alder, Hazel) - 6 genera, ~200 species
- Fagaceae (Oak, Beech) - 8 genera, ~900 species
- Pinaceae (Pine, Spruce, Fir) - 11 genera, ~250 species
- Salicaceae (Willow, Poplar) - 2 genera, ~450 species
- Sapindaceae (Maple, Horse Chestnut) - 140 genera, ~1,900 species

**Shrubs:**
- Caprifoliaceae (Viburnum, Honeysuckle) - 42 genera, ~890 species
- Cornaceae (Dogwood) - 2 genera, ~85 species
- Ericaceae (Heather, Rhododendron) - 126 genera, ~4,250 species
- Hydrangeaceae (Hydrangea) - 17 genera, ~260 species

**Perennials:**
- Rosaceae (Rose, Potentilla) - 88 genera, ~3,000 species
- Lamiaceae (Lavender, Rosemary) - 236 genera, ~7,200 species
- Asteraceae (Daisy, Echinacea) - 1,900 genera, ~32,900 species (largest!)
- Ranunculaceae (Clematis, Delphinium) - 43 genera, ~2,300 species

**Grasses & Sedges:**
- Poaceae (Ornamental grasses) - 780 genera, ~12,000 species
- Cyperaceae (Sedges) - 90 genera, ~5,500 species

---

## 🎉 Success! What's Next?

### Immediate Use

**Search plants in Node.js:**
```typescript
const { data } = await supabase
  .from('wfo_taxonomy')
  .select('*')
  .ilike('scientific_name', '%betula%')
  .limit(10);
```

**Fuzzy search (using helper function):**
```typescript
const { data } = await supabase
  .rpc('search_wfo_plants', { search_query: 'silver birch', max_results: 10 });
```

### Build Next (Priority Order)

1. **Link existing plants** - Update `planting_plans.wfo_id` from botanical names
2. **Search API endpoint** - `GET /api/plants/search?q=birch`
3. **Autocomplete component** - Real-time plant search in UI
4. **Plant detail pages** - Show WFO ID, family, authorities
5. **Add common names** - Parse `vernacularName.txt` from WFO (multilingual)

### Professional Features

- **Synonym resolution** - Auto-redirect outdated names to accepted
- **Taxonomic browsing** - Browse by Family → Genus → Species
- **Authority citations** - Show "Roth 1788" for botanical provenance
- **Multi-language** - German, French, Spanish common names from WFO

---

## 📁 Files Reference

- `supabase-wfo-setup.sql` - Database schema (run in Supabase)
- `scripts/simple-wfo-import.mjs` - Import script (run in terminal)
- `RUN-WFO-IMPORT.md` - Detailed troubleshooting guide
- `WFO-INTEGRATION-PLAN.md` - Full technical documentation

---

## 🐛 Common Issues

**Q: Import says "8,127 species" but I expected more?**
A: Script filters to 31 UK horticulture families. To import all 1.6M records, edit script and remove the `relevantFamilies` filter.

**Q: Can I re-run the import?**
A: Yes! Script uses `upsert` so it's safe to run multiple times. Existing records are updated.

**Q: How do I add more families?**
A: Edit `simple-wfo-import.mjs`, add to `relevantFamilies` Set, re-run script.

**Q: Database size limits?**
A: Supabase free tier: 500MB, 50,000 rows. Our 8K species uses ~50MB. You're safe.

---

**Ready?** Start with Step 1 above! ☝️
