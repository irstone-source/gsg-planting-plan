-- Add Crocus.co.uk retail data fields to plants table

ALTER TABLE plants
ADD COLUMN IF NOT EXISTS crocus_product_name TEXT,
ADD COLUMN IF NOT EXISTS crocus_product_url TEXT,
ADD COLUMN IF NOT EXISTS crocus_image_url TEXT,
ADD COLUMN IF NOT EXISTS crocus_price_gbp DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS crocus_original_price_gbp DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS crocus_availability TEXT,
ADD COLUMN IF NOT EXISTS crocus_pot_size TEXT,
ADD COLUMN IF NOT EXISTS crocus_rating DECIMAL(3, 2),
ADD COLUMN IF NOT EXISTS crocus_review_count INTEGER,
ADD COLUMN IF NOT EXISTS crocus_fetched_at TIMESTAMPTZ;

-- Create index for price queries
CREATE INDEX IF NOT EXISTS idx_plants_crocus_price ON plants(crocus_price_gbp);

-- Create index for availability queries
CREATE INDEX IF NOT EXISTS idx_plants_crocus_availability ON plants(crocus_availability);

-- Comments for documentation
COMMENT ON COLUMN plants.crocus_product_name IS 'Product name from Crocus.co.uk';
COMMENT ON COLUMN plants.crocus_product_url IS 'Direct link to buy on Crocus.co.uk';
COMMENT ON COLUMN plants.crocus_image_url IS 'High-quality product image from Crocus';
COMMENT ON COLUMN plants.crocus_price_gbp IS 'Current price in GBP';
COMMENT ON COLUMN plants.crocus_original_price_gbp IS 'Original price if on sale';
COMMENT ON COLUMN plants.crocus_availability IS 'Stock availability status';
COMMENT ON COLUMN plants.crocus_pot_size IS 'Pot size (e.g., 3 litre pot)';
COMMENT ON COLUMN plants.crocus_rating IS 'Customer rating out of 5';
COMMENT ON COLUMN plants.crocus_review_count IS 'Number of customer reviews';
COMMENT ON COLUMN plants.crocus_fetched_at IS 'Timestamp of last price/data update';
