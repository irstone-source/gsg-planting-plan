# Landscape Plans — Phase 1 Sourcing Seed Roster

**Status:** Seed list for the ingest pipeline (Phase 1)
**Date:** 2026-05-29
**Companion to:** `LANDSCAPE-PLANS-SCOPE.md` (§3.2 crawl-first pipeline, §9 agentic factory)

This is the **starting brief** for the sourcing agents — the first set of suppliers/products to ingest, drawn from Ian's own resources and contacts. It doubles as the seed for the `sourcing_briefs` queue (§9.4).

---

## How to read this

Two ingestion **routes**, prioritised per the strategy ("prioritise sources with an affiliate programme or feed"):

- **🟢 Affiliate** — has a public affiliate programme / product feed → ingest now, monetises immediately via referral, lowest friction.
- **🔵 Direct** — premium / trade / dealer-network brand with no public affiliate → **Supplier/BD agent** outreach to sign up (this is the "suppliers we can actually sign up with" path). Often the highest-value, best-configurator-fit products.
- **🟡 Affiliate alternative** — where the named brand is trade-only, an equivalent affiliate retailer can seed the category immediately while BD pursues the premium brand.

> Ian can supply resources/assets directly for several of these — flagged **[Ian]** — which can bypass crawling entirely for a clean first import.

---

## Seed roster by category

### 🍳 Outdoor kitchens — **recommended Phase 1 hero category**
Inherently modular ("all the permutations people can put together"), high value, visually compelling, multiple suppliers to permute. The perfect proof of the snap-together loop.

| Supplier | Route | Products | Notes |
|----------|-------|----------|-------|
| **Grillo** | 🔵 Direct | Modular powder-coated steel kitchen units, BBQs (gas/charcoal/electric/pizza), sink, fridge, drinks station, planters, bar + seating | UK-built (Cambridge). **Already has an online configurator** → strong partner fit & possible data source. |
| **Cubic** *(/ "UO" — confirm)* | 🔵 Direct | Modular outdoor kitchen systems (CUBIC Tough / Resysta, Lignum-T cladding) | German brand sold via UK resellers (TMFC, Fire Magic). Premium (~£24k). |
| *Permutations* | — | Cross-supplier kitchen module library | Goal: let users mix modules across kitchen suppliers into one buildable run. |

### 🏛️ Pergolas & structures (bioclimatic / louvered)
| Supplier | Route | Products | Notes |
|----------|-------|----------|-------|
| **Renson** | 🔵 Direct | Algarve (and Camargue/Amani/Lapure) louvered bioclimatic pergolas; add-on screens, lighting, heaters | Belgian; UK **dealer network** → sign-up/dealer route. Up to 6×6 m unsupported. |
| **IKON** *(confirm brand)* | 🔵 Direct | Bioclimatic pergola | Brand not yet verified — **needs confirmation** (exact maker/URL). |

### 🧱 Paving & hard landscaping
| Supplier | Route | Products | Notes |
|----------|-------|----------|-------|
| **London Stone** | 🔵 Direct **[Ian]** | Full catalogue: natural stone & porcelain paving, bespoke fabricated stone, composite decking, wall cladding | B2B/trade-focused; no public affiliate → sign-up route. Recent online tie-up with Paving Superstore. |
| *Pavers / Simply Paving / Paving Superstore* | 🟡 Affiliate alt | Porcelain/stone paving | Seeds the paving category now while BD pursues London Stone. |

### 🪵 Fencing
| Supplier | Route | Products | Notes |
|----------|-------|----------|-------|
| **Jacksons Fencing** | 🔵 Direct **[Ian]** | Entire catalogue: panels, trellis, gates, posts | Est. 1947; no Awin programme found → sign-up route. |
| *Buy Fencing Direct* | 🟡 Affiliate alt | Fence panels, gates | Awin, ~5% → seeds fencing category immediately. |

### ☂️ Shade — umbrellas, sunshades, shade sails
| Supplier | Route | Products | Notes |
|----------|-------|----------|-------|
| *Shade suppliers (TBC)* | 🟢/🔵 | Parasols, cantilever umbrellas, sunshades, **shade sails** | **Note:** Pagazzi is a *lighting* retailer (below), not shade — need a dedicated shade/parasol supplier here. Ian to nominate, or affiliate source TBC. |

### 💡 Lighting
| Supplier | Route | Products | Notes |
|----------|-------|----------|-------|
| **Pagazzi** | 🟢 Affiliate | Outdoor lighting (+ mirrors/decor) | One of UK's largest independent lighting retailers; affiliate via FlexOffers, 30-day cookie. |

### 🪑 Furniture & garden buildings
| Supplier | Route | Products | Notes |
|----------|-------|----------|-------|
| **Blue Diamond** | 🔵 Direct | Garden **furniture** + **garden buildings** ("buildings") | Large garden-centre group; no affiliate found → sign-up route. |
| **Dobbies** | 🔵 Direct | Broad range: furniture, decor, plants | Affiliate (Paid On Results) appears **closed** → verify or sign-up route. Good breadth to "show on the site." |
| *Furniture suppliers (TBC)* | — | Quality outdoor furniture | Ian to nominate specific preferred suppliers. |

### 🌱 Planting
| Supplier | Route | Products | Notes |
|----------|-------|----------|-------|
| **Crocus** | 🟢 Affiliate **[existing]** | Plants + garden products | **Already integrated** (`CROCUS-INTEGRATION.md`). Awin (merchant 7833): 10% plants / 7% other, 30-day cookie. The planting module's anchor source. |

---

## Coverage check

This seed list already spans the core garden module categories: **ground (paving), structure (pergolas/fencing), kitchens, shade, lighting, furniture & buildings, and planting.** That's a buildable garden end-to-end — strong Phase 1 breadth.

---

## Recommended ingest order

1. **Affiliate-ready, fastest revenue:** Crocus (live), Pagazzi → prove the crawl→catalogue→render→referral loop on real, monetisable SKUs.
2. **Hero category proof:** Grillo / outdoor kitchens → prove **snap-together modularity** (the differentiator). Use Ian-supplied assets where available to skip crawling.
3. **High-value direct brands via BD:** London Stone, Jacksons Fencing, Renson, Blue Diamond, Cubic → the premium catalogue, seeded with affiliate alternatives meanwhile.

---

## ⚠️ To confirm with Ian
- **Cubic "/ UO"** — what is "UO"? (a Cubic sub-brand / reseller / separate supplier?)
- **IKON bioclimatic pergola** — exact brand / URL (couldn't verify).
- **Shade** — which parasol/sunshade/shade-sail supplier(s)? (Pagazzi is lighting, not shade.)
- **Furniture** — which specific furniture suppliers do you want listed?
- **"eight buildings"** — read as Blue Diamond **garden buildings** — correct?
- Which suppliers can you **provide assets/feeds for directly** (to bypass crawling)?

---

*Sources:* [Grillo outdoor kitchens](https://grilloliving.com/) · [Cubic (TMFC)](https://themodernfurniturecompany.com/collections/outdoor-kitchens-1) · [Renson Algarve](https://renson.net/gd-gb/products/pergolas) · [Crocus affiliate (Awin)](https://www.crocus.co.uk/affiliates/) · [Pagazzi affiliate (FlexOffers)](https://flexoffers.com/affiliate-programs/pagazzi-affiliate-program/) · [Buy Fencing Direct affiliate](https://www.buyfencingdirect.co.uk/affiliate-programme) · [London Stone × Paving Superstore](https://www.prolandscapermagazine.com/2025/07/07/paving-superstore-announces-exclusive-online-collaboration-with-london-stone/) · [Dobbies affiliate](https://www.paidonresults.com/merchants/dobbies.html)
