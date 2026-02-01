-- Designer Styles Feature Schema
-- Creates tables for 18-27 curated planting plans inspired by Chelsea, famous designers, historic gardens

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Designer Styles Table
CREATE TABLE IF NOT EXISTS designer_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL, -- 'piet-oudolf-prairie'
  name VARCHAR(255) NOT NULL, -- 'Piet Oudolf Prairie Style'
  designer_name VARCHAR(255), -- 'Piet Oudolf'
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('show_garden', 'designer', 'historic_garden', 'tv_featured')),
  source_name VARCHAR(255), -- 'Chelsea Flower Show 2023' or 'BBC Gardeners World'
  year INTEGER, -- 2023
  award VARCHAR(100), -- 'Gold Medal'

  -- Style characteristics
  style_category VARCHAR(50) NOT NULL CHECK (style_category IN ('prairie', 'cottage', 'modern', 'formal', 'wildlife', 'exotic', 'wellness', 'sustainable', 'cutting', 'naturalistic', 'contemporary', 'meadow', 'romantic', 'textural')),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  maintenance VARCHAR(20) NOT NULL CHECK (maintenance IN ('low', 'medium', 'high')),

  -- Description & content
  short_description TEXT NOT NULL, -- 2-3 sentences for card
  long_description TEXT NOT NULL, -- Full page description
  design_principles JSONB, -- Array of key principles
  best_for TEXT[], -- ['small gardens', 'urban', 'partial shade']

  -- Visuals
  hero_image_url TEXT, -- Main featured image
  gallery_images TEXT[], -- Additional images

  -- Pricing & plants
  estimated_cost_min INTEGER, -- £400
  estimated_cost_max INTEGER, -- £800
  plants_count INTEGER DEFAULT 15, -- ~15-20 plants

  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],

  -- Attribution & legal
  attribution_text TEXT, -- 'Inspired by Piet Oudolf's naturalistic design principles...'
  source_links JSONB, -- [{title: 'Piet Oudolf Official Site', url: '...'}]

  -- Metrics
  view_count INTEGER DEFAULT 0,
  plan_generation_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Style Signature Plants (the key plants that define this style)
CREATE TABLE IF NOT EXISTS style_signature_plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  style_id UUID REFERENCES designer_styles(id) ON DELETE CASCADE,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  importance INTEGER CHECK (importance BETWEEN 1 AND 5), -- 1-5, with 5 being most signature
  notes TEXT, -- Why this plant is key to the style
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Style Color Palette
CREATE TABLE IF NOT EXISTS style_color_palettes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  style_id UUID REFERENCES designer_styles(id) ON DELETE CASCADE,
  season VARCHAR(20) CHECK (season IN ('spring', 'summer', 'autumn', 'winter', 'year-round')),
  dominant_colors TEXT[], -- ['purple', 'bronze', 'cream']
  accent_colors TEXT[], -- ['red', 'orange']
  foliage_colors TEXT[], -- ['silver', 'green']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_designer_styles_slug ON designer_styles(slug);
CREATE INDEX IF NOT EXISTS idx_designer_styles_category ON designer_styles(style_category);
CREATE INDEX IF NOT EXISTS idx_designer_styles_difficulty ON designer_styles(difficulty);
CREATE INDEX IF NOT EXISTS idx_designer_styles_source_type ON designer_styles(source_type);
CREATE INDEX IF NOT EXISTS idx_style_signature_plants_style ON style_signature_plants(style_id);
CREATE INDEX IF NOT EXISTS idx_style_signature_plants_plant ON style_signature_plants(plant_id);
CREATE INDEX IF NOT EXISTS idx_style_color_palettes_style ON style_color_palettes(style_id);

-- Enable Row Level Security
ALTER TABLE designer_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_signature_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_color_palettes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access for all style data
CREATE POLICY "Anyone can view designer styles" ON designer_styles FOR SELECT USING (true);
CREATE POLICY "Anyone can view signature plants" ON style_signature_plants FOR SELECT USING (true);
CREATE POLICY "Anyone can view color palettes" ON style_color_palettes FOR SELECT USING (true);

-- Admin-only write access (replace with actual admin check if you have auth.users)
CREATE POLICY "Only admins can insert styles" ON designer_styles FOR INSERT WITH CHECK (false);
CREATE POLICY "Only admins can update styles" ON designer_styles FOR UPDATE USING (false);
CREATE POLICY "Only admins can delete styles" ON designer_styles FOR DELETE USING (false);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_designer_styles_updated_at BEFORE UPDATE ON designer_styles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE designer_styles IS 'Curated garden design styles inspired by Chelsea, famous designers, and historic gardens';
COMMENT ON TABLE style_signature_plants IS 'Key plants that define each style, with importance ratings';
COMMENT ON TABLE style_color_palettes IS 'Seasonal color schemes for each style';
COMMENT ON COLUMN designer_styles.slug IS 'URL-friendly identifier (e.g., piet-oudolf-prairie)';
COMMENT ON COLUMN designer_styles.source_type IS 'Category: show_garden, designer, historic_garden, tv_featured';
COMMENT ON COLUMN designer_styles.design_principles IS 'JSON array of key design principles for this style';
COMMENT ON COLUMN designer_styles.attribution_text IS 'Legal attribution and disclaimer text';
COMMENT ON COLUMN style_signature_plants.importance IS 'Rating 1-5, with 5 being most signature to the style';
