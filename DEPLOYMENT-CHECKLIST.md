# 🚀 PlantingPlans - Deployment Checklist

## ✅ Pre-Deployment Complete

- [x] All marketing pages rebuilt with architectural design
- [x] Build passes (45+ static pages, 0 TypeScript errors)
- [x] All navigation links verified
- [x] Error pages implemented (404, error, global-error)
- [x] Lead capture forms integrated
- [x] All changes committed to Git (6 commits)

## 📋 Deployment Steps

### Step 1: Create GitHub Repository

```bash
# Option A: Create via GitHub CLI (if installed)
gh repo create gsg-planting-plan --public --source=. --remote=origin

# Option B: Create manually on GitHub.com
# 1. Go to https://github.com/new
# 2. Name: gsg-planting-plan (or your preferred name)
# 3. Public or Private (your choice)
# 4. DO NOT initialize with README (we have one)
# 5. Click "Create repository"

# Then connect locally:
git remote add origin https://github.com/YOUR_USERNAME/gsg-planting-plan.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**:
   - Click "Add New" → "Project"
   - Select your GitHub account
   - Find "gsg-planting-plan" repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```bash
   # REQUIRED - Plan Generation
   ANTHROPIC_API_KEY=sk-ant-your-key-here

   # REQUIRED - Database & Auth
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key

   # REQUIRED - App URL (use your Vercel domain)
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

   # OPTIONAL - Email Notifications
   RESEND_API_KEY=re_your_key_here
   ADMIN_EMAIL=admin@plantingplans.co.uk

   # OPTIONAL - Payments (not needed for MVP)
   # STRIPE_SECRET_KEY=sk_test_...
   # NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   # STRIPE_WEBHOOK_SECRET=whsec_...

   # OPTIONAL - Cron Jobs
   # CRON_SECRET=your-random-secret
   ```

5. **Deploy**: Click "Deploy"
   - First deployment takes ~2-3 minutes
   - Vercel will show real-time build logs

### Step 3: Post-Deployment Verification

Once deployed, test these critical routes:

```bash
# Replace with your actual Vercel URL
export APP_URL="https://your-app.vercel.app"

# Test critical pages
curl -I $APP_URL                    # Homepage (200)
curl -I $APP_URL/pricing            # Pricing (200)
curl -I $APP_URL/designers          # Designers (200)
curl -I $APP_URL/partners           # Partners (200)
curl -I $APP_URL/affiliate          # Affiliate (200)
curl -I $APP_URL/examples/hub       # Examples (200)
curl -I $APP_URL/nonexistent-page   # 404 page (404)
```

**Manual Browser Tests:**
1. ✅ Homepage loads with hero image and animations
2. ✅ Pricing page shows 3 access tiers
3. ✅ Lead form on /pricing submits successfully
4. ✅ Navigation works (all links clickable)
5. ✅ Mobile responsive (test on phone)
6. ✅ No console errors (open DevTools)
7. ✅ Custom 404 page shows on invalid routes

### Step 4: Verify Lead Capture

Test the lead capture flow:

1. Go to: `https://your-app.vercel.app/pricing`
2. Scroll to "Join Early Access" form
3. Fill out:
   - Name: Test User
   - Email: test@example.com
   - Message: Testing lead capture
4. Submit form
5. Should see: "REQUEST RECEIVED" success message

**Check Supabase:**
1. Go to Supabase Dashboard → Table Editor
2. Open `inbound_leads` table
3. Verify new row exists with your test data

**If Email Configured:**
- Check `ADMIN_EMAIL` inbox for notification

### Step 5: Custom Domain (Optional)

If you have a custom domain:

1. **Vercel Dashboard** → Your Project → "Settings" → "Domains"
2. Add your domain: `plantingplans.co.uk`
3. Follow Vercel's DNS instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Redeploy to apply changes

## 🔧 Troubleshooting

### Build Fails on Vercel

**Issue**: Missing environment variables
```
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Fix**: Add all required env vars in Vercel settings, then redeploy

---

**Issue**: Out of memory during build
```
JavaScript heap out of memory
```

**Fix**: Increase build memory in Vercel settings:
- Go to Settings → Functions
- Set Memory: 1024 MB

### Lead Capture Not Working

**Issue**: Form submits but no data in Supabase

**Check**:
1. Verify Supabase URL and Anon Key are correct
2. Check RLS policies allow inserts to `inbound_leads`
3. Check Vercel logs: Functions → `/api/leads` → View logs

**Fix**:
```sql
-- Allow anonymous inserts to inbound_leads
CREATE POLICY "Allow public insert" ON inbound_leads
  FOR INSERT WITH CHECK (true);
```

### API Routes Return 500

**Issue**: Anthropic API calls fail
```
Error: Invalid API key
```

**Fix**:
1. Verify `ANTHROPIC_API_KEY` is set correctly
2. Check API key is valid and has credits
3. Restart deployment after fixing

### Middleware Warning

You'll see this warning (safe to ignore):
```
⚠ The "middleware" file convention is deprecated.
Use "proxy" instead.
```

This is for affiliate tracking. Works fine, will update in future version.

## 📊 Monitor After Deployment

**Vercel Analytics** (Free):
- Settings → Analytics → Enable
- View: Page views, Web Vitals, geographic distribution

**Supabase Logs**:
- Supabase Dashboard → Logs
- Monitor: API requests, auth events, database queries

**Error Tracking**:
- Check Vercel Functions logs regularly
- Set up alerts for 5xx errors

## 🎯 Success Criteria

- [ ] App accessible at Vercel URL
- [ ] Homepage loads in <2 seconds
- [ ] All 5 marketing pages work
- [ ] Lead form submits successfully
- [ ] Data appears in Supabase
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Custom 404 page works

## 🚀 Next Steps After Deployment

1. **Set up custom domain** (if you have one)
2. **Configure Resend** for email notifications
3. **Test plan generation** with real Anthropic API key
4. **Share URL** with stakeholders for feedback
5. **Monitor** Vercel Analytics and Supabase logs
6. **Launch** affiliate program with founding creators
7. **Activate** partner redemption codes

## 📞 Support

**Deployment Issues:**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

**Code Issues:**
- Check: docs/DEPLOY.md
- Review: README.md
- GitHub Issues (if repo is public)

---

**Deployed by:** Claude Sonnet 4.5
**Date:** 2026-01-31
**Version:** Architectural Rebrand MVP
