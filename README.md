# PlantingPlans - Architectural Vision for UK Gardens

**Designer results. DIY planting.**

AI-powered planting plan generator for UK gardens. Precision planting plans built around your light, soil, and lifestyle - so what you plant thrives and the design looks intentional from day one.

## ✨ Current Status

### ✅ Core Features (Live)
- [x] Architectural design system (Aman-inspired aesthetic)
- [x] Homepage with examples and CTAs
- [x] Multi-step plan generator with AI
- [x] Claude Vision API for site analysis
- [x] Plant database with AI matching
- [x] Lead capture forms
- [x] Example plans gallery
- [x] Professional tools hub
- [x] Marketing pages (pricing, designers, partners, affiliate)
- [x] Error handling (custom 404, error boundaries)

### 🚧 In Progress
- [ ] Stripe payment integration (prepared but not live)
- [ ] User dashboard with vault feature
- [ ] Designer marketplace
- [ ] Partner redemption system
- [ ] Affiliate program tracking

### 🎯 Next Priorities
- [ ] Complete architectural rebrand of all pages
- [ ] QA testing and deployment to Vercel
- [ ] Launch MVP with lead capture
- [ ] Activate affiliate program

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **UI**: Tailwind CSS 4 + Framer Motion
- **Design System**: Architectural (Space Grotesk, Manrope, JetBrains Mono)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Magic Links)
- **AI**: Claude Sonnet 4.5 (Anthropic)
- **Payments**: Stripe (prepared)
- **Email**: Resend (prepared)
- **Deployment**: Vercel

## 📁 Project Structure

```
gsg-planting-plan/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── create/
│   │   │   └── page.tsx          # Form page
│   │   ├── plan/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Results page
│   │   └── api/
│   │       └── generate-plan/
│   │           └── route.ts      # API endpoint
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   └── planting-plan/
│   │       └── PlantingPlanForm.tsx
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── utils.ts             # Utilities
│   └── types/
│       └── index.ts              # TypeScript types
├── supabase-schema.sql          # Database schema
└── .env.local                   # Environment variables
```

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Anthropic API key (Claude Sonnet 4.5)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (create `.env.local`):
   ```bash
   # Required for plan generation
   ANTHROPIC_API_KEY=sk-ant-...

   # Required for database and auth
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

   # Required for app URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Optional: Email notifications (Resend)
   RESEND_API_KEY=re_...
   ADMIN_EMAIL=admin@plantingplans.co.uk

   # Optional: Payments (Stripe - not required for MVP)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Optional: Cron jobs
   CRON_SECRET=your-random-secret
   ```
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `ANTHROPIC_API_KEY`: Your Claude API key

3. **Set up Supabase database**:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the SQL from `supabase-schema.sql`
   - Minimum required tables: `inbound_leads`, `user_profiles`, `planting_plans`

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Build and test** (before deploying):
   ```bash
   npm run build           # Verify build passes
   npm run check-links     # Check for broken internal links
   npm run deploy-check    # Run all pre-deployment checks
   ```

## 🗄️ Database Schema

### Tables

- **plants**: Plant catalog with stock availability
  - Botanical/common names
  - Category (bamboo, climber, shrub, etc.)
  - Growing conditions (sun, soil, moisture)
  - Hardiness zones
  - Stock quantities

- **site_analyses**: Site analysis results
  - Location (postcode, RHS zone)
  - Conditions (sun, soil, moisture, area)
  - Vision analysis data
  - Image URLs

- **planting_plans**: Generated plans
  - Site analysis reference
  - User preferences (style, budget, maintenance)
  - Status and total cost
  - AI-generated content

- **plant_recommendations**: Plan-plant relationships
  - Quantity and positioning
  - Rationale
  - Cost snapshot

## 🚀 Deployment

This app is designed to deploy to Vercel. See **[docs/DEPLOY.md](docs/DEPLOY.md)** for:

- Complete environment variable checklist
- Supabase setup instructions
- Pre-deployment verification steps
- Post-deployment smoke tests
- Common issues and solutions

### Quick Deploy

1. **Push to GitHub** (if not already done)
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your repository
3. **Add environment variables** in Vercel Project Settings
4. **Deploy** and verify critical routes work

See [docs/DEPLOY.md](docs/DEPLOY.md) for detailed instructions.

## 🧪 Testing & QA

### Pre-Deployment Checks

Run these commands before deploying:

```bash
# 1. Verify build passes
npm run build

# 2. Check for broken internal links
npm run check-links

# 3. Run all checks together
npm run deploy-check
```

### Manual Smoke Tests

After deployment, verify these routes:

- [ ] Homepage loads with hero and CTAs
- [ ] `/examples/hub` shows example plans
- [ ] `/pricing` shows pricing and lead form
- [ ] `/create` plan generator loads
- [ ] Lead form submission works
- [ ] Custom 404 page shows on invalid routes
- [ ] No console errors (except optional warnings)

## 🎨 Key Features

### For DIY Gardeners
- ✅ AI-powered plan generation (Claude Sonnet 4.5)
- ✅ Photo analysis with Vision API
- ✅ UK-specific climate and plant recommendations
- ✅ Example plans gallery with 14+ curated plans
- ✅ Progressive preference refinement
- 🚧 Care reminders and seasonal prompts (planned)
- 🚧 Plant substitution suggestions (planned)

### For Professionals
- ✅ Professional tools hub
- ✅ Bulk plant image generation
- ✅ AI plan critique
- ✅ Plant image library (52+ plants)
- ✅ Cost calculator
- ✅ Client portal with password protection
- 🚧 Branded report generator (planned)
- 🚧 Designer marketplace (planned)

### Future Enhancements
- Moodboard generation
- Multi-zone complex designs
- Existing plan analysis
- AR garden preview
- Seasonal maintenance guides
- External API integrations (Kew, Perenual, Plant.id)

## 📊 Data Source

Plant data from **Wyevale Nurseries** stock availability list:
- 2,000+ plant varieties
- Real-time stock quantities
- Multiple sizes (2L, 3L, 5L, 7.5L, bare root, root ball)
- Categories: Bamboo, Climbers, Conifers, Ferns, Grasses, Herbaceous, Shrubs, Trees
- Peat-free options marked

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 📝 API Endpoints

### POST /api/generate-plan
Generate a planting plan from user input.

**Request**: FormData
- `images`: File[] - Site photos
- `data`: JSON string with form data

**Response**: JSON
```json
{
  "success": true,
  "planId": "uuid",
  "message": "Plan generation started"
}
```

## 🚀 Deployment

1. **Vercel** (recommended):
   ```bash
   npm install -g vercel
   vercel
   ```

2. Add environment variables in Vercel dashboard

3. Connect to GitHub for automatic deployments

## 📄 License

Proprietary - George Stone Gardens

## 🤝 Contributing

This is a private project for George Stone Gardens. Internal contributions welcome.

---

**Built with** ❤️ **and** 🤖 **by the GSG team**
