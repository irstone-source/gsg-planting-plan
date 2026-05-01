-- Fix RLS policies for planting_plans, site_analyses, plant_recommendations
-- Principle: users see only their own data; server-side operations use service role to bypass RLS

-- ========================================
-- planting_plans
-- ========================================
ALTER TABLE planting_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own plans" ON planting_plans;
DROP POLICY IF EXISTS "Users can insert own plans" ON planting_plans;
DROP POLICY IF EXISTS "Anyone can insert plans" ON planting_plans;
DROP POLICY IF EXISTS "Authenticated users can insert plans" ON planting_plans;
DROP POLICY IF EXISTS "Anyone can insert plans without user_id" ON planting_plans;
DROP POLICY IF EXISTS "Anyone can view plans without user_id" ON planting_plans;
DROP POLICY IF EXISTS "Users can update own plans" ON planting_plans;
DROP POLICY IF EXISTS "Users can delete own plans" ON planting_plans;

-- Authenticated users can view their own plans
CREATE POLICY "Users can view own plans"
ON planting_plans FOR SELECT
USING (auth.uid() = user_id);

-- Authenticated users can insert plans assigned to themselves
CREATE POLICY "Users can insert own plans"
ON planting_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own plans
CREATE POLICY "Users can update own plans"
ON planting_plans FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own plans
CREATE POLICY "Users can delete own plans"
ON planting_plans FOR DELETE
USING (auth.uid() = user_id);

-- ========================================
-- site_analyses
-- Linked to plans via planting_plans.site_analysis_id
-- Server routes use service role for inserts; clients read via plan ownership
-- ========================================
ALTER TABLE site_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert site analyses" ON site_analyses;
DROP POLICY IF EXISTS "Anyone can view site analyses" ON site_analyses;
DROP POLICY IF EXISTS "Users can view own site analyses" ON site_analyses;

-- Users can view site analyses linked to their own plans
CREATE POLICY "Users can view own site analyses"
ON site_analyses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM planting_plans
    WHERE planting_plans.site_analysis_id = site_analyses.id
      AND planting_plans.user_id = auth.uid()
  )
);

-- No direct client INSERT/UPDATE/DELETE — server routes use service role key

-- ========================================
-- plant_recommendations
-- Linked to plans via plan_id column
-- ========================================
ALTER TABLE plant_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert recommendations" ON plant_recommendations;
DROP POLICY IF EXISTS "Anyone can view recommendations" ON plant_recommendations;
DROP POLICY IF EXISTS "Users can view own recommendations" ON plant_recommendations;

-- Users can view recommendations for their own plans
CREATE POLICY "Users can view own recommendations"
ON plant_recommendations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM planting_plans
    WHERE planting_plans.id = plant_recommendations.plan_id
      AND planting_plans.user_id = auth.uid()
  )
);

-- No direct client INSERT/UPDATE/DELETE — server routes use service role key
