import { NextResponse } from 'next/server';
import { scanPlantImages } from '@/lib/plant-image-utils';

// Cache results (invalidate on server restart)
let cachedPlants: any = null;

export async function GET() {
  try {
    if (!cachedPlants) {
      cachedPlants = await scanPlantImages();
    }

    const types = [...new Set(cachedPlants.map((p: any) => p.type))];

    return NextResponse.json({
      success: true,
      plants: cachedPlants,
      total: cachedPlants.length,
      types
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to scan images' },
      { status: 500 }
    );
  }
}
