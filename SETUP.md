# GSG Planting Plan Generator - Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Get these from https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Get this from https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-your_api_key_here
```

### 3. Set Up Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to **SQL Editor** in the left sidebar
4. Copy the contents of `supabase-schema.sql`
5. Paste and run the SQL script
6. Verify tables were created in **Table Editor**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Setup Instructions

### Supabase Configuration

#### Step 1: Create Project
1. Sign up/login at [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization
4. Fill in:
   - **Name**: `gsg-planting-plan`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to UK (e.g., London, Frankfurt)
5. Click "Create new project"

#### Step 2: Get API Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Paste these into `.env.local`

#### Step 3: Set Up Database Schema
1. Click **SQL Editor** in sidebar
2. Click "New query"
3. Copy entire contents of `supabase-schema.sql`
4. Paste into the editor
5. Click "Run"
6. You should see: `Success. No rows returned`

#### Step 4: Verify Tables
1. Click **Table Editor** in sidebar
2. You should see these tables:
   - `plants`
   - `site_analyses`
   - `planting_plans`
   - `plant_recommendations`

### Anthropic API Key

#### Step 1: Get API Key
1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up/login
3. Click **API Keys** in sidebar
4. Click "Create Key"
5. Give it a name: `gsg-planting-plan-dev`
6. Copy the key (starts with `sk-ant-`)
7. Paste into `.env.local` as `ANTHROPIC_API_KEY`

**Important**: Your API key should look like:
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Testing Your Setup

#### 1. Check Environment Variables
```bash
# This should show your environment variables (without values)
npm run dev
```

Look for the line:
```
- Environments: .env.local
```

#### 2. Test Landing Page
1. Open http://localhost:3000
2. You should see the landing page with:
   - Header with "GSG Planting Plan Generator"
   - Hero section
   - Features cards
   - "Create Planting Plan" button

#### 3. Test Form Page
1. Click "Create Planting Plan" or go to http://localhost:3000/create
2. You should see:
   - Multi-step form with 3 tabs
   - Image upload interface
   - Site details form
   - Preferences form

### Troubleshooting

#### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Supabase connection issues
1. Double-check your `.env.local` file
2. Make sure the URL starts with `https://`
3. Verify the anon key is the **anon/public key**, not the service role key
4. Restart the dev server after changing env vars

#### "Invalid API key" for Anthropic
1. Make sure the key starts with `sk-ant-`
2. Verify there are no spaces or newlines
3. Check you copied the entire key
4. Restart dev server

---

## Next Steps

After setup is complete:

### Day 2: Vision + Analysis Agents
- Implement Claude Vision API integration
- Add image upload to Supabase Storage
- Build site analysis logic

### Day 3: Plant Database + Matching
- Import Wyevale Nurseries plant data (see `/Users/ianstone/Downloads/Rep-287-Web-Amenity-Stock-Availability-List-3.pdf`)
- Create plant matching algorithm
- Build recommendation engine

### Day 4: PDF Generation
- Design planting plan layout
- Implement PDF generation
- Create results page

### Day 5: Polish + Deploy
- End-to-end testing
- UX improvements
- Deploy to Vercel

---

## Development Workflow

### Making Changes
1. Edit files in `src/`
2. Hot reload will update the browser automatically
3. Check console for errors

### Adding Components
```bash
# Add a new shadcn/ui component
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add alert
```

### Database Changes
1. Edit `supabase-schema.sql`
2. Run the new SQL in Supabase SQL Editor
3. Document changes in migration comments

### Deployment Checklist
- [ ] Environment variables set in Vercel
- [ ] Database migrations run
- [ ] Plant data imported
- [ ] API keys valid
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run build`

---

## Support

For issues or questions:
1. Check this setup guide
2. Review the main `README.md`
3. Check Next.js docs: https://nextjs.org/docs
4. Check Supabase docs: https://supabase.com/docs
