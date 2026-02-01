/**
 * Plant Search API
 * Powered by World Flora Online taxonomy
 *
 * GET /api/plants/search?q=birch&limit=20
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Use the search helper function we created
    const { data, error } = await supabase
      .rpc('search_wfo_plants', {
        search_query: query,
        max_results: limit
      });

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      );
    }

    // Enrich with additional data if needed
    const results = data.map((plant: any) => ({
      wfo_id: plant.wfo_id,
      scientific_name: plant.scientific_name,
      common_name: plant.scientific_name.split(' ')[0], // Genus as fallback
      authority: plant.scientific_name_authorship,
      family: plant.family,
      genus: plant.genus,
      rank: plant.rank,
      similarity: plant.similarity,
      display_name: `${plant.scientific_name}${plant.scientific_name_authorship ? ' ' + plant.scientific_name_authorship : ''}`
    }));

    return NextResponse.json({
      query,
      results,
      count: results.length
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
