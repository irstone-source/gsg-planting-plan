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
2. **Drop modules** — from a catalogue of manufacturer 3D products, grouped by function (ground, structure, planting, features, lighting, furniture).
3. **Plug & snap** — modules constrain each other; the layout self-sorts.
4. **See it** — 2D plan + 3D walkthrough.
5. **Cost it** — live basket: per-supplier line items, totals, lead times.
6. **Buy / quote / share** — checkout, request quote, or save & publish.

### 3.2 The 3D asset pipeline (the make-or-break dependency)
- **Source of truth:** manufacturer-supplied 3D files (glTF/GLB target; accept STEP/OBJ/SKP and normalise).
- **Normalisation:** consistent scale, origin, materials, LODs, and a **snap/connection metadata** layer (anchor points, valid neighbours, footprint). This metadata is what makes modules "plug together" — it's our IP, not the raw mesh.
- **Catalogue record per product:** SKU, dimensions, price, stock/lead time, supplier, install notes, the GLB, and the snap metadata.
- **Fallback** for suppliers without 3D: parametric primitives + photo texture, or a "request 3D" queue. Don't let a missing asset block listing.

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

The new build is concentrated in: **the 3D asset pipeline, the snap/connection metadata layer, the 3D viewer, and the multi-supplier basket.**

---

## 7. Phasing

**Phase 0 — Validate the supply side (no code).** Can we actually get 3D files and a "yes" on a listing fee? Sign 2–3 anchor manufacturers per category. *If this fails, nothing else matters — do it first.*

**Phase 1 — 2D configurator, single category.** Snap-together modules in plan view, one strong category (e.g. paving + raised beds), live basket, publish-by-default. Proves the loop cheaply.

**Phase 2 — 3D viewer + multi-category + multi-supplier basket.** GLB pipeline, walkthrough, cross-supplier checkout/quote.

**Phase 3 — Marketplace flywheel.** Ranking/self-sort, remix, supplier analytics dashboard, white-label embeddable widget for supplier sites.

**Phase 4 — Pro layer.** Installer quoting, larger projects, the "design" upsells we deferred.

---

## 8. Open questions / risks (to resolve before committing build)

1. **Asset supply is the keystone.** Will manufacturers actually hand over usable 3D files? What's the fallback coverage if half won't? → Phase 0.
2. **Snap metadata cost.** Authoring connection metadata per SKU is real work — who does it, us or the supplier, and how do we keep it cheap at catalogue scale?
3. **Pricing accuracy & checkout model.** Do we transact, or hand off to supplier carts? Live pricing/stock integration is non-trivial across many suppliers.
4. **Publish-by-default consent & moderation.** Clear opt-in, takedown, and quality-control for a public UGC layout library.
5. **Which revenue line leads?** Listing fee is easiest to sell pre-volume; commission is the bigger prize later. Sequence deliberately.
6. **Scope discipline.** The pull toward "real garden designer" is strong and is the graveyard of this category. Hold the line on *configurator, not CAD* for v1.

---

## 9. The one-paragraph pitch

PlantingPlans already nails the planting. **Landscape Plans** opens it up to the whole garden: partner with manufacturers, ingest their products as snap-together 3D modules, and let anyone plug together a real, costed, buyable garden — no design skills needed. Free users publish their layouts, so the template library (and the SEO, and the shoppable content) compounds itself. Suppliers pay a small fee to be listed, promote the configurator on their own sites, and get their products in front of high-intent buyers in context. Two-sided marketplace, self-curating catalogue, and an existing product to build it on.
