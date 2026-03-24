-- Planting Tool Plans table
-- Stores saved planting plans for authenticated users

CREATE TABLE IF NOT EXISTS planting_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Plan',
  drawing_number TEXT DEFAULT 'GSG-SP-001',
  data JSONB NOT NULL, -- full plan state (plants, placed, settings)
  thumbnail TEXT, -- base64 data URL of canvas thumbnail
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_planting_plans_user_id ON planting_plans(user_id);

-- RLS policies
ALTER TABLE planting_plans ENABLE ROW LEVEL SECURITY;

-- Users can only see their own plans
CREATE POLICY "Users can view own plans"
  ON planting_plans FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own plans
CREATE POLICY "Users can create own plans"
  ON planting_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own plans
CREATE POLICY "Users can update own plans"
  ON planting_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own plans
CREATE POLICY "Users can delete own plans"
  ON planting_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_planting_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_planting_plans_timestamp
  BEFORE UPDATE ON planting_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_planting_plans_updated_at();
