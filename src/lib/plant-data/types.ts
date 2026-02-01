/**
 * Scientific Plant Data Types
 * Based on global botanical databases and professional landscape architecture standards
 */

export type CrownShape =
  | 'pyramidal'      // Christmas tree shape (conifers)
  | 'columnar'       // Tall, narrow (fastigiate forms)
  | 'rounded'        // Sphere/globe shape
  | 'spreading'      // Wide, flat canopy
  | 'weeping'        // Pendulous branches
  | 'oval'           // Egg-shaped
  | 'vase'           // V-shaped (many deciduous)
  | 'irregular'      // Natural, asymmetric
  | 'multi-stem';    // Multiple trunks

export type FoliageType =
  | 'deciduous'      // Loses leaves in winter
  | 'evergreen'      // Keeps foliage year-round
  | 'semi-evergreen'; // May lose some leaves

export type LeafHabit = 'deciduous' | 'evergreen' | 'semi_evergreen';

export type CrownTexture =
  | 'fine'           // Birch, willow - delicate branching
  | 'medium'         // Oak, maple - standard branching
  | 'coarse'         // Catalpa - bold leaves/branches
  | 'needle';        // Conifers

export type WinterInterest =
  | 'red_stems'      // Cornus alba
  | 'white_bark'     // Betula
  | 'flowers'        // Winter flowering
  | 'berries'        // Persistent fruit
  | 'evergreen'      // Retains foliage
  | null;

export type CanopyDensity =
  | 'sparse'         // <40% light blocked
  | 'medium'         // 40-70% light blocked
  | 'dense'          // >70% light blocked
  | 'very-dense';    // >90% light blocked

export type GrowthRate =
  | 'very-slow'      // <15cm per year
  | 'slow'           // 15-30cm per year
  | 'moderate'       // 30-60cm per year
  | 'fast'           // 60-120cm per year
  | 'very-fast';     // >120cm per year

export type PlantForm =
  | 'tree'
  | 'shrub'
  | 'perennial'
  | 'grass'
  | 'climber'
  | 'groundcover';

export interface PlantDimensions {
  height_cm: number;
  spread_cm: number;
  trunk_diameter_cm?: number;
  root_depth_cm?: number;
}

export interface GrowthProgression {
  year_1: PlantDimensions;
  year_3: PlantDimensions;
  year_5: PlantDimensions;
  year_10: PlantDimensions;
  mature: PlantDimensions;
  years_to_maturity: number;
}

export interface BotanicalCharacteristics {
  crown_shape: CrownShape;
  foliage_type: FoliageType;
  canopy_density: CanopyDensity;
  growth_rate: GrowthRate;
  plant_form: PlantForm;
  branching_pattern: 'alternate' | 'opposite' | 'whorled';
  leaf_arrangement: 'simple' | 'compound' | 'palmate' | 'pinnate';
  bark_texture?: 'smooth' | 'rough' | 'fissured' | 'peeling';

  // Professional rendering parameters
  leaf_habit: LeafHabit;           // Authoritative seasonal behavior
  crown_texture: CrownTexture;     // Visual texture for rendering
  crown_density_value: number;     // 0..1 for precise rendering (0.2=airy, 0.85=dense)
  winter_interest?: WinterInterest; // Special winter features
}

export interface ScientificPlantData {
  // Taxonomy
  botanical_name: string;
  common_name: string;
  family: string;
  genus: string;
  species: string;
  cultivar?: string;

  // Growth Data
  growth_progression: GrowthProgression;
  botanical_characteristics: BotanicalCharacteristics;

  // Hardiness
  rhs_zone_min: string;
  rhs_zone_max: string;
  usda_zone_min?: number;
  usda_zone_max?: number;

  // Environmental Requirements
  sun_exposure: ('full-sun' | 'partial-shade' | 'full-shade')[];
  soil_type: ('clay' | 'loam' | 'sand' | 'chalk')[];
  moisture: ('dry' | 'moist' | 'wet')[];
  ph_preference: 'acid' | 'neutral' | 'alkaline' | 'any';

  // Seasonal Interest
  spring_color?: string;
  summer_color?: string;
  autumn_color?: string;
  winter_interest?: boolean;
  flowering_season?: ('spring' | 'summer' | 'autumn' | 'winter')[];

  // Design Data
  spacing_distance_cm: number; // Minimum spacing between plants
  root_zone_radius_cm: number; // Underground footprint

  // Data Sources
  data_sources: {
    trefle?: boolean;
    perenual?: boolean;
    kew?: boolean;
    usda?: boolean;
    rhs?: boolean;
  };

  last_updated: Date;
  data_quality_score: number; // 0-100, based on source completeness
}

export interface PlantVisualization {
  front_view_svg: string;     // Scientific illustration - side view
  top_view_svg: string;        // Plan view - overhead
  year_1_svg: string;          // Scale accurate for year 1
  year_3_svg: string;          // Scale accurate for year 3
  mature_svg: string;          // Scale accurate for mature
  comparison_svg: string;      // Side-by-side growth progression
}
