# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Click "Start your project" or "Sign In"
   - Sign up/Login with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - **Organization:** Create new or use existing
   - **Name:** `gsg-planting-plan`
   - **Database Password:** Generate a strong password and **SAVE IT**
   - **Region:** Europe West (London) - closest to UK
   - **Pricing Plan:** Free tier is fine for now
   - Click "Create new project"
   - ⏰ Wait ~2 minutes for provisioning

## Step 2: Get Your API Keys

Once your project is ready:

1. Click on **Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. You'll see two important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public key:** (under "Project API keys")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 3: Update Environment Variables

Copy these values into your `.env.local` file:

```bash
# Replace the empty values with your actual keys:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Schema

1. In Supabase Dashboard, click **SQL Editor** (in left sidebar)
2. Click **"+ New query"**
3. Copy the ENTIRE contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. Wait for "Success. No rows returned" message
7. You should now see all your tables in the **Table Editor**

## Step 5: Apply RLS Fix

Since we're setting up from scratch, let's apply the RLS fix immediately:

1. Still in **SQL Editor**, click **"+ New query"** again
2. Copy the contents of `fix-rls-policies.sql`
3. Paste and click **"Run"**
4. Wait for success message

## Step 6: Verify Setup

In Supabase Dashboard:

1. Click **Table Editor** in sidebar
2. You should see these tables:
   - ✅ plants
   - ✅ site_analyses
   - ✅ planting_plans
   - ✅ plant_recommendations
   - ✅ user_profiles
   - ✅ activation_passes
   - ✅ affiliates
   - ✅ partners
   - ✅ designers
   - ✅ shared_plan_links
   - ✅ inbound_leads

## Step 7: Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 8: Test the Form

1. Go to http://localhost:3000
2. Fill out the planting plan form
3. Upload at least one image
4. Click "Generate My Planting Plan"
5. It should work now! 🎉

## Troubleshooting

**If you get "Invalid API key" error:**
- Make sure you copied the FULL anon key (it's very long)
- Make sure there are no extra spaces
- Restart your dev server after updating .env.local

**If tables don't appear:**
- Check for errors in the SQL Editor output
- Make sure you're in the correct project
- Try running the schema SQL again

**If you still get "Failed to generate plan":**
- Check the Vercel logs: `vercel logs`
- Make sure environment variables are set in Vercel too (after local testing works)

## Next Steps After Setup

Once everything works locally:

1. **Deploy to Vercel with new env vars:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel --prod
   ```

2. **Populate the plants database** (optional, for testing):
   - Run `scripts/import-plants.sql` in SQL Editor if you have plant data

## Need Help?

If you run into issues, share:
- Which step you're on
- Any error messages you see
- Screenshots of the Supabase dashboard if helpful
