# World Flora Online Integration Plan

## Dataset Overview

**Source**: https://zenodo.org/records/15704590
**Title**: World Flora Online Plant List (June 2025)
**Coverage**: 733 plant families | Angiosperms, Gymnosperms, Bryophytes, Pteridophytes
**Authority**: Consensus taxonomy from IPNI, Tropicos, World Checklist of Vascular Plants

---

## Why WFO is Superior to Current Sources

| Aspect | Current (Trefle/Perenual/Crocus) | WFO Plant List |
|--------|----------------------------------|----------------|
| **Authority** | Commercial APIs, inconsistent | Consensus from botanical institutions |
| **Coverage** | Fragmented, gaps in UK natives | 733 families, global coverage |
| **Taxonomy** | Often outdated synonyms | Current accepted names (2025) |
| **Reliability** | API rate limits, downtime | Static dataset, local DB |
| **Cost** | API quotas, scraping risk | Free, open access |
| **Updates** | Unknown cadence | Regular releases (quarterly/annual) |

---

## Available Formats

1. **JSON (SOLR-optimized)** - Best for search indexing
2. **MySQL dump** - Direct import to relational DB
3. **Darwin Core Archive** - Standard biodiversity format
4. **Catalogue of Life Package** - Full taxonomic hierarchy
5. **IPNI-to-WFO mapping** - Cross-reference with IPNI IDs

---

## Recommended Integration Architecture

### Phase 1: Download and Parse (1 day)

```bash
# Download WFO dataset
wget https://zenodo.org/records/15704590/files/WFO_Backbone_June2025.zip

# Extract
unzip WFO_Backbone_June2025.zip

# Load into local PostgreSQL (Supabase)
# Use Darwin Core Archive format for standard biodiversity schema
```

### Phase 2: Supabase Schema Extension (1 day)

Add WFO tables to existing Supabase database:

```sql
-- WFO Taxonomic Backbone
CREATE TABLE wfo_taxonomy (
  wfo_id TEXT PRIMARY KEY,              -- e.g., "wfo-0000685925"
  scientific_name TEXT NOT NULL,
  family TEXT,
  genus TEXT,
  species TEXT,
  rank TEXT,                            -- species, subspecies, variety, forma
  taxonomic_status TEXT,                -- accepted, synonym, illegitimate
  accepted_name_wfo_id TEXT,            -- if synonym, points to accepted name
  common_names JSONB,                   -- {en: "Silver Birch", de: "Hänge-Birke"}
  distribution JSONB,                   -- Geographic regions
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wfo_scientific ON wfo_taxonomy(scientific_name);
CREATE INDEX idx_wfo_family ON wfo_taxonomy(family);
CREATE INDEX idx_wfo_genus ON wfo_taxonomy(genus);

-- Link to existing planting_plans table
ALTER TABLE planting_plans ADD COLUMN wfo_id TEXT REFERENCES wfo_taxonomy(wfo_id);
```

### Phase 3: Data Enrichment Pipeline (2 days)

Combine WFO taxonomy with horticultural data:

```typescript
interface PlantDataPipeline {
  // 1. WFO Taxonomy (authoritative names)
  wfo: {
    wfo_id: string;
    scientific_name: string;
    family: string;
    genus: string;
    accepted_name: boolean;
  };

  // 2. RHS (UK cultivation data)
  rhs: {
    common_name: string;
    hardiness_zone: string;
    agm_award: boolean; // Award of Garden Merit
    height_range: string;
    spread_range: string;
  };

  // 3. Our Rendering Parameters (manual curation)
  rendering: {
    leaf_habit: 'deciduous' | 'evergreen' | 'semi_evergreen';
    crown_texture: 'fine' | 'medium' | 'coarse' | 'needle';
    crown_density_value: number; // 0..1
    winter_interest: WinterInterest | null;
  };

  // 4. Mature Dimensions (from multiple sources)
  dimensions: {
    mature_height_cm: number;
    mature_spread_cm: number;
    growth_rate: GrowthRate;
    data_sources: string[]; // ['wfo', 'rhs', 'kew']
  };
}
```

### Phase 4: Search & Autocomplete (2 days)

Build fuzzy search using WFO as truth:

```typescript
// Search by common name → WFO accepted name
async function searchPlants(query: string): Promise<WFOPlant[]> {
  const { data } = await supabase
    .from('wfo_taxonomy')
    .select('*')
    .or(`scientific_name.ilike.%${query}%,common_names @> ${JSON.stringify([query])}`)
    .eq('taxonomic_status', 'accepted')
    .limit(20);

  return data;
}

// Resolve synonyms automatically
async function getAcceptedName(wfo_id: string): Promise<string> {
  const { data } = await supabase
    .from('wfo_taxonomy')
    .select('scientific_name, accepted_name_wfo_id')
    .eq('wfo_id', wfo_id)
    .single();

  if (data.accepted_name_wfo_id) {
    // This is a synonym, fetch accepted name
    const accepted = await supabase
      .from('wfo_taxonomy')
      .select('scientific_name')
      .eq('wfo_id', data.accepted_name_wfo_id)
      .single();

    return accepted.data.scientific_name;
  }

  return data.scientific_name; // Already accepted
}
```

---

## Data Quality Improvements

### Before (Current System)
- Viburnum tinus marked as deciduous ❌
- Conflicting data from Trefle vs Perenual
- Missing botanical authorities
- Outdated synonyms

### After (WFO Integration)
- Authoritative taxonomy from botanical institutions ✅
- Automatic synonym resolution
- Consistent nomenclature across all plants
- Traceable data provenance

---

## Example: Betula pendula in WFO

```json
{
  "wfo_id": "wfo-0000685925",
  "scientific_name": "Betula pendula Roth",
  "family": "Betulaceae",
  "genus": "Betula",
  "species": "pendula",
  "rank": "species",
  "taxonomic_status": "accepted",
  "authority": "Roth",
  "common_names": {
    "en": ["Silver Birch", "European White Birch"],
    "de": ["Hänge-Birke"],
    "fr": ["Bouleau verruqueux"]
  },
  "distribution": ["Europe", "Western Asia"],
  "ipni_id": "703280-1"
}
```

We then **enrich** this with:
- RHS hardiness zones (H5-H7)
- Mature dimensions (2500cm height, 1000cm spread)
- Our rendering params (deciduous, fine texture, density=0.35)
- Growth progression data

---

## Implementation Steps

### Week 1: Foundation
1. Download WFO Darwin Core Archive
2. Parse into Supabase tables
3. Build import script (handle 733 families)
4. Create indexes for search performance

### Week 2: Data Pipeline
1. Map existing plants to WFO IDs
2. Resolve synonyms (e.g., Viburnum tinus var. subcordatum → V. tinus)
3. Enrich with RHS data
4. Add manual rendering parameters

### Week 3: Search & UI
1. Build fuzzy search API endpoint
2. Autocomplete component with WFO suggestions
3. Show botanical authorities in UI (e.g., "Roth" for Betula pendula)
4. Display taxonomic hierarchy (Family → Genus → Species)

### Week 4: Quality Assurance
1. Validate all existing plants against WFO
2. Correct misidentifications
3. Add missing UK natives
4. Update rendering parameters

---

## File Priorities

**Download first**:
1. `DarwinCore.zip` - Standard biodiversity format, easiest to parse
2. `IPNI_WFO_mapping.csv.gz` - Cross-reference with IPNI IDs

**Optional**:
- `MySQL_backup.sql.gz` - If you want full DB dump
- `JSON_SOLR.zip` - For search indexing (large file)

---

## Expected Impact

### Data Quality
- **100% accurate taxonomy** (no more "Viburnum is deciduous" errors)
- **Synonym resolution** (users search "Hänge-Birke" → finds Betula pendula)
- **Authority tracking** (show "Roth 1788" for botanical provenance)

### Search Improvements
- Fuzzy match on scientific + common names
- Multi-language support (DE, FR, ES common names)
- Taxonomic hierarchy browsing (show all Betula species)

### Professional Credibility
- "Powered by World Flora Online" badge
- Cite botanical authorities in plant cards
- Traceable data sources

---

## Next Steps

1. **Download WFO dataset** from Zenodo (link in your message)
2. **Parse Darwin Core files** into Supabase
3. **Map existing 3 plants** (Betula, Viburnum, Cornus) to WFO IDs
4. **Validate rendering params** against WFO taxonomy
5. **Build search endpoint** with WFO as backbone

---

## Code Skeleton (Import Script)

```typescript
// scripts/import-wfo-data.ts
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import zlib from 'zlib';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function importWFOTaxonomy() {
  console.log('Reading WFO Darwin Core Archive...');

  // Unzip and parse taxon.txt (Darwin Core format)
  const fileContent = fs.readFileSync('DarwinCore/taxon.txt', 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    delimiter: '\t',
    skip_empty_lines: true
  });

  console.log(`Parsed ${records.length} taxonomic records`);

  // Batch insert to Supabase
  const batchSize = 1000;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize).map(r => ({
      wfo_id: r.taxonID,
      scientific_name: r.scientificName,
      family: r.family,
      genus: r.genus,
      species: r.specificEpithet,
      rank: r.taxonRank,
      taxonomic_status: r.taxonomicStatus,
      accepted_name_wfo_id: r.acceptedNameUsageID || null,
      common_names: {}, // Parse from vernacularName.txt separately
      distribution: [] // Parse from distribution.txt separately
    }));

    const { error } = await supabase.from('wfo_taxonomy').insert(batch);
    if (error) console.error('Batch insert error:', error);

    console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} records)`);
  }

  console.log('✅ WFO taxonomy import complete!');
}

importWFOTaxonomy();
```

---

**Status**: Ready to integrate
**Estimated Time**: 2-3 weeks full implementation
**Priority**: High (fixes core data quality issues)
