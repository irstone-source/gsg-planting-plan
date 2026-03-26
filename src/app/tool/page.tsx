"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect, useCallback } from "react";
import Konva from "konva";
import { usePlanState } from "./usePlanState";
import { useAuth } from "./useAuth";
import { useSavePlan, SavedPlan } from "./useSavePlan";
import PlantPalette from "./PlantPalette";
import PlantSchedule from "./PlantSchedule";
import BulkImportPanel from "./BulkImportPanel";
import Toolbar, { ViewMode } from "./Toolbar";

const PlanCanvas = dynamic(() => import("./PlanCanvas"), { ssr: false });

export default function ToolPage() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [dragPlantId, setDragPlantId] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"schedule" | "bulk" | "plans" | "help">("schedule");
  const [viewMode, setViewMode] = useState<ViewMode>("colour");
  const [growthYear, setGrowthYear] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const state = usePlanState();
  const auth = useAuth();
  const save = useSavePlan(auth.supabase, auth.user);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Growth animation
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setGrowthYear((prev) => {
        if (prev >= 5) {
          setIsAnimating(false);
          return 5;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleToggleAnimate = useCallback(() => {
    if (isAnimating) {
      setIsAnimating(false);
    } else {
      setGrowthYear(1);
      setViewMode("scientific");
      setIsAnimating(true);
    }
  }, [isAnimating]);

  // Fetch plans when user logs in
  useEffect(() => {
    if (auth.user) {
      save.fetchPlans();
    }
  }, [auth.user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); state.undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "Z" || e.key === "y") && (e.shiftKey || e.key === "y")) { e.preventDefault(); state.redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "a") { e.preventDefault(); state.selectAll(); }
      // Ctrl+S = save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const getThumbnail = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return null;
    try {
      return stage.toDataURL({ pixelRatio: 0.3, mimeType: "image/jpeg", quality: 0.5 });
    } catch { return null; }
  }, []);

  const handleSave = useCallback(async () => {
    if (!auth.user) {
      auth.signInWithGoogle();
      return;
    }
    const thumbnail = getThumbnail();
    const fullState = state.getFullState();
    const id = await save.savePlan(fullState, thumbnail);
    if (id) {
      setSaveMessage("Saved");
      setTimeout(() => setSaveMessage(null), 2000);
    }
  }, [auth, save, state, getThumbnail]);

  const handleLoad = useCallback(async (plan: SavedPlan) => {
    const data = await save.loadPlan(plan.id);
    if (data) {
      state.loadFromState(data);
      setRightPanelTab("schedule");
    }
  }, [save, state]);

  // Drop zone
  const [isDragOver, setIsDragOver] = useState(false);
  const handleGlobalDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) state.handleImageUpload(file);
  }, [state]);

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden text-neutral-900" data-theme="light" style={{ colorScheme: "light" }}
      onDragOver={(e) => { e.preventDefault(); if (e.dataTransfer.types.includes("Files")) setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)} onDrop={handleGlobalDrop}>

      {/* Toolbar */}
      <Toolbar
        settings={state.settings}
        onUpdateSettings={state.updateSettings}
        onImageUpload={state.handleImageUpload}
        onUndo={state.undo}
        onRedo={state.redo}
        canUndo={state.canUndo}
        canRedo={state.canRedo}
        onClearAll={state.clearAll}
        stageRef={stageRef}
        backgroundImage={state.backgroundImage}
        totalCount={state.totalCount}
        user={auth.user}
        onSignIn={auth.signInWithGoogle}
        onSignOut={auth.signOut}
        onSave={handleSave}
        saving={save.saving}
        saveMessage={saveMessage}
        currentPlanId={save.currentPlanId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        growthYear={growthYear}
        onGrowthYearChange={setGrowthYear}
        isAnimating={isAnimating}
        onToggleAnimate={handleToggleAnimate}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Plant Palette */}
        <PlantPalette
          plants={state.plants}
          defaultRadius={state.settings.plantRadius}
          onAddPlant={state.addCustomPlant}
          onImportPlants={state.importPlants}
          onUpdatePlantRadius={state.updatePlantRadius}
          onUpdatePlant={state.updatePlant}
          onPlaceAll={state.placeAll}
          onDragStart={setDragPlantId}
          onDragEnd={() => setDragPlantId(null)}
        />

        {/* Center: Canvas */}
        <PlanCanvas
          plants={state.plants}
          placed={state.placed}
          settings={state.settings}
          backgroundImage={state.backgroundImage}
          backgroundWidth={state.backgroundWidth}
          backgroundHeight={state.backgroundHeight}
          selectedIds={state.selectedIds}
          onPlace={state.placePlant}
          onMove={state.movePlant}
          onSelect={state.toggleSelect}
          onClearSelection={state.clearSelection}
          onDelete={state.deletePlant}
          onDeleteSelected={state.deleteSelected}
          dragPlantId={dragPlantId}
          stageRef={stageRef}
          viewingArrow={state.viewingArrow}
          onSetViewingArrow={state.setViewingArrow}
          arrowMode={false}
          onArrowPlaced={() => {}}
          viewMode={viewMode}
          growthYear={growthYear}
        />

        {/* Right: Schedule / Plans / Help */}
        <div className="w-72 bg-white border-l border-neutral-200 flex flex-col">
          <div className="flex border-b border-neutral-200">
            {(["schedule", "bulk", "plans", "help"] as const).map((tab) => (
              <button key={tab} onClick={() => setRightPanelTab(tab)}
                className={`flex-1 py-2 text-xs font-medium ${
                  rightPanelTab === tab
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}>
                {tab === "schedule" ? "Schedule" : tab === "bulk" ? "Bulk Import" : tab === "plans" ? "Plans" : "Help"}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {rightPanelTab === "schedule" ? (
              <PlantSchedule schedule={state.schedule} totalCount={state.totalCount} settings={state.settings} plants={state.plants} />
            ) : rightPanelTab === "bulk" ? (
              <BulkImportPanel
                existingPlants={state.plants}
                onImportPlants={state.importPlants}
              />
            ) : rightPanelTab === "plans" ? (
              <div className="p-3 space-y-3">
                {!auth.user ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-neutral-500 mb-3">Sign in to save and load plans</p>
                    <button onClick={auth.signInWithGoogle}
                      className="flex items-center gap-2 mx-auto px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 shadow-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">{auth.user.email}</span>
                    </div>
                    <button onClick={handleSave}
                      className="w-full px-3 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      {save.currentPlanId ? "Save" : "Save New Plan"}
                    </button>
                    {save.currentPlanId && (
                      <button onClick={async () => {
                        const thumbnail = getThumbnail();
                        await save.saveAsNew(state.getFullState(), thumbnail);
                        setSaveMessage("Saved as new");
                        setTimeout(() => setSaveMessage(null), 2000);
                      }}
                        className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600">
                        Save as New Plan
                      </button>
                    )}
                    <div className="border-t border-neutral-200 pt-3 mt-2">
                      <h3 className="text-xs font-semibold text-neutral-700 mb-2">Saved Plans</h3>
                      {save.loadingPlans ? (
                        <div className="text-xs text-neutral-400 text-center py-2">Loading...</div>
                      ) : save.savedPlans.length === 0 ? (
                        <div className="text-xs text-neutral-400 text-center py-2">No saved plans yet</div>
                      ) : (
                        <div className="space-y-1">
                          {save.savedPlans.map((plan) => (
                            <div key={plan.id}
                              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer group ${
                                save.currentPlanId === plan.id ? "bg-emerald-50 border border-emerald-200" : ""
                              }`}
                              onClick={() => handleLoad(plan)}>
                              {plan.thumbnail ? (
                                <img src={plan.thumbnail} alt="" className="w-10 h-10 rounded object-cover bg-neutral-100" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                  </svg>
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium text-neutral-800 truncate">{plan.name}</div>
                                <div className="text-[10px] text-neutral-400">
                                  {plan.drawing_number} · {new Date(plan.updated_at).toLocaleDateString()}
                                </div>
                              </div>
                              <button onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete "${plan.name}"?`)) save.deletePlan(plan.id);
                              }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-neutral-300 hover:text-red-500">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-3 space-y-3 text-xs text-neutral-600">
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Getting Started</h3>
                  <p>Upload a plan image or drag plants directly onto the canvas.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Shortcuts</h3>
                  <ul className="space-y-1 list-disc pl-3">
                    <li>Scroll to zoom, middle-click to pan</li>
                    <li>Shift+click to multi-select</li>
                    <li>Delete/Backspace removes selected</li>
                    <li>Ctrl+Z / Ctrl+Shift+Z undo/redo</li>
                    <li>Ctrl+S to save</li>
                    <li>Ctrl+A select all</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-emerald-600/10 border-4 border-dashed border-emerald-500 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-xl px-8 py-6 shadow-lg text-center">
            <svg className="mx-auto mb-2 w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="font-semibold text-neutral-800">Drop image to set as plan background</p>
          </div>
        </div>
      )}
    </div>
  );
}
