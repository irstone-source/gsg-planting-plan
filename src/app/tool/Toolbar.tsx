"use client";

import { useRef, useState } from "react";
import Konva from "konva";
import { User } from "@supabase/supabase-js";
import { ProjectSettings } from "./types";

export type ViewMode = "colour" | "scientific";

interface ToolbarProps {
  settings: ProjectSettings;
  onUpdateSettings: (partial: Partial<ProjectSettings>) => void;
  onImageUpload: (file: File) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClearAll: () => void;
  stageRef: React.RefObject<Konva.Stage | null>;
  backgroundImage: string | null;
  totalCount: number;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onSave: () => void;
  saving: boolean;
  saveMessage: string | null;
  currentPlanId: string | null;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  growthYear: number;
  onGrowthYearChange: (year: number) => void;
  isAnimating: boolean;
  onToggleAnimate: () => void;
}

export default function Toolbar({
  settings,
  onUpdateSettings,
  onImageUpload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClearAll,
  stageRef,
  backgroundImage,
  totalCount,
  user,
  onSignIn,
  onSignOut,
  onSave,
  saving,
  saveMessage,
  currentPlanId,
  viewMode,
  onViewModeChange,
  growthYear,
  onGrowthYearChange,
  isAnimating,
  onToggleAnimate,
}: ToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  const exportPNG = (withBackground: boolean) => {
    const stage = stageRef.current;
    if (!stage) return;

    // If exporting without background, temporarily hide the bg image
    const bgImage = stage.findOne("#bg-image");

    if (!withBackground && bgImage) {
      bgImage.visible(false);
    }

    // Get the content bounds
    const dataURL = stage.toDataURL({
      pixelRatio: 2,
      mimeType: "image/png",
    });

    // Create canvas with title block
    const img = new window.Image();
    img.onload = () => {
      const titleBlockHeight = 60;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height + titleBlockHeight * 2; // x2 for retina
      const ctx = canvas.getContext("2d")!;

      // White fill
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw plan
      ctx.drawImage(img, 0, 0);

      // Title block
      const y = img.height;
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, y, canvas.width, titleBlockHeight * 2);
      ctx.strokeStyle = "#d4d4d4";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, y, canvas.width, titleBlockHeight * 2);

      ctx.fillStyle = "#262626";
      ctx.font = "bold 24px Arial";
      ctx.fillText(settings.name, 20, y + 35);
      ctx.font = "16px Arial";
      ctx.fillStyle = "#737373";
      ctx.fillText(`${settings.drawingNumber}  |  ${settings.date}  |  NTS  |  ${totalCount} plants`, 20, y + 65);
      ctx.fillText("George Stone Gardens", 20, y + 95);

      // Download
      const link = document.createElement("a");
      link.download = `${settings.drawingNumber}-planting-plan.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = dataURL;

    // Restore visibility
    if (!withBackground && bgImage) {
      bgImage.visible(true);
    }
  };

  return (
    <div className="h-12 bg-white border-b border-neutral-200 flex items-center px-3 gap-2 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-7 h-7 bg-emerald-600 rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-bold">GSG</span>
        </div>
        <span className="text-sm font-semibold text-neutral-800 hidden sm:block">Planting Plan Tool</span>
      </div>

      <div className="w-px h-6 bg-neutral-200" />

      {/* Upload */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md hover:bg-neutral-100 text-neutral-600"
        title="Upload plan image"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Upload
      </button>

      <div className="w-px h-6 bg-neutral-200" />

      {/* Undo/Redo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-1.5 rounded hover:bg-neutral-100 disabled:opacity-30"
        title="Undo (Ctrl+Z)"
      >
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a4 4 0 014 4v0a4 4 0 01-4 4H3m0-8l4-4m-4 4l4 4" />
        </svg>
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-1.5 rounded hover:bg-neutral-100 disabled:opacity-30"
        title="Redo (Ctrl+Shift+Z)"
      >
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a4 4 0 00-4 4v0a4 4 0 004 4h10m0-8l-4-4m4 4l-4 4" />
        </svg>
      </button>

      <div className="w-px h-6 bg-neutral-200" />

      {/* Plant size slider */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Default</span>
        <input
          type="range"
          min={8}
          max={40}
          value={settings.plantRadius}
          onChange={(e) => onUpdateSettings({ plantRadius: parseInt(e.target.value) })}
          className="w-20 h-1 accent-emerald-600"
        />
        <span className="text-xs text-neutral-500 font-mono w-5">{settings.plantRadius}</span>
      </div>

      <div className="w-px h-6 bg-neutral-200" />

      {/* Grid toggle */}
      <button
        onClick={() => onUpdateSettings({ showGrid: !settings.showGrid })}
        className={`p-1.5 rounded text-xs ${settings.showGrid ? "bg-emerald-100 text-emerald-700" : "hover:bg-neutral-100 text-neutral-500"}`}
        title="Toggle grid"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 8h16M4 12h16M4 16h16M4 20h16M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16" />
        </svg>
      </button>

      {/* Opacity slider */}
      {backgroundImage && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Bg</span>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.backgroundOpacity * 100}
            onChange={(e) => onUpdateSettings({ backgroundOpacity: parseInt(e.target.value) / 100 })}
            className="w-16 h-1 accent-emerald-600"
          />
        </div>
      )}

      <div className="w-px h-6 bg-neutral-200" />

      {/* View Mode Toggle */}
      <div className="flex items-center bg-neutral-100 rounded-md p-0.5">
        <button
          onClick={() => onViewModeChange("colour")}
          className={`px-2 py-1 text-[10px] rounded font-medium transition-colors ${
            viewMode === "colour" ? "bg-white text-emerald-700 shadow-sm" : "text-neutral-500"
          }`}
          title="Colour-coded circles"
        >
          Colour
        </button>
        <button
          onClick={() => onViewModeChange("scientific")}
          className={`px-2 py-1 text-[10px] rounded font-medium transition-colors ${
            viewMode === "scientific" ? "bg-white text-blue-700 shadow-sm" : "text-neutral-500"
          }`}
          title="Scientific view with spread"
        >
          Growth
        </button>
      </div>

      {/* Year slider (only in scientific mode) */}
      {viewMode === "scientific" && (
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-blue-500 font-bold w-7">Yr {growthYear}</span>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={growthYear}
              onChange={(e) => onGrowthYearChange(parseInt(e.target.value))}
              className="w-20 h-1 accent-blue-600"
            />
          </div>
          <button
            onClick={onToggleAnimate}
            className={`p-1.5 rounded ${isAnimating ? "bg-blue-100 text-blue-600" : "hover:bg-neutral-100 text-neutral-500"}`}
            title={isAnimating ? "Stop animation" : "Animate growth (Year 1→5)"}
          >
            {isAnimating ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </>
      )}

      <div className="flex-1" />

      {/* Settings */}
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500"
          title="Project settings"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        {showSettings && (
          <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-50 space-y-3">
            <div>
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Project Name</label>
              <input
                value={settings.name}
                onChange={(e) => onUpdateSettings({ name: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border rounded bg-neutral-50"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Drawing Number</label>
              <input
                value={settings.drawingNumber}
                onChange={(e) => onUpdateSettings({ drawingNumber: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border rounded bg-neutral-50"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Date</label>
              <input
                type="date"
                value={settings.date}
                onChange={(e) => onUpdateSettings({ date: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border rounded bg-neutral-50"
              />
            </div>
            <button
              onClick={() => {
                if (confirm("Clear everything and start fresh?")) {
                  onClearAll();
                  setShowSettings(false);
                }
              }}
              className="w-full px-2 py-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50"
            >
              Clear All &amp; Reset
            </button>
          </div>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={saving}
        className="relative px-2.5 py-1.5 text-xs border border-neutral-200 rounded-md hover:bg-neutral-50 text-neutral-600 font-medium flex items-center gap-1"
        title="Save plan (Ctrl+S)"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        {saving ? "Saving..." : saveMessage || "Save"}
      </button>

      {/* Export buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => exportPNG(true)}
          className="px-2.5 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
        >
          Export PNG
        </button>
        <button
          onClick={() => exportPNG(false)}
          className="px-2.5 py-1.5 text-xs bg-neutral-800 text-white rounded-md hover:bg-neutral-900 font-medium"
        >
          Clean PNG
        </button>
      </div>

      <div className="w-px h-6 bg-neutral-200" />

      {/* Auth */}
      {user ? (
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-[10px] font-bold text-emerald-700">
              {user.email?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <button onClick={onSignOut} className="text-[10px] text-neutral-400 hover:text-neutral-600">
            Sign out
          </button>
        </div>
      ) : (
        <button onClick={onSignIn}
          className="flex items-center gap-1 px-2 py-1 text-[10px] border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-500">
          <svg className="w-3 h-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in
        </button>
      )}
    </div>
  );
}
