# GSG Planting Plan Generator

AI-powered planting plan generator for UK gardens. Upload site photos, share preferences, and receive professional planting recommendations with real supplier availability.

## 🚀 5-Day Sprint Plan

### ✅ Day 1: Project Setup & Foundation (CURRENT)
- [x] Next.js 14 project with TypeScript
- [x] Tailwind CSS + shadcn/ui components
- [x] Supabase configuration
- [x] Landing page with hero and features
- [x] Multi-step form (images, site details, preferences)
- [x] Database schema design
- [ ] Test local development setup
- [ ] Deploy to Vercel (optional)

### 📋 Day 2: Vision + Analysis Agents
- [ ] Claude Vision API integration
- [ ] Image upload to storage
- [ ] Site analysis from photos (light, space, features)
- [ ] Postcode to RHS zone conversion
- [ ] Store analysis results in database

### 📋 Day 3: Plant Database + Matching
- [ ] Import Wyevale Nurseries plant data
- [ ] Plant matching algorithm (conditions, style, budget)
- [ ] Database queries with filters
- [ ] Recommendation generation logic
- [ ] Cost calculation

### 📋 Day 4: PDF Generation + Output
- [ ] Planting plan layout design
- [ ] @react-pdf/renderer implementation
- [ ] Include plant details, positioning, rationale
- [ ] Download/email functionality
- [ ] Results page UI

### 📋 Day 5: Integration + Polish
- [ ] End-to-end testing
- [ ] Error handling and validation
- [ ] Loading states and UX polish
- [ ] Mobile responsiveness
- [ ] Production deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **PDF**: @react-pdf/renderer
- **Forms**: react-hook-form + zod
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

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd gsg-planting-plan
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `ANTHROPIC_API_KEY`: Your Claude API key

3. **Set up Supabase database**:
   - Create a new Supabase project
   - Run the SQL from `supabase-schema.sql` in the SQL Editor
   - Import plant data (coming in Day 3)

4. **Run development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

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

## 🎨 Features

### MVP (5-Day Sprint)
- ✅ Photo upload interface
- ✅ Multi-step form (location, conditions, preferences)
- ⏳ Claude Vision site analysis
- ⏳ Plant matching based on conditions
- ⏳ PDF planting plan generation
- ⏳ Real supplier availability

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
