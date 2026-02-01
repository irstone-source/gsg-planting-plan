/**
 * Plant Symbol Rendering API
 * POST /api/plant/render
 * Generates SVG or PNG plant symbols on-demand
 */

import { NextRequest, NextResponse } from 'next/server';
import { renderPlantSymbol, type PlantSymbolData, type RenderOptions } from '@/lib/symbols/renderSymbol';

export const runtime = 'nodejs'; // Use Node.js runtime for better performance

interface RenderRequest {
  plant_data: PlantSymbolData;
  style: 'scientific' | 'watercolor' | 'marker' | 'hand-drawn';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  scale: '1:10' | '1:20' | '1:50' | '1:100' | '1:200';
  seed?: number;
  format?: 'svg' | 'png'; // svg (default) or png
  png_size?: number; // Only used if format=png (default 4096)
}

export async function POST(request: NextRequest) {
  try {
    const body: RenderRequest = await request.json();

    // Validate required fields
    if (!body.plant_data) {
      return NextResponse.json(
        { error: 'Missing plant_data in request body' },
        { status: 400 }
      );
    }

    if (!body.style || !['scientific', 'watercolor', 'marker', 'hand-drawn'].includes(body.style)) {
      return NextResponse.json(
        { error: 'Invalid style. Must be: scientific, watercolor, marker, or hand-drawn' },
        { status: 400 }
      );
    }

    if (!body.season || !['spring', 'summer', 'autumn', 'winter'].includes(body.season)) {
      return NextResponse.json(
        { error: 'Invalid season. Must be: spring, summer, autumn, or winter' },
        { status: 400 }
      );
    }

    if (!body.scale || !['1:10', '1:20', '1:50', '1:100', '1:200'].includes(body.scale)) {
      return NextResponse.json(
        { error: 'Invalid scale. Must be: 1:10, 1:20, 1:50, 1:100, or 1:200' },
        { status: 400 }
      );
    }

    // Validate plant data structure
    if (!body.plant_data.botanical_params || !body.plant_data.outline_cm) {
      return NextResponse.json(
        { error: 'Invalid plant_data structure. Must include botanical_params and outline_cm' },
        { status: 400 }
      );
    }

    // Prepare render options
    const options: RenderOptions = {
      style: body.style,
      season: body.season,
      scale: body.scale,
      seed: body.seed || Date.now()
    };

    // Generate SVG
    const startTime = Date.now();
    const svg = renderPlantSymbol(body.plant_data, options);
    const renderTime = Date.now() - startTime;

    // Return SVG (or PNG if requested)
    if (body.format === 'png') {
      // PNG rendering would require @resvg/resvg-js here
      // For now, return error suggesting client-side conversion
      return NextResponse.json(
        {
          error: 'PNG rendering not yet implemented via API. Use scripts/rasterize-symbols.mjs for PNG generation.',
          hint: 'Download SVG and use client-side conversion or batch script'
        },
        { status: 501 } // Not Implemented
      );
    }

    // Return SVG response
    return NextResponse.json({
      svg,
      metadata: {
        botanical_name: body.plant_data.botanical_name,
        common_name: body.plant_data.common_name,
        style: body.style,
        season: body.season,
        scale: body.scale,
        render_time_ms: renderTime,
        svg_length: svg.length,
        seed: options.seed
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });

  } catch (error: any) {
    console.error('Symbol rendering error:', error);
    return NextResponse.json(
      {
        error: 'Failed to render plant symbol',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing
 * Returns API documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/plant/render',
    method: 'POST',
    description: 'Generate plant symbols on-demand',
    request_body: {
      plant_data: {
        botanical_name: 'string (required)',
        common_name: 'string (required)',
        botanical_params: {
          spread_cm: 'number (required)',
          height_cm: 'number (required)',
          scale_box_cm: 'number (required)',
          center_cm: { x: 'number', y: 'number' },
          leaf_habit: '"deciduous" | "evergreen" | "semi_evergreen" (required)',
          crown_texture: '"fine" | "medium" | "coarse" | "needle" (required)',
          crown_density_value: 'number 0..1 (required)',
          winter_interest: '"white_bark" | "red_stems" | "berries" | "flowers" | null (optional)'
        },
        outline_cm: 'Array<{x: number, y: number}> (required, 40+ points recommended)'
      },
      style: '"scientific" | "watercolor" | "marker" | "hand-drawn" (required)',
      season: '"spring" | "summer" | "autumn" | "winter" (required)',
      scale: '"1:10" | "1:20" | "1:50" | "1:100" | "1:200" (required)',
      seed: 'number (optional, for deterministic rendering)',
      format: '"svg" | "png" (optional, default: svg)',
      png_size: 'number (optional, only for PNG format, default: 4096)'
    },
    response: {
      svg: 'string (SVG markup)',
      metadata: {
        botanical_name: 'string',
        common_name: 'string',
        style: 'string',
        season: 'string',
        scale: 'string',
        render_time_ms: 'number',
        svg_length: 'number',
        seed: 'number'
      }
    },
    example_curl: `curl -X POST http://localhost:3000/api/plant/render \\
  -H "Content-Type: application/json" \\
  -d '{
    "plant_data": {
      "botanical_name": "Betula pendula",
      "common_name": "Silver Birch",
      "botanical_params": {
        "spread_cm": 1000,
        "height_cm": 2500,
        "scale_box_cm": 2500,
        "center_cm": { "x": 1250, "y": 1250 },
        "leaf_habit": "deciduous",
        "crown_texture": "fine",
        "crown_density_value": 0.35,
        "winter_interest": "white_bark"
      },
      "outline_cm": [ /* 48 points */ ]
    },
    "style": "watercolor",
    "season": "autumn",
    "scale": "1:50"
  }'`
  });
}
