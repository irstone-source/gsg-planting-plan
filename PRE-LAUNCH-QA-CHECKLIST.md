# Pre-Launch QA Checklist
**Generated:** 2026-02-01
**Purpose:** Comprehensive quality assurance before production deployment

---

## ✅ TypeScript & Build

- [x] All TypeScript errors resolved (`npx tsc --noEmit`)
- [ ] Production build successful (`npm run build`)
- [ ] No console errors in development mode
- [ ] No console errors in production build

---

## 🌿 Week 1: Plant Symbol Rendering System

### API Endpoints
- [ ] **POST /api/plant/render**
  - [ ] Accepts valid PlantSymbolData
  - [ ] Returns SVG successfully
  - [ ] Handles invalid data gracefully
  - [ ] Style parameter works (scientific, watercolor, marker, hand-drawn)
  - [ ] Season parameter works (spring, summer, autumn, winter)
  - [ ] Scale parameter works (1:10, 1:20, 1:50, 1:100, 1:200)
  - [ ] Seed parameter produces deterministic results
  - [ ] Response includes proper metadata

### UI Components
- [ ] **Plant Library Page** (`/examples/plant-library`)
  - [ ] Page loads without errors
  - [ ] Plant search works
  - [ ] Style selector changes rendering
  - [ ] Season selector changes colors
  - [ ] Scale selector updates dimensions
  - [ ] Download SVG button works
  - [ ] Export as PNG button works
  - [ ] Preview renders correctly

- [ ] **Plant Library Symbols Page** (`/examples/plant-library-symbols`)
  - [ ] Grid of plant symbols renders
  - [ ] All plants display correctly
  - [ ] Interactive controls work
  - [ ] Filtering works

### Symbol Pack Export
- [ ] **Download functionality**
  - [ ] ZIP file downloads successfully
  - [ ] Contains all requested plants
  - [ ] SVG files are valid
  - [ ] Metadata.json is accurate
  - [ ] Files are properly named

---

## 📸 Week 2: Evidence Upload & Admin Review

### Evidence Upload
- [ ] **POST /api/plant/evidence/upload**
  - [ ] Requires authentication
  - [ ] Accepts valid image files (JPG, PNG, WebP)
  - [ ] Rejects invalid file types
  - [ ] Uploads to Supabase Storage successfully
  - [ ] Creates plant_evidence record
  - [ ] Sends admin notification email
  - [ ] Returns public URL

### Admin Review Queue
- [ ] **Admin Review Page** (`/admin/plant-review`)
  - [ ] Requires admin authentication
  - [ ] Lists pending evidence submissions
  - [ ] Displays evidence details correctly
  - [ ] Image preview works
  - [ ] Botanical name is accurate
  - [ ] Evidence type is clear

- [ ] **Evidence Actions**
  - [ ] Verify button works
  - [ ] Reject button works
  - [ ] Status updates immediately
  - [ ] Sends user notification email
  - [ ] "Run Verification APIs" button triggers verification
  - [ ] Loading states display correctly

### Database & RLS
- [ ] **plant_evidence table**
  - [ ] RLS policies work correctly
  - [ ] Users can only see their own evidence
  - [ ] Admins can see all evidence
  - [ ] Status transitions work (pending → verified/rejected)
  - [ ] Timestamps update correctly

---

## 🔬 Week 3: Verification APIs & Preset Regeneration

### iNaturalist Integration
- [ ] **iNaturalist CV API**
  - [ ] Accepts image URLs
  - [ ] Returns species candidates with confidence scores
  - [ ] Handles API errors gracefully
  - [ ] Respects rate limits
  - [ ] Logs results to verification_runs table

### GBIF Integration
- [ ] **GBIF Backbone API**
  - [ ] Validates botanical names
  - [ ] Returns accepted names for synonyms
  - [ ] Provides confidence scores
  - [ ] Handles API errors gracefully
  - [ ] Logs results to verification_runs table

### Verification Orchestration
- [ ] **POST /api/plant/verify**
  - [ ] Runs both APIs in parallel
  - [ ] Aggregates confidence scores correctly (average)
  - [ ] Creates plant_preset_suggestions when ≥60% confidence
  - [ ] Auto-approves suggestions when ≥80% confidence
  - [ ] Handles name mismatches correctly
  - [ ] Returns comprehensive results
  - [ ] Error handling works

### Preset Regeneration
- [ ] **POST /api/admin/plant-presets/regenerate**
  - [ ] Requires admin authentication
  - [ ] Fetches approved suggestions
  - [ ] Reads presets.ts correctly
  - [ ] Finds and replaces preset entries
  - [ ] Dry-run mode works (preview without saving)
  - [ ] Actual update writes to file correctly
  - [ ] Maintains TypeScript formatting
  - [ ] Returns success/failure status

### Email Notifications
- [ ] **Evidence workflow emails**
  - [ ] Upload confirmation sent to user
  - [ ] Admin notification sent for new uploads
  - [ ] Verification email sent to uploader
  - [ ] Rejection email sent with reason
  - [ ] Emails contain relevant details
  - [ ] Links work correctly
  - [ ] Async sending doesn't block main flow

---

## 🎨 Scientific Visualization & Data Aggregation

### Plant Data APIs
- [ ] **POST /api/generate-scientific-plant-viz**
  - [ ] Fetches plant data from multiple sources
  - [ ] Generates parametric SVG visualizations
  - [ ] Handles missing data gracefully
  - [ ] Updates database with generated URLs
  - [ ] Returns progress and results
  - [ ] Respects rate limits

- [ ] **POST /api/generate-plant-images**
  - [ ] Generates front-view and top-down images
  - [ ] Uses DALL-E API correctly
  - [ ] Removes backgrounds successfully
  - [ ] Uploads to Supabase Storage
  - [ ] Updates plant records
  - [ ] Handles API errors

- [ ] **POST /api/fetch-crocus-data**
  - [ ] Scrapes Crocus.co.uk successfully
  - [ ] Updates plant records with retail data
  - [ ] Handles missing products
  - [ ] Respects rate limits
  - [ ] Skips recently fetched data

### Scientific Viz Page
- [ ] **Scientific Viz Examples** (`/examples/scientific-viz`)
  - [ ] Page loads successfully
  - [ ] Displays plant data correctly
  - [ ] Shows Crocus retail information
  - [ ] Images render properly
  - [ ] Links to Crocus work
  - [ ] Prices format correctly

---

## 🎨 Artistic Rendering & Filters

### Rendering Engines
- [ ] **Watercolor rendering**
  - [ ] Gradients render correctly
  - [ ] Texture layers apply
  - [ ] SVG filters work
  - [ ] Colors match season palettes

- [ ] **Marker rendering**
  - [ ] Bold outlines render
  - [ ] Marker-style fills work
  - [ ] Colors are vibrant

- [ ] **Hand-drawn rendering**
  - [ ] Sketchy lines render
  - [ ] Organic feel maintained
  - [ ] Randomness is seeded

### Seasonal Colors
- [ ] **Spring palette**
  - [ ] Light greens and pastels
  - [ ] Fresh colors

- [ ] **Summer palette**
  - [ ] Rich, saturated greens
  - [ ] Vibrant tones

- [ ] **Autumn palette**
  - [ ] Warm reds, oranges, yellows
  - [ ] Seasonal transitions

- [ ] **Winter palette**
  - [ ] Muted tones
  - [ ] Winter interest features (bark, berries) apply correctly

---

## 🗃️ Database & Data Integrity

### Supabase Connection
- [ ] Connection successful
- [ ] Environment variables set correctly
- [ ] Service role key works for admin operations
- [ ] Anon key works for client operations

### Tables
- [ ] **plants** - populated with test data
- [ ] **plant_evidence** - accepts uploads
- [ ] **verification_runs** - logs API calls
- [ ] **plant_preset_suggestions** - creates suggestions
- [ ] **planting_plans** - test plans exist
- [ ] **plant_recommendations** - linked correctly

### RLS Policies
- [ ] Users can only access their own data
- [ ] Admins can access all data
- [ ] Public reads work where intended
- [ ] Unauthenticated requests blocked appropriately

---

## 🔒 Authentication & Authorization

### Supabase Auth
- [ ] Magic link login works
- [ ] Email verification works
- [ ] Session persistence works
- [ ] Logout works
- [ ] Protected routes redirect to login

### Role-Based Access
- [ ] Admin role can access /admin/* routes
- [ ] Non-admin users blocked from admin pages
- [ ] User role can upload evidence
- [ ] Unauthenticated users see public pages only

---

## 📧 Email System (Resend)

### Configuration
- [ ] RESEND_API_KEY environment variable set
- [ ] From address verified in Resend dashboard
- [ ] Email domain configured

### Email Templates
- [ ] Evidence uploaded notification (admin)
- [ ] Evidence verified notification (user)
- [ ] Evidence rejected notification (user)
- [ ] Suggestion approved notification (admin)
- [ ] All emails include relevant links
- [ ] All emails formatted correctly

---

## 🎨 UI/UX & Accessibility

### General
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Responsive design works on mobile
- [ ] Responsive design works on tablet
- [ ] Responsive design works on desktop
- [ ] Loading states display for async operations
- [ ] Error messages are clear and actionable

### Accessibility
- [ ] Semantic HTML used throughout
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader compatibility tested

### Performance
- [ ] Page load times < 3s
- [ ] SVG rendering performant
- [ ] Image optimization working
- [ ] No memory leaks
- [ ] Bundle size acceptable

---

## 🧪 Cross-Browser Testing

- [ ] **Chrome** (latest)
  - [ ] All features work
  - [ ] No console errors

- [ ] **Firefox** (latest)
  - [ ] All features work
  - [ ] No console errors

- [ ] **Safari** (latest)
  - [ ] All features work
  - [ ] No console errors

- [ ] **Edge** (latest)
  - [ ] All features work
  - [ ] No console errors

---

## 🚀 Deployment Readiness

### Environment Variables
- [ ] All required env vars documented
- [ ] Production values set in Vercel dashboard
- [ ] API keys valid and not expired
- [ ] Secrets rotated from development

### Build
- [ ] `npm run build` succeeds
- [ ] No build warnings
- [ ] Production optimizations enabled
- [ ] Source maps configured

### Monitoring
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] API rate limit monitoring set up

---

## 📝 Documentation

- [ ] README.md updated
- [ ] API documentation complete
- [ ] Environment setup guide written
- [ ] Deployment guide written
- [ ] Admin user guide created
- [ ] User guide created

---

## 🎯 Critical User Journeys

### Journey 1: User uploads evidence
1. [ ] User logs in
2. [ ] Navigates to upload page
3. [ ] Selects evidence type
4. [ ] Uploads image
5. [ ] Receives confirmation
6. [ ] Admin receives notification
7. [ ] Admin reviews and verifies
8. [ ] User receives verification email
9. [ ] Evidence marked as verified

### Journey 2: Admin triggers verification APIs
1. [ ] Admin logs in
2. [ ] Views review queue
3. [ ] Selects pending evidence
4. [ ] Clicks "Run Verification APIs"
5. [ ] iNaturalist and GBIF APIs execute
6. [ ] Confidence scores aggregated
7. [ ] Suggestion created if ≥60% confidence
8. [ ] Auto-approved if ≥80% confidence
9. [ ] Results displayed to admin

### Journey 3: Admin regenerates presets
1. [ ] Admin navigates to preset management
2. [ ] Views approved suggestions
3. [ ] Selects suggestions to apply
4. [ ] Runs dry-run to preview changes
5. [ ] Reviews preview
6. [ ] Applies changes to presets.ts
7. [ ] Verifies file updated correctly
8. [ ] Tests regenerated presets in UI

### Journey 4: User generates plant symbols
1. [ ] User navigates to plant library
2. [ ] Searches for plant species
3. [ ] Selects rendering style
4. [ ] Chooses season
5. [ ] Sets scale
6. [ ] Previews symbol
7. [ ] Downloads SVG
8. [ ] Opens in design software (AutoCAD, Illustrator)
9. [ ] Symbol scales correctly

---

## 🔥 Stress Testing

- [ ] 100 concurrent API requests handled
- [ ] Bulk evidence upload (50+ files)
- [ ] Large SVG generation (50+ plants)
- [ ] Database under load performs well
- [ ] File storage limits not exceeded

---

## ⚠️ Error Scenarios

### API Failures
- [ ] iNaturalist API timeout handled
- [ ] GBIF API rate limit handled
- [ ] OpenAI API error handled
- [ ] Supabase outage handled gracefully

### User Errors
- [ ] Invalid file type upload rejected
- [ ] Missing required fields caught
- [ ] Unauthorized access blocked
- [ ] Invalid botanical name handled

### System Errors
- [ ] Out of disk space handled
- [ ] Database connection failure handled
- [ ] Email send failure doesn't break flow
- [ ] Network errors display user-friendly messages

---

## 📊 Analytics & Metrics

- [ ] Page views tracked
- [ ] User signups tracked
- [ ] Evidence uploads tracked
- [ ] API usage monitored
- [ ] Error rates monitored
- [ ] Performance metrics collected

---

## 🎓 Final Checks

- [ ] All TODO comments resolved
- [ ] Debug logging removed from production
- [ ] Sensitive data not exposed in client
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] SSL certificate valid
- [ ] Domain configured correctly
- [ ] Backup strategy in place
- [ ] Rollback plan documented

---

## Sign-Off

**QA Completed By:** __________________
**Date:** __________________
**Ready for Production:** [ ] YES [ ] NO
**Notes:**
_______________________________________
_______________________________________
_______________________________________
