-- Add new image and reference fields to plants table

-- Generated images
ALTER TABLE plants ADD COLUMN IF NOT EXISTS front_view_image_url TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS top_down_image_url TEXT;

-- Size progression data
ALTER TABLE plants ADD COLUMN IF NOT EXISTS year_1_height_cm INTEGER;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS year_1_spread_cm INTEGER;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS year_3_height_cm INTEGER;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS year_3_spread_cm INTEGER;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS mature_height_cm INTEGER;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS mature_spread_cm INTEGER;

-- Reference images from external sources
ALTER TABLE plants ADD COLUMN IF NOT EXISTS wikipedia_image_url TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS wikipedia_page_url TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS rhs_image_url TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS rhs_page_url TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS kew_image_url TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS kew_page_url TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS reference_images JSONB; -- Array of {source, image_url, page_url}

-- Rename existing generated_image_url to front_view_image_url for clarity
UPDATE plants
SET front_view_image_url = generated_image_url
WHERE generated_image_url IS NOT NULL AND front_view_image_url IS NULL;

COMMENT ON COLUMN plants.front_view_image_url IS 'AI-generated front-facing botanical illustration (transparent background)';
COMMENT ON COLUMN plants.top_down_image_url IS 'AI-generated top-down landscape architecture view for stencil use';
COMMENT ON COLUMN plants.year_1_height_cm IS 'Expected height in centimeters at year 1';
COMMENT ON COLUMN plants.year_1_spread_cm IS 'Expected spread in centimeters at year 1';
COMMENT ON COLUMN plants.year_3_height_cm IS 'Expected height in centimeters at year 3';
COMMENT ON COLUMN plants.year_3_spread_cm IS 'Expected spread in centimeters at year 3';
COMMENT ON COLUMN plants.reference_images IS 'JSON array of reference images from various sources with attribution';
