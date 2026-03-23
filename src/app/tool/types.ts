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
}

export interface HistoryEntry {
  placed: PlacedPlant[];
}
