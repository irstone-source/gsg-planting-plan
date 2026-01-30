import { NextRequest, NextResponse } from 'next/server';
import { searchPlants, searchUKPlants } from '@/lib/trefle';

export const dynamic = 'force-dynamic';

/**
 * Search Trefle plant database
 *
 * Query params:
 * - q: search query (required)
 * - page: page number (optional, default: 1)
 * - uk: filter for UK-suitable plants (optional, boolean)
 * - rhsZone: RHS hardiness zone (optional, e.g., "H4")
 *
 * Example:
 * GET /api/trefle/search?q=lavender&uk=true&rhsZone=H4
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const ukOnly = searchParams.get('uk') === 'true';
    const rhsZone = searchParams.get('rhsZone') || 'H4';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    if (ukOnly) {
      const plants = await searchUKPlants(query, rhsZone);
      return NextResponse.json({
        success: true,
        data: plants,
        meta: {
          total: plants.length,
          filtered: 'uk-suitable',
          rhsZone,
        },
      });
    } else {
      const results = await searchPlants(query, page);
      return NextResponse.json({
        success: true,
        ...results,
      });
    }
  } catch (error: any) {
    console.error('Trefle search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to search Trefle database',
      },
      { status: 500 }
    );
  }
}
