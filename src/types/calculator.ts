export interface PlantCostItem {
  scientific: string;
  common: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface MaterialCostItem {
  name: string;
  category: 'soil' | 'mulch' | 'amendments' | 'supports';
  quantity: number;
  unit: 'm³' | 'bags' | 'units';
  unitPrice: number;
  subtotal: number;
}

export interface LaborEstimate {
  plantingHours: number;
  sitePrepHours: number;
  hourlyRate: number;
  markupPercentage: number;
  laborSubtotal: number;
  laborTotal: number;
}

export interface CostCalculation {
  plants: PlantCostItem[];
  materials: MaterialCostItem[];
  labor: LaborEstimate;
  summary: {
    plantsSubtotal: number;
    materialsSubtotal: number;
    laborSubtotal: number;
    subtotal: number;
    markup: number;
    vat: number;
    grandTotal: number;
  };
}
