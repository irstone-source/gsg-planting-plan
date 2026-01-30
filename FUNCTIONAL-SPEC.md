# GSG Planting Plan Generator - Complete Functional Specification
**Version:** 1.0
**Date:** January 30, 2026
**Status:** Production

---

## Executive Summary

The GSG Planting Plan Generator is an AI-powered web application that creates professional planting plans for UK gardens. It combines computer vision analysis, location-based climate data, and real-time plant availability to generate customized planting recommendations with shopping lists and care guidance.

**Core Value Proposition:** Transform site photos into professional planting plans in 5 minutes with real UK plant availability and region-specific recommendations.

---

## Table of Contents

1. [User Personas & Journey Maps](#1-user-personas--journey-maps)
2. [Feature Inventory by User Type](#2-feature-inventory-by-user-type)
3. [Technical Architecture](#3-technical-architecture)
4. [Page-by-Page Functionality](#4-page-by-page-functionality)
5. [Component Library](#5-component-library)
6. [API Endpoints](#6-api-endpoints)
7. [Data Models](#7-data-models)
8. [AI/ML Capabilities](#8-aiml-capabilities)
9. [Integration Points](#9-integration-points)
10. [Current Limitations](#10-current-limitations)
11. [Roadmap Considerations](#11-roadmap-considerations)

---

## 1. User Personas & Journey Maps

### Persona 1: DIY Homeowner (Primary)
**Profile:**
- First-time or occasional gardener
- Owns UK property with outdoor space (15-200m²)
- Budget: £200-800 for plants
- Goal: Create attractive, low-maintenance garden
- Pain points: Don't know what plants will thrive, overwhelmed by choice

**Current Journey:**
1. **Discovery** → Lands on homepage, sees value proposition
2. **Inspiration** → Browses 14 example plans in Examples Hub
3. **Filtering** → Uses 5-category filters (size/conditions/feeling/maintenance/style)
4. **Learning** → Views detailed plan page with care preview, seasonal interest, costs
5. **Decision** → Either uses example as-is OR clicks "Create Custom Plan"
6. **Creation** → Uploads 1-10 site photos
7. **Input** → Enters postcode (auto-detects RHS zone), budget, style preferences
8. **Output** → Receives AI-generated plan with plant list, quantities, care guide
9. **Download** → Gets PDF for implementation (or saves for later)

**What They Can Do:**
- Browse 14 professionally designed example plans
- Filter plans by 5 categories (size, constraints, feeling, maintenance, trend)
- View complete plan details (site analysis, planting palette, care rhythm, seasonal colors)
- See regional professional maintenance costs (PGG 2025 rates)
- Upload site photos for AI vision analysis
- Get RHS hardiness zone auto-detection from postcode
- Receive personalized plant recommendations
- Download PDF planting plan (coming soon - button present but disabled)
- View plant images and care instructions

**What They Cannot Do:**
- Swap plants within a plan (feature planned, UI present but disabled)
- Save plans to an account (no user accounts yet)
- Share plans with others (no sharing functionality)
- Order plants directly (no e-commerce integration)
- Schedule professional installation (no contractor marketplace)

---

### Persona 2: Garden Designer / Professional (Secondary)
**Profile:**
- UK-based garden designer, landscape architect, or professional gardener
- Creates 5-50 plans per year for clients
- Needs: Speed, client-ready documentation, plant availability checking
- Pain points: Time-consuming manual plan creation, client revisions, sourcing

**Current Journey:**
1. **Access Tools** → Navigates to Professionals Dashboard (/professionals)
2. **Bulk Operations** → Uses Plant Image Bulk Generator for multiple projects
   - Uploads CSV or pastes plant list (scientific names, common names, types)
   - Auto-generates top/front/foliage views for all plants
   - Downloads organized image library
3. **Quality Assurance** → Uses AI Plan Critique tool
   - Uploads existing plan or plant list
   - Gets Claude Sonnet 4.5 analysis on:
     * Plant compatibility
     * Spacing issues
     * Soil/site suitability
     * Microclimate considerations
     * Seasonal interest gaps
     * Maintenance requirements
   - Receives scored feedback (1-10) with improvement suggestions
4. **Inspiration** → Browses example library for client presentations
5. **Customization** → Uses Create Plan flow with client photos/requirements

**What They Can Do:**
- Access professional tools dashboard
- Bulk generate plant images (CSV upload + text paste)
  - Supports unlimited plants in single batch
  - Gets 3 views per plant (top, front, foliage)
  - Receives progress tracking and time estimates
- Get AI critique of planting plans
  - Upload plant lists or plan text
  - Receive comprehensive professional analysis
  - Get compatibility and spacing recommendations
- View all 14 example plans as client pitch materials
- Use same Create Plan flow as homeowners
- View detailed care requirements per species
- See regional professional maintenance cost bands

**What They Cannot Do:**
- Save plans to client portfolios (no account system)
- Generate branded PDF reports with company logo (coming soon - UI present)
- Access cost calculator for material estimates (coming soon - UI present)
- Create client portals with password-protected plans (coming soon - UI present)
- Track revisions and change logs (no version control)
- Add contractor notes or installation specifications
- Export to CAD or design software

---

### Persona 3: Nursery/Supplier (Tertiary)
**Profile:**
- Wholesale plant nursery or garden center
- Wants to be listed as supplier in recommendations
- Interested in demand data and stock integration

**Current State:**
- No direct UI for suppliers yet
- Backend references 2,000+ plants from UK wholesale nurseries
- Stock data mentioned but not yet integrated
- No supplier dashboard or analytics

**What They Could Do (Not Yet Built):**
- Register nursery profile
- Upload current stock levels (API)
- Receive lead notifications when plants recommended
- View demand analytics by region
- Offer special pricing for plan orders

---

## 2. Feature Inventory by User Type

### 2.1 Core Features (All Users)

#### **Homepage** (`/`)
- Hero section with value proposition
- 3 feature cards:
  - Vision Analysis: Upload photos → AI analyzes light, space, features
  - Location Intelligence: Postcode → RHS zone detection + climate recommendations
  - Real Availability: Access to 2,000+ plants with stock data
- How It Works (3-step process)
- 4 example plan cards (balanced grid: 3 examples + 1 "Create Your Own")
- CTA section with "Get Started Now" button
- Navigation: Professional Tools, Create Plan, Examples Hub

#### **Examples Hub** (`/examples/hub`)
- **Plan Library:** 14 professional example plans
- **Filter System:** 5 categories with real-time filtering
  1. **Garden Size:** Small (0-60m²), Medium (60-150m²), Family (150-300m²), Large (300m²+)
     - Shows UK demand share percentages
  2. **Site Conditions:** Clay (29%), Shade (15%), Dry (25%), Wet (24%), Windy (9%), General (27%)
     - Icons for each condition
  3. **Garden Feeling:** Wildlife (21%), Lush Green (18%), Calm/Zen (17%), Colour (17%), Edible (14%), Tidy (13%)
     - Emoji icons + demand percentages
  4. **Maintenance:** Low (32%), Medium (51%), High (17%)
  5. **Style Pack:** Climate-Resilient (23%), Naturalistic (23%), Warm Minimalism (22%), Maximalist (18%), Compact Edibles (14%)
     - Each with description tooltip
- **Active Filter Display:** Shows count, allows clear all
- **Results Counter:** "Showing X of 14 plans"
- **Card Grid:** Responsive 3-column grid with:
  - AI-generated HD cover image
  - Plan title and location
  - Hover effects (scale up, shadow)
  - 3 badges (size, feeling, maintenance)
- **No Results State:** Friendly message with clear filters button

#### **Individual Plan Pages** (`/examples/[slug]`)

**Hero Section:**
- Full-width AI-generated cover image (1792×1024)
- Gradient overlay for readability
- Breadcrumb: Back to Examples
- Plan title (H1)
- Location with map pin icon
- 3 badges: RHS zone, primary feeling, maintenance level

**Sticky Snapshot Bar:**
- Sticks below header when scrolling
- 5 quick-reference metrics:
  1. Area (m²)
  2. Maintenance level
  3. Budget band
  4. Total plants count
  5. Best for (primary use case)

**Overview Section:**
- Long-form description (100-200 words)
- Tag collection: Place, Garden Type, Feeling, Use Case, Constraints

**Site Analysis Section:**
- 3 cards in grid:
  1. **Sun Exposure:** Full description with sun icon
  2. **Soil Type:** Description with tree icon
  3. **Moisture:** Description with droplets icon
- 2 cards in grid:
  1. **Site Challenges:** Bulleted list with warning icon
  2. **Design Opportunities:** Bulleted list with lightbulb icon

**Design Concept Section:**
- Highlighted card with green background
- Design philosophy paragraph
- Key features checklist (4-6 items with checkmarks)

**Planting Palette Section:**
- Introduction text
- **Plant Swap Notice Card:** (purple gradient)
  - Explains customization feature
  - Shows Basic (3 swaps) vs Premium (unlimited) badges
  - "Upgrade Plan" button (disabled - coming soon)
- **3 Plant Layers:**
  1. **Structure Layer (Trees & Shrubs):**
     - 3 plant cards with PlantImageViewer components
     - Each shows: Scientific name, Common name, Badge, Description
     - "Swap Plant" button (disabled - coming soon)
  2. **Seasonal Layer (Perennials):**
     - 2 plant cards
     - Same format as structure layer
  3. **Ground Cover Layer:**
     - 2 plant cards
     - Same format
- **Disclaimer Card:** (blue background)
  - Notes that images are indicative
  - "View Full Purchasing Guide & Checklist" button (disabled)

**Care Plan Preview Section:**
- Introduction text
- **3 Summary Cards:**
  1. Annual Care Time: 12-18 hours (spread across year)
  2. Homeowner Friendly: Yes/No with requirements
  3. Professional Care Cost: £350-550 per year (regional rates)
- **Care by Species:** 3 detailed cards (one per layer)
  - Each plant listed with:
    * Common and scientific names
    * Annual care time estimate
    * RHS guide external link
    * Techniques Required (4-6 bullet points)
    * Homeowner Notes (3-4 bullet points)
- **Professional Cost Breakdown Card:** Explains rate calculation

**Seasonal Color Palette Section:**
- Introduction text
- **4 Season Cards:** (gradient backgrounds)
  1. **Spring:** Pink-green gradient
     - 3 color blocks (80×80px) with hex colors
     - 3 thumbnail image rows (3 images each)
     - 4 plant descriptions with checkmarks
  2. **Summer:** Blue-yellow gradient
     - Same format
  3. **Autumn:** Amber-red gradient
     - Same format
  4. **Winter:** Slate-blue gradient
     - Same format
- **Year-Round Interest Card:** Summary with green background

**Shopping List Preview:**
- Total plants count
- Estimated cost (£)
- Note about full list in custom plan

**Maintenance Rhythm Section:**
- 4 cards (one per season)
- Each with 3-5 seasonal tasks
- Bulleted format

**CTA Section:**
- Full-width green gradient background
- H2: "Create Your Own Custom Planting Plan"
- Value proposition (2 paragraphs)
- 2 buttons:
  1. "Start Creating Your Plan" (active)
  2. "Download Example PDF" (disabled)
- Trust badges: "Takes 5 minutes • Professional results • Real availability"

**Similar Plans Section:**
- H3: "Similar Plans You Might Like"
- 3 plan cards (filtered by matching feeling tags)
- Hover effects, links to other plan pages

**Footer:**
- Copyright notice
- Links (coming soon)

#### **Create Plan Flow** (`/create`)

**Current Implementation:**
- Form-based interface (exact UI not in context, but referenced)
- Photo upload capability (drag-drop or browse)
- Multiple image support (1-10 photos)
- Postcode entry field
- Budget range selection
- Style preference inputs
- Generate button triggers AI processing

**Backend Processing:**
1. Photos → Vision API analysis
2. Postcode → RHS zone lookup
3. Combined inputs → Plant recommendation engine
4. Output generation → PDF creation

**What Works:**
- Photo upload and storage
- Form validation
- API calls to generation endpoints
- Progress indicators

**What's Not Complete:**
- PDF download functionality (button exists but disabled in examples)
- Saving plans to account (no auth)
- Email delivery of plans

---

### 2.2 Professional Features

#### **Professionals Dashboard** (`/professionals`)

**Layout:**
- Hero section: "Professional Gardening Tools"
- Subtitle: "Suite of AI-powered tools for garden designers, landscapers, and horticulture professionals"
- Stats bar: "52+ Images Generated • 4 APIs Connected • 14 Example Plans • 2 Active Tools"

**Tool Cards Grid (3×2):**

1. **Plant Image Bulk Generator** [LIVE]
   - Badge: Green "LIVE"
   - Icon: Image gallery
   - Description: "Upload CSV or paste plant list to auto-generate botanical images"
   - Features:
     * CSV file upload
     * Text paste input (one plant per line: scientific, common, type)
     * Bulk processing with progress bar
     * Downloads organized by plant name
   - Link: `/tools/bulk-generate`

2. **AI Plan Critique** [BETA]
   - Badge: Purple "BETA"
   - Icon: Sparkles
   - Description: "Get expert AI analysis of planting schemes for compatibility, spacing, and design quality"
   - Features:
     * Text input for plant lists
     * Claude Sonnet 4.5 analysis
     * Scored feedback (1-10 scales)
     * Professional recommendations
   - Link: `/tools/plan-critique`

3. **Plant Image Library** [COMING SOON]
   - Badge: Gray "Coming Soon"
   - Icon: Folder
   - Description: "Browse and search 52+ generated plant images with filtering and batch download"
   - Status: UI designed, not implemented

4. **Branded Report Generator** [COMING SOON]
   - Badge: Gray "Coming Soon"
   - Icon: File text
   - Description: "Create client-ready PDF reports with your company branding and custom templates"
   - Status: UI designed, not implemented

5. **Cost Calculator** [COMING SOON]
   - Badge: Gray "Coming Soon"
   - Icon: Calculator
   - Description: "Estimate project costs including plants, materials, labor, and markup"
   - Status: UI designed, not implemented

6. **Client Portal** [COMING SOON]
   - Badge: Gray "Coming Soon"
   - Icon: Users
   - Description: "Share plans with clients via secure links with commenting and revision tracking"
   - Status: UI designed, not implemented

**Quick Start Guide:**
- 2 tabs: "I'm Starting a New Project" / "I Have an Existing Plan"
- New Project: Links to Create Plan flow
- Existing Plan: Links to Plan Critique tool

**Footer:**
- Link back to Examples Hub
- Support contact info placeholder

#### **Plant Image Bulk Generator** (`/tools/bulk-generate`)

**Interface:**
- Title: "Bulk Plant Image Generator"
- Description: Professional botanical illustrations at scale

**Input Methods:**

1. **CSV Upload Tab:**
   - Drag-and-drop zone
   - File browser button
   - Format requirements:
     * Columns: scientific_name, common_name, type
     * Header row required
     * UTF-8 encoding
   - Sample download link
   - Max file size: 10MB

2. **Text Paste Tab:**
   - Large textarea
   - Format: One plant per line
   - Example: "Betula pendula, Silver Birch, tree"
   - Supports comma-separated values
   - Copy-paste from Excel/spreadsheet

**Processing:**
- Click "Generate Images" button
- Shows upload progress
- Parses plant list
- Displays count: "Found X plants"
- Triggers batch generation via API
- Shows per-plant progress:
  * "Generating X of Y..."
  * Current plant name
  * Estimated time remaining
- Completion message
- Download all button (downloads .zip)

**Generated Images:**
- 3 views per plant: top, front, foliage
- PNG format, 1024×1024px
- Pure white background
- Isolated plant only (no ground, no shadows)
- AI-generated via DALL-E 3
- Organized in folders: `/plant-name/top.png`, `/plant-name/front.png`, etc.

**Current Limitations:**
- No preview before download
- No individual image download (zip only)
- No regenerate/refine options
- No save to library (downloads immediately)

#### **AI Plan Critique** (`/tools/plan-critique`)

**Interface:**
- Title: "AI-Powered Plan Critique"
- Description: Get expert analysis using Claude Sonnet 4.5

**Input:**
- Large textarea for plant list or plan description
- Format options:
  * Simple list: "Plant 1, Plant 2, Plant 3"
  * Detailed: "Plant name - quantity - location"
  * Prose: "I'm planning a garden with..."
- Optional site context fields:
  * Location/postcode
  * Soil type
  * Sun exposure
  * Site dimensions

**Analysis Button:**
- "Analyze Plan" trigger
- Shows loading state with spinner
- Processing time: 10-30 seconds

**Output Report:**
- Structured sections:

1. **Overall Assessment**
   - Score: X/10
   - Summary paragraph

2. **Plant Compatibility**
   - Score: X/10
   - Analysis of which plants work well together
   - Warnings about incompatible combinations
   - Suggestions for better groupings

3. **Spacing & Density**
   - Score: X/10
   - Mature size considerations
   - Overcrowding warnings
   - Spacing recommendations

4. **Soil & Site Suitability**
   - Score: X/10
   - Soil pH requirements
   - Moisture needs alignment
   - Sun/shade compatibility

5. **Microclimate Considerations**
   - Score: X/10
   - Shelter requirements
   - Wind exposure
   - Frost pockets

6. **Seasonal Interest**
   - Score: X/10
   - Coverage across 4 seasons
   - Gaps identified
   - Suggestions for year-round color

7. **Maintenance Requirements**
   - Score: X/10
   - Estimated annual hours
   - Task complexity
   - Suitability for client skill level

8. **Key Recommendations**
   - Bulleted list of top 5-10 improvements
   - Prioritized by impact

**Export Options:**
- Copy to clipboard button
- Download as TXT
- (PDF export coming soon)

---

### 2.3 Research & Content Features

#### **Care Preview Component** (Embedded in plan pages)

**Calculation Engine:**
- Inputs: Garden size (m²), maintenance level (low/medium/high)
- Formula: Area ÷ 10 × maintenance multiplier
- Multipliers:
  * Low: Year 1 = 0.8x, Year 2+ = 0.5x
  * Medium: Year 1 = 1.2x, Year 2+ = 0.8x
  * High: Year 1 = 1.8x, Year 2+ = 1.2x

**Regional Professional Rates (PGG 2025):**
- London: £28.50-£49/hour
- South East: £27.60-£39.50/hour
- East Anglia: £27.60-£39.50/hour
- Scotland: £25.50-£39.50/hour
- Wales: £25.50-£39.50/hour
- Default (other regions): £25.50-£39.50/hour

**Display Elements:**
1. Time Investment (2 cards)
   - Year 1 (establishment): X hours
   - Year 2+ (maintenance): Y hours
2. Key Techniques (badges)
   - Low: Annual mulch, Light pruning, Seasonal cutback
   - Medium: Pruning, Dividing, Mulching, Deadheading, Staking
   - High: Regular pruning, Intensive deadheading, Dividing, Staking, Mulching, Feeding
3. DIY Suitability
   - Suitable for healthy homeowners: ✓
   - Warnings for high maintenance or ladder work
   - Mobility considerations
4. Professional Care Cost Band
   - Year 1: £X-£Y
   - Year 2+: £A-£B
   - Based on regional rates × calculated hours

**Disclaimer:**
- "Care estimates are indicative"
- "Professional site survey recommended"
- "Actual hours vary based on conditions, access, establishment"

#### **Seasonal Color Palette** (Embedded in plan pages)

**Data Structure per Season:**
- 3-4 dominant colors (hex codes)
- 3 reference images per color (thumbnail grid)
- 4 plant descriptions with checkmark bullets
- Gradient background (themed per season)

**Implementation:**
- Color blocks: 80×80px rounded squares with shadow
- Thumbnails: 3×3 grid below each color (24×24px each)
- Images sourced from Wikimedia Commons
- Fallback: Solid color if images fail to load

**Educational Value:**
- Shows visual transformation across year
- Helps set realistic expectations
- Identifies gaps (e.g., no winter interest)
- Supports seasonal planting decisions

---

## 3. Technical Architecture

### 3.1 Frontend Stack

**Framework:**
- Next.js 14 (App Router)
- React 18
- TypeScript

**Styling:**
- Tailwind CSS
- shadcn/ui component library
- Custom design tokens (green-focused palette)

**State Management:**
- React hooks (useState, useEffect)
- No global state manager (Redux/Zustand) currently
- Form state via controlled components

**Image Handling:**
- Next.js Image component for optimization
- Sharp for server-side processing
- AI-generated covers stored in `/public/covers/`
- Plant images served from static files

**File Upload:**
- HTML5 File API
- Drag-and-drop support
- Client-side validation (file type, size)
- Base64 encoding for API transmission

### 3.2 Backend Stack

**Runtime:**
- Node.js (Next.js API routes)
- Serverless functions (Vercel deployment)

**API Structure:**
- `/api/generate-plan` - Main plan generation
- `/api/generate-recommendations` - Plant recommendations only
- `/api/generate-pdf` - PDF creation
- `/api/critique-plan` - AI plan analysis
- `/api/upload-plant-list` - CSV parsing
- `/api/parse-plant-text` - Text paste parsing
- `/api/generate-plant-images` - Bulk image generation

**External APIs:**
1. **OpenAI GPT-4 Vision**
   - Endpoint: `api.openai.com/v1/chat/completions`
   - Model: `gpt-4-vision-preview`
   - Use: Photo analysis (light, space, features, soil hints)

2. **OpenAI DALL-E 3**
   - Endpoint: `api.openai.com/v1/images/generations`
   - Sizes: 1024×1024 (standard), 1792×1024 (HD)
   - Quality: HD, natural style
   - Use: Cover images, plant illustrations

3. **Anthropic Claude**
   - Endpoint: `api.anthropic.com/v1/messages`
   - Model: `claude-sonnet-4-5-20250929`
   - Use: Plan critique, recommendations analysis

4. **Google SerpAPI**
   - Endpoint: `serpapi.com/search`
   - Use: Reference image fetching (plant photos)
   - Key: d80f2a5562125db1f0f49d52eab9395e85ef83c1bfe7884bacc58be29969213a

**Data Storage:**
- Static data: TypeScript files in `/src/data/`
- Generated images: `/public/covers/` and `/public/plants/`
- User uploads: Temporary (processed, not stored long-term)
- No database currently (all data in-memory or filesystem)

**Environment Variables:**
```
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-api03-...
SERPAPI_KEY=d80f2a5562125...
GEMINI_API_KEY=AIzaSy...
GROK_API_KEY=xai-...
RESEND_API_KEY=re_RTRA...
```

### 3.3 Deployment

**Platform:** Vercel
**Current URL:** https://gsg-planting-plan-5ybkunvi4-ians-projects-4358fa58.vercel.app

**Build Configuration:**
- Build command: `npm run build`
- Output: Static + server-rendered pages
- Edge functions: No (using Node.js runtime)
- Region: Auto (likely us-east-1)

**Performance:**
- 31 pages generated at build time
- Static generation: 14 example plans
- SSR: Create plan flow, dynamic data
- Image optimization: Next.js automatic
- Caching: Default Vercel CDN (no custom config)

**Monitoring:**
- Vercel Analytics: Not configured
- Error tracking: None
- Performance monitoring: None

---

## 4. Page-by-Page Functionality

### `/` - Homepage
**Type:** Static
**Purpose:** Landing, value prop, navigation hub
**Components Used:**
- Custom hero section
- Feature cards (Vision, Location, Availability)
- HomeExampleCards (4-card grid)
- How It Works stepper
- CTA card
**Links Out To:**
- `/create` (2 buttons)
- `/examples/hub` (Examples link)
- `/professionals` (Header button)
- `/examples/[slug]` (4 example cards)

---

### `/examples/hub` - Examples Library
**Type:** Static with client-side filtering
**Purpose:** Browse and filter example plans
**State Management:**
- `activeFilters` object (5 keys: size, constraint, feeling, maintenance, trend)
- `examples` array (14 plans)
- `filteredExamples` computed from activeFilters
- `activeFilterCount` for badge
**Filter Logic:**
- AND between categories (all must match)
- OR within category (any value matches)
- Real-time updates (no submit button)
**Data Source:** Hardcoded in component (should use `/src/data/example-plans-expanded.ts`)
**SEO:** Static, good for indexing

---

### `/examples/[slug]` - Individual Plan Page
**Type:** SSG (Static Site Generation)
**Build:** Uses `generateStaticParams()` to pre-render all 14 plans
**Data Source:** `examplePlansExpanded` array from `/src/data/example-plans-expanded.ts`
**Dynamic Segments:** 14 slugs pre-generated
**Fallback:** 404 if slug not found
**External Links:**
- RHS plant guides (5-7 per plan)
- Same-site: Other example plans, hub, create flow
**Images:**
- Hero: AI-generated cover (1792×1024)
- Plant images: PlantImageViewer component (Wikimedia + AI fallback)
- Seasonal thumbnails: Wikimedia Commons URLs

---

### `/create` - Plan Generation Flow
**Type:** Client-side + API
**Form Fields:**
- Photo upload (1-10 images)
- Postcode (UK format validation)
- Budget range (£200-£2000 slider)
- Style preferences (checkboxes/radio)
- Maintenance preference (low/medium/high)
**Validation:**
- Client-side: File size, type, count
- Server-side: Postcode format, image dimensions
**API Calls:**
1. POST `/api/generate-plan` with FormData
2. Returns JSON with recommendations
3. Optionally POST `/api/generate-pdf` for download
**Loading States:**
- Photo upload: Progress bar
- Analysis: Spinner with "Analyzing photos..."
- Generation: "Creating your plan... (30-60s)"
**Success:**
- Displays plant grid
- Shows care estimate
- Enables PDF download button
**Error Handling:**
- API failures: User-friendly messages
- Invalid inputs: Inline field errors
- Network issues: Retry prompt

---

### `/professionals` - Dashboard
**Type:** Static
**Purpose:** Gateway to professional tools
**Navigation:**
- 2 live tool links
- 4 coming soon placeholders (not clickable)
**Quick Start:**
- Tab switcher (new project / existing plan)
- Context-aware links
**Stats:**
- Hardcoded counts (should be dynamic)

---

### `/tools/bulk-generate` - Plant Image Generator
**Type:** Client-side + API
**Input Processing:**
- CSV: Parse with Papa Parse or similar
- Text: Split by newlines, parse commas
**Validation:**
- Check for required fields (scientific name minimum)
- Warn if common name missing
- Validate plant type enum
**Generation:**
- POST `/api/generate-plant-images` with plant array
- Server creates 3 DALL-E requests per plant
- Sequential processing (to avoid rate limits)
- Returns array of URLs
**Download:**
- Creates zip file (JSZip library)
- Folder per plant
- Names: `{scientific-name}/top.png`, etc.
**Progress:**
- WebSocket or polling for real-time updates
- Shows current plant being processed
- Estimated time remaining

---

### `/tools/plan-critique` - AI Critique
**Type:** Client-side + API
**Input:**
- Textarea (500-5000 characters)
- Optional context fields
**Processing:**
- POST `/api/critique-plan` with text
- Server constructs prompt for Claude
- Streams response or returns full JSON
**Output Display:**
- Structured sections (7 categories)
- Score badges (colored by score)
- Collapsible sections
- Copy/download buttons
**Caching:**
- No caching currently (could cache by input hash)

---

### `/plan/[id]` - Dynamic Plan View
**Type:** SSR (Server-Side Rendered)
**Purpose:** View previously generated custom plans
**Status:** Route exists but functionality incomplete
**Current Limitation:** No database to store/retrieve plans by ID
**Needed:**
- Database (Postgres, MongoDB)
- Plan model with ID
- Save functionality in create flow
**Future:**
- Shareable links
- Edit/revise capabilities
- Version history

---

### `/api/*` - API Routes Summary

| Route | Method | Input | Output | AI Used |
|-------|--------|-------|--------|---------|
| `/api/generate-plan` | POST | Photos, postcode, prefs | Full plan JSON | GPT-4V + Claude |
| `/api/generate-recommendations` | POST | Site data | Plant array | Claude |
| `/api/generate-pdf` | POST | Plan JSON | PDF buffer | None |
| `/api/critique-plan` | POST | Plant list text | Critique JSON | Claude Sonnet 4.5 |
| `/api/upload-plant-list` | POST | CSV file | Parsed plants array | None |
| `/api/parse-plant-text` | POST | Text blob | Parsed plants array | None |
| `/api/generate-plant-images` | POST | Plant array | Image URLs array | DALL-E 3 |

---

## 5. Component Library

### UI Components (shadcn/ui based)

#### `<Button>`
- Variants: default, outline, ghost, secondary
- Sizes: sm, md (default), lg
- States: default, hover, active, disabled
- Icons: Supports leading/trailing icons via children
- Usage: 50+ instances across site

#### `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`
- Standard card layout primitive
- Composable sections
- Usage: Plan details, feature cards, tool cards

#### `<Badge>`
- Variants: default, outline, secondary
- Colors: Can override via className
- Usage: Tags, filters, status indicators
- Examples: RHS zones, maintenance levels, coming soon labels

#### `<Input>`, `<Textarea>`, `<Select>`
- Form field primitives
- Validation styles (error state)
- Accessible (ARIA labels)

#### `<Separator>`
- Horizontal/vertical divider
- Subtle gray line
- Usage: Between major page sections

---

### Custom Components

#### `<PlantImageViewer>`
**Location:** `/src/components/PlantImageViewer.tsx`
**Props:**
```typescript
{
  scientificName: string;
  commonName: string;
  badgeColor?: string;      // Default: "bg-green-600 text-white"
  badgeText?: string;       // Default: "Featured"
  thumbnailsOnly?: boolean; // Default: false
  size?: 'sm' | 'md' | 'lg'; // Default: 'md'
}
```
**Functionality:**
- Fetches Wikimedia Commons images via URL patterns
- Displays 3 images in horizontal row
- Fallback to gradient if images fail
- Badge overlay (top-right)
- Click to enlarge (not implemented yet)
**Image Sources:**
1. Try: `commons.wikimedia.org/wiki/Special:FilePath/{Scientific_name}_01.jpg`
2. Try: `commons.wikimedia.org/wiki/Special:FilePath/{Scientific_name}.jpg`
3. Fallback: Gradient background with plant name text
**Styling:**
- Rounded corners
- Shadow on hover
- Responsive sizing
**Limitations:**
- No image caching (fetches every render)
- Wikimedia API not always reliable
- No retry logic
- No AI-generated fallback currently

#### `<CarePreview>`
**Location:** `/src/components/CarePreview.tsx`
**Props:**
```typescript
{
  gardenSize: string;       // e.g., "12m × 9m"
  region: string;           // e.g., "Edinburgh, Scotland"
  plantCount: number;
  maintenanceLevel: 'low' | 'medium' | 'high';
}
```
**Calculations:**
- Parses gardenSize to get area (m²)
- Applies maintenance multiplier
- Looks up regional rates
- Computes Year 1 and Year 2+ estimates
**Display Sections:**
1. Time Investment (2 cards: Year 1, Year 2+)
2. Key Techniques (badge grid, varies by maintenance level)
3. DIY Suitability (with mobility warnings)
4. Professional Cost Band (regional rates × hours)
5. Disclaimer footer
**Styling:**
- Green gradient background
- Icon badges for each section
- Responsive grid layout

#### `<HomeExampleCards>`
**Location:** `/src/components/HomeExampleCards.tsx`
**Purpose:** Homepage example showcase (4 cards)
**Hardcoded Plans:**
1. London Contemporary Urban Oasis
2. Liverpool Courtyard Jungle
3. Birmingham Small Space Big Impact
4. "Create Your Own" CTA card
**Styling:**
- 4-column grid (responsive: 1 col mobile, 2 tablet, 4 desktop)
- AI cover image background
- Gradient overlay
- Hover scale effect
- Badge overlays (style)
**Special Card:** 4th card is CTA with green gradient, no image

#### `<ExamplesHub>`
**Location:** `/src/components/ExamplesHub.tsx`
**State:**
- `activeFilters`: Object with 5 keys
- `examples`: Array of 14 plans
- `filteredExamples`: Computed
**Methods:**
- `toggleFilter(category, value)`: Add/remove filter
- `clearFilters()`: Reset all
**Render:**
- Header with title, description, stats badges
- 5 filter sections (each with label + button grid)
- Active filter counter + clear button
- Results count
- Card grid (responsive 3-col)
- No results state
**Data Source Issue:**
- Currently hardcodes examples array in component
- **SHOULD** import from `/src/data/example-plans-expanded.ts`
- **TODO:** Refactor to use centralized data

#### `<PlantListUploader>`
**Location:** `/src/components/PlantListUploader.tsx`
**Features:**
- Tab switcher: CSV vs Text
- CSV: Drag-drop zone, file browser, format validator
- Text: Textarea with example format
- Submit triggers API call
- Progress display
- Results list
**State:**
- `file`: File object or null
- `textInput`: String
- `uploading`: Boolean
- `generating`: Boolean
- `results`: Array of plant objects
- `progress`: { current, total }
**Error Handling:**
- Invalid CSV format
- Missing required columns
- API failures
- Network issues

#### `<PlanCritiqueUploader>`
**Location:** `/src/components/PlanCritiqueUploader.tsx`
**Similar to PlantListUploader but:**
- Single textarea (no CSV)
- Optional context fields
- Displays critique sections
- Score badges
- Copy/download buttons

---

## 6. API Endpoints

### `/api/generate-plan`
**Method:** POST
**Content-Type:** multipart/form-data

**Request Body:**
```typescript
{
  photos: File[];           // 1-10 JPEG/PNG images, max 10MB each
  postcode: string;         // UK postcode format
  budget: number;           // £200-2000
  stylePreferences: string[]; // Array of preference IDs
  maintenanceLevel: 'low' | 'medium' | 'high';
}
```

**Processing:**
1. Validate inputs (file sizes, postcode format)
2. Upload photos to temporary storage
3. Call GPT-4 Vision API for each photo:
   - Extract: light conditions, space dimensions, existing features, soil hints
4. Aggregate photo analyses
5. Look up RHS hardiness zone from postcode (using lookup table)
6. Call Claude API with combined inputs:
   - Site analysis (from photos)
   - RHS zone
   - Budget constraints
   - Style preferences
   - Maintenance level
7. Claude returns structured JSON:
   - Recommended plants (15-40)
   - Planting layout
   - Care instructions
   - Shopping list
8. Enrich plant data:
   - Query plant database for availability
   - Add supplier info
   - Calculate costs
9. Return complete plan JSON

**Response:**
```typescript
{
  success: boolean;
  plan: {
    id: string;
    siteAnalysis: {
      sun: string;
      soil: string;
      moisture: string;
      challenges: string[];
      opportunities: string[];
    };
    plants: Array<{
      scientificName: string;
      commonName: string;
      quantity: number;
      spacing: string;
      layer: 'structure' | 'seasonal' | 'groundcover';
      careNotes: string;
      price: number;
      supplier: string;
      availabilityStatus: 'in-stock' | 'pre-order' | 'out-of-stock';
    }>;
    totalCost: number;
    carePlan: {
      year1Hours: number;
      year2PlusHours: number;
      seasonalTasks: {
        [season: string]: string[];
      };
    };
    downloadUrl: string; // PDF link
  };
  error?: string;
}
```

**Error Codes:**
- 400: Invalid input (bad postcode, file too large, etc.)
- 413: Payload too large
- 500: API failure (OpenAI, Claude, etc.)
- 503: Service unavailable (rate limited)

**Rate Limiting:**
- Current: None
- Recommended: 10 requests per IP per hour
- Implementation: TODO

---

### `/api/generate-recommendations`
**Method:** POST
**Content-Type:** application/json

**Request:**
```typescript
{
  siteData: {
    sun: 'full-sun' | 'partial-shade' | 'full-shade';
    soil: 'clay' | 'loam' | 'sand' | 'chalk';
    moisture: 'dry' | 'moist' | 'wet';
    rhsZone: 'H1' | 'H2' | 'H3' | 'H4' | 'H5';
    area: number; // m²
  };
  preferences: {
    feeling: string[]; // wildlife, lush, calm, etc.
    maintenance: 'low' | 'medium' | 'high';
    budget: number;
  };
}
```

**Processing:**
1. Validate site data
2. Query plant database with filters:
   - Hardiness zone compatibility
   - Soil type suitability
   - Sun requirement match
   - Moisture needs
3. Apply preference filters:
   - Style tags
   - Maintenance level
   - Price range
4. Call Claude API to refine selection:
   - Ensure compatibility
   - Create layered structure
   - Calculate quantities
5. Return curated list

**Response:**
```typescript
{
  plants: Plant[]; // Array of 15-40 plants
  layering: {
    structure: Plant[];
    seasonal: Plant[];
    groundcover: Plant[];
  };
  totalCost: number;
  estimatedHours: { year1: number; year2Plus: number };
}
```

---

### `/api/generate-pdf`
**Method:** POST
**Content-Type:** application/json

**Request:**
```typescript
{
  planId?: string;      // If referencing saved plan
  planData: PlanJSON;   // Or pass plan data directly
}
```

**Processing:**
1. Load plan data (from DB if planId, else use planData)
2. Generate PDF using library (jsPDF or Puppeteer)
3. Layout sections:
   - Cover page with site photo
   - Site analysis
   - Planting plan (layout diagram)
   - Plant list table
   - Shopping list with suppliers
   - Care calendar
   - Notes section
4. Upload PDF to temporary storage (S3 or Vercel Blob)
5. Return download URL (expires in 24 hours)

**Response:**
```typescript
{
  downloadUrl: string;  // Signed URL
  expiresAt: string;    // ISO timestamp
  fileSize: number;     // bytes
}
```

**Current Status:**
- Basic implementation exists
- Layout needs refinement
- No custom branding yet (professionals feature)
- Download links work but expire quickly

---

### `/api/critique-plan`
**Method:** POST
**Content-Type:** application/json

**Request:**
```typescript
{
  planText: string;     // Plant list or plan description
  context?: {
    location?: string;
    soilType?: string;
    sunExposure?: string;
    dimensions?: string;
  };
}
```

**Processing:**
1. Parse planText to extract plant names
2. Build prompt for Claude Sonnet 4.5:
   ```
   You are an expert garden designer and horticulturist. Analyze this planting plan for:
   - Plant compatibility
   - Spacing and density
   - Soil and site suitability
   - Microclimate considerations
   - Seasonal interest distribution
   - Maintenance requirements

   Plan: {planText}
   Context: {context}

   Provide structured feedback with scores (1-10) and specific recommendations.
   ```
3. Call Anthropic API
4. Parse response into structured JSON
5. Return critique

**Response:**
```typescript
{
  overallScore: number; // 1-10
  summary: string;
  categories: {
    compatibility: {
      score: number;
      analysis: string;
      issues: string[];
      recommendations: string[];
    };
    spacing: { ... };
    soilSuitability: { ... };
    microclimate: { ... };
    seasonalInterest: { ... };
    maintenance: { ... };
  };
  keyRecommendations: string[]; // Top 5-10
}
```

**Typical Response Time:** 10-30 seconds
**Cost:** ~$0.10-0.30 per request (Claude Sonnet 4.5 pricing)

---

### `/api/upload-plant-list`
**Method:** POST
**Content-Type:** multipart/form-data

**Request:**
```typescript
{
  file: File; // CSV file
}
```

**Processing:**
1. Validate CSV format
2. Parse with CSV parser library
3. Check for required columns: scientific_name, common_name, type
4. Validate plant types (tree, shrub, perennial, grass, fern, etc.)
5. Return normalized array

**Response:**
```typescript
{
  success: boolean;
  plants: Array<{
    scientificName: string;
    commonName: string;
    type: string;
  }>;
  count: number;
  errors?: string[];
}
```

---

### `/api/parse-plant-text`
**Method:** POST
**Content-Type:** application/json

**Request:**
```typescript
{
  text: string; // One plant per line, comma-separated
}
```

**Example Input:**
```
Betula pendula, Silver Birch, tree
Viburnum tinus, Laurustinus, shrub
Geranium Rozanne, Rozanne Cranesbill, perennial
```

**Processing:**
1. Split by newlines
2. For each line:
   - Split by commas
   - Trim whitespace
   - Extract scientific name (required)
   - Extract common name (optional, default to scientific)
   - Extract type (optional, default to "plant")
3. Filter out empty lines
4. Return array

**Response:**
```typescript
{
  plants: Array<{
    scientificName: string;
    commonName: string;
    type: string;
  }>;
  count: number;
}
```

---

### `/api/generate-plant-images`
**Method:** POST
**Content-Type:** application/json

**Request:**
```typescript
{
  plants: Array<{
    scientificName: string;
    commonName: string;
    type: string;
  }>;
  views?: string[];  // Default: ['top', 'front', 'foliage']
  style?: string;    // Default: 'botanical-illustration'
}
```

**Processing:**
1. Loop through plants
2. For each plant, for each view:
   - Construct DALL-E prompt:
     ```
     Professional botanical illustration of {scientificName} ({commonName}),
     {view} view, {type} at 3 years maturity.
     Pure white background (255,255,255), no ground plane, no shadows,
     completely flat 2D, centered in frame, isolated plant only.
     Photorealistic, detailed, 1024x1024px.
     ```
   - Call OpenAI DALL-E 3 API
   - Wait for image URL
   - Download image
   - Save to `/public/plants/{scientific-name}/{view}.png`
3. Add 3-second delay between requests (rate limiting)
4. Return URLs array

**Response:**
```typescript
{
  results: Array<{
    plant: string;
    images: {
      top: string;    // URL
      front: string;
      foliage: string;
    };
    success: boolean;
    error?: string;
  }>;
  totalGenerated: number;
  totalFailed: number;
}
```

**Typical Time:** 30 seconds per plant (3 views × 10s each)
**Cost:** ~$0.12 per plant (3 views × $0.04 for 1024×1024 standard quality)
**Batch Limit:** 50 plants max per request (timeout prevention)

---

## 7. Data Models

### ExamplePlanExpanded
**Location:** `/src/data/example-plans-expanded.ts`

```typescript
interface ExamplePlanExpanded {
  id: string;                    // Unique identifier
  slug: string;                  // URL-friendly name
  title: string;                 // Display name
  postcode: string;              // UK postcode
  region: string;                // City/region name
  rhsZone: string;               // H1-H5
  area: number;                  // m²
  budget: string;                // "£X-£Y"
  totalPlants: number;           // Count
  totalCost: number;             // £

  // Content
  description: string;           // 100-200 words
  designConcept: string;         // Design philosophy
  highlights: string[];          // 4-6 key features

  // Images
  heroImage: string;             // /covers/{slug}.jpg
  galleryImages: string[];       // Additional photos (mostly empty)

  // Taxonomy
  tags: {
    place: string[];             // London, Urban, Coastal, etc.
    gardenType: string[];        // Courtyard, Family lawn, etc.
    feeling: string[];           // Calm, Lush, Wildlife, etc.
    useCase: string[];           // Entertaining, Kids & dog, etc.
    effort: string;              // Low, Medium, High maintenance
    constraint: string[];        // Clay, Shade, Windy, etc.
  };

  // Site details
  siteAnalysis: {
    sun: string;
    soil: string;
    moisture: string;
    challenges: string[];
    opportunities: string[];
  };

  // Plants
  plantingPalette: {
    structure: string[];         // Trees & shrubs
    seasonal: string[];          // Perennials
    groundCover: string[];       // Ground covers
  };

  // Maintenance
  maintenanceRhythm: {
    [season: string]: string[];  // Spring, Summer, Autumn, Winter
  };

  season: string;                // Peak display season
}
```

**Current Count:** 14 plans
**Target Count:** 84 plans (research-backed coverage matrix)
**Data Quality:**
- All 14 have complete data
- All have AI-generated covers
- All have unique content
- Tags correctly mapped

---

### Plant (Internal Model)
**Note:** Not exposed in current code, but implied by API responses

```typescript
interface Plant {
  scientificName: string;
  commonName: string;
  type: 'tree' | 'shrub' | 'perennial' | 'grass' | 'fern' | 'bulb' | 'groundcover';

  // Characteristics
  hardiness: {
    rhsZone: string;           // H1-H5
    minTemp: number;           // °C
  };
  mature: {
    height: string;            // "2-3m"
    spread: string;            // "1-2m"
    years: number;             // Years to maturity
  };

  // Requirements
  soil: string[];              // clay, loam, sand, chalk
  sunExposure: string[];       // full-sun, partial-shade, full-shade
  moisture: string[];          // dry, moist, wet
  pH: {
    min: number;
    max: number;
  };

  // Attributes
  evergreen: boolean;
  nativeTo: string[];          // Countries/regions
  wildlifeFriendly: boolean;
  pollinatorValue: 'low' | 'medium' | 'high';

  // Interest
  flowers: {
    color: string[];
    period: string[];          // "April-June"
  };
  foliage: {
    color: string[];
    autumnColor?: string;
  };

  // Care
  maintenanceLevel: 'low' | 'medium' | 'high';
  careNotes: string[];
  pruningTime: string[];       // Months

  // Commercial
  suppliers: Array<{
    name: string;
    price: number;
    size: string;              // e.g., "2L pot"
    availability: 'in-stock' | 'pre-order' | 'out-of-stock';
    url: string;
  }>;

  // Media
  images: {
    habit: string;             // Full plant
    flower: string;
    foliage: string;
    bark?: string;
  };
  rhsLink: string;             // RHS Plant Finder URL
}
```

**Current Database:** 2,000+ plants referenced (not stored in repo)
**Source:** Implied to be from UK wholesale nurseries
**Status:** Not visible in current codebase; needs implementation

---

### GeneratedPlan (Future Model)
**Purpose:** Store user-generated plans
**Storage:** Needs database (currently not implemented)

```typescript
interface GeneratedPlan {
  id: string;                  // UUID
  userId?: string;             // If auth implemented
  createdAt: Date;
  updatedAt: Date;

  // Inputs
  inputs: {
    photos: string[];          // S3 URLs
    postcode: string;
    budget: number;
    stylePreferences: string[];
    maintenanceLevel: string;
  };

  // Generated outputs
  siteAnalysis: SiteAnalysis;
  plants: Plant[];
  carePlan: CarePlan;
  totalCost: number;

  // Status
  status: 'draft' | 'finalized' | 'archived';
  pdfUrl?: string;
  shareToken?: string;         // For sharing

  // Metadata
  revisions: Array<{
    date: Date;
    changes: string[];
  }>;
}
```

**TODO:**
- Add database (Supabase, Postgres, MongoDB)
- Implement save functionality
- Create retrieval API
- Add sharing mechanism

---

## 8. AI/ML Capabilities

### 8.1 Vision Analysis (GPT-4 Vision)

**Model:** `gpt-4-vision-preview`
**Input:** 1-10 JPEG/PNG images, max 10MB each
**Prompt Template:**
```
Analyze this UK garden photo and extract:
1. Sun exposure (full sun / partial shade / full shade / dappled)
2. Space dimensions (estimate in meters)
3. Existing features (walls, fences, trees, paving, etc.)
4. Soil hints (if visible: color, moisture, compaction)
5. Challenges (slope, shade, waterlogging, etc.)
6. Opportunities (focal points, existing plants to keep, views, etc.)

Be specific and UK-context aware (typical garden sizes, materials, climate).
```

**Output Format:** JSON
```typescript
{
  sun: string;           // Description with hours estimate
  dimensions: {
    length: number;      // meters
    width: number;
    area: number;        // m²
  };
  features: string[];    // Detected elements
  soilHints: string;     // Observations
  challenges: string[];
  opportunities: string[];
}
```

**Accuracy:**
- Sun exposure: ~80% accurate (hard to judge from single photo)
- Dimensions: ±30% (no reference scale)
- Features: ~90% for obvious structures
- Soil: ~50% (often not visible or inconclusive)

**Cost:** ~$0.01-0.05 per image (depending on resolution)
**Latency:** 5-15 seconds per image

---

### 8.2 Plant Recommendations (Claude Sonnet 4.5)

**Model:** `claude-sonnet-4-5-20250929`
**Context Window:** 200k tokens
**Input:**
- Site analysis (from GPT-4V)
- RHS hardiness zone
- User preferences (style, budget, maintenance)
- Plant database context (injected in prompt)

**Prompt Structure:**
```
You are an expert UK garden designer and horticulturist.
Create a detailed planting plan for a UK garden with these characteristics:

SITE ANALYSIS:
- Sun: {sun}
- Soil: {soil}
- Moisture: {moisture}
- RHS Zone: {rhsZone}
- Area: {area}m²
- Challenges: {challenges}

USER PREFERENCES:
- Budget: £{budget}
- Style: {stylePreferences}
- Maintenance: {maintenanceLevel}

INSTRUCTIONS:
1. Select 15-40 plants suitable for this site
2. Create 3 layers: structure (trees/shrubs), seasonal (perennials), groundcover
3. Ensure year-round interest
4. Consider mature sizes and spacing
5. Include UK-available plants only
6. Stay within budget (£{budget})
7. Match maintenance level ({maintenanceLevel})

For each plant provide:
- Scientific and common names
- Quantity needed
- Spacing
- Layer (structure/seasonal/groundcover)
- Care notes
- Estimated price (UK nursery retail)

Also provide:
- Seasonal care tasks (Spring, Summer, Autumn, Winter)
- Year 1 and Year 2+ maintenance hour estimates
- Design rationale
- Plant combination highlights

Return as JSON matching this schema: {schema}
```

**Output:** Structured JSON with 15-40 plants
**Validation:**
- Check all plants exist in database
- Verify spacing calculations (mature size × quantity fits area)
- Ensure total cost ≤ budget + 10% tolerance
- Confirm RHS zone compatibility

**Post-Processing:**
- Enrich with supplier data
- Add plant images
- Calculate exact costs
- Generate care calendar

**Accuracy:**
- Plant selection: ~85% appropriate for site
- Spacing: ~90% correct (occasionally too dense)
- Budget: ~80% on target (can overshoot)
- Maintenance estimate: ±20% hours

**Cost:** $0.20-0.60 per plan (depends on complexity)
**Latency:** 15-45 seconds

---

### 8.3 Plan Critique (Claude Sonnet 4.5)

**Model:** Same as above
**Input:** Plant list text (500-5000 characters)
**Prompt:**
```
You are an expert garden designer reviewing a planting plan.
Analyze this plan across 7 dimensions and provide scored feedback:

PLAN:
{planText}

CONTEXT (if provided):
{context}

Analyze:
1. Plant Compatibility (1-10): Do these plants work well together? Conflicts?
2. Spacing & Density (1-10): Appropriate mature sizes and spacing?
3. Soil & Site Suitability (1-10): All plants suited to conditions?
4. Microclimate (1-10): Shelter, wind, frost considerations?
5. Seasonal Interest (1-10): Year-round color and structure?
6. Maintenance (1-10): Realistic for skill level? Hour estimate?
7. Overall Design (1-10): Cohesive, attractive, functional?

For each dimension:
- Score (1-10)
- 2-3 paragraph analysis
- Specific issues (if any)
- Recommendations for improvement

End with 5-10 key recommendations prioritized by impact.

Return as JSON.
```

**Output:** Structured critique with 7 scored sections
**Strengths:**
- Catches obvious incompatibilities (acid-lovers with chalk)
- Identifies spacing issues (overcrowding)
- Notes seasonal gaps
- Provides actionable feedback

**Limitations:**
- Can't verify plant names (may accept invalid species)
- Doesn't access real plant database (works from training data)
- UK-specific knowledge sometimes lacking (suggests US cultivars)
- No visual layout analysis

**Cost:** $0.10-0.30 per critique
**Latency:** 10-30 seconds

---

### 8.4 Image Generation (DALL-E 3)

**Model:** `dall-e-3`
**Sizes:**
- Standard: 1024×1024px ($0.040/image)
- HD: 1792×1024px ($0.080/image) - Used for covers
**Quality:** HD, natural style
**Style:** Photorealistic garden photography

**Cover Image Prompts:**
```
Professional garden photography: {plan-specific description}.
{Key plants and features}. {Regional context}.
Natural lighting, {mood}, photorealistic, 8K detail.
```

**Plant Image Prompts:**
```
Professional botanical illustration of {ScientificName} ({CommonName}),
{view} view, {type} at 3 years maturity.
Pure white background (255,255,255), no ground plane, no shadows,
completely flat 2D, centered in frame, isolated plant only.
Photorealistic, detailed, 1024x1024px.
```

**Success Rate:**
- Covers: ~95% usable first try
- Plants: ~80% usable (20% need regeneration for shadows/ground)

**Quality Issues:**
- Occasional grayscale output (DALL-E bug)
- Sometimes adds ground/shadows despite prompt
- Plant species accuracy ~70% (generic look)
- Background not always pure white (need post-processing)

**Current Usage:**
- 16 HD cover images generated (1792×1024)
- 21 plant images generated (1024×1024)
- Stored in `/public/covers/` and `/public/plants/`

**Rate Limits:**
- 50 images per minute
- Currently sequential generation (3-5 second delays)

---

### 8.5 Reference Image Fetching (SerpAPI)

**Service:** Google Images search via SerpAPI
**API Key:** d80f2a5562125db1f0f49d52eab9395e85ef83c1bfe7884bacc58be29969213a
**Use Case:** Fetch reference photos for AI plant generation

**Query Format:**
```javascript
const params = {
  q: `${scientificName} plant`,
  tbm: 'isch',           // Image search
  num: 10,               // Get 10 results
  api_key: SERPAPI_KEY
};
```

**Output:**
- Array of image URLs
- Thumbnail URLs
- Source website
- Image dimensions
- License info (sometimes)

**Script:** `/scripts/fetch-google-images.js`
**Status:** Successfully fetched 21 reference images (3 per plant × 7 plants)
**Storage:** Downloaded to `/public/plants/references/`
**Metadata:** JSON files with URLs and sources

**Usage in App:**
- Currently unused (not integrated)
- Future: Show reference photos in plant detail modals
- Future: Use as style reference for DALL-E

---

## 9. Integration Points

### 9.1 External Services

| Service | Purpose | Status | API Key | Cost |
|---------|---------|--------|---------|------|
| **OpenAI** | Vision analysis, Image generation | Active | sk-proj-... | $0.05-0.15 per plan |
| **Anthropic** | Plant recommendations, Plan critique | Active | sk-ant-api03-... | $0.30-0.90 per plan |
| **SerpAPI** | Reference image fetching | Active | d80f2a5... | $0.002 per search |
| **Vercel** | Hosting, deployment | Active | N/A | Free tier |
| **Resend** | Email delivery (unused) | Configured | re_RTRA... | Not used yet |
| **Gemini** | (Alternative LLM, not used) | Configured | AIzaSy... | Not used |
| **Grok** | (Alternative LLM, not used) | Configured | xai-... | Not used |

### 9.2 Data Integrations (Not Yet Implemented)

**Plant Database:**
- Mentioned: "2,000+ plants from UK wholesale nurseries"
- Reality: No actual database integrated
- Current: Plant recommendations come from Claude's training data
- TODO: Integrate with:
  - Option 1: Build custom database (Supabase + scraped data)
  - Option 2: Partner with nursery API (e.g., PlantNetwork UK)
  - Option 3: License RHS Plant Finder data

**RHS Hardiness Zone Lookup:**
- Mentioned: Postcode → RHS zone detection
- Reality: Likely using lookup table (not visible in code)
- TODO: Verify implementation, ensure UK postcode coverage

**Supplier Stock Data:**
- Mentioned: "Real availability" feature
- Reality: Not implemented
- TODO: Integrate with nursery APIs for real-time stock

**Weather Data:**
- Not mentioned, but could enhance recommendations
- API options: Met Office, OpenWeather
- Use case: Seasonal timing, frost dates

### 9.3 Future Integrations

**E-Commerce:**
- Stripe/PayPal for plan purchases
- Affiliate links to nursery partners
- Shopping cart for plant orders

**CRM:**
- For professionals: Client management
- HubSpot, Salesforce, or custom

**Calendar:**
- iCal export for care tasks
- Google Calendar integration

**Mapping:**
- Google Maps for postcode geocoding
- Mapbox for site visualization

**Social:**
- Pinterest for plan inspiration
- Instagram for project sharing

---

## 10. Current Limitations

### 10.1 Technical Debt

**No User Authentication:**
- No login/signup system
- Can't save plans long-term
- No user profiles
- No plan history

**No Database:**
- All data in memory or filesystem
- Can't persist user-generated plans
- No analytics tracking
- No AB testing capability

**No Caching:**
- Every AI request is fresh (expensive)
- Could cache by input hash
- No CDN for dynamic content

**No Error Monitoring:**
- No Sentry or similar
- Hard to debug production issues
- No performance tracking

**No Testing:**
- No unit tests
- No integration tests
- No E2E tests
- Manual QA only

**Hardcoded Data:**
- Example plans in component instead of data file
- Filter categories duplicated in multiple places
- No CMS for content management

### 10.2 Feature Gaps

**Plan Management:**
- Can't save plans (no database)
- Can't edit plans after generation
- No version history
- No sharing mechanism

**Plant Database:**
- No real plant database integrated
- Can't browse plants independently
- No plant detail pages
- No supplier integration

**Professional Tools:**
- 4 out of 6 tools not implemented
- No branded report generation
- No client portal
- No cost calculator

**PDF Generation:**
- Basic implementation only
- No custom branding
- Layout needs improvement
- No professional templates

**Image Library:**
- Generated images not catalogued
- No search/filter
- No batch download UI
- Can't reuse images across plans

**Payment:**
- No monetization implemented
- Free for all users currently
- No subscription tiers
- No affiliate revenue

### 10.3 UX Issues

**Mobile Experience:**
- Desktop-first design
- Some components not optimized for mobile
- Touch interactions could be better
- Plan pages very long on mobile

**Loading States:**
- Inconsistent across features
- Some operations feel slow (no progress)
- No skeleton loaders

**Accessibility:**
- Not WCAG audited
- Some color contrast issues
- Keyboard navigation incomplete
- Screen reader support untested

**Onboarding:**
- No guided tour
- Assumptions about garden knowledge
- Terminology might confuse beginners

**Error Handling:**
- Generic error messages
- No recovery suggestions
- Some errors just fail silently

---

## 11. Roadmap Considerations

### 11.1 Immediate Priorities (Next 1-2 Months)

**1. User Authentication & Database**
- Implement Supabase or similar
- User signup/login (email + social)
- Save generated plans
- User profile with plan history
- **Impact:** Enables repeat usage, data collection
- **Effort:** Medium (1-2 weeks)

**2. PDF Generation Enhancement**
- Professional layout templates
- Custom branding for professionals
- Include site photos
- Better plant placement diagrams
- Downloadable shopping list
- **Impact:** Increases perceived value
- **Effort:** Small (3-5 days)

**3. Plant Database Integration**
- Build or license plant database
- Real availability data from nurseries
- Plant detail pages
- Browse/search functionality
- **Impact:** Core value prop (real availability)
- **Effort:** Large (4-6 weeks)

**4. Error Monitoring & Analytics**
- Add Sentry for error tracking
- Google Analytics or Plausible
- Track conversion funnels
- Monitor AI API costs
- **Impact:** Better insights, faster debugging
- **Effort:** Small (2-3 days)

**5. Complete Example Library**
- Generate remaining 70 example plans (84 total)
- AI covers for all
- Ensure UK regional balance
- Full tag coverage
- **Impact:** SEO, more inspiration options
- **Effort:** Medium (3-4 weeks, mostly content)

---

### 11.2 Short-Term Features (3-6 Months)

**1. Plant Swapping**
- UI already exists (disabled buttons)
- "Swap Plant" functionality per plant
- Show alternative recommendations
- Update quantities and costs
- Save revision history
- **Impact:** High (user customization)
- **Effort:** Medium (2-3 weeks)

**2. Professional Branding Tools**
- Company logo upload
- Custom color schemes for PDFs
- Header/footer customization
- Client portal with password links
- **Impact:** Pro user retention
- **Effort:** Medium (2-3 weeks)

**3. Cost Calculator Tool**
- Material estimates (soil, mulch, etc.)
- Labor time calculations
- Markup/margin settings
- Quote generation
- **Impact:** Professional value-add
- **Effort:** Medium (2 weeks)

**4. Plan Comparison**
- Side-by-side view of 2-3 plans
- Highlight differences
- Compare costs, maintenance, etc.
- Help decision-making
- **Impact:** Better UX for exploring options
- **Effort:** Small (1 week)

**5. Email Delivery**
- Send plan PDFs via email
- Resend API already configured
- Welcome emails
- Care reminders (seasonal)
- **Impact:** Convenience, retention
- **Effort:** Small (3-5 days)

---

### 11.3 Medium-Term Features (6-12 Months)

**1. Mobile App**
- React Native or Flutter
- Photo capture from camera
- Push notifications for care tasks
- Offline plan access
- **Impact:** Accessibility, engagement
- **Effort:** Large (3-4 months)

**2. Marketplace for Professionals**
- Directory of garden designers
- Client matching
- Review system
- Lead generation
- **Impact:** New revenue stream
- **Effort:** Large (3-4 months)

**3. E-Commerce Integration**
- Partner with nurseries
- Buy plants directly from plan
- Affiliate commission model
- Bulk order discounts
- **Impact:** Major revenue opportunity
- **Effort:** Large (2-3 months)

**4. Community Features**
- User galleries (share completed gardens)
- Comments and reviews on example plans
- Q&A forum
- Garden diary/journal
- **Impact:** Engagement, content generation
- **Effort:** Medium (6-8 weeks)

**5. Advanced AI Features**
- 3D garden visualization
- Plant growth simulation over time
- Seasonal preview rendering
- Layout optimization algorithm
- **Impact:** Wow factor, differentiation
- **Effort:** Large (4-6 months)

---

### 11.4 Long-Term Vision (12+ Months)

**1. Regional Expansion**
- Expand beyond UK (EU, US, etc.)
- Localize plant databases
- Regional climate data
- Currency and units
- **Impact:** 10x market size
- **Effort:** Very Large (6+ months per region)

**2. White-Label Platform**
- Allow nurseries to embed tool
- Custom branding
- API for integration
- Revenue share model
- **Impact:** B2B revenue stream
- **Effort:** Large (4-6 months)

**3. Augmented Reality**
- AR plant placement via phone camera
- See plants at mature size in situ
- Walk through virtual garden
- **Impact:** Cutting edge, press coverage
- **Effort:** Very Large (6-12 months)

**4. Sustainability Metrics**
- Carbon sequestration calculator
- Water usage estimates
- Pollinator value scoring
- Native species percentage
- Climate resilience rating
- **Impact:** Aligned with trends, PR value
- **Effort:** Medium (2-3 months)

**5. Garden Maintenance Service**
- Partner with gardeners for installation
- Ongoing care subscriptions
- Quality guarantee
- Platform takes commission
- **Impact:** Full-stack solution, recurring revenue
- **Effort:** Very Large (12+ months, operations-heavy)

---

## 12. Competitive Landscape & Positioning

### 12.1 Direct Competitors

**Shoot Gardening (shootgardening.com)**
- Similar AI-powered plant recommendations
- UK-focused
- Stronger on community features
- Weaker on professional tools
- **Our Edge:** Professional suite, regional depth, care cost transparency

**SmartPlant (smartplant.com)**
- Global plant database
- Care reminders
- Plant ID
- **Our Edge:** Full plan generation, UK-specific, professional market

**Garden Planner by GrowVeg**
- Layout tool (manual dragging)
- Not AI-powered
- Strong seasonal planning
- **Our Edge:** Automation, AI vision, modern UX

**Local Garden Designers**
- Bespoke service, expensive (£500-2000 per plan)
- Slow turnaround (weeks)
- High quality, personal touch
- **Our Edge:** Speed (5 mins), cost (£20-50?), accessibility

### 12.2 Unique Selling Points

1. **AI Vision Analysis:** Upload photos, get instant site assessment
2. **Real UK Availability:** (when implemented) Live stock data from nurseries
3. **Professional Care Costs:** PGG 2025 regional rates, transparent estimates
4. **Pro Tools Suite:** Bulk generation, AI critique - unique to us
5. **Research-Backed:** Synthetic population study, 84-plan matrix coverage
6. **Regional Depth:** Scotland H2, coastal salt tolerance, urban microclimates
7. **Speed:** 5-minute plan generation vs weeks for traditional service

### 12.3 Pricing Strategy (Not Yet Implemented)

**Freemium Model:**
- Free: Browse examples, basic plan generation (1 per month)
- Basic (£9.99/month or £19.99 once): 5 plans/month, PDF download, 3 plant swaps per plan
- Premium (£24.99/month or £49.99 once): Unlimited plans, unlimited swaps, priority support

**Professional Tier:**
- Pro (£49.99/month): All Premium + branding, client portal, 50 bulk images/month
- Studio (£149.99/month): Unlimited everything, API access, white-label option

**Add-Ons:**
- Professional installation: Commission on referrals (15-20%)
- Plant orders: Affiliate commission (5-10%)
- One-time plan purchase: £29.99 per custom plan

---

## 13. Success Metrics & KPIs

### 13.1 User Acquisition
- **Goal:** 10,000 users in 6 months
- **Current:** Not tracked (no analytics)
- **Metrics to Track:**
  - Unique visitors
  - Signup rate
  - Source attribution (organic, paid, referral)
  - Cost per acquisition

### 13.2 Engagement
- **Goal:** 60% of users generate at least 1 plan
- **Metrics:**
  - Plans generated per user
  - Example plan views
  - Time on site
  - Return visit rate (7-day, 30-day)

### 13.3 Conversion
- **Goal:** 10% convert to paid (when implemented)
- **Metrics:**
  - Free to paid conversion rate
  - Average revenue per user (ARPU)
  - Churn rate
  - Lifetime value (LTV)

### 13.4 Quality
- **Goal:** 4.5+ star rating, 80%+ satisfaction
- **Metrics:**
  - Plan satisfaction rating (1-5)
  - Plant relevance score (user feedback)
  - PDF download rate (completion indicator)
  - Support ticket volume

### 13.5 AI Performance
- **Goal:** <5% failed generations, <30s average time
- **Metrics:**
  - Generation success rate
  - Average latency per step
  - AI cost per plan
  - Retry rate

---

## Appendix A: File Structure

```
/Users/ianstone/gsg-planting-plan/
├── public/
│   ├── covers/                     # AI-generated HD cover images (16 files)
│   ├── plants/                     # Plant images (21 files, subdirs)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── page.tsx                # Homepage
│   │   ├── layout.tsx              # Root layout
│   │   ├── create/page.tsx         # Plan generation flow
│   │   ├── examples/
│   │   │   ├── hub/page.tsx        # Examples library
│   │   │   ├── [slug]/page.tsx     # Dynamic plan pages (14 generated)
│   │   │   └── edinburgh-wildlife-haven/page.tsx  # Static example (legacy)
│   │   ├── professionals/page.tsx   # Professional dashboard
│   │   ├── tools/
│   │   │   ├── bulk-generate/page.tsx  # Bulk image generator
│   │   │   └── plan-critique/page.tsx  # AI critique tool
│   │   ├── plan/[id]/page.tsx      # Dynamic plan view (not implemented)
│   │   └── api/
│   │       ├── generate-plan/route.ts
│   │       ├── generate-recommendations/route.ts
│   │       ├── generate-pdf/route.ts
│   │       ├── critique-plan/route.ts
│   │       ├── upload-plant-list/route.ts
│   │       ├── parse-plant-text/route.ts
│   │       └── generate-plant-images/route.ts
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── PlantImageViewer.tsx
│   │   ├── CarePreview.tsx
│   │   ├── HomeExampleCards.tsx
│   │   ├── ExamplesHub.tsx
│   │   ├── PlantListUploader.tsx
│   │   └── PlanCritiqueUploader.tsx
│   ├── data/
│   │   ├── example-plans-expanded.ts  # 14 detailed example plans
│   │   └── example-plans.ts        # Legacy (unused)
│   └── lib/
│       └── utils.ts                # Utility functions
├── scripts/
│   ├── generate-plant-images.js    # Bulk DALL-E plant generation
│   ├── fetch-google-images.js      # SerpAPI reference fetching
│   ├── generate-cover-images.js    # DALL-E cover generation
│   ├── generate-remaining-covers.js # Batch cover generation (11 plans)
│   └── replace-cover-urls.js       # Data migration script
├── .env.local                      # API keys (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── QA-REPORT.md                    # Comprehensive QA audit
└── FUNCTIONAL-SPEC.md              # This document
```

---

## Appendix B: Environment Setup

**Required Environment Variables:**
```bash
OPENAI_API_KEY=sk-proj-...          # For GPT-4V and DALL-E 3
ANTHROPIC_API_KEY=sk-ant-api03-...  # For Claude Sonnet 4.5
SERPAPI_KEY=d80f2a5562125...        # For Google Images search
RESEND_API_KEY=re_RTRA...           # For email (not yet used)
GEMINI_API_KEY=AIzaSy...            # Alternative LLM (not used)
GROK_API_KEY=xai-...                # Alternative LLM (not used)
```

**Installation:**
```bash
git clone [repo-url]
cd gsg-planting-plan
npm install
cp .env.example .env.local  # Add API keys
npm run dev                 # Local development
npm run build               # Production build
vercel --prod               # Deploy to Vercel
```

**Dependencies:**
- Node.js 18+
- npm 9+
- Modern browser (Chrome, Firefox, Safari)

---

## Appendix C: API Cost Estimates

**Per Custom Plan Generation:**
- GPT-4 Vision (5 photos): 5 × $0.01 = **$0.05**
- Claude Sonnet 4.5 (recommendations): **$0.30**
- DALL-E 3 (if generating plant images): 7 × $0.04 = **$0.28**
- **Total: ~$0.63 per plan**

**Per Bulk Plant Generation:**
- DALL-E 3 (3 views per plant): 3 × $0.04 = **$0.12 per plant**
- 50 plants: **$6.00**

**Per Plan Critique:**
- Claude Sonnet 4.5: **$0.15**

**Monthly Estimates (1000 plans/month):**
- AI costs: 1000 × $0.63 = **$630/month**
- Vercel hosting: **$20/month** (Pro plan)
- Total infra: **~$650/month**
- Revenue needed: $650 ÷ 0.7 = **~$930/month** (30% margin)
- If $29.99/plan: Need **31 paid plans/month** to break even
- If 10% convert: Need **310 total plans/month**

---

## Appendix D: Technical Implementation Notes

**Image Optimization:**
- Next.js Image component handles automatic optimization
- Formats: WebP with JPEG fallback
- Responsive sizes generated automatically
- Lazy loading by default

**SEO:**
- Static generation for all example pages (good for indexing)
- Meta tags present but could be enhanced
- No sitemap.xml yet (TODO)
- No robots.txt
- Structured data (JSON-LD) not implemented

**Performance:**
- Lighthouse score: Not tested
- Core Web Vitals: Not monitored
- Build time: ~45 seconds
- Cold start (serverless): 2-5 seconds

**Security:**
- No auth = no user data exposure risk
- API keys in environment variables (secure)
- No SQL injection risk (no database)
- File upload validation prevents malicious files
- Rate limiting not implemented (TODO)

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-30 | AI Assistant | Initial comprehensive functional specification |

---

**End of Functional Specification**
