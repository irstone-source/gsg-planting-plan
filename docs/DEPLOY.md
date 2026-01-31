# PlantingPlans - Vercel Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables (Required)

Set these in Vercel Project Settings → Environment Variables:

```bash
# Anthropic API (Required for plan generation)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (Required for auth and data storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# App URL (Set to your Vercel domain)
NEXT_PUBLIC_APP_URL=https://plantingplans.vercel.app

# Optional: Email notifications via Resend
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@plantingplans.co.uk

# Optional: Stripe (for payments - not required for MVP)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Cron job authentication
CRON_SECRET=your-random-secret-here
```

### 2. Supabase Setup

Run the schema file to set up required tables:

```sql
-- See /supabase-schema.sql for full schema
-- Minimum required tables:
-- - inbound_leads (for lead capture)
-- - user_profiles (for auth)
-- - activation_passes (for paid features)
-- - planting_plans (for storing generated plans)
```

Enable Row Level Security (RLS) policies as defined in the schema.

### 3. Build Verification

Before deploying, verify the build passes locally:

```bash
npm run build
```

Expected output:
- ✓ Compiled successfully
- ✓ Generating static pages (45+)
- No TypeScript errors

### 4. Route Testing

Test these critical routes work:

#### Public Pages (Should Load)
- `/` - Homepage
- `/examples/hub` - Example plans hub
- `/pricing` - Pricing page
- `/designers` - For designers page
- `/partners` - For partners page
- `/affiliate` - Affiliate program page
- `/create` - Plan generator

#### API Endpoints (Should Return 200 or Expected Response)
- `/api/leads` - Lead capture (POST)
- `/api/generate-plan` - Plan generation (POST, requires auth)
- `/api/generate-plant-images` - Plant images (POST)

#### Error Pages (Should Load)
- `/nonexistent-page` - Should show custom 404

## Vercel Deployment Steps

### 1. Connect Repository

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select "gsg-planting-plan" folder

### 2. Configure Build Settings

Vercel should auto-detect Next.js. Verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

### 3. Add Environment Variables

Go to Project Settings → Environment Variables and add all required env vars from the checklist above.

### 4. Deploy

Click "Deploy" and wait for build to complete (~2-3 minutes).

## Post-Deployment Verification

### 1. Smoke Test Critical Paths

Visit these URLs on your deployed site:

- [ ] Homepage loads with hero image and CTAs
- [ ] /examples/hub shows example plans
- [ ] /pricing shows pricing cards and lead form
- [ ] /create page loads (may require login)
- [ ] Lead form submission works (check Supabase `inbound_leads` table)

### 2. Check Console Logs

Open browser DevTools → Console. Should see no errors except:

- Optional: "Supabase client created" (info log)
- Optional: Anthropic API key warnings (only affects plan generation)

### 3. Test Lead Capture

1. Go to /pricing
2. Fill out "Join Early Access" form
3. Submit
4. Verify:
   - Success message appears
   - Lead appears in Supabase `inbound_leads` table
   - (Optional) Notification email sent via Resend

### 4. Test 404 Handling

Visit `/nonexistent-page`. Should see:
- Custom PlantingPlans 404 page
- "RETURN HOME" and "VIEW EXAMPLES" buttons
- Quick links to other pages

## Common Issues

### Build Fails with "Module not found"

**Solution**: Ensure all dependencies are in `package.json`:
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variable Not Working

**Solution**:
1. Check spelling matches exactly (case-sensitive)
2. Redeploy after adding new env vars
3. For `NEXT_PUBLIC_*` vars, rebuild is required

### Supabase RLS Blocking Requests

**Solution**: Check RLS policies in Supabase dashboard:
```sql
-- Example: Allow public reads of example plans
CREATE POLICY "Allow public read of published plans"
  ON planting_plans FOR SELECT
  USING (status = 'published');
```

### 404s for Dynamic Routes

**Solution**: Ensure `generateStaticParams()` is defined in dynamic route pages or set to dynamic rendering:

```typescript
// In app/examples/[slug]/page.tsx
export const dynamic = 'force-dynamic';
```

## Monitoring

### 1. Vercel Analytics

Enable in Project Settings → Analytics for:
- Page views
- Web Vitals (Core performance metrics)
- Error tracking

### 2. Supabase Logs

Monitor in Supabase Dashboard → Logs:
- Database queries
- Auth events
- API usage

### 3. Custom Monitoring (Optional)

Add PostHog or similar:
```bash
npm install posthog-js
```

Track key events:
- Plan generation starts
- Lead form submissions
- Affiliate clicks
- Purchase completions

## Rolling Back

If issues occur after deployment:

1. Go to Vercel Project → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

## Support

For deployment issues:
- Check Vercel deployment logs
- Review Supabase error logs
- Verify all env vars are set correctly

For code issues:
- Run `npm run build` locally
- Check browser console for errors
- Review API response status codes
