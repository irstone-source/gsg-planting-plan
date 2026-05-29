# Landscape Plans — Product & Business Scope

**Status:** Scoping / vision
**Date:** 2026-05-29
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

The new build is concentrated in: **the crawl/ingest pipeline, the dimensions-driven footprint + snap layer, the top-down render, and the multi-supplier referral basket.** (3D meshes + snap metadata are a v2 fidelity upgrade, not a launch requirement.)

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

## 9. The one-paragraph pitch

PlantingPlans already nails the planting. **Landscape Plans** opens it up to the whole garden. We **bootstrap the catalogue by crawling the ecommerce sites that already sell the kit** — no manufacturer cooperation needed to start — and turn each product into a real-dimensioned, snap-together module with a simulated top-down view from its photos. Anyone can plug together a real, costed, buyable garden with no design skills; the output is a shopping list that refers traffic out to the retailers (who want it). Free users publish their layouts, so the template library — and the SEO, and the shoppable content — compounds itself. Once there's an audience and demand data, suppliers pay a small fee to be listed, featured, and to embed the configurator on their own sites. Two-sided marketplace, self-curating catalogue, and an existing product to build it on — with the hardest dependency engineered away.
