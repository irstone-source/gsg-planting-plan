-- Add designer_style_slug column to planting_plans table
ALTER TABLE planting_plans
ADD COLUMN IF NOT EXISTS designer_style_slug TEXT REFERENCES designer_styles(slug);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_planting_plans_designer_style
ON planting_plans(designer_style_slug);

-- Add comment
COMMENT ON COLUMN planting_plans.designer_style_slug IS 'Reference to specific designer style used for this plan (e.g., piet-oudolf-prairie, dan-pearson-meadow)';
