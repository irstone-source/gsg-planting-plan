-- Add status column to planting_plans table for async generation tracking
-- Migration: add_status_column_to_planting_plans
-- Created: 2026-02-06

-- Add status column with check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='planting_plans' AND column_name='status'
  ) THEN
    ALTER TABLE planting_plans
    ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'complete', 'error'));

    -- Add index for faster status queries
    CREATE INDEX idx_planting_plans_status ON planting_plans(status);

    -- Update existing plans to 'complete' if they have recommendations
    UPDATE planting_plans p
    SET status = 'complete'
    WHERE EXISTS (
      SELECT 1 FROM plant_recommendations r WHERE r.plan_id = p.id
    );

    RAISE NOTICE 'Status column added successfully to planting_plans table';
  ELSE
    RAISE NOTICE 'Status column already exists in planting_plans table';
  END IF;
END $$;
