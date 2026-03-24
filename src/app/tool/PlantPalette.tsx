"use client";

import { useState } from "react";
import { Plant } from "./defaultPlants";

// Auto-assign colours to imported plants that don't have one
const PALETTE_COLOURS = [
  "#4CAF50", "#E91E63", "#FF9800", "#2196F3", "#9C27B0",
  "#00BCD4", "#795548", "#607D8B", "#F44336", "#3F51B5",
  "#CDDC39", "#FF5722", "#009688", "#673AB7", "#FFC107",
  "#8BC34A", "#03A9F4", "#E040FB", "#FF6E40", "#26A69A",
];

function parsePlantList(text: string): Plant[] {
  const lines = text.trim().split("\n").filter((l) => l.trim());
  if (lines.length === 0) return [];

  // Detect separator: tab, comma, or pipe
  const firstLine = lines[0];
  const sep = firstLine.includes("\t") ? "\t" : firstLine.includes("|") ? "|" : ",";

  // Check if first line is a header
  const headerLike = /code|name|species/i.test(firstLine);
  const dataLines = headerLike ? lines.slice(1) : lines;

  const results: Plant[] = [];
  let colourIndex = 0;

  for (const line of dataLines) {
    const parts = line.split(sep).map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) continue;

    // Try to detect format:
    // 2 cols: Code, Name
    // 3 cols: Code, Name, Cultivar
    // 4+ cols: Code, Name, Cultivar, Colour (hex)
    const code = parts[0].replace(/^["']|["']$/g, "");
    const name = parts[1].replace(/^["']|["']$/g, "");
    const cultivar = parts[2]?.replace(/^["']|["']$/g, "") || "";
    const colourRaw = parts[3]?.replace(/^["']|["']$/g, "").trim() || "";
    const hasColour = /^#[0-9a-fA-F]{3,8}$/.test(colourRaw);

    // Determine text colour based on background brightness
    const colour = hasColour ? colourRaw : PALETTE_COLOURS[colourIndex % PALETTE_COLOURS.length];
    colourIndex++;

    // Simple luminance check
    const hex = colour.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textDark = luminance > 0.5;

    results.push({
      id: code.toLowerCase().replace(/[^a-z0-9]/g, ""),
      code,
      name,
      cultivar,
      colour,
      textDark,
    });
  }

  return results;
}

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
  const [importText, setImportText] = useState("");
  const [importPreview, setImportPreview] = useState<Plant[]>([]);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCultivar, setNewCultivar] = useState("");
  const [newColour, setNewColour] = useState("#4CAF50");
  const [newTextDark, setNewTextDark] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedPlant, setExpandedPlant] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName || !newCode) return;
    const id = newCode.toLowerCase().replace(/[^a-z0-9]/g, "");
    onAddPlant({
      id,
      code: newCode,
      name: newName,
      cultivar: newCultivar,
      colour: newColour,
      textDark: newTextDark,
    });
    setNewName("");
    setNewCode("");
    setNewCultivar("");
    setNewColour("#4CAF50");
    setNewTextDark(false);
    setShowAddForm(false);
  };

  const handleImportTextChange = (text: string) => {
    setImportText(text);
    setImportPreview(parsePlantList(text));
  };

  const handleImportConfirm = () => {
    if (importPreview.length > 0) {
      onImportPlants(importPreview);
      setImportText("");
      setImportPreview([]);
      setShowImport(false);
    }
  };

  const filtered = search
    ? plants.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase()) ||
          p.cultivar.toLowerCase().includes(search.toLowerCase())
      )
    : plants;

  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full">
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
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-neutral-50"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filtered.map((plant) => {
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
                  <div className="text-xs font-medium text-neutral-800 truncate">
                    {plant.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 italic truncate">
                    {plant.cultivar}
                  </div>
                </div>
                {/* Size adjust toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedPlant(isExpanded ? null : plant.id);
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded text-neutral-300 hover:text-neutral-500 hover:bg-neutral-100 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Adjust size"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>
              </div>
              {/* Per-plant size slider */}
              {isExpanded && (
                <div className="flex items-center gap-1.5 px-2 py-1.5 ml-2 bg-neutral-50 rounded-md mb-0.5">
                  <span className="text-[10px] text-neutral-400 w-6">Size</span>
                  <input
                    type="range"
                    min={6}
                    max={50}
                    value={currentRadius}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      onUpdatePlantRadius(plant.id, val === defaultRadius ? undefined : val);
                    }}
                    className="flex-1 h-1 accent-emerald-600"
                  />
                  <span className="text-[10px] text-neutral-500 font-mono w-5 text-right">{currentRadius}</span>
                  {plant.radius !== undefined && (
                    <button
                      onClick={() => onUpdatePlantRadius(plant.id, undefined)}
                      className="text-[10px] text-neutral-400 hover:text-neutral-600"
                      title="Reset to default"
                    >
                      reset
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Import / Add buttons */}
      <div className="p-2 border-t border-neutral-200 space-y-1.5">
        {showImport ? (
          <div className="space-y-2">
            <div className="text-[10px] text-neutral-500 leading-snug">
              Paste plant list — one per line. Accepts CSV, tab-separated, or pipe-separated.
              <br />
              Format: <span className="font-mono">Code, Name, Cultivar, #Colour</span>
            </div>
            <textarea
              value={importText}
              onChange={(e) => handleImportTextChange(e.target.value)}
              placeholder={`An, Anemanthele, lessoniana, #8DB580\nGa, Gaura, lindheimeri, #F2C4D0\nPi, Pittosporum, tenuifolium`}
              className="w-full h-28 px-2 py-1.5 text-xs border rounded bg-neutral-50 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            {importPreview.length > 0 && (
              <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {importPreview.length} plant{importPreview.length !== 1 ? "s" : ""} detected
                <div className="flex gap-0.5 ml-1">
                  {importPreview.slice(0, 8).map((p) => (
                    <div
                      key={p.id}
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: p.colour }}
                      title={`${p.code} — ${p.name}`}
                    />
                  ))}
                  {importPreview.length > 8 && (
                    <span className="text-neutral-400">+{importPreview.length - 8}</span>
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-1">
              <button
                onClick={handleImportConfirm}
                disabled={importPreview.length === 0}
                className="flex-1 px-2 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-40"
              >
                Import {importPreview.length > 0 ? `(${importPreview.length})` : ""}
              </button>
              <button
                onClick={() => { setShowImport(false); setImportText(""); setImportPreview([]); }}
                className="px-2 py-1.5 text-xs border rounded hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : showAddForm ? (
          <div className="space-y-2">
            <div className="flex gap-1">
              <input
                placeholder="Code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-16 px-2 py-1 text-xs border rounded bg-neutral-50"
                maxLength={3}
              />
              <input
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-2 py-1 text-xs border rounded bg-neutral-50"
              />
            </div>
            <input
              placeholder="Cultivar"
              value={newCultivar}
              onChange={(e) => setNewCultivar(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded bg-neutral-50"
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColour}
                onChange={(e) => setNewColour(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <label className="flex items-center gap-1 text-xs text-neutral-600">
                <input
                  type="checkbox"
                  checked={newTextDark}
                  onChange={(e) => setNewTextDark(e.target.checked)}
                />
                Dark text
              </label>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleAdd}
                className="flex-1 px-2 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-2 py-1.5 text-xs border rounded hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={() => setShowImport(true)}
              className="flex-1 px-2 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
            >
              Paste List
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex-1 px-2 py-1.5 text-xs border border-dashed border-neutral-300 rounded-md hover:bg-neutral-50 text-neutral-500"
            >
              + Add One
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
