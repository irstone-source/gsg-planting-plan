# Landscape Plans — Product & Business Scope

**Status:** Scoping / vision
**Date:** 2026-05-29 (rev. with crawl-first pipeline, agentic operating model, imagery canvas & Google UCP/AP2)
**Owner:** Ian (Cambray Design)
**Branch:** `claude/landscape-plans-scope-YO6yV`

---

## 1. The thesis in one line

> If we partner with the manufacturers and get every product as a 3D file, we have effectively built an **ecommerce product configurator for a garden**.

It is *not* a garden designer in the CAD sense. It's a **module configurator**: people plug together pre-modelled, real, buyable components — decking, paving, raised beds, pergolas, fencing, lighting, water features, furniture, and (via the existing PlantingPlans engine) the planting itself — and the result is a layout they can both *see* and *buy*.

PlantingPlans already solves the hardest, most defensible half of this (the planting). Landscape Plans wraps the rest of the garden around it.

---

## 2. Why this is different from "garden design software"

Existing tools split into two camps, and both have a gap we exploit:

| Camp | Examples | Gap |
|------|----------|-----|
| **Pro CAD** (hard, expensive, empty) | Vectorworks Landmark, SketchUp, AutoCAD | Steep learning curve; models are generic, not buyable; no commerce |
| **Toy planners** (easy, shallow, fake) | Marshalls/most retailer "garden planners" | Single-brand, low fidelity, dead-end — you can't build a *whole* garden |

**Our wedge:** the constraint *is* the feature. Because every block is a real, manufacturer-supplied 3D product with real dimensions, price, and lead time, the configurator can:

- **self-sort** — modules snap, align, and validate against each other (a 2.4 m pergola wants a 2.4 m base; a raised bed kit comes in fixed widths), so a novice can't build something nonsensical;
- **stay buyable** — every layout resolves to a basket of SKUs across suppliers;
- **go a long way without being "design"** — you assemble proven modules rather than draw from scratch.

---

## 3. The product, in modules

### 3.1 Core loop
1. **Set the canvas** — boundary + dimensions (reuse existing bed-tracing / scale-calibration tooling).
2. **Drop modules** — from a catalogue of real products, grouped by function (ground, structure, planting, features, lighting, furniture).
3. **Plug & snap** — modules constrain each other by their real dimensions; the layout self-sorts.
4. **See it** — top-down plan first (simulated render from product photos); 3D walkthrough later.
5. **Cost it** — live basket: per-supplier line items, totals, lead times.
6. **Buy / quote / share** — referral-out to retailer, request quote, or save & publish.

### 3.2 The asset pipeline — crawl first, 3D later

We originally treated manufacturer-supplied 3D files as the keystone dependency. **We can sidestep that entirely for v1.** The cleanest way to remove the first block is to **bootstrap the catalogue ourselves by crawling the ecommerce sites that already sell the kit.** We don't need anyone's permission or cooperation to start — and the only thing we send back to retailers is referral traffic, which they want.

**v1 — Crawl & ingest (no supplier involvement):**
- **Crawl** garden-product ecommerce/PDP pages: title, **dimensions**, price, category, description, and product images.
- **Catalogue record per product:** SKU/URL, footprint (W×D from the spec), price, supplier, category, image set, affiliate/referral link. Dimensions are the load-bearing field — they drive footprint, snap, and self-sort.
- **Place by spec, not by mesh.** The user drops a real-dimensioned **footprint** onto the plan. No 3D model required to start.
- **Simulated top-down render.** Generate a plausible plan-view tile for each product from its photos (crop/normalise the most top-down-ish image, or AI-derive a top-down thumbnail), scaled to its real footprint. Good enough to read a layout.
- **Feed of what they're installing.** Every layout produces a shopping list with the product image, name, dimensions, price, and a buy link per item — "the list of what they're installing." This *is* the deliverable and the referral surface.

**v2+ — Upgrade fidelity where it pays off:**
- Replace simulated tiles with real **glTF/GLB** for high-value/high-volume modules (supplier-supplied or commissioned), plus the **snap/connection metadata** layer (anchor points, valid neighbours) — that authored metadata, not the raw mesh, is our IP.
- This becomes a *carrot* for suppliers later ("pay to be listed and we'll model your range properly / feature you"), not a launch blocker.

### 3.2.1 Crawl risks to manage (not blockers)
- **ToS / robots / rate-limits** — crawl politely; prefer feeds/affiliate-network product data (e.g. Awin/affiliate APIs) where available, which is sanctioned and cleaner than scraping.
- **Image rights** — using product photos to *promote a sale of that product* is generally tolerated and in the retailer's interest, but AI-derived top-down tiles are safer ground; keep originals attributable and honour takedowns.
- **Data freshness** — prices/stock drift; show "last checked", re-crawl on a schedule, and treat the basket as a referral hand-off, not a live cart, in v1.
- **Dimension quality** — specs are inconsistent/missing; needs parsing + a manual/AI clean-up queue and sensible fallbacks.

### 3.3 What we deliberately *don't* build (v1)
- Free-form CAD drawing, terrain/levels engineering, drainage/structural calc, planning-permission logic. Park these as "for the professional" upsells later.

---

## 4. The growth engine: community layouts

> "As people publish designs, there'll be more and more layouts to choose from… it will almost self-sort. If you use it for free, it automatically shares your layout."

This is the flywheel and it's the most valuable idea here:

- **Free tier publishes by default.** Use it for nothing → your layout becomes a public, remixable template (clearly disclosed at sign-up). Want it private → that's the paid tier.
- **Layouts are the content.** Every published garden is SEO-rich, shoppable, and remixable ("start from this one"). The library compounds without us authoring it.
- **Self-sorting / ranking.** Surface layouts by buy-through, remix count, ratings, garden type, budget band, aspect/region. The best designs rise; the catalogue curates itself.
- **Cold-start:** seed with the existing 9 designer-style example plans + a batch of in-house "starter gardens" so day-one users have something to remix.

This directly extends the existing examples hub and designer-styles marketplace — it's the same idea, opened up to user-generated, *buyable* layouts.

---

## 5. Business model

Two-sided marketplace. Multiple, stackable revenue lines — but **don't levy them all at launch**; lead with the one that needs the least trust.

### 5.1 Supply side (manufacturers / suppliers)
- **Listing fee** — "all suppliers should be willing to pay a small fee to be listed." Tiered (basic listing → featured placement → analytics). Low friction; recurring.
- **Transaction / referral commission** on baskets routed to them — likely the real long-term margin, but harder to land before we have volume. Phase this in.
- **Promoted placement** within relevant module categories.
- **Distribution in exchange for listing:** "as well as if they'll promote it." Make a co-marketing ask part of onboarding — supplier embeds a "Design with our products" configurator on *their* site (white-label widget), driving their traffic into our funnel. This is how we grow without ad spend.

### 5.2 Demand side (homeowners / pros)
- **Free** (publishes publicly) → **Paid** (private layouts, HD/print exports, no-share, pro tools).
- **Affiliate / installer** layer (already scaffolded at `/affiliate`, `/professionals`) — landscapers use it to quote and order.

### 5.3 Why suppliers say yes
- Their products shown *in context*, configured into real gardens, in front of high-intent buyers.
- A free 3D-configurator widget for their own site (most can't build one).
- Demand signal + analytics: what gets configured, costed, and bought.

---

## 6. How it builds on what already exists

We are **not** starting from zero. Reuse:

- **Planting engine + plant DB + scientific symbols** → the "planting" module category, already the hardest part.
- **Designer styles** → curated module *kits* ("Oudolf prairie border kit", "modern courtyard kit").
- **Suppliers / partners / affiliate pages** (`src/app/suppliers`, `/partners`, `/affiliate`) → the supply-side onboarding and the listing-fee surface already have a home.
- **Examples hub + cloud save/load + Google auth** → the community-layout library and publish-by-default loop.
- **Scale calibration, bed tracing, paper-size export, growth timeline** → canvas + plan-output tooling.

The new build is concentrated in: **the agentic product-pipeline factory (§9), the imagery→scale→grid canvas (§10), the dimensions-driven footprint + snap layer, the top-down render, and the pluggable multi-supplier basket (§12).** (3D meshes + snap metadata are a v2 fidelity upgrade, not a launch requirement.)

---

## 7. Phasing

The crawl-first pipeline (§3.2) removes the old Phase 0 supplier-sign-up blocker. We can **build the catalogue unilaterally** and earn the right to charge suppliers *after* we have an audience.

**Phase 1 — Crawl + 2D configurator, single category.** Ingest one strong category (e.g. paving + raised beds) from retail sites, dimensions-driven footprints, simulated top-down tiles, snap, publish-by-default, and a referral-out shopping list. Proves the whole loop with zero supplier dependency.

**Phase 2 — Breadth + community flywheel.** More categories, more crawled suppliers, ranking/self-sort, remix, the UGC layout library. This is where the content compounds.

**Phase 3 — Monetise the supply side.** Now that there's an audience and demand data, sell listing fees / featured placement, give suppliers an analytics dashboard, and offer the white-label embeddable widget for their own sites.

**Phase 4 — 3D fidelity + pro layer.** GLB models + snap metadata for high-value modules, 3D walkthrough, installer quoting, larger projects, and the "design" upsells we deferred.

---

## 8. Open questions / risks (to resolve before committing build)

1. **Crawl legality & sourcing.** Scrape vs. sanctioned affiliate-network product feeds (Awin etc.) — prefer feeds where they exist. Respect ToS/robots; honour takedowns. *(De-risked vs. the old "will manufacturers give us 3D files" keystone — now a managed risk, not a blocker.)*
2. **Dimension & spec quality at scale.** Specs are inconsistent/missing across sites; needs robust parsing + an AI/manual clean-up queue. This is the new long-pole, since dimensions drive everything.
3. **Top-down render quality.** How convincing does the simulated tile need to be before the plan reads well? Where's the floor before it feels fake?
4. **Pricing/stock freshness & checkout model.** v1 is a referral hand-off, not a live cart — show "last checked", re-crawl on schedule. Decide if/when we ever transact.
5. **Publish-by-default consent & moderation.** Clear opt-in, takedown, and quality-control for a public UGC layout library.
6. **Which revenue line leads, and when.** Referral commission is uncontroversial and immediate; listing fees come after audience. Sequence deliberately.
7. **Scope discipline.** The pull toward "real garden designer" is strong and is the graveyard of this category. Hold the line on *configurator, not CAD* for v1.

---

## 9. The operating model: a continuous product-pipeline "factory"

The catalogue isn't a one-off build — it's a **living dataset we continuously amass and keep clean.** That calls for an always-on, agentic process with a heartbeat, defined roles, quality gates, and a daily report. The job is simple to state and hard to do well: *strategically grow the library of installable products, driven by measured demand, market insight, and supplier deals — while keeping the data trustworthy.*

### 9.1 Why agentic + always-on
- Sourcing is unbounded and repetitive (thousands of SKUs across hundreds of retailers) — ideal for parallel agents.
- Priorities shift with demand and seasonality — needs a strategist in the loop, not a static crawl list.
- Data rots (prices, stock, URLs) — needs continuous re-validation, not a single import.

### 9.2 The agent roster

| Agent | Role | Output |
|-------|------|--------|
| **Sourcing agents** (parallel fan-out) | Discover products on retail sites; **prioritise sources with an affiliate programme or product feed**. Each agent owns a category, supplier, or region brief. | Candidate product records (raw) |
| **Enrichment / render agent** | Parse specs → dimensions/footprint; normalise; generate the simulated top-down tile from product photos. | Enriched records + render assets |
| **Quality agent** (gatekeeper) | Validate dimensions, dedupe, score confidence, check image/render quality, enforce schema. Nothing goes **live** without passing. | Pass/fail + confidence score + review-queue items |
| **Ecommerce / Product-Manager agent** (orchestrator) | The strategist. Reads demand signals + market intel + supplier pipeline → writes the sourcing briefs, sets priorities, owns pipeline KPIs. | Prioritised brief queue + daily report |
| **Supplier / BD agent** | Track potential suppliers to sign up, affiliate-network enrolment status, deals worth pursuing. | Supplier CRM pipeline |
| **Design agents** (see §11) | Generate suggested layouts/configurations; learn from published layouts + buy-through. | In-product suggestions |

Human-in-the-loop stays the editor-in-chief: approves edge cases in the review queue, signs off supplier deals, and can override priorities. Agents draft; humans ratify what's ambiguous.

### 9.3 The heartbeat (daily loop) + daily report
A scheduled run (the "heartbeat" — e.g. a daily Claude Code on the web session or a cron/GitHub-Action-triggered job) drives one cycle:

1. **PM agent** reviews yesterday's demand signals + KPIs → updates the brief queue.
2. **Sourcing agents** fan out against the top briefs.
3. **Enrichment + render** process candidates.
4. **Quality agent** gates them; clean records go live, ambiguous ones to the review queue.
5. **Supplier/BD agent** updates the pipeline.
6. **Daily report** posted (Slack/email/issue): *added today, live-catalogue size, quality pass-rate, top unmet-demand gaps, stale records re-checked, supplier-pipeline movement, and the next briefs.*

> The report-in-every-day cadence is the forcing function that turns "a good idea" into something that actually compounds.

### 9.4 The dataset we're amassing (data model sketch)
- **`products`** — SKU/source URL, supplier, category, **footprint (W×D from spec)**, price, stock/lead time, image set, **render tile**, affiliate/referral link, **provenance + confidence score**, **lifecycle status** (`discovered → enriched → quality-passed → live → stale → retired`), `last_checked`.
- **`demand_signals`** — searches with no result, placed-but-unpriced items, abandoned categories, explicit "I want X" requests, buy-through per SKU, popular published layouts. *This is the feedstock for the PM agent.*
- **`sourcing_briefs`** — prioritised work queue for sourcing agents.
- **`suppliers`** — BD pipeline + affiliate-enrolment state.

### 9.5 Quality is a first-class product (dataset integrity)
"Continually amassing a huge dataset and making sure there's quality in it." Concretely:
- **Confidence score** per record; below threshold → review queue, never silently live.
- **Dimensions are sacred** — they drive footprint, snap, and scale, so they get the strictest validation (sanity ranges, cross-checks, unit normalisation).
- **Freshness SLA** — re-crawl cadence per record; surface "last checked"; auto-retire dead URLs.
- **Dedupe** across retailers selling the same product.

### 9.6 Demand-driven sourcing (the strategic part)
The PM agent grows the library where it pays, prioritising by:
- **Measured demand** — what users place, search for, and *can't* find (the unmet-demand gaps are gold).
- **Market intelligence / insight** — seasonality, trends, high-margin or high-attach categories.
- **Supplier deals** — signed suppliers and affiliate availability get a sourcing boost.

---

## 10. The canvas: imagery → scale → grid → plot

We don't reinvent garden design; we give people a clean, to-scale surface and let them plot proven modules onto it. Modelled on the OpenSolar approach (and reusing our existing **scale-calibration** and **bed-tracing** tooling):

1. **Acquire imagery** for the user's address — Google Maps / **Google Solar API** ground imagery, or higher-res aerial via an imagery marketplace (Nearmap-style). Solar API tiles are geo-referenced, so scale can often be **auto-derived** from metadata.
2. **Calibrate scale** — where auto-scale isn't available, the user draws a line between two points of known real-world length (e.g. a wall, a standard slab) and enters the distance — exactly the OpenSolar pattern, and exactly what our scale-calibration code already does.
3. **Overlay an alignable grid** — user rotates/aligns the grid to their plot boundary.
4. **Plot to scale** — drop real-dimensioned modules; they snap to the grid and to each other (§3). Most of this is deliberately simple — assembly, not CAD.

The output is the same buyable, shareable, costed layout — now anchored to the user's *actual* garden footprint.

---

## 11. Design agents (AI on top, not instead of)

We are explicitly **not** building an auto-designer. The canvas stays a human assembly tool. AI sits *on top* as suggestion and acceleration:

- **Suggest configurations** — "for this aspect/size/budget, here's a starting layout" (seeded by published layouts + designer styles + buy-through data).
- **Complete & critique** — "you've placed decking; most people add a pergola here / your path is below standard width."
- **Auto-cost & optimise** — swap modules to hit a budget, or maximise buy-through-proven combos.
- **Learn from the flywheel** — the published-layout corpus (§4) is training/grounding data; popular, high-buy-through designs inform suggestions. The library and the design agents improve each other over time.

This is where the catalogue, the community flywheel, and the agent fabric converge into a moat.

---

## 12. Payments & checkout: affiliate now, Google UCP / AP2 next

Sequence the rails to match what's actually available in the UK:

- **Now (UK) — affiliate referral-out.** Per-SKU buy links via affiliate networks (Awin etc.). Uncontroversial, works today, no checkout to build. v1 basket = a referral hand-off, not a live cart.
- **Next — Google Universal Cart / Universal Commerce Protocol (UCP) / Agent Payments Protocol (AP2).** Google's 2026 stack is almost purpose-built for our cross-supplier basket: a **cross-merchant cart built on Google Wallet**, Google Pay checkout or transfer-to-merchant, and an open protocol (**REST + MCP binding, AP2/A2A-compatible**) — the *same* agent fabric we're building for sourcing and design. AP2's signed **Intent → Cart → Payment** mandates (with spend guardrails) are the natural rail for **design agents eventually purchasing on a user's behalf**.
- **The catch: geography & timing.** Universal Cart / UCP checkout launches **US-first (summer 2026), then Canada/Australia, with the UK *later*.** UCP is also single-merchant today with **multi-item/multi-merchant carts on the roadmap** — i.e. our exact need is "coming," not shipped.
- **So: design for it, don't depend on it.** Build a **pluggable checkout abstraction** behind the basket. Ship affiliate referral in the UK now; adopt UCP/Universal Cart the moment it lands in the UK and supports multi-merchant. Because UCP speaks MCP/A2A/AP2, our agents integrate without re-platforming.

*Sources:* [Universal Cart (Google blog)](https://blog.google/products-and-platforms/products/shopping/google-shopping-cart/) · [UCP for developers](https://developers.google.com/merchant/ucp) · [AP2 announcement (Google Cloud)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol) · [AP2 docs](https://ap2-protocol.org/) · [OpenSolar manual scaling](https://support.opensolar.com/hc/en-us/articles/13251322728975-How-to-design-in-Manual-mode) · [Google Solar/Nearmap imagery on OpenSolar](https://help.nearmap.com/kb/articles/87-nearmap-on-opensolar)

---

## 13. The one-paragraph pitch

PlantingPlans already nails the planting. **Landscape Plans** opens it up to the whole garden. We **bootstrap the catalogue by crawling the ecommerce sites that already sell the kit** — no manufacturer cooperation needed to start — and turn each product into a real-dimensioned, snap-together module with a simulated top-down view from its photos. Anyone can plug together a real, costed, buyable garden with no design skills; the output is a shopping list that refers traffic out to the retailers (who want it). Free users publish their layouts, so the template library — and the SEO, and the shoppable content — compounds itself. Once there's an audience and demand data, suppliers pay a small fee to be listed, featured, and to embed the configurator on their own sites. Two-sided marketplace, self-curating catalogue, and an existing product to build it on — with the hardest dependency engineered away.
