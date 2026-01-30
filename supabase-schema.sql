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

-- ============================================
-- CLIENT PORTAL TABLES
-- ============================================

-- Shared plan links for client portal
CREATE TABLE shared_plan_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id TEXT UNIQUE NOT NULL,
  plan_id TEXT NOT NULL,
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  allow_comments BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- Comments on shared plans
CREATE TABLE portal_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id TEXT REFERENCES shared_plan_links(share_id) ON DELETE CASCADE,
  author TEXT NOT NULL CHECK (author IN ('client', 'professional')),
  author_name TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan approval status
CREATE TABLE portal_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id TEXT REFERENCES shared_plan_links(share_id) ON DELETE CASCADE UNIQUE,
  approved BOOLEAN NOT NULL,
  approved_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_shared_plan_links_share_id ON shared_plan_links(share_id);
CREATE INDEX idx_shared_plan_links_status ON shared_plan_links(status);
CREATE INDEX idx_portal_comments_share_id ON portal_comments(share_id);
CREATE INDEX idx_portal_comments_created_at ON portal_comments(created_at DESC);

-- Row Level Security (RLS) policies
-- Note: These are basic policies. Adjust based on your auth setup.

-- Public read access to active shared links
ALTER TABLE shared_plan_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active shared links" ON shared_plan_links
  FOR SELECT USING (status = 'active');

-- Anyone can add comments if allowed
ALTER TABLE portal_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON portal_comments
  FOR SELECT USING (true);
CREATE POLICY "Anyone can add comments" ON portal_comments
  FOR INSERT WITH CHECK (true);

-- Anyone can add approvals
ALTER TABLE portal_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read approvals" ON portal_approvals
  FOR SELECT USING (true);
CREATE POLICY "Anyone can add approvals" ON portal_approvals
  FOR INSERT WITH CHECK (true);

-- ========================================
-- PLANTINGPLANS MVP - SAAS TRANSFORMATION
-- ========================================

-- USERS & AUTH
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'designer', 'affiliate', 'partner', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVATION PASSES
CREATE TABLE activation_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('diy', 'pro')),
  price_paid INTEGER NOT NULL, -- in pence
  credits_total INTEGER NOT NULL,
  credits_remaining INTEGER NOT NULL,
  vault_slots INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'refunded')),
  stripe_payment_intent TEXT,
  stripe_session_id TEXT,
  affiliate_code TEXT, -- attribution for commission
  partner_code TEXT, -- attribution for revenue share
  UNIQUE(user_id, status) -- Only one active pass per user
);

CREATE INDEX idx_activation_expires ON activation_passes(expires_at);
CREATE INDEX idx_activation_user ON activation_passes(user_id);

-- PLAN OWNERSHIP (link existing plans to users)
ALTER TABLE planting_plans ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES user_profiles(id);
ALTER TABLE planting_plans ADD COLUMN IF NOT EXISTS in_vault BOOLEAN DEFAULT FALSE;
ALTER TABLE planting_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_plans_user ON planting_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_vault ON planting_plans(in_vault);

-- AFFILIATES
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  code TEXT UNIQUE NOT NULL, -- e.g., "SARAH30"
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  commission_rate INTEGER NOT NULL, -- 30 or 20 (percentage)
  is_founding_creator BOOLEAN DEFAULT FALSE,
  founding_expires_at TIMESTAMPTZ, -- 30 days from approval
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_earnings_pence INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_code TEXT NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  converted BOOLEAN DEFAULT FALSE,
  conversion_id UUID, -- links to activation_passes.id
  FOREIGN KEY (affiliate_code) REFERENCES affiliates(code)
);

CREATE INDEX idx_affiliate_clicks ON affiliate_clicks(affiliate_code, clicked_at);

-- PARTNERS (garden centres)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  business_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  redemption_code TEXT UNIQUE NOT NULL, -- e.g., "WYEVALE15"
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 10 AND 30),
  revenue_share_percent INTEGER NOT NULL CHECK (revenue_share_percent BETWEEN 15 AND 25),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused')),
  total_redemptions INTEGER DEFAULT 0,
  total_revenue_pence INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DESIGNERS
CREATE TABLE designers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  business_name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  location TEXT,
  website_url TEXT,
  instagram_handle TEXT,
  portfolio_images JSONB, -- array of image URLs
  specialties TEXT[], -- e.g., ['urban', 'wildlife', 'contemporary']
  service_areas TEXT[], -- postcodes or regions
  pricing_from INTEGER, -- starting price in pence
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused')),
  featured BOOLEAN DEFAULT FALSE,
  total_leads INTEGER DEFAULT 0,
  total_plans_sold INTEGER DEFAULT 0,
  total_earnings_pence INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE designer_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES designers(id) NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  message TEXT,
  postcode TEXT,
  budget_range TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE designer_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES designers(id) NOT NULL,
  plan_id UUID REFERENCES planting_plans(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_pence INTEGER NOT NULL,
  preview_images TEXT[], -- array of URLs
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold', 'archived')),
  purchases INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE planting_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE designers ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Users can view their own activation passes
CREATE POLICY "Users can view own passes" ON activation_passes FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own plans
CREATE POLICY "Users can view own plans" ON planting_plans FOR SELECT USING (auth.uid() = user_id);

-- Public read for designers (marketplace)
CREATE POLICY "Anyone can view active designers" ON designers FOR SELECT USING (status = 'active');

-- LEAD CAPTURE
CREATE TABLE inbound_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('pricing', 'partner', 'designer', 'affiliate', 'supplier')),
  name TEXT,
  email TEXT,
  message TEXT,
  metadata JSONB, -- store all other fields as JSON
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inbound_leads_type ON inbound_leads(type);
CREATE INDEX idx_inbound_leads_created_at ON inbound_leads(created_at DESC);
