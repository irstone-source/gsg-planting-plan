-- Fix RLS policies for planting_plans to allow inserts
-- This allows both authenticated and unauthenticated plan creation

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can view own plans" ON planting_plans;
DROP POLICY IF EXISTS "Users can insert own plans" ON planting_plans;
DROP POLICY IF EXISTS "Anyone can insert plans" ON planting_plans;

-- Allow authenticated users to view their own plans
CREATE POLICY "Users can view own plans"
ON planting_plans
FOR SELECT
USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own plans
CREATE POLICY "Authenticated users can insert plans"
ON planting_plans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow unauthenticated users to insert plans (for immediate free trials)
-- These plans will have user_id = NULL
CREATE POLICY "Anyone can insert plans without user_id"
ON planting_plans
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Allow anyone to view plans without a user_id (public/demo plans)
CREATE POLICY "Anyone can view plans without user_id"
ON planting_plans
FOR SELECT
USING (user_id IS NULL);

-- Similarly, fix site_analyses table if it has RLS enabled
-- Check if RLS is enabled and add insert policies
DO $$
BEGIN
  -- Enable RLS if not already enabled
  ALTER TABLE site_analyses ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can insert site analyses" ON site_analyses;
  DROP POLICY IF EXISTS "Anyone can view site analyses" ON site_analyses;

  -- Allow anyone to insert site analyses (needed for plan generation)
  CREATE POLICY "Anyone can insert site analyses"
  ON site_analyses
  FOR INSERT
  WITH CHECK (true);

  -- Allow anyone to view site analyses (needed for plan display)
  CREATE POLICY "Anyone can view site analyses"
  ON site_analyses
  FOR SELECT
  USING (true);
END $$;

-- Similarly for plant_recommendations
DO $$
BEGIN
  ALTER TABLE plant_recommendations ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Anyone can insert recommendations" ON plant_recommendations;
  DROP POLICY IF EXISTS "Anyone can view recommendations" ON plant_recommendations;

  CREATE POLICY "Anyone can insert recommendations"
  ON plant_recommendations
  FOR INSERT
  WITH CHECK (true);

  CREATE POLICY "Anyone can view recommendations"
  ON plant_recommendations
  FOR SELECT
  USING (true);
END $$;
