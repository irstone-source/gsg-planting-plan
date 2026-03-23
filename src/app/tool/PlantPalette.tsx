"use client";

import { useState } from "react";
import { Plant } from "./defaultPlants";

interface PlantPaletteProps {
  plants: Plant[];
  onAddPlant: (plant: Plant) => void;
  onDragStart: (plantId: string) => void;
  onDragEnd: () => void;
}

export default function PlantPalette({ plants, onAddPlant, onDragStart, onDragEnd }: PlantPaletteProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCultivar, setNewCultivar] = useState("");
  const [newColour, setNewColour] = useState("#4CAF50");
  const [newTextDark, setNewTextDark] = useState(false);
  const [search, setSearch] = useState("");

  const handleAdd = () => {
    if (!newName || !newCode) return;
    const id = newCode.toLowerCase().replace(/\s/g, "");
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
        <h2 className="font-semibold text-sm text-neutral-800 mb-2">Plant Palette</h2>
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-neutral-50"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map((plant) => (
          <div
            key={plant.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("plantId", plant.id);
              onDragStart(plant.id);
            }}
            onDragEnd={onDragEnd}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab active:cursor-grabbing hover:bg-neutral-50 transition-colors group"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-black/10 shadow-sm"
              style={{
                backgroundColor: plant.colour,
                color: plant.textDark ? "#1a1a1a" : "#fff",
              }}
            >
              {plant.code}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-neutral-800 truncate">
                {plant.name}
              </div>
              <div className="text-[10px] text-neutral-500 italic truncate">
                {plant.cultivar}
              </div>
            </div>
            <svg
              className="w-3 h-3 text-neutral-300 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="currentColor"
              viewBox="0 0 6 20"
            >
              <circle cx="3" cy="3" r="1.5" />
              <circle cx="3" cy="10" r="1.5" />
              <circle cx="3" cy="17" r="1.5" />
            </svg>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-neutral-200">
        {showAddForm ? (
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
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full px-2 py-1.5 text-xs border border-dashed border-neutral-300 rounded-md hover:bg-neutral-50 text-neutral-500"
          >
            + Add Custom Plant
          </button>
        )}
      </div>
    </div>
  );
}
