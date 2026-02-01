-- Add missing columns to plants table to match import data

-- Add RHS zone columns (replace single hardiness_zone with min/max)
ALTER TABLE plants ADD COLUMN IF NOT EXISTS rhs_zone_min VARCHAR(10);
ALTER TABLE plants ADD COLUMN IF NOT EXISTS rhs_zone_max VARCHAR(10);

-- Add price column
ALTER TABLE plants ADD COLUMN IF NOT EXISTS price_gbp DECIMAL(10, 2);

-- Drop the old hardiness_zone column if it's not being used
ALTER TABLE plants DROP COLUMN IF EXISTS hardiness_zone;

-- Update indexes
DROP INDEX IF EXISTS idx_plants_hardiness;
CREATE INDEX IF NOT EXISTS idx_plants_rhs_zone ON plants(rhs_zone_min, rhs_zone_max);
