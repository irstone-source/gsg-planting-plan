-- GSG Planting Plan Generator Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Plants table (from Wyevale Nurseries stock list)
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  botanical_name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255),
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'BAMBOO', 'CLIMBER', 'CONIFER', 'FERN', 'GRASS',
    'HERBACEOUS', 'SHRUB', 'TREE', 'SUNDRIES'
  )),
  size VARCHAR(20) NOT NULL,
  product_code VARCHAR(50) UNIQUE NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_peat_free BOOLEAN DEFAULT FALSE,

  -- Plant characteristics
  hardiness_zone VARCHAR(10), -- RHS zones: H1-H7
  height_min INTEGER, -- in cm
  height_max INTEGER,
  spread_min INTEGER,
  spread_max INTEGER,
  growth_rate VARCHAR(20) CHECK (growth_rate IN ('slow', 'medium', 'fast')),
  evergreen BOOLEAN DEFAULT FALSE,

  -- Growing conditions (arrays)
  soil_type TEXT[], -- ['clay', 'loam', 'sand', 'chalk']
  moisture TEXT[], -- ['dry', 'moist', 'wet']
  sun_exposure TEXT[], -- ['full_sun', 'partial_shade', 'full_shade']

  -- Ornamental features
  flower_color TEXT[],
  flower_season TEXT[], -- ['spring', 'summer', 'autumn', 'winter']
  foliage_color TEXT[],

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site analyses table
CREATE TABLE site_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  postcode VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rhs_zone VARCHAR(10),

  -- Site conditions
  sun_exposure VARCHAR(50) NOT NULL,
  soil_type VARCHAR(50) NOT NULL,
  moisture VARCHAR(50) NOT NULL,
  area_sqm DECIMAL(10, 2),
  aspect VARCHAR(10),

  -- Vision analysis (JSON data from Claude)
  vision_analysis JSONB,

  -- Image URLs
  image_urls TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planting plans table
CREATE TABLE planting_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_analysis_id UUID REFERENCES site_analyses(id) ON DELETE CASCADE,

  -- User preferences
  style VARCHAR(50) NOT NULL,
  maintenance_level VARCHAR(20) NOT NULL,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  special_requirements TEXT,

  -- Plan metadata
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
  total_cost DECIMAL(10, 2) DEFAULT 0,

  -- AI-generated content
  design_rationale TEXT,
  planting_instructions TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plant recommendations table (links plans to specific plants)
CREATE TABLE plant_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planting_plan_id UUID REFERENCES planting_plans(id) ON DELETE CASCADE,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,

  -- Recommendation details
  quantity INTEGER NOT NULL DEFAULT 1,
  position_zone VARCHAR(50),
  position_layer VARCHAR(50) CHECK (position_layer IN (
    'canopy', 'shrub', 'herbaceous', 'ground_cover'
  )),

  -- Rationale
  rationale TEXT,

  -- Pricing (snapshot at time of recommendation)
  cost_per_unit DECIMAL(10, 2),
  total_cost DECIMAL(10, 2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_plants_category ON plants(category);
CREATE INDEX idx_plants_stock ON plants(stock_quantity) WHERE stock_quantity > 0;
CREATE INDEX idx_plants_botanical_name ON plants(botanical_name);
CREATE INDEX idx_plants_hardiness ON plants(hardiness_zone);

CREATE INDEX idx_site_analyses_postcode ON site_analyses(postcode);
CREATE INDEX idx_planting_plans_status ON planting_plans(status);
CREATE INDEX idx_planting_plans_created ON planting_plans(created_at DESC);

CREATE INDEX idx_recommendations_plan ON plant_recommendations(planting_plan_id);
CREATE INDEX idx_recommendations_plant ON plant_recommendations(plant_id);

-- Full-text search on plant names
CREATE INDEX idx_plants_name_search ON plants USING gin(
  to_tsvector('english', botanical_name || ' ' || COALESCE(common_name, ''))
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON plants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planting_plans_updated_at BEFORE UPDATE ON planting_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample RHS zone lookup function (simplified)
CREATE OR REPLACE FUNCTION get_rhs_zone_from_postcode(postcode_input VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
  -- This is a simplified version
  -- In production, this would use a proper postcode to RHS zone mapping
  -- For now, return a default zone based on UK regions
  CASE
    WHEN postcode_input LIKE 'SW%' OR postcode_input LIKE 'SE%' THEN RETURN 'H4';
    WHEN postcode_input LIKE 'N%' OR postcode_input LIKE 'E%' THEN RETURN 'H4';
    WHEN postcode_input LIKE 'M%' OR postcode_input LIKE 'L%' THEN RETURN 'H4';
    WHEN postcode_input LIKE 'G%' OR postcode_input LIKE 'EH%' THEN RETURN 'H3';
    WHEN postcode_input LIKE 'AB%' OR postcode_input LIKE 'IV%' THEN RETURN 'H2';
    ELSE RETURN 'H4'; -- Default to H4 for most of UK
  END CASE;
END;
$$ LANGUAGE plpgsql;
