"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

function hue(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return h * 360;
}

function parsePlantList(text: string): Plant[] {
  const lines = text.trim().split("\n").filter((l) => l.trim());
  if (lines.length === 0) return [];
  const firstLine = lines[0];
  const sep = firstLine.includes("\t") ? "\t" : firstLine.includes("|") ? "|" : ",";
  const headerLike = /code|name|species/i.test(firstLine);
  const dataLines = headerLike ? lines.slice(1) : lines;
  const results: Plant[] = [];
  let colourIndex = 0;
  for (const line of dataLines) {
    const parts = line.split(sep).map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) continue;
    const code = parts[0].replace(/^["']|["']$/g, "");
    const name = parts[1].replace(/^["']|["']$/g, "");
    const cultivar = parts[2]?.replace(/^["']|["']$/g, "") || "";
    const colourRaw = parts[3]?.replace(/^["']|["']$/g, "").trim() || "";
    const hasColour = /^#[0-9a-fA-F]{3,8}$/.test(colourRaw);
    const colour = hasColour ? colourRaw : PALETTE_COLOURS[colourIndex % PALETTE_COLOURS.length];
    colourIndex++;
    results.push({
      id: code.toLowerCase().replace(/[^a-z0-9]/g, ""),
      code, name, cultivar, colour, textDark: luminance(colour) > 0.5,
    });
  }
  return results;
}

function genCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, "");
  if (clean.length <= 2) return clean;
  const consonants = clean.slice(1).match(/[bcdfghjklmnpqrstvwxyz]/i);
  if (consonants) return clean[0].toUpperCase() + consonants[0].toLowerCase();
  return clean.substring(0, 2);
}

type SortMode = "alpha" | "genus" | "colour";

interface PlantPaletteProps {
  plants: Plant[];
  defaultRadius: number;
  onAddPlant: (plant: Plant) => void;
  onImportPlants: (plants: Plant[]) => void;
  onUpdatePlantRadius: (plantId: string, radius: number | undefined) => void;
  onUpdatePlant: (plantId: string, updates: Partial<Plant>) => void;
  onPlaceAll: () => void;
  onDragStart: (plantId: string) => void;
  onDragEnd: () => void;
}

interface DbResult {
  scientific_name: string;
  common_name: string | null;
  genus: string;
  family: string;
  slug: string;
  image_url: string | null;
}

interface PlantDetail {
  family: string;
  genus: string;
  spread?: number;
  height?: number;
  growthHabit?: string;
  flowerColour?: string[];
  foliageColour?: string[];
  commonName?: string;
  loading: boolean;
  error?: string;
}

export default function PlantPalette({
  plants,
  defaultRadius,
  onAddPlant,
  onImportPlants,
  onUpdatePlantRadius,
  onUpdatePlant,
  onPlaceAll,
  onDragStart,
  onDragEnd,
}: PlantPaletteProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showDbSearch, setShowDbSearch] = useState(false);
  const [importText, setImportText] = useState("");
  const [importPreview, setImportPreview] = useState<Plant[]>([]);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCultivar, setNewCultivar] = useState("");
  const [newColour, setNewColour] = useState("#4CAF50");
  const [newTextDark, setNewTextDark] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedPlant, setExpandedPlant] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("alpha");

  // Detail data cache
  const [detailCache, setDetailCache] = useState<Record<string, PlantDetail>>({});

  // DB search state
  const [dbQuery, setDbQuery] = useState("");
  const [dbResults, setDbResults] = useState<DbResult[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Fetch plant detail when expanded
  const fetchDetail = useCallback(async (plant: Plant) => {
    if (detailCache[plant.id] && !detailCache[plant.id].error) return;

    // Build search slug from name
    const searchName = `${plant.name} ${plant.cultivar}`.trim().replace(/'/g, "");
    const slug = searchName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    setDetailCache((prev) => ({ ...prev, [plant.id]: { family: "", genus: plant.name, loading: true } }));

    try {
      // First try direct slug lookup, then fall back to search
      let detail: PlantDetail | null = null;

      if (plant.slug) {
        const res = await fetch(`/api/trefle/plants/${plant.slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          detail = {
            family: d.family || "",
            genus: d.genus || plant.name,
            spread: d.main_species?.growth?.spread?.cm || undefined,
            height: d.main_species?.specifications?.average_height?.cm || d.main_species?.specifications?.maximum_height?.cm || undefined,
            growthHabit: d.main_species?.specifications?.growth_habit || undefined,
            flowerColour: d.main_species?.flower?.color || undefined,
            foliageColour: d.main_species?.foliage?.color || undefined,
            commonName: d.common_name || undefined,
            loading: false,
          };
        }
      }

      if (!detail) {
        // Fall back to search
        const searchRes = await fetch(`/api/trefle/search?q=${encodeURIComponent(plant.name + " " + plant.cultivar)}`);
        const searchData = await searchRes.json();
        if (searchData.success && searchData.data?.length > 0) {
          const first = searchData.data[0];
          // Now get details for the first match
          const detailRes = await fetch(`/api/trefle/plants/${first.slug}`);
          const detailData = await detailRes.json();
          if (detailData.success && detailData.data) {
            const d = detailData.data;
            detail = {
              family: d.family || first.family || "",
              genus: d.genus || first.genus || plant.name,
              spread: d.main_species?.growth?.spread?.cm || undefined,
              height: d.main_species?.specifications?.average_height?.cm || d.main_species?.specifications?.maximum_height?.cm || undefined,
              growthHabit: d.main_species?.specifications?.growth_habit || undefined,
              flowerColour: d.main_species?.flower?.color || undefined,
              foliageColour: d.main_species?.foliage?.color || undefined,
              commonName: d.common_name || first.common_name || undefined,
              loading: false,
            };
            // Store slug for future lookups
            onUpdatePlant(plant.id, { slug: first.slug });
          }
        }
      }

      if (detail) {
        setDetailCache((prev) => ({ ...prev, [plant.id]: detail! }));
        // Auto-update plant with retrieved data
        const updates: Partial<Plant> = {};
        if (detail.family) updates.family = detail.family;
        if (detail.growthHabit) updates.growthHabit = detail.growthHabit;
        if (detail.height) updates.height = detail.height;
        if (detail.flowerColour) updates.flowerColour = detail.flowerColour;
        if (detail.foliageColour) updates.foliageColour = detail.foliageColour;
        if (detail.spread && !plant.spread) updates.spread = detail.spread;
        if (Object.keys(updates).length > 0) onUpdatePlant(plant.id, updates);
      } else {
        setDetailCache((prev) => ({ ...prev, [plant.id]: { family: "", genus: plant.name, loading: false, error: "No data found" } }));
      }
    } catch {
      setDetailCache((prev) => ({ ...prev, [plant.id]: { family: "", genus: plant.name, loading: false, error: "Failed to fetch" } }));
    }
  }, [detailCache, onUpdatePlant]);

  // Fetch detail when expanding
  useEffect(() => {
    if (expandedPlant) {
      const plant = plants.find((p) => p.id === expandedPlant);
      if (plant) fetchDetail(plant);
    }
  }, [expandedPlant, plants, fetchDetail]);

  // Debounced DB search
  const searchDb = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setDbResults([]); setDbError(""); return; }
    debounceRef.current = setTimeout(async () => {
      setDbLoading(true);
      setDbError("");
      try {
        const res = await fetch(`/api/trefle/search?q=${encodeURIComponent(q)}&uk=true`);
        const data = await res.json();
        if (data.success && data.data) {
          setDbResults(data.data.slice(0, 20));
        } else {
          setDbResults([]);
          setDbError(data.error || "Search failed");
        }
      } catch {
        setDbError("Network error");
        setDbResults([]);
      } finally {
        setDbLoading(false);
      }
    }, 400);
  }, []);

  useEffect(() => {
    if (showDbSearch) searchDb(dbQuery);
  }, [dbQuery, showDbSearch, searchDb]);

  const addFromDb = (result: DbResult) => {
    const genus = result.genus || result.scientific_name.split(" ")[0];
    const species = result.scientific_name.split(" ").slice(1).join(" ") || "";
    const code = genCode(genus);
    const existingCodes = new Set(plants.map((p) => p.code.toLowerCase()));
    let finalCode = code;
    let suffix = 2;
    while (existingCodes.has(finalCode.toLowerCase())) { finalCode = code + suffix; suffix++; }
    const colourIdx = plants.length % PALETTE_COLOURS.length;
    const colour = PALETTE_COLOURS[colourIdx];
    onAddPlant({
      id: (genus + species).toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 12),
      code: finalCode,
      name: genus,
      cultivar: species || (result.common_name || ""),
      colour,
      textDark: luminance(colour) > 0.5,
      slug: result.slug,
      family: result.family,
    });
  };

  const handleAdd = () => {
    if (!newName || !newCode) return;
    onAddPlant({ id: newCode.toLowerCase().replace(/[^a-z0-9]/g, ""), code: newCode, name: newName, cultivar: newCultivar, colour: newColour, textDark: newTextDark });
    setNewName(""); setNewCode(""); setNewCultivar(""); setNewColour("#4CAF50"); setNewTextDark(false); setShowAddForm(false);
  };

  const handleImportTextChange = (text: string) => { setImportText(text); setImportPreview(parsePlantList(text)); };
  const handleImportConfirm = () => {
    if (importPreview.length > 0) { onImportPlants(importPreview); setImportText(""); setImportPreview([]); setShowImport(false); }
  };

  const filtered = search
    ? plants.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.cultivar.toLowerCase().includes(search.toLowerCase())
      )
    : plants;

  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === "alpha") return a.name.localeCompare(b.name);
    if (sortMode === "colour") return hue(a.colour) - hue(b.colour);
    return a.name.localeCompare(b.name);
  });

  type GroupedPlants = { label: string; plants: Plant[] }[];
  let groups: GroupedPlants;
  if (sortMode === "genus") {
    const genusMap = new Map<string, Plant[]>();
    for (const p of sorted) {
      const genus = p.name.split(" ")[0];
      if (!genusMap.has(genus)) genusMap.set(genus, []);
      genusMap.get(genus)!.push(p);
    }
    groups = Array.from(genusMap.entries()).map(([label, plants]) => ({ label, plants }));
  } else {
    groups = [{ label: "", plants: sorted }];
  }

  const bottomMode = showDbSearch ? "dbSearch" : showImport ? "import" : showAddForm ? "add" : "buttons";

  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm text-neutral-800">Plant Palette</h2>
          <button onClick={onPlaceAll}
            className="px-2 py-0.5 text-[10px] font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700"
            title="Place one of each plant onto the canvas">Place All</button>
        </div>
        <input type="text" placeholder="Filter palette..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-neutral-50" />
        <div className="flex gap-0.5 mt-1.5">
          {(["alpha", "genus", "colour"] as SortMode[]).map((mode) => (
            <button key={mode} onClick={() => setSortMode(mode)}
              className={`flex-1 px-1 py-0.5 text-[10px] rounded transition-colors ${
                sortMode === mode ? "bg-emerald-100 text-emerald-700 font-medium" : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}>
              {mode === "alpha" ? "A-Z" : mode === "genus" ? "Genus" : "Colour"}
            </button>
          ))}
        </div>
      </div>

      {/* Plant list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {groups.map((group) => (
          <div key={group.label || "_all"}>
            {group.label && (
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-2 pt-2 pb-1 sticky top-0 bg-white">
                {group.label} <span className="text-neutral-300 font-normal">({group.plants.length})</span>
              </div>
            )}
            {group.plants.map((plant) => {
              const isExpanded = expandedPlant === plant.id;
              const currentRadius = plant.radius ?? defaultRadius;
              const detail = detailCache[plant.id];
              return (
                <div key={plant.id}>
                  {/* Plant row */}
                  <div
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData("plantId", plant.id); onDragStart(plant.id); }}
                    onDragEnd={onDragEnd}
                    onClick={() => setExpandedPlant(isExpanded ? null : plant.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab active:cursor-grabbing hover:bg-neutral-50 transition-colors group ${isExpanded ? "bg-neutral-50" : ""}`}
                  >
                    <div className="rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-black/10 shadow-sm"
                      style={{
                        backgroundColor: plant.colour, color: plant.textDark ? "#1a1a1a" : "#fff",
                        width: Math.max(24, Math.min(40, currentRadius * 1.8)),
                        height: Math.max(24, Math.min(40, currentRadius * 1.8)),
                        fontSize: Math.max(9, Math.min(14, currentRadius * 0.7)),
                      }}>
                      {plant.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-neutral-800 truncate">{plant.name}</div>
                      <div className="text-[10px] text-neutral-500 italic truncate">{plant.cultivar}</div>
                    </div>
                    <svg className={`w-3 h-3 shrink-0 transition-transform text-neutral-300 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="mx-1 mb-1 p-2 bg-neutral-50 rounded-lg border border-neutral-100 space-y-2.5">
                      {/* Colour picker */}
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Colour</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={plant.colour}
                            onChange={(e) => {
                              const c = e.target.value;
                              onUpdatePlant(plant.id, { colour: c, textDark: luminance(c) > 0.5 });
                            }}
                            className="w-8 h-8 rounded cursor-pointer border border-neutral-200" />
                          <span className="text-xs font-mono text-neutral-500">{plant.colour}</span>
                          <label className="flex items-center gap-1 text-[10px] text-neutral-500 ml-auto">
                            <input type="checkbox" checked={plant.textDark}
                              onChange={(e) => onUpdatePlant(plant.id, { textDark: e.target.checked })}
                              className="w-3 h-3" />
                            Dark text
                          </label>
                        </div>
                      </div>

                      {/* Size */}
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Circle Size</label>
                        <div className="flex items-center gap-1.5">
                          <input type="range" min={6} max={50} value={currentRadius}
                            onChange={(e) => { const v = parseInt(e.target.value); onUpdatePlantRadius(plant.id, v === defaultRadius ? undefined : v); }}
                            className="flex-1 h-1 accent-emerald-600" />
                          <span className="text-[10px] text-neutral-500 font-mono w-5 text-right">{currentRadius}</span>
                          {plant.radius !== undefined && (
                            <button onClick={() => onUpdatePlantRadius(plant.id, undefined)}
                              className="text-[10px] text-neutral-400 hover:text-neutral-600">reset</button>
                          )}
                        </div>
                      </div>

                      {/* Spread */}
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Spread (cm)</label>
                        <div className="flex items-center gap-2">
                          <input type="number" min={0} max={500}
                            value={plant.spread || ""}
                            placeholder={detail?.spread ? String(detail.spread) : "—"}
                            onChange={(e) => onUpdatePlant(plant.id, { spread: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-16 px-1.5 py-1 text-xs border rounded bg-white font-mono" />
                          <label className="flex items-center gap-1 text-[10px] text-neutral-500">
                            <input type="checkbox" checked={plant.showSpread || false}
                              onChange={(e) => onUpdatePlant(plant.id, { showSpread: e.target.checked })}
                              className="w-3 h-3" />
                            Show on canvas
                          </label>
                        </div>
                      </div>

                      {/* Scientific data */}
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Plant Data</label>
                        {detail?.loading ? (
                          <div className="text-[10px] text-neutral-400 animate-pulse">Fetching from Trefle...</div>
                        ) : detail?.error ? (
                          <div className="text-[10px] text-neutral-400">{detail.error}</div>
                        ) : detail ? (
                          <div className="space-y-1 text-[10px]">
                            {detail.commonName && (
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Common</span>
                                <span className="text-neutral-700 font-medium">{detail.commonName}</span>
                              </div>
                            )}
                            {detail.family && (
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Family</span>
                                <span className="text-neutral-700">{detail.family}</span>
                              </div>
                            )}
                            {detail.growthHabit && (
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Habit</span>
                                <span className="text-neutral-700 capitalize">{detail.growthHabit}</span>
                              </div>
                            )}
                            {detail.height && (
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Height</span>
                                <span className="text-neutral-700">{detail.height}cm</span>
                              </div>
                            )}
                            {detail.spread && (
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Spread</span>
                                <span className="text-neutral-700">{detail.spread}cm</span>
                              </div>
                            )}
                            {detail.flowerColour && detail.flowerColour.length > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Flower</span>
                                <span className="text-neutral-700 capitalize">{detail.flowerColour.join(", ")}</span>
                              </div>
                            )}
                            {detail.foliageColour && detail.foliageColour.length > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Foliage</span>
                                <span className="text-neutral-700 capitalize">{detail.foliageColour.join(", ")}</span>
                              </div>
                            )}
                            {!detail.family && !detail.height && !detail.spread && (
                              <div className="text-neutral-400">Limited data available</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-400">Click to load plant data</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-neutral-400 text-center py-4">No plants match filter</div>
        )}
      </div>

      {/* Bottom panel */}
      <div className="p-2 border-t border-neutral-200 space-y-1.5">
        {bottomMode === "dbSearch" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Search Plant Database</span>
              <button onClick={() => { setShowDbSearch(false); setDbQuery(""); setDbResults([]); }}
                className="text-[10px] text-neutral-400 hover:text-neutral-600">Close</button>
            </div>
            <input type="text" placeholder="e.g. Lavandula, Echinacea, grass..."
              value={dbQuery} onChange={(e) => setDbQuery(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border rounded bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-emerald-500" autoFocus />
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {dbLoading && <div className="text-xs text-neutral-400 text-center py-2">Searching...</div>}
              {dbError && <div className="text-xs text-red-500 text-center py-2">{dbError}</div>}
              {!dbLoading && dbResults.map((r, i) => {
                const alreadyAdded = plants.some(
                  (p) => p.name.toLowerCase() === (r.genus || "").toLowerCase() &&
                         p.cultivar.toLowerCase() === (r.scientific_name.split(" ").slice(1).join(" ") || "").toLowerCase()
                );
                return (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-50 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-neutral-800 truncate italic">{r.scientific_name}</div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        {r.common_name && <span>{r.common_name} · </span>}{r.family}
                      </div>
                    </div>
                    <button onClick={() => addFromDb(r)} disabled={alreadyAdded}
                      className={`shrink-0 px-2 py-0.5 text-[10px] rounded font-medium ${
                        alreadyAdded ? "text-neutral-300 border border-neutral-200" : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}>
                      {alreadyAdded ? "Added" : "+ Add"}
                    </button>
                  </div>
                );
              })}
              {!dbLoading && !dbError && dbQuery.length >= 2 && dbResults.length === 0 && (
                <div className="text-xs text-neutral-400 text-center py-2">No results found</div>
              )}
            </div>
          </div>
        ) : bottomMode === "import" ? (
          <div className="space-y-2">
            <div className="text-[10px] text-neutral-500 leading-snug">
              Paste plant list — CSV, tab, or pipe-separated.<br />
              Format: <span className="font-mono">Code, Name, Cultivar, #Colour</span>
            </div>
            <textarea value={importText} onChange={(e) => handleImportTextChange(e.target.value)}
              placeholder={`An, Anemanthele, lessoniana, #8DB580\nGa, Gaura, lindheimeri`}
              className="w-full h-28 px-2 py-1.5 text-xs border rounded bg-neutral-50 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500" autoFocus />
            {importPreview.length > 0 && (
              <div className="text-[10px] text-emerald-600">{importPreview.length} plant{importPreview.length !== 1 ? "s" : ""} detected</div>
            )}
            <div className="flex gap-1">
              <button onClick={handleImportConfirm} disabled={importPreview.length === 0}
                className="flex-1 px-2 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-40">
                Import {importPreview.length > 0 ? `(${importPreview.length})` : ""}</button>
              <button onClick={() => { setShowImport(false); setImportText(""); setImportPreview([]); }}
                className="px-2 py-1.5 text-xs border rounded hover:bg-neutral-50">Cancel</button>
            </div>
          </div>
        ) : bottomMode === "add" ? (
          <div className="space-y-2">
            <div className="flex gap-1">
              <input placeholder="Code" value={newCode} onChange={(e) => setNewCode(e.target.value)}
                className="w-16 px-2 py-1 text-xs border rounded bg-neutral-50" maxLength={3} />
              <input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-2 py-1 text-xs border rounded bg-neutral-50" />
            </div>
            <input placeholder="Cultivar" value={newCultivar} onChange={(e) => setNewCultivar(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded bg-neutral-50" />
            <div className="flex items-center gap-2">
              <input type="color" value={newColour} onChange={(e) => setNewColour(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
              <label className="flex items-center gap-1 text-xs text-neutral-600">
                <input type="checkbox" checked={newTextDark} onChange={(e) => setNewTextDark(e.target.checked)} /> Dark text
              </label>
            </div>
            <div className="flex gap-1">
              <button onClick={handleAdd} className="flex-1 px-2 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700">Add</button>
              <button onClick={() => setShowAddForm(false)} className="px-2 py-1.5 text-xs border rounded hover:bg-neutral-50">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <button onClick={() => setShowDbSearch(true)}
              className="w-full px-2 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search Plant Database
            </button>
            <div className="flex gap-1">
              <button onClick={() => setShowImport(true)}
                className="flex-1 px-2 py-1.5 text-xs border border-neutral-200 rounded-md hover:bg-neutral-50 text-neutral-600">Paste List</button>
              <button onClick={() => setShowAddForm(true)}
                className="flex-1 px-2 py-1.5 text-xs border border-dashed border-neutral-300 rounded-md hover:bg-neutral-50 text-neutral-500">+ Add One</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
