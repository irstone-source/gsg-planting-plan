-- Add designer_style_slug column to planting_plans table
-- This links plans to designer styles for attribution and AI context

ALTER TABLE planting_plans
ADD COLUMN designer_style_slug VARCHAR(100) REFERENCES designer_styles(slug) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX idx_planting_plans_designer_style ON planting_plans(designer_style_slug);

-- Add comment
COMMENT ON COLUMN planting_plans.designer_style_slug IS 'References designer style that inspired this plan (e.g., piet-oudolf-prairie)';
