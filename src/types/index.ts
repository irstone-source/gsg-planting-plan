// Plant Data Types
export interface Plant {
  id: string;
  botanical_name: string;
  common_name?: string;
  category: 'BAMBOO' | 'CLIMBER' | 'CONIFER' | 'FERN' | 'GRASS' | 'HERBACEOUS' | 'SHRUB' | 'TREE' | 'SUNDRIES';
  size: string; // e.g., "2L", "3L", "5L", "7.5L", "BR", "RB"
  product_code: string;
  stock_quantity: number;
  is_peat_free: boolean;
  hardiness_zone?: string; // RHS zones H1-H7
  height_min?: number; // in cm
  height_max?: number;
  spread_min?: number;
  spread_max?: number;
  soil_type?: string[];
  moisture?: string[];
  sun_exposure?: string[];
  flower_color?: string[];
  flower_season?: string[];
  foliage_color?: string[];
  growth_rate?: string;
  evergreen?: boolean;
}

// Site Analysis Types
export interface SiteAnalysis {
  location: {
    postcode: string;
    latitude?: number;
    longitude?: number;
    rhs_zone?: string;
  };
  conditions: {
    sun_exposure: 'full_sun' | 'partial_shade' | 'full_shade' | 'mixed';
    soil_type: 'clay' | 'loam' | 'sand' | 'chalk' | 'peat' | 'silt' | 'unknown';
    moisture: 'dry' | 'moist' | 'wet' | 'variable';
    aspect?: 'north' | 'south' | 'east' | 'west';
  };
  dimensions?: {
    area_sqm?: number;
    length_m?: number;
    width_m?: number;
  };
  images?: string[]; // URLs or base64
}

// User Preferences
export interface UserPreferences {
  style: 'cottage' | 'contemporary' | 'formal' | 'wildlife' | 'low_maintenance' | 'mixed';
  color_preferences?: string[];
  seasonal_interest?: ('spring' | 'summer' | 'autumn' | 'winter')[];
  budget?: {
    min: number;
    max: number;
    currency: 'GBP';
  };
  maintenance_level?: 'low' | 'medium' | 'high';
  special_requirements?: string[];
}

// Planting Plan
export interface PlantingPlan {
  id: string;
  created_at: string;
  site_analysis: SiteAnalysis;
  preferences: UserPreferences;
  recommendations: PlantRecommendation[];
  total_cost: number;
  status: 'draft' | 'completed';
}

// Plant Recommendation
export interface PlantRecommendation {
  plant: Plant;
  quantity: number;
  position: {
    zone?: string;
    layer: 'canopy' | 'shrub' | 'herbaceous' | 'ground_cover';
  };
  rationale: string;
  cost_per_unit: number;
  total_cost: number;
}

// Form Data Types
export interface PlantingPlanFormData {
  location: {
    postcode: string;
  };
  siteConditions: {
    sunExposure: string;
    soilType: string;
    moisture: string;
    areaSqm?: number;
  };
  preferences: {
    style: string;
    colorPreferences: string[];
    seasonalInterest: string[];
    maintenanceLevel: string;
    budgetMin?: number;
    budgetMax?: number;
    specialRequirements?: string;
  };
  images: File[];
}
