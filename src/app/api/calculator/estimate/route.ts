import { NextRequest, NextResponse } from 'next/server';
import { calculatePlantingHours, calculateLaborCost, calculateVAT } from '@/lib/cost-calculator';

export async function POST(request: NextRequest) {
  try {
    const { plants, materials, labor, includeVAT } = await request.json();

    // Calculate subtotals
    const plantsSubtotal = plants.reduce((sum: number, p: any) => sum + p.subtotal, 0);
    const materialsSubtotal = materials.reduce((sum: number, m: any) => sum + m.subtotal, 0);

    // Calculate labor
    const plantingHours = calculatePlantingHours(plants.length);
    const laborCosts = calculateLaborCost(
      plantingHours,
      labor.sitePrepHours,
      labor.hourlyRate,
      labor.markupPercentage
    );

    const subtotal = plantsSubtotal + materialsSubtotal + laborCosts.subtotal;
    const markup = laborCosts.total - laborCosts.subtotal;
    const vat = includeVAT ? calculateVAT(subtotal + markup) : 0;
    const grandTotal = subtotal + markup + vat;

    return NextResponse.json({
      success: true,
      calculation: {
        plants,
        materials,
        labor: {
          ...labor,
          plantingHours,
          laborSubtotal: laborCosts.subtotal,
          laborTotal: laborCosts.total
        },
        summary: {
          plantsSubtotal,
          materialsSubtotal,
          laborSubtotal: laborCosts.subtotal,
          subtotal,
          markup,
          vat,
          grandTotal
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
