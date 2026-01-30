import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { plants } = await request.json();

    if (!plants || !Array.isArray(plants)) {
      return NextResponse.json({ error: 'Invalid plants data' }, { status: 400 });
    }

    // Create temporary plant list file
    const tempFile = path.join(process.cwd(), 'temp-plants.json');
    await fs.writeFile(tempFile, JSON.stringify(plants, null, 2));

    // Trigger image generation (non-blocking)
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate-from-list.js');

    // Start generation in background
    exec(`node ${scriptPath} ${tempFile}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Generation error:', error);
      }
      console.log('Generation output:', stdout);
    });

    return NextResponse.json({
      success: true,
      message: 'Image generation started',
      plantCount: plants.length,
      estimatedTime: Math.ceil(plants.length * 3 * 15 / 60) // 3 views, ~15 sec each
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start generation' },
      { status: 500 }
    );
  }
}
