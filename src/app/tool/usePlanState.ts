"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Plant, defaultPlants } from "./defaultPlants";
import { PlacedPlant, ProjectSettings, PlanState, HistoryEntry, ViewingArrow, ScaleCalibration, DEFAULT_PAPER, PaperSettings, Bed } from "./types";

const STORAGE_KEY = "gsg-planting-tool-state";

const defaultSettings: ProjectSettings = {
  name: "Project Name",
  drawingNumber: "GSG-SP-001",
  date: new Date().toISOString().split("T")[0],
  plantRadius: 18,
  backgroundOpacity: 1.0,
  showGrid: false,
  paper: DEFAULT_PAPER,
  bedDisplayMode: "name",
};

function withSettingsFallback(s: ProjectSettings | undefined): ProjectSettings {
  if (!s) return defaultSettings;
  return {
    ...defaultSettings,
    ...s,
    paper: s.paper ?? DEFAULT_PAPER,
    bedDisplayMode: s.bedDisplayMode ?? "name",
  };
}

function generateUid(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

/**
 * Migrate legacy single `border` field into the new `beds[]` array.
 * Existing localStorage / Supabase rows that pre-date multi-bed support
 * still load cleanly without the user losing their traced outline.
 */
function migrateBeds(saved: PlanState | null | undefined): Bed[] {
  if (!saved) return [];
  if (Array.isArray(saved.beds) && saved.beds.length > 0) return saved.beds;
  if (saved.border && Array.isArray(saved.border.points) && saved.border.points.length >= 3) {
    return [{ id: generateUid(), name: "Bed 1", points: saved.border.points }];
  }
  return [];
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
  const [viewingArrow, setViewingArrow] = useState<ViewingArrow | null>(null);
  const [scale, setScale] = useState<ScaleCalibration | null>(null);
  const [beds, setBeds] = useState<Bed[]>([]);

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
      setSettings(withSettingsFallback(saved.settings));
      setBackgroundImage(saved.backgroundImage || null);
      setBackgroundWidth(saved.backgroundWidth || 0);
      setBackgroundHeight(saved.backgroundHeight || 0);
      setViewingArrow(saved.viewingArrow || null);
      setScale(saved.scale || null);
      setBeds(migrateBeds(saved));
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
      viewingArrow,
      scale,
      beds,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [plants, placed, settings, backgroundImage, backgroundWidth, backgroundHeight, viewingArrow, scale, beds]);

  // Push to history when placed changes (but not during undo/redo)
  useEffect(() => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    if (historyIndex === -1) return;
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

  const placeAll = useCallback(() => {
    const spacing = settings.plantRadius * 3;
    const cols = Math.ceil(Math.sqrt(plants.length));
    const startX = 100;
    const startY = 100;
    const newPlants: PlacedPlant[] = plants.map((plant, i) => ({
      uid: generateUid(),
      plantId: plant.id,
      x: startX + (i % cols) * spacing,
      y: startY + Math.floor(i / cols) * spacing,
    }));
    setPlaced((prev) => [...prev, ...newPlants]);
  }, [plants, settings.plantRadius]);

  const movePlant = useCallback((uid: string, x: number, y: number) => {
    setPlaced((prev) => prev.map((p) => (p.uid === uid ? { ...p, x, y } : p)));
  }, []);

  const moveSelected = useCallback((dx: number, dy: number) => {
    setPlaced((prev) =>
      prev.map((p) => (selectedIds.has(p.uid) ? { ...p, x: p.x + dx, y: p.y + dy } : p)),
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

  const importPlants = useCallback((newPlants: Plant[]) => {
    setPlants((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const toAdd = newPlants.filter((p) => !existingIds.has(p.id));
      return [...prev, ...toAdd];
    });
  }, []);

  const updatePlantRadius = useCallback((plantId: string, radius: number | undefined) => {
    setPlants((prev) => prev.map((p) => (p.id === plantId ? { ...p, radius } : p)));
  }, []);

  const updatePlant = useCallback((plantId: string, updates: Partial<Plant>) => {
    setPlants((prev) => prev.map((p) => (p.id === plantId ? { ...p, ...updates } : p)));
  }, []);

  const toggleSelect = useCallback((uid: string, additive: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(additive ? prev : []);
      if (prev.has(uid) && additive) next.delete(uid);
      else next.add(uid);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

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

  const updatePaper = useCallback((partial: Partial<PaperSettings>) => {
    setSettings((prev) => ({
      ...prev,
      paper: { ...(prev.paper ?? DEFAULT_PAPER), ...partial },
    }));
  }, []);

  // Bed CRUD
  const addBed = useCallback((points: { x: number; y: number }[]) => {
    setBeds((prev) => [
      ...prev,
      { id: generateUid(), name: `Bed ${prev.length + 1}`, points },
    ]);
  }, []);

  const renameBed = useCallback((id: string, name: string) => {
    setBeds((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)));
  }, []);

  const removeBed = useCallback((id: string) => {
    setBeds((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setPlaced([]);
    setSelectedIds(new Set());
    setBackgroundImage(null);
    setBackgroundWidth(0);
    setBackgroundHeight(0);
    setSettings(defaultSettings);
    setPlants(defaultPlants);
    setScale(null);
    setBeds([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const loadFromState = useCallback((saved: PlanState) => {
    setPlants(saved.plants?.length ? saved.plants : defaultPlants);
    setPlaced(saved.placed || []);
    setSettings(withSettingsFallback(saved.settings));
    setBackgroundImage(saved.backgroundImage || null);
    setBackgroundWidth(saved.backgroundWidth || 0);
    setBackgroundHeight(saved.backgroundHeight || 0);
    setViewingArrow(saved.viewingArrow || null);
    setScale(saved.scale || null);
    setBeds(migrateBeds(saved));
    setSelectedIds(new Set());
    setHistory([{ placed: saved.placed || [] }]);
    setHistoryIndex(0);
  }, []);

  const getFullState = useCallback((): PlanState => ({
    plants, placed, settings, backgroundImage, backgroundWidth, backgroundHeight, viewingArrow, scale, beds,
  }), [plants, placed, settings, backgroundImage, backgroundWidth, backgroundHeight, viewingArrow, scale, beds]);

  // Get schedule (aggregated counts)
  const schedule = plants
    .map((plant) => ({
      ...plant,
      quantity: placed.filter((p) => p.plantId === plant.id).length,
    }))
    .filter((p) => p.quantity > 0)
    .sort((a, b) => a.code.localeCompare(b.code));

  const totalCount = placed.length;

  // Remove just the uploaded background image; keep scale, beds, plants, labels.
  const removeBackgroundImage = useCallback(() => {
    setBackgroundImage(null);
    setBackgroundWidth(0);
    setBackgroundHeight(0);
  }, []);

  return {
    plants,
    placed,
    settings,
    backgroundImage,
    backgroundWidth,
    backgroundHeight,
    selectedIds,
    viewingArrow,
    setViewingArrow,
    scale,
    setScale,
    beds,
    addBed,
    renameBed,
    removeBed,
    schedule,
    totalCount,
    placePlant,
    placeAll,
    movePlant,
    moveSelected,
    deletePlant,
    deleteSelected,
    addCustomPlant,
    importPlants,
    updatePlantRadius,
    updatePlant,
    toggleSelect,
    clearSelection,
    selectAll,
    handleImageUpload,
    removeBackgroundImage,
    updateSettings,
    updatePaper,
    clearAll,
    loadFromState,
    getFullState,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
