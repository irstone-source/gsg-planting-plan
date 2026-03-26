"use client";

import { useState, useCallback } from "react";
import { Plant } from "./defaultPlants";
import { ViewingArrow } from "./types";

type VisStyle = "perspective" | "section" | "seasonal" | "custom";

interface IllustrationPanelProps {
  plants: Plant[];
  placedPlantIds: string[]; // IDs of plants actually placed on canvas
  viewingArrow: ViewingArrow | null;
  onSetArrowMode: (active: boolean) => void;
  arrowMode: boolean;
}

function buildPlantList(plants: Plant[], placedIds: string[]): string {
  const used = plants.filter((p) => placedIds.includes(p.id));
  if (used.length === 0) return plants.map((p) => `${p.name} ${p.cultivar}`).join("\n");

  // Group by rough category
  const grasses = used.filter((p) =>
    ["Anemanthele", "Pennisetum", "Stipa", "Miscanthus", "Nassella", "Muhlenbergia", "Deschampsia"].some((g) => p.name.includes(g))
      || p.growthHabit?.toLowerCase().includes("gramin")
  );
  const shrubs = used.filter((p) =>
    ["Pittosporum", "Phormium", "Leucophyllum", "Ilex", "Corylus", "Crataegus"].some((g) => p.name.includes(g))
      || p.growthHabit?.toLowerCase().includes("shrub")
  );
  const flowers = used.filter((p) => !grasses.includes(p) && !shrubs.includes(p));

  const lines: string[] = [];
  if (shrubs.length) {
    lines.push("Shrubs/Structure:");
    shrubs.forEach((p) => lines.push(`  ${p.name} ${p.cultivar}`));
  }
  if (grasses.length) {
    lines.push("Ornamental Grasses:");
    grasses.forEach((p) => lines.push(`  ${p.name} ${p.cultivar}`));
  }
  if (flowers.length) {
    lines.push("Flowering Perennials:");
    flowers.forEach((p) => lines.push(`  ${p.name} ${p.cultivar}`));
  }
  return lines.join("\n");
}

function getViewingDescription(arrow: ViewingArrow | null): string {
  if (!arrow) return "front-on, eye level";
  const dx = arrow.x2 - arrow.x1;
  const dy = arrow.y2 - arrow.y1;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Convert angle to cardinal description
  if (angle > -45 && angle <= 45) return "looking right (east-facing view)";
  if (angle > 45 && angle <= 135) return "looking towards the bottom (south-facing view)";
  if (angle > 135 || angle <= -135) return "looking left (west-facing view)";
  return "looking towards the top (north-facing view)";
}

const PROMPT_TEMPLATES: Record<VisStyle, (plants: string, viewDir: string) => string> = {
  perspective: (plants, viewDir) =>
`Create a landscape planting composition diagram combining a 3D perspective planting vignette (top) and a plan view planting diagram (bottom).

Top (3D view):
Render a naturalistic planting bed with a clear hierarchy of vegetation, viewed ${viewDir}:
- rounded shrubs forming structure
- ornamental grasses for vertical texture
- flowering perennials for color
The composition should feel balanced but slightly organic, with layered planting heights and seasonal variation. Use soft shadows, realistic lighting, and a clean studio-like background.

Bottom (plan view):
Translate the same planting into a diagrammatic top view, using:
- circular and textured graphic symbols for each plant type
- varied hatch/texture to differentiate species
- clean thin leader lines pointing to labels
- botanical names placed clearly around the diagram

Use these specific plants:
${plants}

Style: Clean white background, professional landscape architecture presentation, botanical illustration quality. Labeled with full botanical names.`,

  section: (plants, viewDir) =>
`Create a landscape architecture ecological section diagram showing a horizontal cross-section through a planting bed, viewed ${viewDir}.

Organize the vegetation into three vertical layers:
- canopy (tall trees and large shrubs)
- understory (small trees, medium shrubs, and tall grasses)
- ground cover (grasses, perennials, and low vegetation)

Render trees and plants in a soft, semi-realistic style with light atmospheric fading, maintaining a calm and elegant visual tone.

Above the section, include a row of circular plant reference images, each connected to the corresponding plant in the section with thin vertical lines. Add clean labels for each plant.

Use these specific plants:
${plants}

Style: Professional landscape section drawing on white background, soft watercolour-style rendering, clean typography for labels.`,

  seasonal: (plants, _viewDir) =>
`Create a circular seasonal ecological diagram illustrating the relationship between plants, wildlife, and seasonal changes across a full year in a UK garden landscape.

The composition is organized as a large central circle divided into four seasonal quadrants: spring, summer, autumn, and winter. Each quadrant should show a naturalistic collage of plants, textures, and ecological elements representing seasonal change.

Around the main circle, arrange 12 smaller circular vignettes representing monthly cycles. Each small circle contains delicate illustrations of seasonal phenomena such as flowering plants, seed heads, wildlife activity, frost, or foliage changes.

Use these specific plants from the planting scheme:
${plants}

Style: Detailed botanical illustration quality, soft naturalistic rendering, clean white background, elegant typography for season and month labels. Each plant should be botanically recognizable.`,

  custom: () => "",
};

export default function IllustrationPanel({
  plants,
  placedPlantIds,
  viewingArrow,
  onSetArrowMode,
  arrowMode,
}: IllustrationPanelProps) {
  const [style, setStyle] = useState<VisStyle>("perspective");
  const [provider, setProvider] = useState<"gemini" | "openai">("gemini");
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [usedProvider, setUsedProvider] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const buildPrompt = useCallback(() => {
    const plantList = buildPlantList(plants, placedPlantIds);
    const viewDir = getViewingDescription(viewingArrow);
    if (style === "custom") return prompt;
    return PROMPT_TEMPLATES[style](plantList, viewDir);
  }, [plants, placedPlantIds, viewingArrow, style, prompt]);

  const handleGenerate = useCallback(async () => {
    const finalPrompt = buildPrompt();
    if (!finalPrompt.trim()) return;

    setGenerating(true);
    setError("");
    setGeneratedImage(null);
    setUsedProvider(null);

    try {
      const res = await fetch("/api/generate-illustration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, provider }),
      });
      const data = await res.json();
      if (data.image) {
        setGeneratedImage(data.image);
        setUsedProvider(data.provider + (data.fallbackFrom ? ` (${data.fallbackFrom} failed)` : ""));
      } else {
        setError(data.error || "No image generated");
      }
    } catch {
      setError("Failed to generate. Check your connection.");
    } finally {
      setGenerating(false);
    }
  }, [buildPrompt]);

  const downloadImage = useCallback(() => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `planting-illustration-${style}.png`;
    a.click();
  }, [generatedImage, style]);

  return (
    <div className="p-3 space-y-3">
      {/* Viewing Arrow */}
      <div>
        <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Viewing Direction</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetArrowMode(!arrowMode)}
            className={`flex-1 px-2 py-1.5 text-xs rounded-md font-medium flex items-center justify-center gap-1.5 ${
              arrowMode
                ? "bg-blue-600 text-white"
                : viewingArrow
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            {arrowMode ? "Click canvas to place arrow..." : viewingArrow ? "Arrow set" : "Set Viewing Arrow"}
          </button>
          {viewingArrow && (
            <span className="text-[10px] text-neutral-400">{getViewingDescription(viewingArrow)}</span>
          )}
        </div>
      </div>

      {/* Illustration Style */}
      <div>
        <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Illustration Style</label>
        <div className="grid grid-cols-2 gap-1">
          {([
            { key: "perspective", label: "3D + Plan", desc: "Perspective vignette with plan view below" },
            { key: "section", label: "Cross Section", desc: "Ecological section through planting" },
            { key: "seasonal", label: "Seasonal Wheel", desc: "Circular seasonal interest diagram" },
            { key: "custom", label: "Custom Prompt", desc: "Write your own prompt" },
          ] as { key: VisStyle; label: string; desc: string }[]).map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => setStyle(key)}
              className={`p-2 text-left rounded-lg border transition-colors ${
                style === key
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="text-xs font-medium text-neutral-800">{label}</div>
              <div className="text-[10px] text-neutral-500 leading-tight">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Provider */}
      <div>
        <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">AI Provider</label>
        <div className="flex gap-1">
          <button
            onClick={() => setProvider("gemini")}
            className={`flex-1 px-2 py-1.5 text-xs rounded-md font-medium ${
              provider === "gemini"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            Gemini Flash
          </button>
          <button
            onClick={() => setProvider("openai")}
            className={`flex-1 px-2 py-1.5 text-xs rounded-md font-medium ${
              provider === "openai"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            DALL-E 3
          </button>
        </div>
        <p className="text-[10px] text-neutral-400 mt-1">
          {provider === "gemini" ? "Fast, free tier. Good compositions." : "HD quality, great at labelled diagrams. ~$0.08/image."}
          {" "}Auto-falls back to the other if one fails.
        </p>
      </div>

      {/* Custom prompt or preview */}
      {style === "custom" ? (
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the illustration you want..."
          className="w-full h-32 px-2 py-1.5 text-xs border rounded bg-neutral-50 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      ) : (
        <div>
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-[10px] text-neutral-400 hover:text-neutral-600 flex items-center gap-1"
          >
            <svg className={`w-3 h-3 transition-transform ${showPrompt ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showPrompt ? "Hide prompt" : "Preview prompt"}
          </button>
          {showPrompt && (
            <pre className="mt-1 text-[10px] text-neutral-500 bg-neutral-50 rounded p-2 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
              {buildPrompt()}
            </pre>
          )}
        </div>
      )}

      {/* Generate */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full px-3 py-2.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {generating ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Generate Illustration
          </>
        )}
      </button>

      {error && <div className="text-xs text-red-500 text-center">{error}</div>}

      {/* Result */}
      {generatedImage && (
        <div className="space-y-2">
          {usedProvider && (
            <div className="text-[10px] text-neutral-400 text-center">
              Generated with {usedProvider}
            </div>
          )}
          <img
            src={generatedImage}
            alt="Generated planting illustration"
            className="w-full rounded-lg border border-neutral-200 shadow-sm"
          />
          <div className="flex gap-1">
            <button
              onClick={downloadImage}
              className="flex-1 px-2 py-1.5 text-xs bg-neutral-800 text-white rounded hover:bg-neutral-900 font-medium"
            >
              Download
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-2 py-1.5 text-xs border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
