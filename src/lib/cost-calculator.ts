export function calculatePlantingHours(plantCount: number): number {
  return Math.round(plantCount * 0.25 * 10) / 10; // 15 mins per plant, rounded
}

export function calculateLaborCost(
  plantingHours: number,
  sitePrepHours: number,
  hourlyRate: number,
  markupPercentage: number
): { subtotal: number; total: number } {
  const subtotal = (plantingHours + sitePrepHours) * hourlyRate;
  const total = subtotal * (1 + markupPercentage / 100);
  return { subtotal, total };
}

export function calculateVAT(subtotal: number): number {
  return subtotal * 0.20; // 20% UK VAT
}
