import { NextRequest, NextResponse } from 'next/server';
import { getPlantDetail, getPlantImages } from '@/lib/trefle';

export const dynamic = 'force-dynamic';

/**
 * Get detailed plant information from Trefle
 *
 * Params:
 * - id: plant ID or slug
 *
 * Query params:
 * - images: include images array (optional, boolean)
 *
 * Example:
 * GET /api/trefle/plants/lavandula-angustifolia?images=true
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeImages = searchParams.get('images') === 'true';

    const result = await getPlantDetail(id);

    if (includeImages) {
      const images = await getPlantImages(id);
      return NextResponse.json({
        success: true,
        ...result,
        images,
      });
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Trefle plant detail error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch plant details from Trefle',
      },
      { status: 500 }
    );
  }
}
