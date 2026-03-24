"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Plant } from "./defaultPlants";

// Auto-assign colours to imported plants that don't have one
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
    const textDark = luminance(colour) > 0.5;
    results.push({
      id: code.toLowerCase().replace(/[^a-z0-9]/g, ""),
      code, name, cultivar, colour, textDark,
    });
  }
  return results;
}

// Generate a code from genus name
function genCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, "");
  if (clean.length <= 2) return clean;
  // First letter + first consonant after that, or first 2 letters
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
  onPlaceAll: () => void;
  onDragStart: (plantId: string) => void;
  onDragEnd: () => void;
}

// DB search result type
interface DbResult {
  scientific_name: string;
  common_name: string | null;
  genus: string;
  family: string;
  image_url: string | null;
}

export default function PlantPalette({
  plants,
  defaultRadius,
  onAddPlant,
  onImportPlants,
  onUpdatePlantRadius,
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

  // DB search state
  const [dbQuery, setDbQuery] = useState("");
  const [dbResults, setDbResults] = useState<DbResult[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

    // Make code unique if needed
    let finalCode = code;
    let suffix = 2;
    while (existingCodes.has(finalCode.toLowerCase())) {
      finalCode = code + suffix;
      suffix++;
    }

    const colourIdx = plants.length % PALETTE_COLOURS.length;
    const colour = PALETTE_COLOURS[colourIdx];

    onAddPlant({
      id: (genus + species).toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 12),
      code: finalCode,
      name: genus,
      cultivar: species || (result.common_name || ""),
      colour,
      textDark: luminance(colour) > 0.5,
    });
  };

  const handleAdd = () => {
    if (!newName || !newCode) return;
    const id = newCode.toLowerCase().replace(/[^a-z0-9]/g, "");
    onAddPlant({ id, code: newCode, name: newName, cultivar: newCultivar, colour: newColour, textDark: newTextDark });
    setNewName(""); setNewCode(""); setNewCultivar(""); setNewColour("#4CAF50"); setNewTextDark(false); setShowAddForm(false);
  };

  const handleImportTextChange = (text: string) => {
    setImportText(text);
    setImportPreview(parsePlantList(text));
  };

  const handleImportConfirm = () => {
    if (importPreview.length > 0) {
      onImportPlants(importPreview);
      setImportText(""); setImportPreview([]); setShowImport(false);
    }
  };

  // Filter
  const filtered = search
    ? plants.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.cultivar.toLowerCase().includes(search.toLowerCase())
      )
    : plants;

  // Sort & group
  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === "alpha") return a.name.localeCompare(b.name);
    if (sortMode === "colour") return hue(a.colour) - hue(b.colour);
    if (sortMode === "genus") return a.name.localeCompare(b.name); // genus IS the name field
    return 0;
  });

  // Build groups
  type GroupedPlants = { label: string; plants: Plant[] }[];
  let groups: GroupedPlants;
  if (sortMode === "genus") {
    const genusMap = new Map<string, Plant[]>();
    for (const p of sorted) {
      const genus = p.name.split(" ")[0]; // first word = genus
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
          <button
            onClick={onPlaceAll}
            className="px-2 py-0.5 text-[10px] font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700"
            title="Place one of each plant onto the canvas"
          >
            Place All
          </button>
        </div>
        <input
          type="text"
          placeholder="Filter palette..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-neutral-50"
        />
        {/* Sort/group controls */}
        <div className="flex gap-0.5 mt-1.5">
          {(["alpha", "genus", "colour"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`flex-1 px-1 py-0.5 text-[10px] rounded transition-colors ${
                sortMode === mode
                  ? "bg-emerald-100 text-emerald-700 font-medium"
                  : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}
            >
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
                {group.label}
                <span className="text-neutral-300 ml-1 font-normal">({group.plants.length})</span>
              </div>
            )}
            {group.plants.map((plant) => {
              const isExpanded = expandedPlant === plant.id;
              const currentRadius = plant.radius ?? defaultRadius;
              return (
                <div key={plant.id}>
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("plantId", plant.id);
                      onDragStart(plant.id);
                    }}
                    onDragEnd={onDragEnd}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab active:cursor-grabbing hover:bg-neutral-50 transition-colors group"
                  >
                    <div
                      className="rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-black/10 shadow-sm"
                      style={{
                        backgroundColor: plant.colour,
                        color: plant.textDark ? "#1a1a1a" : "#fff",
                        width: Math.max(24, Math.min(40, currentRadius * 1.8)),
                        height: Math.max(24, Math.min(40, currentRadius * 1.8)),
                        fontSize: Math.max(9, Math.min(14, currentRadius * 0.7)),
                      }}
                    >
                      {plant.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-neutral-800 truncate">{plant.name}</div>
                      <div className="text-[10px] text-neutral-500 italic truncate">{plant.cultivar}</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedPlant(isExpanded ? null : plant.id); }}
                      className="w-5 h-5 flex items-center justify-center rounded text-neutral-300 hover:text-neutral-500 hover:bg-neutral-100 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Adjust size"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="flex items-center gap-1.5 px-2 py-1.5 ml-2 bg-neutral-50 rounded-md mb-0.5">
                      <span className="text-[10px] text-neutral-400 w-6">Size</span>
                      <input type="range" min={6} max={50} value={currentRadius}
                        onChange={(e) => { const val = parseInt(e.target.value); onUpdatePlantRadius(plant.id, val === defaultRadius ? undefined : val); }}
                        className="flex-1 h-1 accent-emerald-600" />
                      <span className="text-[10px] text-neutral-500 font-mono w-5 text-right">{currentRadius}</span>
                      {plant.radius !== undefined && (
                        <button onClick={() => onUpdatePlantRadius(plant.id, undefined)}
                          className="text-[10px] text-neutral-400 hover:text-neutral-600" title="Reset to default">reset</button>
                      )}
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

      {/* Bottom panel — DB search, import, add, or buttons */}
      <div className="p-2 border-t border-neutral-200 space-y-1.5">
        {bottomMode === "dbSearch" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Search Plant Database</span>
              <button onClick={() => { setShowDbSearch(false); setDbQuery(""); setDbResults([]); }}
                className="text-[10px] text-neutral-400 hover:text-neutral-600">Close</button>
            </div>
            <input
              type="text"
              placeholder="e.g. Lavandula, Echinacea, grass..."
              value={dbQuery}
              onChange={(e) => setDbQuery(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border rounded bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {dbLoading && (
                <div className="text-xs text-neutral-400 text-center py-2">Searching...</div>
              )}
              {dbError && (
                <div className="text-xs text-red-500 text-center py-2">{dbError}</div>
              )}
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
                        {r.common_name && <span>{r.common_name} · </span>}
                        {r.family}
                      </div>
                    </div>
                    <button
                      onClick={() => addFromDb(r)}
                      disabled={alreadyAdded}
                      className={`shrink-0 px-2 py-0.5 text-[10px] rounded font-medium ${
                        alreadyAdded
                          ? "text-neutral-300 border border-neutral-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
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
              Paste plant list — one per line. CSV, tab, or pipe-separated.
              <br />Format: <span className="font-mono">Code, Name, Cultivar, #Colour</span>
            </div>
            <textarea value={importText} onChange={(e) => handleImportTextChange(e.target.value)}
              placeholder={`An, Anemanthele, lessoniana, #8DB580\nGa, Gaura, lindheimeri, #F2C4D0`}
              className="w-full h-28 px-2 py-1.5 text-xs border rounded bg-neutral-50 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus />
            {importPreview.length > 0 && (
              <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {importPreview.length} plant{importPreview.length !== 1 ? "s" : ""} detected
              </div>
            )}
            <div className="flex gap-1">
              <button onClick={handleImportConfirm} disabled={importPreview.length === 0}
                className="flex-1 px-2 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-40">
                Import {importPreview.length > 0 ? `(${importPreview.length})` : ""}
              </button>
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
            <button
              onClick={() => setShowDbSearch(true)}
              className="w-full px-2 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Plant Database
            </button>
            <div className="flex gap-1">
              <button onClick={() => setShowImport(true)}
                className="flex-1 px-2 py-1.5 text-xs border border-neutral-200 rounded-md hover:bg-neutral-50 text-neutral-600">
                Paste List
              </button>
              <button onClick={() => setShowAddForm(true)}
                className="flex-1 px-2 py-1.5 text-xs border border-dashed border-neutral-300 rounded-md hover:bg-neutral-50 text-neutral-500">
                + Add One
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
