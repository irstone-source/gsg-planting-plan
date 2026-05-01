/**
 * Generate and download professional planting schedule and care reports
 */

import { Plant } from "./defaultPlants";
import { ProjectSettings, PaperSettings, ScaleCalibration } from "./types";
import { paperDimensionsMm, paperPixelsAtDpi, gridSpacingMetres, TITLE_BLOCK_MM } from "./paperUtils";

interface ScheduleItem extends Plant {
  quantity: number;
}

// Seasonal care data per growth habit
const SEASONAL_CARE: Record<string, { spring: string; summer: string; autumn: string; winter: string }> = {
  Graminoid: {
    spring: "Cut back old growth to 10-15cm in late February/early March before new shoots emerge.",
    summer: "No maintenance needed. Allow to flower naturally. Water newly planted specimens during dry spells.",
    autumn: "Leave seed heads standing for winter interest and wildlife habitat.",
    winter: "Leave standing — provides structure, wildlife shelter, and frost interest.",
  },
  Forb: {
    spring: "Cut back dead stems to base. Divide congested clumps every 3-4 years. Mulch with composted bark.",
    summer: "Deadhead spent flowers to encourage repeat blooming. Stake tall varieties if needed. Water in dry periods.",
    autumn: "Leave late-season seed heads for birds. Cut back collapsed stems. Apply a light mulch.",
    winter: "Leave seed heads for frost interest. Plan any moves/divisions for spring.",
  },
  Herb: {
    spring: "Cut back dead growth. Divide large clumps. Apply slow-release feed and mulch around bases.",
    summer: "Deadhead regularly to extend flowering. Pinch growing tips for bushier plants. Water as needed.",
    autumn: "Reduce watering. Leave structural seed heads. Take cuttings of tender herbs.",
    winter: "Protect tender varieties with fleece. Leave evergreen herbs in place.",
  },
  Shrub: {
    spring: "Prune spring-flowering shrubs after blooming. Feed with general-purpose fertiliser. Mulch to retain moisture.",
    summer: "Prune summer-flowering shrubs lightly after first flush. Water deeply in drought. Watch for pests.",
    autumn: "Reduce watering. Plant new shrubs. Apply composted bark mulch 5-8cm deep.",
    winter: "Prune deciduous shrubs while dormant. Check stakes and ties. Protect tender specimens.",
  },
  Tree: {
    spring: "Inspect for winter damage. Apply mulch ring (keep clear of trunk). Feed young specimens.",
    summer: "Water newly planted trees deeply during dry spells. Monitor for pests and disease.",
    autumn: "Plant new trees. Stake if needed. Clear fallen leaves from crowns of small plants below.",
    winter: "Prune deciduous trees while dormant. Formative pruning of young trees. Check ties.",
  },
  default: {
    spring: "Clear dead material. Feed with slow-release fertiliser. Mulch around bases.",
    summer: "Deadhead spent flowers. Water during dry periods. Monitor for pests.",
    autumn: "Tidy as needed but leave structural seed heads. Apply autumn mulch.",
    winter: "Leave standing for frost interest and wildlife. Plan any changes for spring.",
  },
};

function getSeasonalCare(habit: string | undefined): typeof SEASONAL_CARE["default"] {
  if (!habit) return SEASONAL_CARE.default;
  const key = Object.keys(SEASONAL_CARE).find(
    (k) => habit.toLowerCase().includes(k.toLowerCase())
  );
  return SEASONAL_CARE[key || "default"];
}

// Seasonal colour estimation from flower/foliage data
function getSeasonalInterest(plant: Plant): { spring: string; summer: string; autumn: string; winter: string } {
  const fc = plant.flowerColour || [];
  const fol = plant.foliageColour || [];
  const habit = (plant.growthHabit || "").toLowerCase();

  // Simple heuristic based on common knowledge
  const isGrass = habit.includes("gramin") || ["Anemanthele", "Pennisetum", "Stipa", "Miscanthus"].some(g => plant.name.includes(g));
  const isEvergreen = ["Pittosporum", "Phormium"].some(g => plant.name.includes(g));

  if (isGrass) {
    return {
      spring: "Fresh green growth",
      summer: "Flowering plumes",
      autumn: "Golden/bronze tones, seed heads",
      winter: "Bleached stems, structural",
    };
  }
  if (isEvergreen) {
    return {
      spring: "Evergreen foliage" + (fol.length ? ` (${fol.join(", ")})` : ""),
      summer: "Evergreen foliage, new growth",
      autumn: "Evergreen foliage",
      winter: "Evergreen structure",
    };
  }

  return {
    spring: fc.length ? `Emerging foliage` : "New growth",
    summer: fc.length ? `Flowers: ${fc.join(", ")}` : "Foliage interest",
    autumn: "Seed heads, " + (fol.length ? `${fol.join("/")} foliage` : "autumn colour"),
    winter: "Dormant" + (habit.includes("shrub") ? " — structural stems" : ""),
  };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function downloadScheduleReport(
  schedule: ScheduleItem[],
  totalCount: number,
  settings: ProjectSettings,
  plants: Plant[]
) {
  const date = settings.date || new Date().toISOString().split("T")[0];
  const enriched = schedule.map((s) => {
    const full = plants.find((p) => p.id === s.id);
    return { ...s, ...full, quantity: s.quantity };
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(settings.name)} — Planting Schedule</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.5; }
  .header { border-bottom: 3px solid #166534; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
  .header h1 { font-size: 20pt; color: #166534; font-weight: 700; }
  .header .meta { text-align: right; color: #737373; font-size: 9pt; }
  .brand { font-size: 8pt; color: #a3a3a3; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #f5f5f5; border-bottom: 2px solid #166534; padding: 6px 8px; text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5px; color: #525252; }
  td { padding: 6px 8px; border-bottom: 1px solid #e5e5e5; font-size: 9pt; vertical-align: top; }
  tr:hover td { background: #fafafa; }
  .swatch { width: 18px; height: 18px; border-radius: 50%; display: inline-block; border: 1px solid rgba(0,0,0,0.15); vertical-align: middle; }
  .code { font-family: 'SF Mono', 'Menlo', monospace; font-weight: 700; font-size: 10pt; }
  .sci { font-style: italic; color: #525252; }
  .qty { text-align: right; font-family: monospace; font-weight: 700; }
  .detail { color: #737373; font-size: 8pt; }
  .seasonal { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
  .season-box { border: 1px solid #e5e5e5; border-radius: 6px; padding: 8px; }
  .season-box h4 { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .season-spring h4 { color: #16a34a; }
  .season-summer h4 { color: #ca8a04; }
  .season-autumn h4 { color: #c2410c; }
  .season-winter h4 { color: #6b7280; }
  .season-text { font-size: 8pt; color: #525252; }
  .total-row td { border-top: 2px solid #166534; font-weight: 700; background: #f5f5f5; }
  .footer { margin-top: 30px; border-top: 1px solid #e5e5e5; padding-top: 10px; color: #a3a3a3; font-size: 8pt; display: flex; justify-content: space-between; }
  .pagebreak { page-break-before: always; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>${escapeHtml(settings.name)}</h1>
    <div class="brand">plantingplans.co.uk — Planting Schedule</div>
  </div>
  <div class="meta">
    ${escapeHtml(settings.drawingNumber)}<br>
    ${date}<br>
    ${totalCount} plants · ${schedule.length} species
  </div>
</div>

<table>
  <thead>
    <tr>
      <th style="width:30px"></th>
      <th style="width:40px">Code</th>
      <th>Species</th>
      <th style="width:120px">Family</th>
      <th style="width:60px">Height</th>
      <th style="width:60px">Spread</th>
      <th style="width:80px">Habit</th>
      <th style="width:40px" class="qty">Qty</th>
    </tr>
  </thead>
  <tbody>
    ${enriched.map((p) => `
    <tr>
      <td><span class="swatch" style="background:${p.colour}"></span></td>
      <td class="code">${escapeHtml(p.code)}</td>
      <td>
        <strong>${escapeHtml(p.name)}</strong> <span class="sci">${escapeHtml(p.cultivar)}</span>
        ${p.flowerColour?.length ? `<div class="detail">Flower: ${p.flowerColour.join(", ")}</div>` : ""}
        ${p.foliageColour?.length ? `<div class="detail">Foliage: ${p.foliageColour.join(", ")}</div>` : ""}
      </td>
      <td class="detail">${p.family || "—"}</td>
      <td class="detail">${p.height ? p.height + "cm" : "—"}</td>
      <td class="detail">${p.spread ? p.spread + "cm" : "—"}</td>
      <td class="detail" style="text-transform:capitalize">${p.growthHabit || "—"}</td>
      <td class="qty">${p.quantity}</td>
    </tr>`).join("")}
    <tr class="total-row">
      <td colspan="7" style="text-align:right">Total Plants</td>
      <td class="qty">${totalCount}</td>
    </tr>
  </tbody>
</table>

<h2 style="font-size:14pt; color:#166534; margin-bottom:12px; border-bottom:2px solid #22c55e; padding-bottom:4px;">Seasonal Interest Calendar</h2>

${enriched.map((p) => {
  const si = getSeasonalInterest(p);
  return `
  <div style="margin-bottom:16px;">
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
      <span class="swatch" style="background:${p.colour}"></span>
      <strong>${escapeHtml(p.name)}</strong> <span class="sci">${escapeHtml(p.cultivar)}</span>
    </div>
    <div class="seasonal">
      <div class="season-box season-spring"><h4>Spring</h4><div class="season-text">${si.spring}</div></div>
      <div class="season-box season-summer"><h4>Summer</h4><div class="season-text">${si.summer}</div></div>
      <div class="season-box season-autumn"><h4>Autumn</h4><div class="season-text">${si.autumn}</div></div>
      <div class="season-box season-winter"><h4>Winter</h4><div class="season-text">${si.winter}</div></div>
    </div>
  </div>`;
}).join("")}

<div class="footer">
  <span>${escapeHtml(settings.name)} · ${escapeHtml(settings.drawingNumber)}</span>
  <span>Generated ${date} · plantingplans.co.uk</span>
</div>

</body></html>`;

  downloadHtml(html, `${settings.drawingNumber}-planting-schedule.html`);
}

export function downloadCareReport(
  schedule: ScheduleItem[],
  settings: ProjectSettings,
  plants: Plant[]
) {
  const date = settings.date || new Date().toISOString().split("T")[0];
  const enriched = schedule.map((s) => {
    const full = plants.find((p) => p.id === s.id);
    return { ...s, ...full, quantity: s.quantity };
  });

  // Group by growth habit for care sections
  const habitGroups = new Map<string, typeof enriched>();
  for (const p of enriched) {
    const habit = p.growthHabit || "General";
    if (!habitGroups.has(habit)) habitGroups.set(habit, []);
    habitGroups.get(habit)!.push(p);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(settings.name)} — Seasonal Care Guide</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.6; }
  .header { border-bottom: 3px solid #166534; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
  .header h1 { font-size: 20pt; color: #166534; font-weight: 700; }
  .header .meta { text-align: right; color: #737373; font-size: 9pt; }
  .brand { font-size: 8pt; color: #a3a3a3; margin-top: 4px; }
  h2 { font-size: 14pt; color: #166534; margin: 24px 0 12px; border-bottom: 2px solid #22c55e; padding-bottom: 4px; }
  h3 { font-size: 11pt; color: #374151; margin: 16px 0 8px; }
  .season-section { margin-bottom: 24px; padding: 16px; border: 1px solid #e5e5e5; border-radius: 8px; }
  .season-section.spring { border-left: 4px solid #16a34a; }
  .season-section.summer { border-left: 4px solid #ca8a04; }
  .season-section.autumn { border-left: 4px solid #c2410c; }
  .season-section.winter { border-left: 4px solid #6b7280; }
  .season-title { font-size: 13pt; font-weight: 700; margin-bottom: 12px; }
  .season-title.spring { color: #16a34a; }
  .season-title.summer { color: #ca8a04; }
  .season-title.autumn { color: #c2410c; }
  .season-title.winter { color: #6b7280; }
  .month-range { font-size: 9pt; color: #737373; font-weight: 400; }
  .habit-group { margin-bottom: 12px; }
  .habit-label { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.5px; color: #737373; margin-bottom: 4px; font-weight: 600; }
  .plant-names { font-size: 9pt; color: #525252; margin-bottom: 4px; }
  .care-text { font-size: 10pt; color: #374151; margin-left: 12px; padding-left: 12px; border-left: 2px solid #e5e5e5; }
  .swatch { width: 12px; height: 12px; border-radius: 50%; display: inline-block; border: 1px solid rgba(0,0,0,0.15); vertical-align: middle; margin-right: 4px; }
  .general-tips { background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 24px; }
  .general-tips h3 { color: #166534; margin-top: 0; }
  .general-tips ul { margin-left: 20px; }
  .general-tips li { margin-bottom: 6px; font-size: 9pt; color: #525252; }
  .footer { margin-top: 30px; border-top: 1px solid #e5e5e5; padding-top: 10px; color: #a3a3a3; font-size: 8pt; display: flex; justify-content: space-between; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .season-section { break-inside: avoid; } }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>${escapeHtml(settings.name)}</h1>
    <div class="brand">plantingplans.co.uk — Seasonal Care Guide</div>
  </div>
  <div class="meta">
    ${escapeHtml(settings.drawingNumber)}<br>
    ${date}<br>
    ${enriched.length} species
  </div>
</div>

<p style="margin-bottom:20px; color:#525252;">
  This seasonal maintenance guide covers all ${enriched.length} plant species in your planting scheme.
  Follow these guidelines to establish healthy, thriving planting that matures beautifully over time.
</p>

${["spring", "summer", "autumn", "winter"].map((season) => {
  const titles: Record<string, string> = { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter" };
  const months: Record<string, string> = { spring: "March — May", summer: "June — August", autumn: "September — November", winter: "December — February" };

  return `
  <div class="season-section ${season}">
    <div class="season-title ${season}">${titles[season]} <span class="month-range">${months[season]}</span></div>
    ${Array.from(habitGroups.entries()).map(([habit, groupPlants]) => {
      const care = getSeasonalCare(habit);
      const seasonKey = season as keyof typeof care;
      return `
      <div class="habit-group">
        <div class="habit-label">${escapeHtml(habit)}s</div>
        <div class="plant-names">
          ${groupPlants.map((p) => `<span class="swatch" style="background:${p.colour}"></span>${escapeHtml(p.name)} ${escapeHtml(p.cultivar)}`).join(" · ")}
        </div>
        <div class="care-text">${care[seasonKey]}</div>
      </div>`;
    }).join("")}
  </div>`;
}).join("")}

<div class="general-tips">
  <h3>General Establishment Notes (Year 1)</h3>
  <ul>
    <li><strong>Watering:</strong> Water thoroughly at planting. During the first growing season, water deeply once per week in dry periods (more in sandy soil).</li>
    <li><strong>Mulching:</strong> Apply 5-8cm of composted bark mulch around all plants, keeping clear of stems/crowns. Top up annually in spring.</li>
    <li><strong>Feeding:</strong> Apply a balanced slow-release feed (such as Vitax Q4) in March. Avoid high-nitrogen feeds which encourage soft growth.</li>
    <li><strong>Weeding:</strong> Keep planting areas weed-free during establishment. Hand weed carefully around new plants — avoid hoeing near shallow roots.</li>
    <li><strong>Staking:</strong> Stake tall perennials early (April/May) before they need it. Use grow-through supports where possible.</li>
    <li><strong>Patience:</strong> Most perennial plantings follow the rule: "Sleep, Creep, Leap" — year 1 establishes roots, year 2 grows, year 3 flourishes.</li>
  </ul>
</div>

<div class="general-tips" style="margin-top:16px;">
  <h3>Professional Maintenance Estimate</h3>
  <ul>
    <li><strong>Year 1:</strong> ~2 hours per month (establishment care, watering, weeding)</li>
    <li><strong>Year 2+:</strong> ~1 hour per month (seasonal tasks as described above)</li>
    <li><strong>Spring cutback:</strong> Allow 30-60 minutes for annual spring clearance</li>
  </ul>
</div>

<div class="footer">
  <span>${escapeHtml(settings.name)} · ${escapeHtml(settings.drawingNumber)}</span>
  <span>Generated ${date} · plantingplans.co.uk</span>
</div>

</body></html>`;

  downloadHtml(html, `${settings.drawingNumber}-care-guide.html`);
}

export function downloadGrowthReport(
  captures: { year: number; dataUrl: string }[],
  settings: ProjectSettings,
  schedule: (Plant & { quantity: number })[]
) {
  const date = settings.date || new Date().toISOString().split("T")[0];
  const yearDescriptions: Record<number, string> = {
    1: "Establishment year. Plants are settling root systems. Expect modest above-ground growth with regular watering essential.",
    2: "Root systems established. Visible growth begins with perennials filling gaps and shrubs gaining structure.",
    3: "The planting scheme begins to mature. Perennials reach near-full spread, grasses billow, and the design intent becomes clear.",
    5: "Full maturity. Plants have reached their expected spread. The scheme is fully established with a natural, cohesive appearance.",
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(settings.name)} — Growth Timeline</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.5; }
  .header { border-bottom: 3px solid #166534; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
  .header h1 { font-size: 22pt; color: #166534; font-weight: 700; }
  .header .meta { text-align: right; color: #737373; font-size: 9pt; }
  .brand { font-size: 8pt; color: #a3a3a3; margin-top: 4px; }
  .intro { margin-bottom: 24px; color: #525252; font-size: 10pt; max-width: 700px; }
  .year-section { margin-bottom: 32px; page-break-inside: avoid; }
  .year-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .year-badge { background: #166534; color: white; font-size: 14pt; font-weight: 700; padding: 4px 14px; border-radius: 6px; white-space: nowrap; }
  .year-desc { color: #525252; font-size: 9pt; flex: 1; }
  .year-image { width: 100%; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; }
  .year-image img { width: 100%; height: auto; display: block; }
  .note { background: #f9fafb; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-top: 24px; }
  .note h3 { font-size: 11pt; color: #166534; margin-bottom: 8px; }
  .note p { font-size: 9pt; color: #525252; margin-bottom: 6px; }
  .footer { margin-top: 30px; border-top: 1px solid #e5e5e5; padding-top: 10px; color: #a3a3a3; font-size: 8pt; display: flex; justify-content: space-between; }
  .plant-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; margin-bottom: 24px; }
  .legend-item { display: flex; align-items: center; gap: 4px; font-size: 8pt; color: #525252; }
  .legend-swatch { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.15); }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .year-section { break-inside: avoid; } }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>${escapeHtml(settings.name)}</h1>
    <div class="brand">plantingplans.co.uk — Growth Timeline</div>
  </div>
  <div class="meta">
    ${escapeHtml(settings.drawingNumber)}<br>
    ${date}<br>
    ${schedule.reduce((sum, s) => sum + s.quantity, 0)} plants &middot; ${schedule.length} species
  </div>
</div>

<div class="intro">
  <p>This report shows how your planting scheme will develop over time. Each view shows the expected
  spread of every plant at that stage of growth, giving you a clear picture of how the garden will
  fill in and mature.</p>
</div>

${schedule.length > 0 ? `
<div class="plant-legend">
  ${schedule.map(p => `<div class="legend-item"><span class="legend-swatch" style="background:${p.colour}"></span>${escapeHtml(p.name)} ${escapeHtml(p.cultivar)} &times;${p.quantity}</div>`).join("")}
</div>
` : ""}

${captures.map((c) => `
<div class="year-section">
  <div class="year-header">
    <span class="year-badge">Year ${c.year}</span>
    <span class="year-desc">${yearDescriptions[c.year] || ""}</span>
  </div>
  <div class="year-image">
    <img src="${c.dataUrl}" alt="Growth at Year ${c.year}" />
  </div>
</div>
`).join("")}

<div class="note">
  <h3>Understanding This Report</h3>
  <p><strong>Dashed outer circles</strong> show the mature spread each plant will eventually reach.</p>
  <p><strong>Filled circles</strong> show the expected size at each growth stage.</p>
  <p>Plants follow the gardener's rule of "Sleep, Creep, Leap" — year 1 establishes roots,
  year 2 grows steadily, and by year 3 most perennials are approaching their full potential.</p>
  <p>Actual growth rates will vary based on soil conditions, exposure, watering, and local climate.</p>
</div>

<div class="footer">
  <span>${escapeHtml(settings.name)} &middot; ${escapeHtml(settings.drawingNumber)}</span>
  <span>Generated ${date} &middot; plantingplans.co.uk</span>
</div>

</body></html>`;

  downloadHtml(html, `${settings.drawingNumber}-growth-timeline.html`);
}

function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Choose nice round scale-bar tick values (in metres) given the active ratio.
 * Tick spacing in mm on paper = (tickMetres × 1000) / ratio.
 * Aim for ~10–20 mm between ticks on the printed page.
 */
function pickScaleBarTicks(ratio: number): { ticks: number[]; unitLabel: string } {
  // tickMm = tickM * 1000 / ratio. Solve for tickM around 15mm: tickM ≈ 15 * ratio / 1000
  const targetTickM = (15 * ratio) / 1000;
  const candidates = [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50];
  const tick = candidates.reduce((best, c) =>
    Math.abs(c - targetTickM) < Math.abs(best - targetTickM) ? c : best,
  candidates[0]);
  // Build 5 ticks: 0, tick, 2*tick, 3*tick, 5*tick (skip 4 for readability)
  const ticks = [0, tick, 2 * tick, 3 * tick, 5 * tick];
  return { ticks, unitLabel: "m" };
}

/**
 * Render the *printable* region of the Konva stage as a 300 DPI PNG, then
 * embed it in a paper-sized HTML doc with @page margin: 0 so we control the
 * full sheet directly. Every dimension is computed from paper-mm and ratio,
 * so 1m in the source maps to (1000 / ratio) mm on paper. Print at 100% for
 * true scale.
 */
export async function downloadPrintPdf(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: any,
  printableRect: { x: number; y: number; w: number; h: number; widthMm: number; heightMm: number },
  ratio: number,
  paper: PaperSettings,
  scale: ScaleCalibration,
  settings: ProjectSettings,
  schedule: (Plant & { quantity: number })[],
) {
  const { w: paperW_mm, h: paperH_mm } = paperDimensionsMm(paper);
  // 200 DPI is print-quality and ~2.25× faster than 300 (and ~half the file size).
  // Konva's toDataURL is synchronous on the main thread; A3 at 300 DPI = 17 MP and blocks for seconds.
  const DPI = 200;
  const targetPx = paperPixelsAtDpi(paper, DPI);
  // Render image at print resolution: print width in pixels at the chosen DPI for the printable area
  const printablePx_w = Math.round((printableRect.widthMm / 25.4) * DPI);
  const pixelRatio = printablePx_w / printableRect.w;

  const overlayNodes = stage.find(".page-overlay") || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlayNodes.forEach((n: any) => n.visible(false));
  // toDataURL({x,y,w,h}) interprets coords in the stage's *absolute output* space
  // (after scale + position). Reset transforms so we can pass content-space coords directly.
  const prevScale = stage.scale();
  const prevPos = stage.position();
  stage.scale({ x: 1, y: 1 });
  stage.position({ x: 0, y: 0 });
  stage.batchDraw();
  const dataUrl = stage.toDataURL({
    x: printableRect.x,
    y: printableRect.y,
    width: printableRect.w,
    height: printableRect.h,
    pixelRatio,
    mimeType: "image/png",
  });
  stage.scale(prevScale);
  stage.position(prevPos);
  stage.batchDraw();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlayNodes.forEach((n: any) => n.visible(true));

  const date = settings.date || new Date().toISOString().split("T")[0];
  const totalCount = schedule.reduce((sum, s) => sum + s.quantity, 0);
  const gridStepM = gridSpacingMetres(ratio);
  const orientationLabel = paper.orientation === "landscape" ? "landscape" : "portrait";

  // Scale-bar — black/white segments at grid intervals, total ~50mm wide
  const segMm = (gridStepM * 1000) / ratio; // mm per step on paper
  const segCount = Math.max(2, Math.min(5, Math.floor(50 / segMm)));
  const barWidthMm = segMm * segCount;
  const segs = Array.from({ length: segCount }, (_, i) => `<div style="width:${segMm}mm;height:5mm;background:${i % 2 === 0 ? "#1a1a1a" : "#ffffff"};border:0.3mm solid #1a1a1a"></div>`).join("");
  const tickLabels = Array.from({ length: segCount + 1 }, (_, i) => `<span>${i * gridStepM}m</span>`).join("");

  // Calibration checksum: "6m reference → 120mm on paper at 1:50"
  const refMm = (scale.realMetres * 1000) / ratio;

  const innerW_mm = printableRect.widthMm;
  const innerH_mm = printableRect.heightMm;
  const planX_mm = paper.marginMm;
  const planY_mm = paper.marginMm;
  const titleY_mm = planY_mm + innerH_mm;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(settings.name)} — Print Plan ${paper.size} 1:${ratio}</title>
<style>
  @page { size: ${paper.size} ${orientationLabel}; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${paperW_mm}mm; height: ${paperH_mm}mm; }
  body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; }
  .sheet { position: relative; width: ${paperW_mm}mm; height: ${paperH_mm}mm; }
  .plan-img {
    position: absolute;
    left: ${planX_mm}mm; top: ${planY_mm}mm;
    width: ${innerW_mm}mm; height: ${innerH_mm}mm;
    display: block;
    border: 0.3mm solid #cbd5e1;
  }
  .title-block {
    position: absolute;
    left: ${planX_mm}mm; top: ${titleY_mm}mm;
    width: ${innerW_mm}mm; height: ${TITLE_BLOCK_MM}mm;
    border: 0.3mm solid #1a1a1a; border-top: 0;
    padding: 2mm 4mm;
    display: flex; justify-content: space-between; align-items: stretch;
    font-size: 9pt;
  }
  .tb-left h1 { font-size: 13pt; color: #166534; margin-bottom: 1mm; }
  .tb-left .meta { color: #525252; font-size: 8pt; line-height: 1.35; }
  .tb-mid { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1mm; padding: 0 4mm; border-left: 0.3mm solid #e5e5e5; border-right: 0.3mm solid #e5e5e5; }
  .scale-bar { display: flex; }
  .scale-ticks { display: flex; justify-content: space-between; width: ${barWidthMm}mm; font-size: 6.5pt; color: #1a1a1a; margin-top: 0.8mm; }
  .scale-caption { font-size: 7pt; color: #1a1a1a; font-weight: 700; }
  .calibration { font-size: 6.5pt; color: #525252; margin-top: 0.5mm; }
  .tb-right { text-align: right; color: #525252; font-size: 8pt; line-height: 1.4; padding-left: 4mm; }
  .tb-right .ratio { font-size: 16pt; font-weight: 700; color: #0f766e; line-height: 1; margin-bottom: 1mm; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="sheet">
    <img class="plan-img" src="${dataUrl}" alt="Plan" />
    <div class="title-block">
      <div class="tb-left">
        <h1>${escapeHtml(settings.name)}</h1>
        <div class="meta">
          ${escapeHtml(settings.drawingNumber)} · ${date}<br>
          ${totalCount} plants · ${schedule.length} species<br>
          plantingplans.co.uk
        </div>
      </div>
      <div class="tb-mid">
        <div class="scale-bar">${segs}</div>
        <div class="scale-ticks">${tickLabels}</div>
        <div class="scale-caption">Scale 1:${ratio} · grid ${gridStepM}m</div>
        <div class="calibration">Reference: ${scale.realMetres}m → ${refMm.toFixed(1)}mm @ 1:${ratio}</div>
      </div>
      <div class="tb-right">
        <div class="ratio">1:${ratio}</div>
        <div>${paper.size} ${orientationLabel}</div>
        <div>${paperW_mm}×${paperH_mm}mm</div>
        <div>Print at 100%</div>
      </div>
    </div>
  </div>
  <script>
    window.addEventListener('load', () => { setTimeout(() => window.print(), 250); });
  </script>
</body></html>`;

  downloadHtml(html, `${settings.drawingNumber}-print-${paper.size}-${paper.orientation}-1-${ratio}.html`);
  void targetPx;
}
