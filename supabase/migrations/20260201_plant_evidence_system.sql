-- Plant Evidence & Verification System
-- Enables "ever-learning" plant rendering improvements via user-submitted evidence

-- Plant Evidence: User-uploaded reference photos
CREATE TABLE IF NOT EXISTS plant_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wfo_id TEXT REFERENCES wfo_taxonomy(wfo_id),
  botanical_name TEXT NOT NULL,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('leaf', 'bark', 'habit', 'winter', 'flower', 'fruit', 'overall')),
  image_url TEXT NOT NULL, -- Supabase Storage URL
  uploaded_by UUID REFERENCES auth.users(id),
  upload_source TEXT DEFAULT 'manual', -- manual, api, import
  metadata JSONB DEFAULT '{}', -- exif data, geolocation, season, etc.
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'needs_review')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evidence_wfo ON plant_evidence(wfo_id);
CREATE INDEX idx_evidence_botanical ON plant_evidence(botanical_name);
CREATE INDEX idx_evidence_status ON plant_evidence(verification_status);
CREATE INDEX idx_evidence_type ON plant_evidence(evidence_type);

-- Plant Verification Runs: Results from species verification APIs
CREATE TABLE IF NOT EXISTS plant_verification_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID REFERENCES plant_evidence(id) ON DELETE CASCADE,
  verification_backend TEXT NOT NULL, -- 'inaturalist_cv', 'gbif_backbone', 'local_embeddings', 'wfo_match'
  input_data JSONB NOT NULL, -- { image_url, botanical_name_hint, etc }
  output_data JSONB NOT NULL, -- full API response
  candidate_taxa JSONB, -- [ { name, confidence, rank, source } ]
  top_match TEXT, -- best candidate botanical name
  confidence_score DECIMAL(5,4), -- 0.0000 to 1.0000
  accepted_name TEXT, -- normalized/accepted taxonomic name
  taxonomic_status TEXT, -- 'accepted', 'synonym', 'unresolved'
  run_timestamp TIMESTAMPTZ DEFAULT NOW(),
  processing_time_ms INTEGER,
  error_message TEXT,
  provenance JSONB DEFAULT '{}' -- { api_version, endpoint, rate_limit_info }
);

CREATE INDEX idx_verification_evidence ON plant_verification_runs(evidence_id);
CREATE INDEX idx_verification_backend ON plant_verification_runs(verification_backend);
CREATE INDEX idx_verification_confidence ON plant_verification_runs(confidence_score);

-- Plant Preset Suggestions: Proposed improvements to rendering parameters
CREATE TABLE IF NOT EXISTS plant_preset_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  botanical_name TEXT NOT NULL,
  wfo_id TEXT REFERENCES wfo_taxonomy(wfo_id),
  evidence_ids UUID[] NOT NULL, -- supporting evidence
  verification_run_ids UUID[] NOT NULL, -- verification results that support this suggestion
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('leaf_habit', 'crown_texture', 'crown_density', 'winter_interest', 'species_correction')),
  current_value TEXT, -- JSON string of current preset values
  suggested_value TEXT NOT NULL, -- JSON string of suggested values
  confidence_score DECIMAL(5,4) NOT NULL, -- aggregated confidence from verification runs
  rationale TEXT, -- human-readable explanation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'deferred')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_suggestions_botanical ON plant_preset_suggestions(botanical_name);
CREATE INDEX idx_suggestions_status ON plant_preset_suggestions(status);
CREATE INDEX idx_suggestions_type ON plant_preset_suggestions(suggestion_type);
CREATE INDEX idx_suggestions_confidence ON plant_preset_suggestions(confidence_score DESC);

-- Plant Preset Audit: Log of approved changes
CREATE TABLE IF NOT EXISTS plant_preset_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  botanical_name TEXT NOT NULL,
  wfo_id TEXT,
  suggestion_id UUID REFERENCES plant_preset_suggestions(id),
  change_type TEXT NOT NULL CHECK (change_type IN ('preset_update', 'species_rename', 'new_species')),
  previous_values JSONB, -- old preset data
  new_values JSONB NOT NULL, -- new preset data
  applied_by UUID REFERENCES auth.users(id) NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  rollback_possible BOOLEAN DEFAULT TRUE,
  rollback_at TIMESTAMPTZ, -- if change was rolled back
  rollback_reason TEXT
);

CREATE INDEX idx_audit_botanical ON plant_preset_audit(botanical_name);
CREATE INDEX idx_audit_applied ON plant_preset_audit(applied_at DESC);

-- Storage Bucket for Plant Evidence (run via Supabase dashboard or API)
-- CREATE BUCKET plant_evidence (public: false, file_size_limit: 10485760, allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp']);

-- Row Level Security Policies
ALTER TABLE plant_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_verification_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_preset_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_preset_audit ENABLE ROW LEVEL SECURITY;

-- Evidence: Users can upload and view their own evidence
CREATE POLICY "Users can insert own evidence" ON plant_evidence
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can view own evidence" ON plant_evidence
  FOR SELECT TO authenticated
  USING (auth.uid() = uploaded_by OR verification_status = 'verified');

-- Admin users can view all evidence
CREATE POLICY "Admins can view all evidence" ON plant_evidence
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
  ));

-- Verification runs: Readable by authenticated users, insertable by system
CREATE POLICY "Users can view verification runs" ON plant_verification_runs
  FOR SELECT TO authenticated
  USING (TRUE);

-- Suggestions: Viewable by all authenticated, updatable by admins
CREATE POLICY "Users can view suggestions" ON plant_preset_suggestions
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can update suggestions" ON plant_preset_suggestions
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
  ));

-- Audit: Read-only for authenticated users
CREATE POLICY "Users can view audit log" ON plant_preset_audit
  FOR SELECT TO authenticated
  USING (TRUE);

-- Functions: Helper for computing aggregated confidence scores
CREATE OR REPLACE FUNCTION compute_suggestion_confidence(
  verification_run_ids UUID[]
) RETURNS DECIMAL(5,4) AS $$
DECLARE
  avg_confidence DECIMAL(5,4);
BEGIN
  SELECT AVG(confidence_score)
  INTO avg_confidence
  FROM plant_verification_runs
  WHERE id = ANY(verification_run_ids);

  RETURN COALESCE(avg_confidence, 0);
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plant_evidence_updated
  BEFORE UPDATE ON plant_evidence
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER plant_suggestions_updated
  BEFORE UPDATE ON plant_preset_suggestions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Indexes for efficient queries
CREATE INDEX idx_evidence_created ON plant_evidence(created_at DESC);
CREATE INDEX idx_suggestions_created ON plant_preset_suggestions(created_at DESC);
