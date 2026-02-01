# Fix Database RLS Policies

## Problem
The `planting_plans` table has Row Level Security (RLS) enabled but no INSERT policy, which blocks all plan creation attempts.

## Solution
Run the SQL migration in your Supabase dashboard to add the missing INSERT policies.

## Steps

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `gsg-planting-plan`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste this SQL:**

```sql
-- Fix RLS policies for planting_plans to allow inserts

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can view own plans" ON planting_plans;
DROP POLICY IF EXISTS "Authenticated users can insert plans" ON planting_plans;
DROP POLICY IF EXISTS "Anyone can insert plans without user_id" ON planting_plans;
DROP POLICY IF EXISTS "Anyone can view plans without user_id" ON planting_plans;

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
CREATE POLICY "Anyone can insert plans without user_id"
ON planting_plans
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Allow anyone to view plans without a user_id (public/demo plans)
CREATE POLICY "Anyone can view plans without user_id"
ON planting_plans
FOR SELECT
USING (user_id IS NULL);

-- Fix site_analyses table
ALTER TABLE site_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert site analyses" ON site_analyses;
DROP POLICY IF EXISTS "Anyone can view site analyses" ON site_analyses;

CREATE POLICY "Anyone can insert site analyses"
ON site_analyses
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view site analyses"
ON site_analyses
FOR SELECT
USING (true);

-- Fix plant_recommendations table
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
```

4. **Run the query**
   - Click the "Run" button (or press Cmd+Enter)
   - Wait for "Success" message

5. **Test the fix**
   - Go back to your website: https://gsg-planting-plan-aqifxkdqi-ians-projects-4358fa58.vercel.app
   - Fill out the form
   - Click "Generate My Planting Plan"
   - It should work now!

## What This Does

- **Allows authenticated users** to create and view their own plans
- **Allows unauthenticated users** to create plans for free trials (user_id = NULL)
- **Allows anyone** to view plans without a user_id (public demo plans)
- **Fixes site_analyses** and **plant_recommendations** tables to allow inserts

## After Running

The error "Failed to generate planting plan" should be fixed and users can now create plans without signing up.
