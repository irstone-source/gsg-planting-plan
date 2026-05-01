import { Plant } from "./defaultPlants";

export interface PlacedPlant {
  uid: string;
  plantId: string;
  x: number;
  y: number;
}

export type PaperSize = "A4" | "A3";
export type PaperOrientation = "portrait" | "landscape";

export interface PaperSettings {
  size: PaperSize;
  orientation: PaperOrientation;
  /** Architectural ratio denominator. e.g. 50 means 1:50. null = auto-fit. */
  ratio: number | null;
  /** Page margin in mm */
  marginMm: number;
}

/** Paper dimensions in mm: [shorter side, longer side] (portrait) */
export const PAPER_SIZES_MM: Record<PaperSize, [number, number]> = {
  A4: [210, 297],
  A3: [297, 420],
};

export const SCALE_RATIOS = [20, 25, 50, 100, 200, 500] as const;

export const DEFAULT_PAPER: PaperSettings = {
  size: "A3",
  orientation: "landscape",
  ratio: null,
  marginMm: 15,
};

export interface ProjectSettings {
  name: string;
  drawingNumber: string;
  date: string;
  plantRadius: number;
  backgroundOpacity: number;
  showGrid: boolean;
  paper: PaperSettings;
}

export interface ScaleCalibration {
  /** Start point of reference line (canvas pixel coords) */
  x1: number;
  y1: number;
  /** End point of reference line (canvas pixel coords) */
  x2: number;
  y2: number;
  /** Real-world distance in metres */
  realMetres: number;
  /** Computed: canvas pixels per real-world metre */
  pixelsPerMetre: number;
}

export interface BorderPolygon {
  /** Closed polygon vertices in canvas-pixel coordinates */
  points: { x: number; y: number }[];
}

export interface PlanState {
  plants: Plant[];
  placed: PlacedPlant[];
  settings: ProjectSettings;
  backgroundImage: string | null;
  backgroundWidth: number;
  backgroundHeight: number;
  viewingArrow: ViewingArrow | null;
  scale: ScaleCalibration | null;
  border: BorderPolygon | null;
}

export interface HistoryEntry {
  placed: PlacedPlant[];
}

export interface ViewingArrow {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

