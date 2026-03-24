import { Plant } from "./defaultPlants";

export interface PlacedPlant {
  uid: string;
  plantId: string;
  x: number;
  y: number;
}

export interface ProjectSettings {
  name: string;
  drawingNumber: string;
  date: string;
  plantRadius: number;
  backgroundOpacity: number;
  showGrid: boolean;
}

export interface PlanState {
  plants: Plant[];
  placed: PlacedPlant[];
  settings: ProjectSettings;
  backgroundImage: string | null;
  backgroundWidth: number;
  backgroundHeight: number;
  viewingArrow: ViewingArrow | null;
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

