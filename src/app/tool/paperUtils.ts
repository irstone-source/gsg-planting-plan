import {
  PaperSettings,
  PAPER_SIZES_MM,
  SCALE_RATIOS,
  ScaleCalibration,
} from "./types";

/** Paper width and height in mm, accounting for orientation. */
export function paperDimensionsMm(paper: PaperSettings): { w: number; h: number } {
  const [shortSide, longSide] = PAPER_SIZES_MM[paper.size];
  return paper.orientation === "landscape"
    ? { w: longSide, h: shortSide }
    : { w: shortSide, h: longSide };
}

export interface DrawingBoundsMetres {
  /** Width in metres */
  w: number;
  /** Height in metres */
  h: number;
  /** Centre x in canvas pixels (where to place the page rectangle) */
  cx: number;
  /** Centre y in canvas pixels */
  cy: number;
}

/**
 * Pick the smallest standard ratio (1:20 → 1:500) at which the drawing fits
 * inside the printable area (paper minus margins). Returns null if even
 * the coarsest ratio (1:500) can't accommodate it.
 */
export function autoFitRatio(
  paper: PaperSettings,
  drawing: { w: number; h: number },
): number | null {
  const { w: paperW, h: paperH } = paperDimensionsMm(paper);
  const usableW = paperW - 2 * paper.marginMm;
  const usableH = paperH - 2 * paper.marginMm;
  for (const r of SCALE_RATIOS) {
    const drawnW_mm = drawing.w * 1000 / r;
    const drawnH_mm = drawing.h * 1000 / r;
    if (drawnW_mm <= usableW && drawnH_mm <= usableH) return r;
  }
  return null;
}

/** Resolve the active ratio: explicit user choice, or auto-fit fallback. */
export function resolveRatio(
  paper: PaperSettings,
  drawing: { w: number; h: number },
): number {
  if (paper.ratio != null) return paper.ratio;
  return autoFitRatio(paper, drawing) ?? SCALE_RATIOS[SCALE_RATIOS.length - 1];
}

/** Title-block height in mm (reserved at bottom of printable area). */
export const TITLE_BLOCK_MM = 22;

/**
 * Outer paper rectangle in canvas pixels.
 * Width on canvas = paper width in metres × pixelsPerMetre
 *                 = (paperMm / 1000) × ratio × pixelsPerMetre
 */
export function pageBoundsCanvasPx(
  paper: PaperSettings,
  scale: ScaleCalibration,
  drawing: DrawingBoundsMetres,
  ratio: number,
): { x: number; y: number; w: number; h: number } {
  const { w: paperW_mm, h: paperH_mm } = paperDimensionsMm(paper);
  const w = (paperW_mm / 1000) * ratio * scale.pixelsPerMetre;
  const h = (paperH_mm / 1000) * ratio * scale.pixelsPerMetre;
  return { x: drawing.cx - w / 2, y: drawing.cy - h / 2, w, h };
}

/**
 * Inner *printable* area (paper minus margins minus title-block reserve)
 * in canvas pixels. This is what the export captures and renders at true scale.
 */
export function printableAreaCanvasPx(
  paper: PaperSettings,
  scale: ScaleCalibration,
  drawing: DrawingBoundsMetres,
  ratio: number,
): { x: number; y: number; w: number; h: number; widthMm: number; heightMm: number } {
  const { w: paperW_mm, h: paperH_mm } = paperDimensionsMm(paper);
  const widthMm = paperW_mm - 2 * paper.marginMm;
  const heightMm = paperH_mm - 2 * paper.marginMm - TITLE_BLOCK_MM;
  const w = (widthMm / 1000) * ratio * scale.pixelsPerMetre;
  const h = (heightMm / 1000) * ratio * scale.pixelsPerMetre;
  return {
    x: drawing.cx - w / 2,
    y: drawing.cy - h / 2,
    w,
    h,
    widthMm,
    heightMm,
  };
}

/**
 * Pick a sensible grid spacing (in metres) for the active ratio.
 * Tighter ratios (closer to 1:1) get a finer grid so it's not too coarse on screen.
 */
export function gridSpacingMetres(ratio: number): number {
  if (ratio <= 25) return 0.25;
  if (ratio <= 50) return 0.5;
  if (ratio <= 200) return 1;
  return 5;
}

/** Compute target image pixel dimensions for a given DPI. */
export function paperPixelsAtDpi(
  paper: PaperSettings,
  dpi: number,
): { w: number; h: number } {
  const { w, h } = paperDimensionsMm(paper);
  return { w: Math.round((w / 25.4) * dpi), h: Math.round((h / 25.4) * dpi) };
}
