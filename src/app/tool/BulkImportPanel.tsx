"use client";

import { useState, useCallback } from "react";
import { Plant } from "./defaultPlants";

const PALETTE_COLOURS = [
  "#4CAF50", "#E91E63", "#FF9800", "#2196F3", "#9C27B0",
  "#00BCD4", "#795548", "#607D8B", "#F44336", "#3F51B5",
  "#CDDC39", "#FF5722", "#009688", "#673AB7", "#FFC107",
  "#8BC34A", "#03A9F4", "#E040FB", "#FF6E40", "#26A69A",
];

function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function genCode(name: string, existingCodes: Set<string>): string {
  const clean = name.replace(/[^a-zA-Z]/g, "");
  if (clean.length === 0) return "X";
  const consonants = clean.slice(1).match(/[bcdfghjklmnpqrstvwxyz]/i);
  let base = consonants
    ? clean[0].toUpperCase() + consonants[0].toLowerCase()
    : clean.substring(0, 2);
  let code = base;
  let i = 2;
  while (existingCodes.has(code.toLowerCase())) {
    code = base + i;
    i++;
  }
  return code;
}

interface ParsedPlant {
  scientific: string;
  common: string;
  type: string;
}

interface EnrichedPlant extends ParsedPlant {
  family?: string;
  height?: number;
  spread?: number;
  growthHabit?: string;
  flowerColour?: string[];
  foliageColour?: string[];
  slug?: string;
  imageUrl?: string;
}

interface BulkImportPanelProps {
  existingPlants: Plant[];
  onImportPlants: (plants: Plant[]) => void;
}

export default function BulkImportPanel({ existingPlants, onImportPlants }: BulkImportPanelProps) {
  const [textInput, setTextInput] = useState("");
  const [parsed, setParsed] = useState<ParsedPlant[]>([]);
  const [enriched, setEnriched] = useState<EnrichedPlant[]>([]);
  const [parsing, setParsing] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "review" | "done">("input");
  const [enrichProgress, setEnrichProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);

  const handleParse = useCallback(async () => {
    if (!textInput.trim()) return;
    setParsing(true);
    setError("");
    try {
      const res = await fetch("/api/parse-plant-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      const data = await res.json();
      if (data.success && data.plants?.length > 0) {
        setParsed(data.plants);
        setEnriched(data.plants.map((p: ParsedPlant) => ({ ...p })));
        setStep("review");
      } else {
        setError(data.error || "No plants found");
      }
    } catch {
      setError("Failed to parse. Check format.");
    } finally {
      setParsing(false);
    }
  }, [textInput]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-plant-list", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.plants?.length > 0) {
        setParsed(data.plants);
        setEnriched(data.plants.map((p: ParsedPlant) => ({ ...p })));
        setStep("review");
      } else {
        setError(data.error || "No plants found in file");
      }
    } catch {
      setError("Failed to upload file");
    } finally {
      setParsing(false);
    }
  }, []);

  // Enrich with Trefle data
  const handleEnrich = useCallback(async () => {
    setEnriching(true);
    setEnrichProgress(0);
    const updated = [...enriched];

    for (let i = 0; i < updated.length; i++) {
      const p = updated[i];
      try {
        const res = await fetch(`/api/trefle/search?q=${encodeURIComponent(p.scientific)}&uk=true`);
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          const match = data.data[0];
          updated[i] = {
            ...p,
            slug: match.slug,
            family: match.family,
          };

          // Try to get detail
          try {
            const detRes = await fetch(`/api/trefle/plants/${match.slug}`);
            const det = await detRes.json();
            if (det.success && det.data?.main_species) {
              const ms = det.data.main_species;
              updated[i].height = ms.specifications?.average_height?.cm || ms.specifications?.maximum_height?.cm;
              updated[i].spread = ms.growth?.spread?.cm;
              updated[i].growthHabit = ms.specifications?.growth_habit;
              updated[i].flowerColour = ms.flower?.color;
              updated[i].foliageColour = ms.foliage?.color;
            }
          } catch { /* detail fetch optional */ }
        }
      } catch { /* search failed, skip */ }
      setEnrichProgress(i + 1);
    }

    setEnriched(updated);
    setEnriching(false);
  }, [enriched]);

  // Generate AI plant images
  const handleGenerateImages = useCallback(async () => {
    setGeneratingImages(true);
    setImageProgress(0);
    const updated = [...enriched];

    for (let i = 0; i < updated.length; i++) {
      const p = updated[i];
      try {
        const prompt = `A detailed botanical illustration of ${p.scientific}${p.common ? ` (${p.common})` : ""}, professional scientific drawing style, white background, showing the plant's natural form, leaves, and flowers if present. Clean, precise, elegant botanical art.`;
        const res = await fetch("/api/generate-illustration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, provider: "gemini" }),
        });
        const data = await res.json();
        if (data.image) {
          updated[i] = { ...updated[i], imageUrl: data.image };
        }
      } catch { /* image gen failed, skip */ }
      setImageProgress(i + 1);
    }

    setEnriched(updated);
    setGeneratingImages(false);
  }, [enriched]);

  // Import into palette
  const handleImport = useCallback(() => {
    const existingIds = new Set(existingPlants.map((p) => p.id));
    const existingCodes = new Set(existingPlants.map((p) => p.code.toLowerCase()));

    const newPlants: Plant[] = enriched.map((p, i) => {
      const genus = p.scientific.split(" ")[0];
      const species = p.scientific.split(" ").slice(1).join(" ");
      const code = genCode(genus, existingCodes);
      existingCodes.add(code.toLowerCase());

      const colour = PALETTE_COLOURS[
        (existingPlants.length + i) % PALETTE_COLOURS.length
      ];

      const id = genus.toLowerCase().replace(/[^a-z]/g, "") + (species ? species.toLowerCase().replace(/[^a-z]/g, "").substring(0, 6) : "");

      // Skip if already exists
      if (existingIds.has(id)) return null;

      return {
        id,
        code,
        name: genus,
        cultivar: species || p.common || "",
        colour,
        textDark: luminance(colour) > 0.5,
        slug: p.slug,
        family: p.family,
        growthHabit: p.growthHabit,
        height: p.height,
        spread: p.spread,
        flowerColour: p.flowerColour,
        foliageColour: p.foliageColour,
      } as Plant;
    }).filter(Boolean) as Plant[];

    onImportPlants(newPlants);
    setStep("done");
  }, [enriched, existingPlants, onImportPlants]);

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-neutral-700">Bulk Import Plants</h3>
        {step !== "input" && (
          <button onClick={() => { setStep("input"); setParsed([]); setEnriched([]); setError(""); }}
            className="text-[10px] text-neutral-400 hover:text-neutral-600">Start over</button>
        )}
      </div>

      {step === "input" && (
        <>
          <div className="text-[10px] text-neutral-500 leading-snug">
            Paste a plant list (one per line) or upload a CSV.
            <br />Format: <span className="font-mono">Scientific name, Common name, Type</span>
          </div>

          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`Betula pendula, Silver Birch, tree\nViburnum tinus, Laurustinus, shrub\nAlchemilla mollis, Lady's Mantle, perennial\nStipa tenuissima, Mexican Feather Grass, grass`}
            className="w-full h-32 px-2 py-1.5 text-xs border rounded bg-neutral-50 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <div className="flex gap-1">
            <button onClick={handleParse} disabled={parsing || !textInput.trim()}
              className="flex-1 px-2 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium disabled:opacity-40">
              {parsing ? "Parsing..." : "Parse Plant List"}
            </button>
            <label className="flex-1">
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              <span className="block px-2 py-1.5 text-xs border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600 text-center cursor-pointer font-medium">
                Upload CSV
              </span>
            </label>
          </div>

          {error && <div className="text-xs text-red-500">{error}</div>}
        </>
      )}

      {step === "review" && (
        <>
          <div className="text-[10px] text-emerald-600 font-medium">{parsed.length} plants parsed</div>

          {/* Plant list preview */}
          <div className="max-h-48 overflow-y-auto space-y-0.5 border rounded bg-neutral-50 p-1.5">
            {enriched.map((p, i) => (
              <div key={i} className="flex items-center gap-2 px-1.5 py-1 text-xs rounded hover:bg-white">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" className="w-7 h-7 rounded object-cover bg-white border" />
                ) : (
                  <div className="w-7 h-7 rounded flex items-center justify-center text-[8px] font-bold border border-black/10"
                    style={{ backgroundColor: PALETTE_COLOURS[(existingPlants.length + i) % PALETTE_COLOURS.length], color: "#fff" }}>
                    {p.scientific.substring(0, 2)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-neutral-800 truncate italic">{p.scientific}</div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {p.common && <span>{p.common}</span>}
                    {p.family && <span> · {p.family}</span>}
                    {p.height && <span> · {p.height}cm</span>}
                    {p.spread && <span> · spread {p.spread}cm</span>}
                  </div>
                </div>
                <span className="text-[10px] text-neutral-300 capitalize shrink-0">{p.type}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-1.5">
            {/* Enrich */}
            <button onClick={handleEnrich} disabled={enriching}
              className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600 font-medium flex items-center justify-center gap-1.5">
              {enriching ? (
                <span>Enriching... {enrichProgress}/{enriched.length}</span>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Enrich with Trefle Data (height, spread, family)
                </>
              )}
            </button>

            {/* Generate images */}
            <button onClick={handleGenerateImages} disabled={generatingImages}
              className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600 font-medium flex items-center justify-center gap-1.5">
              {generatingImages ? (
                <span>Generating images... {imageProgress}/{enriched.length}</span>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                  </svg>
                  Generate AI Plant Images (optional)
                </>
              )}
            </button>

            {/* Import */}
            <button onClick={handleImport}
              className="w-full px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold">
              Import {enriched.length} Plants to Palette
            </button>
          </div>
        </>
      )}

      {step === "done" && (
        <div className="text-center py-6">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-neutral-800">Plants imported!</p>
          <p className="text-xs text-neutral-500 mt-1">Check the palette on the left. You can now drag them onto the canvas.</p>
          <button onClick={() => { setStep("input"); setTextInput(""); setParsed([]); setEnriched([]); }}
            className="mt-3 text-xs text-emerald-600 hover:text-emerald-700 font-medium">Import more plants</button>
        </div>
      )}
    </div>
  );
}
