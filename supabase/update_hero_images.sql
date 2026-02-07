-- Update hero images for first three garden styles
-- Run this manually in Supabase SQL Editor

-- Update the meadow/prairie style
UPDATE designer_styles
SET hero_image_url = '/images/styles/meadow-garden.png'
WHERE slug LIKE '%meadow%' OR slug LIKE '%prairie%' OR name ILIKE '%meadow%' OR name ILIKE '%prairie%'
LIMIT 1;

-- Update the cottage/perennial border style
UPDATE designer_styles
SET hero_image_url = '/images/styles/cottage-border.jpg'
WHERE slug LIKE '%cottage%' OR slug LIKE '%perennial%' OR name ILIKE '%cottage%' OR name ILIKE '%border%'
LIMIT 1;

-- Update the wildflower/native style
UPDATE designer_styles
SET hero_image_url = '/images/styles/wildflower-path.jpg'
WHERE slug LIKE '%wildflower%' OR slug LIKE '%wildlife%' OR name ILIKE '%wildflower%' OR name ILIKE '%wildlife%'
LIMIT 1;

-- Verify the updates
SELECT slug, name, hero_image_url
FROM designer_styles
WHERE hero_image_url IS NOT NULL
ORDER BY view_count DESC;
