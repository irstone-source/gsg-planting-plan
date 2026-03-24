/**
 * Generate and download professional planting schedule and care reports
 */

import { Plant } from "./defaultPlants";
import { ProjectSettings } from "./types";

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
    <div class="brand">George Stone Gardens — Planting Schedule</div>
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
  <span>Generated ${date} · George Stone Gardens</span>
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
    <div class="brand">George Stone Gardens — Seasonal Care Guide</div>
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
  <span>Generated ${date} · George Stone Gardens</span>
</div>

</body></html>`;

  downloadHtml(html, `${settings.drawingNumber}-care-guide.html`);
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
