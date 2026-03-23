"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect, useCallback } from "react";
import Konva from "konva";
import { usePlanState } from "./usePlanState";
import PlantPalette from "./PlantPalette";
import PlantSchedule from "./PlantSchedule";
import Toolbar from "./Toolbar";

// Konva must be client-only (no SSR)
const PlanCanvas = dynamic(() => import("./PlanCanvas"), { ssr: false });

export default function ToolPage() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [dragPlantId, setDragPlantId] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"schedule" | "help">("schedule");
  const state = usePlanState();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        state.undo();
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.ctrlKey || e.metaKey) && (e.key === "Z" || e.key === "y") && (e.shiftKey || e.key === "y")) {
        e.preventDefault();
        state.redo();
      }
      // Select all: Ctrl+A
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        state.selectAll();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state]);

  // Drop zone for initial image upload
  const [isDragOver, setIsDragOver] = useState(false);

  const handleGlobalDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        state.handleImageUpload(file);
      }
    },
    [state]
  );

  return (
    <div
      className="h-screen flex flex-col bg-neutral-50 overflow-hidden"
      onDragOver={(e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes("Files")) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleGlobalDrop}
    >
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
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Plant Palette */}
        <PlantPalette
          plants={state.plants}
          onAddPlant={state.addCustomPlant}
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
        />

        {/* Right: Schedule */}
        <div className="w-72 bg-white border-l border-neutral-200 flex flex-col">
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => setRightPanelTab("schedule")}
              className={`flex-1 py-2 text-xs font-medium ${
                rightPanelTab === "schedule"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Plant Schedule
            </button>
            <button
              onClick={() => setRightPanelTab("help")}
              className={`flex-1 py-2 text-xs font-medium ${
                rightPanelTab === "help"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Help
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {rightPanelTab === "schedule" ? (
              <PlantSchedule schedule={state.schedule} totalCount={state.totalCount} />
            ) : (
              <div className="p-3 space-y-3 text-xs text-neutral-600">
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Getting Started</h3>
                  <p>Upload a plan image using the toolbar button, or drag an image file onto the canvas.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Placing Plants</h3>
                  <p>Drag plants from the left palette onto the canvas. Each drop creates a colour-coded circle.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Editing</h3>
                  <ul className="space-y-1 list-disc pl-3">
                    <li>Click a plant to select it</li>
                    <li>Shift+click to multi-select</li>
                    <li>Drag to reposition</li>
                    <li>Right-click to delete</li>
                    <li>Delete/Backspace removes selected</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Navigation</h3>
                  <ul className="space-y-1 list-disc pl-3">
                    <li>Scroll to zoom in/out</li>
                    <li>Middle-click + drag to pan</li>
                    <li>Ctrl+Z / Ctrl+Shift+Z for undo/redo</li>
                    <li>Ctrl+A to select all</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Export</h3>
                  <p><strong>Export PNG</strong> — full plan with background image and title block.</p>
                  <p className="mt-1"><strong>Clean PNG</strong> — plants on white background with title block.</p>
                  <p className="mt-1"><strong>Export CSV</strong> — plant schedule from the Schedule tab.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag overlay for file upload */}
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
