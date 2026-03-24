"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Stage, Layer, Circle, Text, Image as KonvaImage, Rect, Group } from "react-konva";
import Konva from "konva";
import { Plant } from "./defaultPlants";
import { PlacedPlant, ProjectSettings } from "./types";

interface PlanCanvasProps {
  plants: Plant[];
  placed: PlacedPlant[];
  settings: ProjectSettings;
  backgroundImage: string | null;
  backgroundWidth: number;
  backgroundHeight: number;
  selectedIds: Set<string>;
  onPlace: (plantId: string, x: number, y: number) => void;
  onMove: (uid: string, x: number, y: number) => void;
  onSelect: (uid: string, additive: boolean) => void;
  onClearSelection: () => void;
  onDelete: (uid: string) => void;
  onDeleteSelected: () => void;
  dragPlantId: string | null;
  stageRef: React.RefObject<Konva.Stage | null>;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;

export default function PlanCanvas({
  plants,
  placed,
  settings,
  backgroundImage,
  backgroundWidth,
  backgroundHeight,
  selectedIds,
  onPlace,
  onMove,
  onSelect,
  onClearSelection,
  onDelete,
  onDeleteSelected,
  dragPlantId,
  stageRef,
}: PlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; uid: string } | null>(null);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStageSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Load background image
  useEffect(() => {
    if (!backgroundImage) {
      setBgImg(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => setBgImg(img);
    img.src = backgroundImage;
  }, [backgroundImage]);

  // Fit image to canvas when first loaded
  useEffect(() => {
    if (bgImg && backgroundWidth && backgroundHeight && stageSize.width > 0) {
      const scaleX = stageSize.width / backgroundWidth;
      const scaleY = stageSize.height / backgroundHeight;
      const fitScale = Math.min(scaleX, scaleY, 1);
      setScale(fitScale);
      setPosition({
        x: (stageSize.width - backgroundWidth * fitScale) / 2,
        y: (stageSize.height - backgroundHeight * fitScale) / 2,
      });
    }
  }, [bgImg, backgroundWidth, backgroundHeight, stageSize]);

  // Zoom with scroll wheel
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const factor = 1.08;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, direction > 0 ? oldScale * factor : oldScale / factor));

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, [scale, position, stageRef]);

  // Pan with middle mouse or space+drag
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 1) {
      setIsPanning(true);
      e.evt.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning) {
      setPosition((prev) => ({
        x: prev.x + e.evt.movementX,
        y: prev.y + e.evt.movementY,
      }));
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Click on empty canvas = clear selection
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage() || e.target.attrs.id === "background" || e.target.attrs.id === "bg-image") {
      onClearSelection();
      setContextMenu(null);
    }
  }, [onClearSelection]);

  // Right-click context menu
  const handleContextMenu = useCallback((e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    const uid = e.target.attrs.plantUid || e.target.parent?.attrs.plantUid;
    if (uid) {
      const stage = stageRef.current;
      if (!stage) return;
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      setContextMenu({
        x: e.evt.clientX - containerRect.left,
        y: e.evt.clientY - containerRect.top,
        uid,
      });
    }
  }, [stageRef]);

  // Drop from palette
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const plantId = e.dataTransfer.getData("plantId");
    if (!plantId) return;
    const stage = stageRef.current;
    if (!stage) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    // Convert screen coords to canvas coords
    const x = (e.clientX - containerRect.left - position.x) / scale;
    const y = (e.clientY - containerRect.top - position.y) / scale;
    onPlace(plantId, x, y);
  }, [onPlace, position, scale, stageRef]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.size > 0) {
          e.preventDefault();
          onDeleteSelected();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, onDeleteSelected]);

  const getPlantById = (id: string) => plants.find((p) => p.id === id);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 bg-neutral-100 overflow-hidden cursor-crosshair"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ minHeight: 400 }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleStageClick}
        onContextMenu={handleContextMenu}
      >
        <Layer>
          {/* White background fill */}
          <Rect
            id="background"
            x={-10000}
            y={-10000}
            width={20000}
            height={20000}
            fill="white"
          />

          {/* Background image */}
          {bgImg && (
            <KonvaImage
              id="bg-image"
              image={bgImg}
              x={0}
              y={0}
              width={backgroundWidth}
              height={backgroundHeight}
              opacity={settings.backgroundOpacity}
            />
          )}

          {/* Grid overlay */}
          {settings.showGrid && bgImg && (
            <>
              {Array.from({ length: Math.ceil(backgroundWidth / 50) }, (_, i) => (
                <Rect
                  key={`gv-${i}`}
                  x={i * 50}
                  y={0}
                  width={1}
                  height={backgroundHeight}
                  fill="rgba(0,0,0,0.08)"
                />
              ))}
              {Array.from({ length: Math.ceil(backgroundHeight / 50) }, (_, i) => (
                <Rect
                  key={`gh-${i}`}
                  x={0}
                  y={i * 50}
                  width={backgroundWidth}
                  height={1}
                  fill="rgba(0,0,0,0.08)"
                />
              ))}
            </>
          )}

          {/* Placed plants */}
          {placed.map((pp) => {
            const plant = getPlantById(pp.plantId);
            if (!plant) return null;
            const isSelected = selectedIds.has(pp.uid);
            const r = plant.radius ?? settings.plantRadius;
            return (
              <Group
                key={pp.uid}
                x={pp.x}
                y={pp.y}
                draggable
                plantUid={pp.uid}
                onDragEnd={(e) => {
                  onMove(pp.uid, e.target.x(), e.target.y());
                }}
                onClick={(e) => {
                  e.cancelBubble = true;
                  onSelect(pp.uid, e.evt.shiftKey);
                }}
              >
                {/* Spread circle */}
                {plant.showSpread && plant.spread && (
                  <Circle
                    radius={plant.spread / 2} // spread is diameter in cm, we use it as canvas units
                    fill={plant.colour}
                    opacity={0.12}
                    stroke={plant.colour}
                    strokeWidth={1}
                    dash={[4, 4]}
                    listening={false}
                  />
                )}
                {/* Selection ring */}
                {isSelected && (
                  <Circle
                    radius={r + 3}
                    stroke="#2563eb"
                    strokeWidth={2}
                    dash={[4, 2]}
                  />
                )}
                {/* Plant circle */}
                <Circle
                  radius={r}
                  fill={plant.colour}
                  stroke={isSelected ? "#2563eb" : "rgba(0,0,0,0.3)"}
                  strokeWidth={isSelected ? 2 : 1}
                  plantUid={pp.uid}
                />
                {/* Plant code text */}
                <Text
                  text={plant.code}
                  fontSize={r * 0.9}
                  fontFamily="Arial"
                  fontStyle="bold"
                  fill={plant.textDark ? "#1a1a1a" : "#ffffff"}
                  align="center"
                  verticalAlign="middle"
                  width={r * 2}
                  height={r * 2}
                  offsetX={r}
                  offsetY={r}
                  listening={false}
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 min-w-[120px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 text-red-600"
            onClick={() => {
              onDelete(contextMenu.uid);
              setContextMenu(null);
            }}
          >
            Delete Plant
          </button>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs text-neutral-500 font-mono">
        {Math.round(scale * 100)}%
      </div>

      {/* Empty state */}
      {!backgroundImage && placed.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-neutral-400">
            <svg className="mx-auto mb-3 w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">Upload a plan image to get started</p>
            <p className="text-xs mt-1">or drag plants directly onto the canvas</p>
          </div>
        </div>
      )}
    </div>
  );
}
