export interface Plant {
  id: string;
  code: string;
  name: string;
  cultivar: string;
  colour: string;
  textDark: boolean;
  radius?: number; // per-species size override (undefined = use global default)
}

export const defaultPlants: Plant[] = [
  { id: "an", code: "An", name: "Anemanthele", cultivar: "lessoniana", colour: "#8DB580", textDark: false },
  { id: "ga", code: "Ga", name: "Gaura", cultivar: "lindheimeri", colour: "#F2C4D0", textDark: true },
  { id: "pi", code: "Pi", name: "Pittosporum", cultivar: "tenuifolium", colour: "#2E7D32", textDark: false },
  { id: "pe", code: "Pe", name: "Pennisetum", cultivar: "alopecuroides", colour: "#C9B458", textDark: true },
  { id: "ec", code: "Ec", name: "Echinacea", cultivar: "purpurea", colour: "#E8548A", textDark: false },
  { id: "a", code: "A", name: "Achillea", cultivar: "millefolium", colour: "#FFD54F", textDark: true },
  { id: "g", code: "G", name: "Geum", cultivar: "sp.", colour: "#FF8A50", textDark: false },
  { id: "st", code: "St", name: "Stipa", cultivar: "tenuissima", colour: "#B8D4B8", textDark: true },
  { id: "v", code: "V", name: "Veronicastrum", cultivar: "virginicum", colour: "#7E57C2", textDark: false },
  { id: "m", code: "M", name: "Miscanthus", cultivar: "sinensis", colour: "#A1887F", textDark: false },
  { id: "sg", code: "Sg", name: "Sanguisorba", cultivar: "officinalis", colour: "#4A0E0E", textDark: false },
  { id: "aq", code: "Aq", name: "Aquilegia", cultivar: "vulgaris", colour: "#81D4FA", textDark: true },
  { id: "s", code: "S", name: "Salvia", cultivar: "'May Night'", colour: "#3F51B5", textDark: false },
  { id: "sa", code: "Sa", name: "Salvia", cultivar: "'Love & Wishes'", colour: "#AB47BC", textDark: false },
  { id: "p", code: "P", name: "Phormium", cultivar: "'Platts Black'", colour: "#1B1B1B", textDark: false },
  { id: "k", code: "K", name: "Knautia", cultivar: "macedonica", colour: "#D32F2F", textDark: false },
];
