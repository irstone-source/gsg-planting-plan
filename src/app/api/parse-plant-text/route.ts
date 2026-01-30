import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Parse text (one plant per line, comma-separated)
    const lines = text.split('\n').filter(line => line.trim());

    const plants = [];
    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 1) {
        const plant: any = {
          scientific: parts[0] || '',
          common: parts[1] || '',
          type: parts[2] || 'plant'
        };

        // Skip empty entries
        if (plant.scientific) {
          plants.push(plant);
        }
      }
    }

    if (plants.length === 0) {
      return NextResponse.json({ error: 'No valid plants found' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      count: plants.length,
      plants: plants
    });

  } catch (error: any) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse text' },
      { status: 500 }
    );
  }
}
