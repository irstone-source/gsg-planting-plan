-- WFO Taxonomy Setup SQL
-- Run this in Supabase SQL Editor before importing

-- 1. Create exec_sql function (for schema creation from Node.js)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- 2. Create wfo_taxonomy table
CREATE TABLE IF NOT EXISTS wfo_taxonomy (
  wfo_id TEXT PRIMARY KEY,
  ipni_id TEXT,
  scientific_name TEXT NOT NULL,
  scientific_name_authorship TEXT,
  family TEXT,
  subfamily TEXT,
  tribe TEXT,
  genus TEXT,
  species TEXT,
  infraspecific_epithet TEXT,
  rank TEXT,
  taxonomic_status TEXT,
  nomenclatural_status TEXT,
  name_published_in TEXT,
  name_published_year INTEGER,
  accepted_name_wfo_id TEXT,
  parent_name_wfo_id TEXT,
  taxon_remarks TEXT,
  reference_url TEXT,
  major_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_wfo_scientific ON wfo_taxonomy(scientific_name);
CREATE INDEX IF NOT EXISTS idx_wfo_family ON wfo_taxonomy(family);
CREATE INDEX IF NOT EXISTS idx_wfo_genus ON wfo_taxonomy(genus);
CREATE INDEX IF NOT EXISTS idx_wfo_status ON wfo_taxonomy(taxonomic_status);
CREATE INDEX IF NOT EXISTS idx_wfo_rank ON wfo_taxonomy(rank);

-- 4. Full text search index
CREATE INDEX IF NOT EXISTS idx_wfo_search
  ON wfo_taxonomy
  USING gin(to_tsvector('english', scientific_name));

-- 5. Add WFO link to existing planting_plans table
ALTER TABLE planting_plans
  ADD COLUMN IF NOT EXISTS wfo_id TEXT REFERENCES wfo_taxonomy(wfo_id);

CREATE INDEX IF NOT EXISTS idx_plans_wfo ON planting_plans(wfo_id);

-- 6. Enable RLS (but allow service role access)
ALTER TABLE wfo_taxonomy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON wfo_taxonomy
  FOR SELECT
  USING (true);

-- 7. Create search helper function
CREATE OR REPLACE FUNCTION search_wfo_plants(search_query TEXT, max_results INT DEFAULT 20)
RETURNS TABLE (
  wfo_id TEXT,
  scientific_name TEXT,
  scientific_name_authorship TEXT,
  family TEXT,
  genus TEXT,
  rank TEXT,
  similarity REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.wfo_id,
    t.scientific_name,
    t.scientific_name_authorship,
    t.family,
    t.genus,
    t.rank,
    SIMILARITY(t.scientific_name, search_query) as similarity
  FROM wfo_taxonomy t
  WHERE
    t.taxonomic_status = 'accepted'
    AND (
      t.scientific_name ILIKE '%' || search_query || '%'
      OR to_tsvector('english', t.scientific_name) @@ plainto_tsquery('english', search_query)
    )
  ORDER BY similarity DESC, t.scientific_name
  LIMIT max_results;
END;
$$;

-- 8. Enable pg_trgm extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Done! Ready to import data.
