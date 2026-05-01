"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Stage, Layer, Circle, Text, Image as KonvaImage, Rect, Group, Arrow, Line } from "react-konva";
import Konva from "konva";
import { Plant } from "./defaultPlants";
import { PlacedPlant, ProjectSettings, ViewingArrow, ScaleCalibration, PaperSettings, BorderPolygon } from "./types";
import { resolveRatio, pageBoundsCanvasPx, printableAreaCanvasPx, gridSpacingMetres } from "./paperUtils";

type ViewMode = "colour" | "scientific";

// Growth multipliers by year (fraction of mature spread)
const GROWTH_MULTIPLIERS = [0, 0.30, 0.50, 0.70, 0.85, 1.0];

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
  viewingArrow: ViewingArrow | null;
  onSetViewingArrow: (arrow: ViewingArrow | null) => void;
  arrowMode: boolean;
  onArrowPlaced: () => void;
  viewMode: ViewMode;
  growthYear: number;
  scale: ScaleCalibration | null;
  scaleMode: boolean;
  onScaleLineDrawn: (x1: number, y1: number, x2: number, y2: number, pixelLength: number) => void;
  onScaleModeExit: () => void;
  paper: PaperSettings;
  /** Notify parent of resolved ratio + paper rect + printable rect (in canvas px). */
  onPageInfoChange?: (
    info:
      | {
          ratio: number;
          pageRect: { x: number; y: number; w: number; h: number };
          printableRect: { x: number; y: number; w: number; h: number; widthMm: number; heightMm: number };
        }
      | null,
  ) => void;
  /** Border drawing */
  border: BorderPolygon | null;
  borderMode: boolean;
  borderInProgress: { x: number; y: number }[];
  onAddBorderPoint: (x: number, y: number) => void;
  onFinishBorder: () => void;
  onCancelBorder: () => void;
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
  viewingArrow,
  onSetViewingArrow,
  arrowMode,
  onArrowPlaced,
  viewMode,
  growthYear,
  scale,
  scaleMode,
  onScaleLineDrawn,
  onScaleModeExit,
  paper,
  onPageInfoChange,
  border,
  borderMode,
  borderInProgress,
  onAddBorderPoint,
  onFinishBorder,
  onCancelBorder,
}: PlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [canvasScale, setCanvasScale] = useState(1);
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
      setCanvasScale(fitScale);
      setPosition({
        x: (stageSize.width - backgroundWidth * fitScale) / 2,
        y: (stageSize.height - backgroundHeight * fitScale) / 2,
      });
    }
  }, [bgImg, backgroundWidth, backgroundHeight, stageSize]);

  // Helper: convert plant spread (cm) to pixel radius using scale calibration
  const spreadToPixels = useCallback((spreadCm: number): number => {
    if (!scale) return spreadCm / 2; // No calibration — use raw value as-is (legacy behaviour)
    // spreadCm / 100 = metres, * pixelsPerMetre = pixels, / 2 = radius
    return (spreadCm / 200) * scale.pixelsPerMetre;
  }, [scale]);

  // Compute drawing bounds (in metres + canvas-px centre) for auto-fit and page placement.
  // Uses union of placed plants (with their spread) and the background image extent.
  const drawingBoundsMetres = useMemo(() => {
    if (!scale) return null;
    const ppm = scale.pixelsPerMetre;
    const pts: { x: number; y: number; r: number }[] = [];
    if (bgImg && backgroundWidth > 0 && backgroundHeight > 0) {
      pts.push({ x: 0, y: 0, r: 0 });
      pts.push({ x: backgroundWidth, y: backgroundHeight, r: 0 });
    }
    for (const pp of placed) {
      const plant = plants.find((p) => p.id === pp.plantId);
      const spread = plant?.spread ?? settings.plantRadius * 2;
      const r = (spread / 200) * ppm;
      pts.push({ x: pp.x, y: pp.y, r });
    }
    if (pts.length === 0) {
      // No plants and no image yet — default to a 5m × 5m canvas around origin
      return { w: 5, h: 5, cx: 0, cy: 0 };
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of pts) {
      minX = Math.min(minX, p.x - p.r);
      minY = Math.min(minY, p.y - p.r);
      maxX = Math.max(maxX, p.x + p.r);
      maxY = Math.max(maxY, p.y + p.r);
    }
    // Add 1m padding so the page doesn't hug the outermost plant
    const padPx = 1 * ppm;
    minX -= padPx; minY -= padPx; maxX += padPx; maxY += padPx;
    return {
      w: (maxX - minX) / ppm,
      h: (maxY - minY) / ppm,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
    };
  }, [scale, placed, plants, bgImg, backgroundWidth, backgroundHeight, settings.plantRadius]);

  const resolvedRatio = useMemo(() => {
    if (!scale || !drawingBoundsMetres) return null;
    return resolveRatio(paper, { w: drawingBoundsMetres.w, h: drawingBoundsMetres.h });
  }, [paper, drawingBoundsMetres, scale]);

  const pageRect = useMemo(() => {
    if (!scale || !drawingBoundsMetres || resolvedRatio == null) return null;
    return pageBoundsCanvasPx(paper, scale, drawingBoundsMetres, resolvedRatio);
  }, [paper, scale, drawingBoundsMetres, resolvedRatio]);

  const printableRect = useMemo(() => {
    if (!scale || !drawingBoundsMetres || resolvedRatio == null) return null;
    return printableAreaCanvasPx(paper, scale, drawingBoundsMetres, resolvedRatio);
  }, [paper, scale, drawingBoundsMetres, resolvedRatio]);

  // Notify parent so the toolbar can show the active ratio + the export can use the same rects
  useEffect(() => {
    if (resolvedRatio != null && pageRect && printableRect) {
      onPageInfoChange?.({ ratio: resolvedRatio, pageRect, printableRect });
    } else {
      onPageInfoChange?.(null);
    }
  }, [resolvedRatio, pageRect, printableRect, onPageInfoChange]);

  // Real-world grid spacing (canvas pixels per grid line)
  const gridStepPx = useMemo(() => {
    if (!scale) return 50; // legacy: 50px when not calibrated
    const stepM = gridSpacingMetres(resolvedRatio ?? 100);
    return stepM * scale.pixelsPerMetre;
  }, [scale, resolvedRatio]);

  // Zoom with scroll wheel
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = canvasScale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const factor = 1.08;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, direction > 0 ? oldScale * factor : oldScale / factor));

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    setCanvasScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, [canvasScale, position, stageRef]);

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

  // Arrow placement state
  const [arrowStart, setArrowStart] = useState<{ x: number; y: number } | null>(null);

  // Scale line drawing state
  const [scaleStart, setScaleStart] = useState<{ x: number; y: number } | null>(null);
  // Reset scaleStart when scaleMode is turned off
  useEffect(() => {
    if (!scaleMode) setScaleStart(null);
  }, [scaleMode]);

  // Click on empty canvas = clear selection OR place arrow OR draw scale line
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const isBackground = e.target === e.target.getStage() || e.target.attrs.id === "background" || e.target.attrs.id === "bg-image";

    // Scale mode: draw reference line
    if (scaleMode && isBackground) {
      const stage = stageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const x = (pointer.x - position.x) / canvasScale;
      const y = (pointer.y - position.y) / canvasScale;

      if (!scaleStart) {
        setScaleStart({ x, y });
      } else {
        const dx = x - scaleStart.x;
        const dy = y - scaleStart.y;
        const pixelLength = Math.sqrt(dx * dx + dy * dy);
        onScaleLineDrawn(scaleStart.x, scaleStart.y, x, y, pixelLength);
        setScaleStart(null);
      }
      return;
    }

    // Border drawing — click to add vertices; click near first to close
    if (borderMode && isBackground) {
      const stage = stageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const x = (pointer.x - position.x) / canvasScale;
      const y = (pointer.y - position.y) / canvasScale;
      if (borderInProgress.length >= 3) {
        const dx = x - borderInProgress[0].x;
        const dy = y - borderInProgress[0].y;
        // Snap-close threshold: ~12 canvas px in screen space
        if (Math.sqrt(dx * dx + dy * dy) * canvasScale < 12) {
          onFinishBorder();
          return;
        }
      }
      onAddBorderPoint(x, y);
      return;
    }

    if (arrowMode && isBackground) {
      const stage = stageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const x = (pointer.x - position.x) / canvasScale;
      const y = (pointer.y - position.y) / canvasScale;

      if (!arrowStart) {
        setArrowStart({ x, y });
      } else {
        onSetViewingArrow({ x1: arrowStart.x, y1: arrowStart.y, x2: x, y2: y });
        setArrowStart(null);
        onArrowPlaced();
      }
      return;
    }

    if (isBackground) {
      onClearSelection();
      setContextMenu(null);
    }
  }, [onClearSelection, arrowMode, arrowStart, scaleMode, scaleStart, position, canvasScale, stageRef, onSetViewingArrow, onArrowPlaced, onScaleLineDrawn, borderMode, borderInProgress, onAddBorderPoint, onFinishBorder]);

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
    const x = (e.clientX - containerRect.left - position.x) / canvasScale;
    const y = (e.clientY - containerRect.top - position.y) / canvasScale;
    onPlace(plantId, x, y);
  }, [onPlace, position, canvasScale, stageRef]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.size > 0) {
          e.preventDefault();
          onDeleteSelected();
        }
      }
      if (borderMode) {
        if (e.key === "Enter") {
          e.preventDefault();
          if (borderInProgress.length >= 3) onFinishBorder();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          onCancelBorder();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, onDeleteSelected, borderMode, borderInProgress, onFinishBorder, onCancelBorder]);

  const getPlantById = (id: string) => plants.find((p) => p.id === id);

  return (
    <div
      ref={containerRef}
      className={`relative flex-1 bg-neutral-50 overflow-hidden ${
        isPanning ? "cursor-grabbing" :
        scaleMode || borderMode ? "cursor-crosshair" :
        arrowMode ? "cursor-pointer" :
        "cursor-default"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ minHeight: 400 }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={canvasScale}
        scaleY={canvasScale}
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

          {/* Grid overlay (real-world metres when scale is set, falls back to 50px) */}
          {settings.showGrid && (() => {
            // Determine grid extent: prefer page rect when set, else image, else nothing.
            const gx = pageRect ? pageRect.x : 0;
            const gy = pageRect ? pageRect.y : 0;
            const gw = pageRect ? pageRect.w : backgroundWidth;
            const gh = pageRect ? pageRect.h : backgroundHeight;
            if (gw <= 0 || gh <= 0) return null;
            const verticals = Math.ceil(gw / gridStepPx) + 1;
            const horizontals = Math.ceil(gh / gridStepPx) + 1;
            return (
              <>
                {Array.from({ length: verticals }, (_, i) => (
                  <Rect
                    key={`gv-${i}`}
                    x={gx + i * gridStepPx}
                    y={gy}
                    width={1}
                    height={gh}
                    fill="rgba(0,0,0,0.08)"
                    listening={false}
                  />
                ))}
                {Array.from({ length: horizontals }, (_, i) => (
                  <Rect
                    key={`gh-${i}`}
                    x={gx}
                    y={gy + i * gridStepPx}
                    width={gw}
                    height={1}
                    fill="rgba(0,0,0,0.08)"
                    listening={false}
                  />
                ))}
              </>
            );
          })()}

          {/* Placed plants */}
          {placed.map((pp) => {
            const plant = getPlantById(pp.plantId);
            if (!plant) return null;
            const isSelected = selectedIds.has(pp.uid);
            const baseR = plant.radius ?? settings.plantRadius;

            if (viewMode === "scientific") {
              // Scientific / Growth view
              const matureSpreadCm = plant.spread || baseR * 3; // fallback if no spread data
              const growthFactor = GROWTH_MULTIPLIERS[growthYear] || 1;
              const matureR = scale ? spreadToPixels(matureSpreadCm) : matureSpreadCm / 2;
              const spreadR = matureR * growthFactor;
              const coreR = Math.max(4, spreadR * 0.15); // small core dot
              // Muted green palette based on plant type
              const isGrass = plant.growthHabit?.toLowerCase().includes("gramin") || ["Anemanthele", "Pennisetum", "Stipa", "Miscanthus"].some(g => plant.name.includes(g));
              const isShrub = plant.growthHabit?.toLowerCase().includes("shrub") || ["Pittosporum", "Phormium"].some(g => plant.name.includes(g));
              const spreadFill = isGrass ? "#b8d4b8" : isShrub ? "#6b8e6b" : "#a8c8a0";
              const spreadStroke = isGrass ? "#7da67d" : isShrub ? "#4a6e4a" : "#6b946b";

              return (
                <Group
                  key={pp.uid}
                  x={pp.x}
                  y={pp.y}
                  draggable
                  plantUid={pp.uid}
                  onDragEnd={(e) => onMove(pp.uid, e.target.x(), e.target.y())}
                  onClick={(e) => { e.cancelBubble = true; onSelect(pp.uid, e.evt.shiftKey); }}
                >
                  {/* Spread area */}
                  <Circle
                    radius={spreadR}
                    fill={spreadFill}
                    opacity={0.25}
                    stroke={spreadStroke}
                    strokeWidth={1}
                    dash={[3, 3]}
                    listening={false}
                  />
                  {/* Mature outline (year 5) — shown as ghost */}
                  {growthYear < 5 && (
                    <Circle
                      radius={matureR}
                      stroke={spreadStroke}
                      strokeWidth={0.5}
                      opacity={0.15}
                      dash={[6, 6]}
                      listening={false}
                    />
                  )}
                  {/* Selection ring */}
                  {isSelected && (
                    <Circle radius={spreadR + 3} stroke="#2563eb" strokeWidth={2} dash={[4, 2]} />
                  )}
                  {/* Core planting point */}
                  <Circle
                    radius={coreR}
                    fill={plant.colour}
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth={1}
                    plantUid={pp.uid}
                  />
                  {/* Botanical name label */}
                  <Text
                    text={`${plant.name}\n${plant.cultivar}`}
                    fontSize={8}
                    fontFamily="Arial"
                    fontStyle="italic"
                    fill="#374151"
                    align="center"
                    y={spreadR + 4}
                    width={120}
                    offsetX={60}
                    listening={false}
                  />
                  {/* Spread measurement */}
                  <Text
                    text={`${Math.round(matureSpreadCm * growthFactor)}cm`}
                    fontSize={7}
                    fontFamily="Arial"
                    fill="#9ca3af"
                    align="center"
                    y={-spreadR - 12}
                    width={60}
                    offsetX={30}
                    listening={false}
                  />
                </Group>
              );
            }

            // Default: Colour-coded view
            // When scale is calibrated, size the circle to real-world spread
            const scaledR = scale && plant.spread
              ? spreadToPixels(plant.spread)
              : baseR;

            return (
              <Group
                key={pp.uid}
                x={pp.x}
                y={pp.y}
                draggable
                plantUid={pp.uid}
                onDragEnd={(e) => onMove(pp.uid, e.target.x(), e.target.y())}
                onClick={(e) => { e.cancelBubble = true; onSelect(pp.uid, e.evt.shiftKey); }}
              >
                {/* Spread circle (if toggled per-plant) */}
                {plant.showSpread && plant.spread && (
                  <Circle
                    radius={scale ? spreadToPixels(plant.spread) : plant.spread / 2}
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
                  <Circle radius={scaledR + 3} stroke="#2563eb" strokeWidth={2} dash={[4, 2]} />
                )}
                {/* Plant circle */}
                <Circle
                  radius={scaledR}
                  fill={plant.colour}
                  stroke={isSelected ? "#2563eb" : "rgba(0,0,0,0.3)"}
                  strokeWidth={isSelected ? 2 : 1}
                  plantUid={pp.uid}
                />
                {/* Plant code text */}
                <Text
                  text={plant.code}
                  fontSize={Math.min(scaledR * 0.9, 24)}
                  fontFamily="Arial"
                  fontStyle="bold"
                  fill={plant.textDark ? "#1a1a1a" : "#ffffff"}
                  align="center"
                  verticalAlign="middle"
                  width={scaledR * 2}
                  height={scaledR * 2}
                  offsetX={scaledR}
                  offsetY={scaledR}
                  listening={false}
                />
              </Group>
            );
          })}

          {/* Viewing direction arrow */}
          {viewingArrow && (
            <Arrow
              points={[viewingArrow.x1, viewingArrow.y1, viewingArrow.x2, viewingArrow.y2]}
              stroke="#2563eb"
              strokeWidth={3}
              fill="#2563eb"
              pointerLength={12}
              pointerWidth={10}
              dash={[8, 4]}
              listening={false}
            />
          )}
          {/* Arrow placement preview (first click placed, tracking mouse) */}
          {arrowStart && arrowMode && (
            <Circle
              x={arrowStart.x}
              y={arrowStart.y}
              radius={6}
              fill="#2563eb"
              listening={false}
            />
          )}

          {/* Scale reference line — sized so it prints visibly at any A4/A3 ratio */}
          {scale && (() => {
            // Target sizes on the printed page, in mm. Convert to canvas pixels via ratio.
            // canvasPx = (mm / 1000) × ratio × pixelsPerMetre.
            // If no ratio yet, fall back to roughly 0.5m of real world.
            const ratio = resolvedRatio ?? 100;
            const ppm = scale.pixelsPerMetre;
            const mmToPx = (mm: number) => (mm / 1000) * ratio * ppm;
            const tickMm = 4;       // end-tick half-length on paper
            const strokeMm = 0.6;   // line stroke width on paper
            const labelMm = 5;      // label height on paper
            const tickHalfPx = mmToPx(tickMm);
            const strokePx = Math.max(2, mmToPx(strokeMm));
            const fontSizePx = Math.max(14, mmToPx(labelMm));
            const dx = scale.x2 - scale.x1;
            const dy = scale.y2 - scale.y1;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / len * tickHalfPx;
            const ny = dx / len * tickHalfPx;
            const cx = (scale.x1 + scale.x2) / 2;
            const cy = (scale.y1 + scale.y2) / 2;
            // Offset the label perpendicular to the line so it sits above
            const offMagPx = mmToPx(7);
            const offX = -dy / len * offMagPx;
            const offY = dx / len * offMagPx;
            const labelW = fontSizePx * 5;
            return (
              <Group listening={false}>
                <Line
                  points={[scale.x1, scale.y1, scale.x2, scale.y2]}
                  stroke="#dc2626"
                  strokeWidth={strokePx}
                  dash={[strokePx * 4, strokePx * 2]}
                />
                <Line
                  points={[scale.x1 + nx, scale.y1 + ny, scale.x1 - nx, scale.y1 - ny]}
                  stroke="#dc2626"
                  strokeWidth={strokePx}
                />
                <Line
                  points={[scale.x2 + nx, scale.y2 + ny, scale.x2 - nx, scale.y2 - ny]}
                  stroke="#dc2626"
                  strokeWidth={strokePx}
                />
                {/* White halo behind label so it's readable over plants */}
                <Rect
                  x={cx + offX - labelW / 2 - mmToPx(1)}
                  y={cy + offY - fontSizePx * 0.55 - mmToPx(0.5)}
                  width={labelW + mmToPx(2)}
                  height={fontSizePx * 1.1 + mmToPx(1)}
                  fill="rgba(255,255,255,0.85)"
                  cornerRadius={mmToPx(0.5)}
                />
                <Text
                  x={cx + offX}
                  y={cy + offY - fontSizePx * 0.5}
                  text={`${scale.realMetres}m reference`}
                  fontSize={fontSizePx}
                  fontFamily="Arial"
                  fontStyle="bold"
                  fill="#dc2626"
                  align="center"
                  width={labelW}
                  offsetX={labelW / 2}
                />
              </Group>
            );
          })()}

          {/* Completed border polygon + area label */}
          {border && border.points.length >= 3 && (() => {
            const pts = border.points;
            // Shoelace area in canvas pixels
            let s = 0;
            for (let i = 0; i < pts.length; i++) {
              const j = (i + 1) % pts.length;
              s += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
            }
            const areaPx = Math.abs(s) / 2;
            // Centroid
            let cx = 0, cy = 0;
            for (const p of pts) { cx += p.x; cy += p.y; }
            cx /= pts.length; cy /= pts.length;
            const ratio = resolvedRatio ?? 100;
            const ppm = scale?.pixelsPerMetre ?? 100;
            const areaM2 = scale ? areaPx / (ppm * ppm) : null;
            const fontSizePx = Math.max(16, scale ? ((6 / 1000) * ratio * ppm) : 18);
            // Flatten for Konva Line
            const flat: number[] = [];
            for (const p of pts) flat.push(p.x, p.y);
            return (
              <Group listening={false}>
                <Line
                  points={flat}
                  closed
                  fill="rgba(245, 158, 11, 0.10)"
                  stroke="#d97706"
                  strokeWidth={Math.max(2, ((0.6 / 1000) * ratio * ppm))}
                />
                {areaM2 != null && (
                  <>
                    <Rect
                      x={cx - fontSizePx * 3}
                      y={cy - fontSizePx * 0.7}
                      width={fontSizePx * 6}
                      height={fontSizePx * 1.4}
                      fill="rgba(255,255,255,0.9)"
                      cornerRadius={4}
                      stroke="#d97706"
                      strokeWidth={1}
                    />
                    <Text
                      x={cx - fontSizePx * 3}
                      y={cy - fontSizePx * 0.4}
                      width={fontSizePx * 6}
                      text={`${areaM2.toFixed(1)} m²`}
                      fontSize={fontSizePx}
                      fontFamily="Arial"
                      fontStyle="bold"
                      fill="#92400e"
                      align="center"
                    />
                  </>
                )}
              </Group>
            );
          })()}

          {/* In-progress border drawing */}
          {borderMode && borderInProgress.length > 0 && (
            <Group listening={false}>
              {borderInProgress.length > 1 && (
                <Line
                  points={borderInProgress.flatMap((p) => [p.x, p.y])}
                  stroke="#d97706"
                  strokeWidth={2}
                  dash={[6, 4]}
                />
              )}
              {borderInProgress.map((p, i) => (
                <Circle
                  key={`bp-${i}`}
                  x={p.x}
                  y={p.y}
                  radius={i === 0 && borderInProgress.length >= 3 ? 8 : 4}
                  fill={i === 0 && borderInProgress.length >= 3 ? "#fef3c7" : "#d97706"}
                  stroke="#d97706"
                  strokeWidth={2}
                />
              ))}
            </Group>
          )}

          {/* Scale line drawing preview */}
          {scaleStart && scaleMode && (
            <Circle
              x={scaleStart.x}
              y={scaleStart.y}
              radius={6}
              fill="#dc2626"
              listening={false}
            />
          )}

          {/* Page-bounds rectangles + scale bar (only when scale calibrated) */}
          {pageRect && printableRect && resolvedRatio != null && scale && (() => {
            const stepM = gridSpacingMetres(resolvedRatio);
            const stepPx = stepM * scale.pixelsPerMetre;
            // 5-step bar with tick labels; never wider than the printable area
            const maxBarPx = printableRect.w - 200;
            const stepCount = Math.max(2, Math.min(5, Math.floor(maxBarPx / stepPx)));
            const barH = Math.max(14, scale.pixelsPerMetre * 0.04); // ~4cm tall in real-world ≈ visible
            const barX = printableRect.x + 16;
            const barY = printableRect.y + printableRect.h - barH - 28;
            const fontSize = Math.max(10, scale.pixelsPerMetre * 0.04);
            return (
              <Group listening={false} name="page-overlay">
                {/* Outer paper edge (dashed, light) */}
                <Rect
                  x={pageRect.x}
                  y={pageRect.y}
                  width={pageRect.w}
                  height={pageRect.h}
                  stroke="#94a3b8"
                  strokeWidth={1}
                  dash={[6, 4]}
                />
                {/* Inner printable area (solid teal) — what actually prints */}
                <Rect
                  x={printableRect.x}
                  y={printableRect.y}
                  width={printableRect.w}
                  height={printableRect.h}
                  stroke="#0f766e"
                  strokeWidth={2}
                  dash={[10, 6]}
                />
                <Text
                  x={printableRect.x + 8}
                  y={printableRect.y + 8}
                  text={`${paper.size} ${paper.orientation === "landscape" ? "Landscape" : "Portrait"}  ·  Scale 1:${resolvedRatio}${paper.ratio == null ? " (auto)" : ""}  ·  printable ${printableRect.widthMm.toFixed(0)}×${printableRect.heightMm.toFixed(0)}mm`}
                  fontSize={Math.max(10, scale.pixelsPerMetre * 0.05)}
                  fontFamily="Arial"
                  fontStyle="bold"
                  fill="#0f766e"
                />

                {/* Scale-bar — alternating black/white segments aligned to grid */}
                {Array.from({ length: stepCount }, (_, i) => (
                  <Rect
                    key={`sb-${i}`}
                    x={barX + i * stepPx}
                    y={barY}
                    width={stepPx}
                    height={barH}
                    fill={i % 2 === 0 ? "#1a1a1a" : "#ffffff"}
                    stroke="#1a1a1a"
                    strokeWidth={1}
                  />
                ))}
                {Array.from({ length: stepCount + 1 }, (_, i) => {
                  const m = i * stepM;
                  return (
                    <Text
                      key={`tk-${i}`}
                      x={barX + i * stepPx - 24}
                      y={barY + barH + 2}
                      width={48}
                      align="center"
                      text={`${m}m`}
                      fontSize={fontSize}
                      fontFamily="Arial"
                      fill="#1a1a1a"
                    />
                  );
                })}
                <Text
                  x={barX + stepPx * stepCount + 12}
                  y={barY + barH * 0.25}
                  text={`Scale 1:${resolvedRatio}  ·  grid ${stepM}m`}
                  fontSize={fontSize}
                  fontFamily="Arial"
                  fontStyle="bold"
                  fill="#1a1a1a"
                />

                {/* Calibration checksum — show the scale-line distance and what it should measure on paper */}
                {(() => {
                  const refMm = (scale.realMetres * 1000) / resolvedRatio;
                  return (
                    <Text
                      x={printableRect.x + 8}
                      y={printableRect.y + printableRect.h - barH - 56}
                      text={`Calibration: ${scale.realMetres}m reference → ${refMm.toFixed(1)}mm on paper at 1:${resolvedRatio}`}
                      fontSize={fontSize}
                      fontFamily="Arial"
                      fill="#525252"
                    />
                  );
                })()}
              </Group>
            );
          })()}
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

      {/* Border mode banner */}
      {borderMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 z-10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v18M19 3v18M3 5h18M3 19h18" />
          </svg>
          {borderInProgress.length === 0
            ? "Click around your bed to add corners"
            : borderInProgress.length < 3
            ? `Click to add corners (${borderInProgress.length})`
            : `Click first point to close (${borderInProgress.length} corners) · Enter to finish · Esc to cancel`}
          <button onClick={onCancelBorder} className="ml-2 px-2 py-0.5 bg-white/20 rounded hover:bg-white/30 text-[10px]">
            Cancel
          </button>
        </div>
      )}

      {/* Scale mode banner */}
      {scaleMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 z-10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          {scaleStart ? "Click the end point of your reference line" : "Click the start point of a known distance"}
          <button onClick={onScaleModeExit} className="ml-2 px-2 py-0.5 bg-white/20 rounded hover:bg-white/30 text-[10px]">
            Cancel
          </button>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs text-neutral-500 font-mono">
        {Math.round(canvasScale * 100)}%
      </div>

      {/* Empty / onboarding state */}
      {!backgroundImage && placed.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm px-8 py-7 max-w-md">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-emerald-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-3.5 0-6 2.5-6 6 0 2.5 1.5 4.5 3 5.5V20a1 1 0 002 0v-6.5c.5-.2 1-.5 1-.5s.5.3 1 .5V20a1 1 0 002 0v-6.5c1.5-1 3-3 3-5.5 0-3.5-2.5-6-6-6z"/></svg>
              <h2 className="text-sm font-semibold text-neutral-900 tracking-tight">Plant your plan</h2>
            </div>
            <p className="text-xs text-neutral-500 mb-5">Print true-to-scale planting plans on A4 or A3.</p>
            <ol className="space-y-3 text-[13px] text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold flex items-center justify-center mt-0.5">1</span>
                <span><span className="font-medium">Upload</span> your border outline or site plan.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold flex items-center justify-center mt-0.5">2</span>
                <span><span className="font-medium">Set scale</span> by drawing a line of known length.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold flex items-center justify-center mt-0.5">3</span>
                <span><span className="font-medium">Pick paper</span> — A4 / A3 at 1:50, 1:100 or auto-fit.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold flex items-center justify-center mt-0.5">4</span>
                <span><span className="font-medium">Drag plants</span> from the palette &amp; export the print-ready PDF.</span>
              </li>
            </ol>
            <p className="mt-5 text-[11px] text-neutral-400">Drop an image anywhere on this canvas to begin.</p>
          </div>
        </div>
      )}

      {/* Mid-flow nudge: image up, but scale not set yet */}
      {backgroundImage && !scale && (
        <div className="absolute top-3 right-3 bg-white border border-neutral-200 rounded-lg shadow-sm px-3 py-2 max-w-[260px] z-10">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold flex items-center justify-center mt-0.5">2</div>
            <div className="text-[12px] text-neutral-700">
              <span className="font-medium">Set the scale.</span>
              <span className="block text-[11px] text-neutral-500 mt-0.5">Click the Scale button, then click two points along a known dimension.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
