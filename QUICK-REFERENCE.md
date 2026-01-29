# GSG Planting Plan Generator - Quick Reference

## 🚀 Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Supabase
# Run these in Supabase SQL Editor
# 1. Copy contents of supabase-schema.sql
# 2. Paste and run in SQL Editor
```

## 📂 Key File Locations

### Configuration
- `.env.local` - Environment variables (DO NOT COMMIT)
- `.env.local.example` - Template for environment variables
- `supabase-schema.sql` - Database schema
- `components.json` - shadcn/ui configuration

### Core Application
- `src/app/page.tsx` - Landing page
- `src/app/create/page.tsx` - Form page
- `src/app/api/generate-plan/route.ts` - API endpoint
- `src/components/planting-plan/PlantingPlanForm.tsx` - Main form

### Libraries & Utilities
- `src/lib/supabase.ts` - Supabase client
- `src/lib/utils.ts` - Utility functions
- `src/types/index.ts` - TypeScript types

### Documentation
- `README.md` - Project overview
- `SETUP.md` - Detailed setup instructions
- `DAY1-SUMMARY.md` - Day 1 completion summary

## 🔑 Environment Variables

Required in `.env.local`:

```env
# Supabase (from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Anthropic (from https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...
```

## 🗄️ Database Tables

1. **plants** - Plant catalog (2,000+ plants)
2. **site_analyses** - Site analysis results
3. **planting_plans** - Generated plans
4. **plant_recommendations** - Plan-plant links

## 🎨 Color Palette

```css
/* Primary Colors */
green-50:  #f0fdf4  /* Light background */
green-600: #16a34a  /* Primary green */
green-700: #15803d  /* Hover state */
green-900: #14532d  /* Dark text */

/* Neutral */
gray-600:  #4b5563  /* Body text */
white:     #ffffff  /* Cards/backgrounds */
```

## 📱 Routes

- `/` - Landing page
- `/create` - Form to create planting plan
- `/plan/[id]` - View planting plan (to be built)
- `/api/generate-plan` - API endpoint

## 🧩 shadcn/ui Components Installed

Available in `src/components/ui/`:
- Button, Card, Input, Label
- Select, Textarea, Form
- Progress, Badge, Separator, Tabs

Add more:
```bash
npx shadcn@latest add [component-name]
```

## 🔄 Workflow

### Creating a New Feature
1. Define types in `src/types/index.ts`
2. Create components in `src/components/`
3. Add API routes in `src/app/api/`
4. Update database schema if needed
5. Test and document

### Making Database Changes
1. Edit `supabase-schema.sql`
2. Run migration in Supabase SQL Editor
3. Update TypeScript types
4. Update Supabase client queries

### Adding New UI Components
```bash
# View available components
npx shadcn@latest add

# Install specific component
npx shadcn@latest add dialog
```

## 🐛 Troubleshooting

### Dev server won't start
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### TypeScript errors
```bash
npm run build  # Check for type errors
```

### Supabase connection issues
1. Verify `.env.local` values
2. Check Supabase project is running
3. Verify you're using the **anon key**, not service role key
4. Restart dev server after env changes

### Import errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📊 Project Stats

- **Tech Stack**: Next.js 14, TypeScript, Tailwind, Supabase, Claude AI
- **Dependencies**: 69 packages
- **Components**: 12 (11 UI + 1 custom form)
- **Database Tables**: 4
- **Type Definitions**: 8
- **Build Time**: ~1.5 seconds

## ⏭️ Next Steps (Day 2)

1. **Set up Supabase project**
   - Create project at supabase.com
   - Run `supabase-schema.sql`
   - Add credentials to `.env.local`

2. **Get Anthropic API key**
   - Sign up at console.anthropic.com
   - Create API key
   - Add to `.env.local`

3. **Implement vision analysis**
   - Create `src/lib/anthropic.ts`
   - Create `src/lib/vision-analysis.ts`
   - Update `/api/generate-plan/route.ts`

4. **Test image upload flow**
   - Upload images
   - Call vision API
   - Store results

## 📚 Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic API](https://docs.anthropic.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎯 Sprint Progress

- [x] **Day 1**: Project setup & foundation ✅
- [ ] **Day 2**: Vision + Analysis agents
- [ ] **Day 3**: Plant database + matching
- [ ] **Day 4**: PDF generation + output
- [ ] **Day 5**: Integration + polish

---

**Last Updated**: January 29, 2026
**Current Phase**: Day 1 Complete → Starting Day 2
