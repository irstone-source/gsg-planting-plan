import { NextRequest, NextResponse } from 'next/server';
import { listPlants } from '@/lib/trefle';

export const dynamic = 'force-dynamic';

/**
 * List plants with advanced filtering
 *
 * Query params:
 * - page: page number (optional)
 * - filter[key]: filter by specific attributes (e.g., filter[toxicity]=none)
 * - filter_not[key]: exclude specific values
 * - order[key]: sort order (asc or desc)
 * - range[key]: value range (e.g., range[maximum_height_cm]=50,200)
 *
 * Common filters:
 * - filter[toxicity]=none,low (non-toxic plants)
 * - filter[vegetable]=true (vegetables only)
 * - filter[edible_part]=roots,leaves (edible plants)
 * - range[maximum_height_cm]=50,200 (height 50-200cm)
 *
 * Example:
 * GET /api/trefle/list?filter[toxicity]=none&range[maximum_height_cm]=50,150&page=1
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');

    // Parse filters
    const filter: Record<string, string> = {};
    const filter_not: Record<string, string> = {};
    const order: Record<string, string> = {};
    const range: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      const filterMatch = key.match(/^filter\[(.+)\]$/);
      const filterNotMatch = key.match(/^filter_not\[(.+)\]$/);
      const orderMatch = key.match(/^order\[(.+)\]$/);
      const rangeMatch = key.match(/^range\[(.+)\]$/);

      if (filterMatch) {
        filter[filterMatch[1]] = value;
      } else if (filterNotMatch) {
        filter_not[filterNotMatch[1]] = value;
      } else if (orderMatch) {
        order[orderMatch[1]] = value;
      } else if (rangeMatch) {
        range[rangeMatch[1]] = value;
      }
    });

    const results = await listPlants({
      page,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      filter_not: Object.keys(filter_not).length > 0 ? filter_not : undefined,
      order: Object.keys(order).length > 0 ? order : undefined,
      range: Object.keys(range).length > 0 ? range : undefined,
    });

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error: any) {
    console.error('Trefle list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to list plants from Trefle',
      },
      { status: 500 }
    );
  }
}
