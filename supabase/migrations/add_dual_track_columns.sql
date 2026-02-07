-- Add columns for dual-track onboarding system
-- Migration: add_dual_track_columns
-- Created: 2026-02-06

-- Add columns to track DIY vs Professional flows and style selection
ALTER TABLE planting_plans
ADD COLUMN IF NOT EXISTS is_finalized BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS source_track TEXT DEFAULT 'professional' CHECK (source_track IN ('diy', 'professional')),
ADD COLUMN IF NOT EXISTS selected_style_slug TEXT;

-- Add foreign key constraint to designer_styles (if designer_styles table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='designer_styles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name='planting_plans_selected_style_slug_fkey'
    ) THEN
      ALTER TABLE planting_plans
      ADD CONSTRAINT planting_plans_selected_style_slug_fkey
      FOREIGN KEY (selected_style_slug) REFERENCES designer_styles(slug);
    END IF;
  END IF;
END $$;

-- Add indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_planting_plans_source_track ON planting_plans(source_track);
CREATE INDEX IF NOT EXISTS idx_planting_plans_is_finalized ON planting_plans(is_finalized);
CREATE INDEX IF NOT EXISTS idx_planting_plans_selected_style_slug ON planting_plans(selected_style_slug);

-- Update existing plans to be marked as finalized
UPDATE planting_plans
SET is_finalized = true
WHERE status = 'complete' AND is_finalized IS NULL;

COMMENT ON COLUMN planting_plans.is_finalized IS 'Distinguishes draft plans (DIY flow) from refined/finalized plans';
COMMENT ON COLUMN planting_plans.source_track IS 'Which onboarding flow was used: diy (style-first) or professional (detailed form)';
COMMENT ON COLUMN planting_plans.selected_style_slug IS 'The designer style chosen from the gallery (DIY flow)';
