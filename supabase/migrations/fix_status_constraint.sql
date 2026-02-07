-- Fix status constraint to ensure it allows all required values
-- Migration: fix_status_constraint
-- Created: 2026-02-07

-- Drop existing constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'planting_plans_status_check'
    AND table_name = 'planting_plans'
  ) THEN
    ALTER TABLE planting_plans DROP CONSTRAINT planting_plans_status_check;
    RAISE NOTICE 'Dropped existing status constraint';
  END IF;
END $$;

-- Add the correct constraint
ALTER TABLE planting_plans
ADD CONSTRAINT planting_plans_status_check
CHECK (status IN ('draft', 'generating', 'complete', 'error'));

-- Ensure status column exists with correct default
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='planting_plans' AND column_name='status'
  ) THEN
    ALTER TABLE planting_plans
    ADD COLUMN status TEXT DEFAULT 'draft';
    RAISE NOTICE 'Added status column';
  END IF;
END $$;

COMMENT ON CONSTRAINT planting_plans_status_check ON planting_plans IS 'Ensures status is one of: draft, generating, complete, error';
