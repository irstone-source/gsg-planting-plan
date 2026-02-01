# WFO Import Instructions

## Step 1: Run SQL Setup in Supabase

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/qeliskdyzlclgtabkome
2. Click **SQL Editor** (left sidebar)
3. Click **New query**
4. Copy and paste **ALL** content from `supabase-wfo-setup.sql`
5. Click **Run** (or press Cmd+Enter)

This creates:
- `wfo_taxonomy` table
- All indexes for fast search
- `exec_sql` function
- `search_wfo_plants` function
- Foreign key link from `planting_plans` to `wfo_taxonomy`

## Step 2: Run Import Script

```bash
cd /Users/ianstone/gsg-planting-plan
node scripts/simple-wfo-import.mjs
```

Expected output:
```
🌿 WFO Taxonomy Import
================================================

📖 Reading /Users/ianstone/Downloads/classification.csv...
  Parsing: 100000/1648361 lines...
  Parsing: 200000/1648361 lines...
  ...
✅ Parsed 1,648,360 records

🔍 Filtering to accepted species...
  Found ~8,000 accepted species in 31 families

⏳ Importing to Supabase...
  Progress: 8000/8000 (100%)

✅ Import complete!
   Imported: 8,000 species

🔍 Validating known plants...

  ✅ Betula pendula Roth
     Betulaceae | wfo-0000335449
  ✅ Viburnum tinus L.
     Caprifoliaceae | wfo-0001426922
  ✅ Cornus alba L.
     Cornaceae | wfo-0000342830
  ...

  Found 8/8 known plants

⏱️  Total time: 120.5s
```

## Step 3: Verify Data

In Supabase SQL Editor, run:

```sql
-- Count total species
SELECT COUNT(*) FROM wfo_taxonomy;

-- Top families
SELECT family, COUNT(*) as species_count
FROM wfo_taxonomy
GROUP BY family
ORDER BY species_count DESC
LIMIT 10;

-- Check Betula
SELECT * FROM wfo_taxonomy WHERE scientific_name = 'Betula pendula';
```

## Step 4: Test Search Function

```sql
-- Fuzzy search for "birch"
SELECT * FROM search_wfo_plants('birch', 10);

-- Search for "viburnum"
SELECT * FROM search_wfo_plants('viburnum', 10);

-- Search genus
SELECT scientific_name, family
FROM wfo_taxonomy
WHERE genus = 'Betula'
  AND taxonomic_status = 'accepted'
ORDER BY scientific_name;
```

## Troubleshooting

### Error: "relation wfo_taxonomy does not exist"
→ Run `supabase-wfo-setup.sql` in Supabase SQL Editor first

### Error: "permission denied for table wfo_taxonomy"
→ Check that service role key is in `.env.local`

### Error: "null value in column wfo_id"
→ CSV parsing issue - check file path is correct

### Import hangs or times out
→ Reduce `batchSize` in script (change 500 to 250)

## What Gets Imported

**Included families** (31 families, ~8,000 species):
- Betulaceae (Birch, Alder, Hazel)
- Caprifoliaceae (Viburnum, Honeysuckle)
- Cornaceae (Dogwood)
- Rosaceae (Rose, Apple, Cherry)
- Fagaceae (Oak, Beech)
- Pinaceae (Pine, Spruce, Fir)
- Salicaceae (Willow, Poplar)
- Sapindaceae (Maple, Horse Chestnut)
- Ericaceae (Heather, Rhododendron)
- ... and 22 more UK horticulture families

**Filtered out**:
- Synonyms (only accepted names)
- Subspecies/varieties (only species rank)
- Non-horticultural families
- Tropical/exotic families not used in UK

To import **ALL** 1.6M records (including synonyms):
- Comment out the `relevantFamilies` filter in script
- Remove the `taxonRank === 'species'` filter
- Increase Supabase plan (free tier has limits)

## Next Steps After Import

1. **Link existing plants**:
```sql
UPDATE planting_plans
SET wfo_id = (
  SELECT wfo_id FROM wfo_taxonomy
  WHERE scientific_name = planting_plans.botanical_name
  LIMIT 1
)
WHERE botanical_name IS NOT NULL;
```

2. **Build search API** (`src/app/api/search-plants/route.ts`)
3. **Add autocomplete UI** component
4. **Show botanical authorities** in plant cards

## Files Created

- `supabase-wfo-setup.sql` - Database schema
- `scripts/simple-wfo-import.mjs` - Import script
- `scripts/import-wfo-csv.mjs` - Alternative version with RPC
- `WFO-INTEGRATION-PLAN.md` - Full documentation

## Performance

- **Parse time**: ~10-15 seconds (1.6M records)
- **Filter time**: ~5 seconds
- **Import time**: ~2-3 minutes (8,000 species @ 500 records/batch)
- **Total time**: ~3-5 minutes

Supabase limits:
- Free tier: 500MB database, 50,000 rows
- Pro tier: 8GB database, unlimited rows

Our import (~8,000 species) fits comfortably in free tier.
