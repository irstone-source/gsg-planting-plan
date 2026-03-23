"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Plant, defaultPlants } from "./defaultPlants";
import { PlacedPlant, ProjectSettings, PlanState, HistoryEntry } from "./types";

const STORAGE_KEY = "gsg-planting-tool-state";

const defaultSettings: ProjectSettings = {
  name: "Project Name",
  drawingNumber: "GSG-SP-001",
  date: new Date().toISOString().split("T")[0],
  plantRadius: 18,
  backgroundOpacity: 1.0,
  showGrid: false,
};

function generateUid(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function loadState(): PlanState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function usePlanState() {
  const [plants, setPlants] = useState<Plant[]>(defaultPlants);
  const [placed, setPlaced] = useState<PlacedPlant[]>([]);
  const [settings, setSettings] = useState<ProjectSettings>(defaultSettings);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundWidth, setBackgroundWidth] = useState(0);
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Undo/redo
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setPlants(saved.plants?.length ? saved.plants : defaultPlants);
      setPlaced(saved.placed || []);
      setSettings(saved.settings || defaultSettings);
      setBackgroundImage(saved.backgroundImage || null);
      setBackgroundWidth(saved.backgroundWidth || 0);
      setBackgroundHeight(saved.backgroundHeight || 0);
      // Initialize history with loaded state
      setHistory([{ placed: saved.placed || [] }]);
      setHistoryIndex(0);
    } else {
      setHistory([{ placed: [] }]);
      setHistoryIndex(0);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const state: PlanState = {
      plants,
      placed,
      settings,
      backgroundImage,
      backgroundWidth,
      backgroundHeight,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [plants, placed, settings, backgroundImage, backgroundWidth, backgroundHeight]);

  // Push to history when placed changes (but not during undo/redo)
  useEffect(() => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    if (historyIndex === -1) return; // initial mount
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { placed: [...placed] }];
    });
    setHistoryIndex((prev) => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    isUndoRedo.current = true;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setPlaced(history[newIndex].placed);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    isUndoRedo.current = true;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setPlaced(history[newIndex].placed);
  }, [history, historyIndex]);

  const placePlant = useCallback((plantId: string, x: number, y: number) => {
    const newPlant: PlacedPlant = { uid: generateUid(), plantId, x, y };
    setPlaced((prev) => [...prev, newPlant]);
  }, []);

  const movePlant = useCallback((uid: string, x: number, y: number) => {
    setPlaced((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, x, y } : p))
    );
  }, []);

  const moveSelected = useCallback((dx: number, dy: number) => {
    setPlaced((prev) =>
      prev.map((p) =>
        selectedIds.has(p.uid) ? { ...p, x: p.x + dx, y: p.y + dy } : p
      )
    );
  }, [selectedIds]);

  const deletePlant = useCallback((uid: string) => {
    setPlaced((prev) => prev.filter((p) => p.uid !== uid));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(uid);
      return next;
    });
  }, []);

  const deleteSelected = useCallback(() => {
    setPlaced((prev) => prev.filter((p) => !selectedIds.has(p.uid)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const addCustomPlant = useCallback((plant: Plant) => {
    setPlants((prev) => [...prev, plant]);
  }, []);

  const toggleSelect = useCallback((uid: string, additive: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(additive ? prev : []);
      if (prev.has(uid) && additive) {
        next.delete(uid);
      } else {
        next.add(uid);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(placed.map((p) => p.uid)));
  }, [placed]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        setBackgroundImage(dataUrl);
        setBackgroundWidth(img.width);
        setBackgroundHeight(img.height);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const updateSettings = useCallback((partial: Partial<ProjectSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearAll = useCallback(() => {
    setPlaced([]);
    setSelectedIds(new Set());
    setBackgroundImage(null);
    setBackgroundWidth(0);
    setBackgroundHeight(0);
    setSettings(defaultSettings);
    setPlants(defaultPlants);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get schedule (aggregated counts)
  const schedule = plants
    .map((plant) => ({
      ...plant,
      quantity: placed.filter((p) => p.plantId === plant.id).length,
    }))
    .filter((p) => p.quantity > 0)
    .sort((a, b) => a.code.localeCompare(b.code));

  const totalCount = placed.length;

  return {
    plants,
    placed,
    settings,
    backgroundImage,
    backgroundWidth,
    backgroundHeight,
    selectedIds,
    schedule,
    totalCount,
    placePlant,
    movePlant,
    moveSelected,
    deletePlant,
    deleteSelected,
    addCustomPlant,
    toggleSelect,
    clearSelection,
    selectAll,
    handleImageUpload,
    updateSettings,
    clearAll,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
