# Dual-Track System Testing Checklist

## Pre-Testing: Database Migration

**CRITICAL**: Run the database migration before testing:

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Copy contents of `/supabase/migrations/add_dual_track_columns.sql`
3. Paste and execute
4. Verify columns added:
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'planting_plans'
   AND column_name IN ('is_finalized', 'source_track', 'selected_style_slug');
   ```

---

## Test 1: DIY Track (Style-First Flow)

### Test 1A: Homepage Style Gallery
- [ ] Navigate to homepage at `/`
- [ ] Verify StyleGallery displays (not ImmediatePlanCreator form)
- [ ] Verify style cards show:
  - Style images (or placeholder if no hero_image_url)
  - Style name
  - Short description
  - Difficulty badge
  - Maintenance badge
  - Best for tags
  - Estimated cost
  - "Start with this style" button
- [ ] Verify cards have hover effects
- [ ] No console errors

### Test 1B: Style Selection & Start Page
- [ ] Click "Start with this style" on any card
- [ ] Should route to `/start/[slug]` (e.g., `/start/meadow-garden`)
- [ ] Verify page shows:
  - ✓ Style Selected badge
  - "YOUR [STYLE] PLAN HAS STARTED" heading
  - Reassurance message
  - Style preview card with image and details
  - Minimal input form (4 fields only)
- [ ] No console errors

### Test 1C: Minimal Form Submission
Fill out the form:
- [ ] Garden area: Adjust slider (test: 50m²)
- [ ] UK Postcode: Enter valid postcode (test: "SW1A 1AA")
- [ ] Light conditions: Select one (test: "Mixed")
- [ ] Soil type: Select one (test: "Loam")
- [ ] Click "Create My [Style] Plan"
- [ ] Verify button shows loading state with spinner
- [ ] Verify progress bar appears
- [ ] Should poll for status updates
- [ ] Should redirect to `/plan/[id]` when complete

### Test 1D: Verify Database Records
After plan creation, check Supabase:

```sql
SELECT
  id,
  status,
  source_track,
  selected_style_slug,
  is_finalized,
  style,
  area_sqm,
  postcode
FROM planting_plans
ORDER BY created_at DESC
LIMIT 1;
```

Expected values:
- [ ] `source_track` = 'diy'
- [ ] `selected_style_slug` = the style slug you selected
- [ ] `is_finalized` = false
- [ ] `status` = 'complete' (after generation finishes)

### Test 1E: Plan View (DIY Draft)
- [ ] Verify plan displays correctly
- [ ] Check if any "draft mode" indicators show
- [ ] Verify plants are displayed
- [ ] Verify shopping list shows
- [ ] No console errors

---

## Test 2: Professional Track (Existing Detailed Flow)

### Test 2A: Access Create Page
- [ ] Navigate directly to `/create`
- [ ] Verify PlantingPlanForm displays (tabbed interface)
- [ ] Verify all tabs present:
  - Site Analysis
  - Design Preferences
  - Requirements
  - Budget & Contact
- [ ] No console errors

### Test 2B: Complete Form Submission
Fill out the detailed form:
- [ ] **Site Analysis Tab**:
  - Upload at least one image
  - Enter postcode
  - Select sun exposure
  - Select soil type
  - Enter area
  - Select moisture
- [ ] **Design Preferences Tab**:
  - Select style
  - Select maintenance level
- [ ] **Requirements Tab**:
  - Enter description (at least 20 characters)
- [ ] **Budget Tab**:
  - Enter budget range (optional)
- [ ] Click "Generate Plan"
- [ ] Should show loading state
- [ ] Should poll for status
- [ ] Should redirect to `/plan/[id]`

### Test 2C: Verify Database Records
Check Supabase:

```sql
SELECT
  id,
  status,
  source_track,
  selected_style_slug,
  is_finalized,
  style,
  area_sqm,
  postcode
FROM planting_plans
ORDER BY created_at DESC
LIMIT 1;
```

Expected values:
- [ ] `source_track` = 'professional'
- [ ] `selected_style_slug` = NULL (unless pre-selected from /styles/[slug])
- [ ] `is_finalized` = false
- [ ] `status` = 'complete' (after generation finishes)

### Test 2D: Plan View (Professional)
- [ ] Verify plan displays correctly
- [ ] Verify image analysis included (if images uploaded)
- [ ] Verify comprehensive plant recommendations
- [ ] No console errors

---

## Test 3: Style Pre-Selection (Professional Track)

### Test 3A: Navigate from Style Gallery
- [ ] Go to `/styles`
- [ ] Click on any style card
- [ ] Click "Start with this style" on detail page
- [ ] Should route to `/create` with style pre-selected
- [ ] Verify style dropdown shows correct style
- [ ] Complete form and submit
- [ ] Verify plan creation works

---

## Test 4: Integration Tests

### Test 4A: Multiple Plan Creation
- [ ] Create 2-3 plans using DIY flow
- [ ] Create 2-3 plans using Professional flow
- [ ] Verify all plans appear in user's plan list
- [ ] Verify each has correct `source_track` value

### Test 4B: Analytics Check
Run analytics query:

```sql
SELECT
  source_track,
  COUNT(*) as plan_count,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_generation_time
FROM planting_plans
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY source_track;
```

- [ ] Verify both 'diy' and 'professional' tracks show data

### Test 4C: Error Handling
- [ ] Try submitting DIY form without postcode (should show validation error)
- [ ] Try submitting Professional form without required fields (should show errors)
- [ ] Verify error messages are clear and helpful

---

## Test 5: Cross-Browser & Device Testing

### Desktop Browsers
- [ ] Chrome - DIY flow works
- [ ] Chrome - Professional flow works
- [ ] Safari - DIY flow works
- [ ] Safari - Professional flow works
- [ ] Firefox - DIY flow works
- [ ] Firefox - Professional flow works

### Mobile Browsers
- [ ] Mobile Safari - Style gallery displays correctly
- [ ] Mobile Safari - Forms are usable
- [ ] Mobile Chrome - Style gallery displays correctly
- [ ] Mobile Chrome - Forms are usable

---

## Test 6: Performance & UX

### DIY Track Performance
- [ ] Style gallery loads in < 2 seconds
- [ ] Style images load progressively
- [ ] Form submission feels instant
- [ ] Polling doesn't freeze UI
- [ ] Progress bar updates smoothly

### Professional Track Performance
- [ ] Form loads quickly
- [ ] Image upload provides feedback
- [ ] Submission with images doesn't timeout
- [ ] Polling works correctly

---

## Known Issues / Expected Behavior

### DIY Track
- **No images initially**: This is by design. DIY users start with minimal input and can add images later during refinement.
- **Draft indicator**: Plans created via DIY flow should be marked as drafts (is_finalized = false)
- **Style locked**: Once selected, the style is locked to the plan

### Professional Track
- **Image required OR description**: At least one must be provided
- **Credit system**: If authenticated, credits should be consumed
- **More comprehensive**: Should generate more detailed recommendations

---

## Success Criteria

All tests pass with:
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No 404s or broken links
- [ ] Both tracks create valid plans
- [ ] Database records correctly populated
- [ ] Plans display correctly
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Error handling works

---

## Rollback Plan

If critical issues found:
1. Revert homepage changes: restore ImmediatePlanCreator
2. Disable `/start/[slug]` route
3. Keep `/create` as primary entry point
4. Database columns are safe to keep (backward compatible)

---

## Post-Testing: Monitor

After deployment, monitor:
- Conversion rate: DIY vs Professional
- Completion rate: Both tracks
- Error rate: API logs
- User feedback: Support tickets
- Analytics: Which styles are most popular

Track metrics:
```sql
-- Daily track comparison
SELECT
  DATE(created_at) as date,
  source_track,
  COUNT(*) as plans_created,
  COUNT(CASE WHEN status = 'complete' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'error' THEN 1 END) as errors
FROM planting_plans
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), source_track
ORDER BY date DESC, source_track;
```
