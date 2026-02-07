import { NextRequest, NextResponse } from 'next/server';
import { processGenerationInBackground } from '@/lib/background-generation';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Webhook endpoint for processing plan generation in background
 * Called via HTTP from create-plan to ensure it runs in a separate function
 */
export async function POST(request: NextRequest) {
  try {
    const { planId, options } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'planId required' },
        { status: 400 }
      );
    }

    console.log(`🚀 Processing plan ${planId} in dedicated function`);

    // This runs in its own serverless function with 60s timeout
    await processGenerationInBackground(planId, options);

    return NextResponse.json({
      success: true,
      message: 'Plan processed successfully',
    });

  } catch (error) {
    console.error('❌ Error processing plan:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed',
      },
      { status: 500 }
    );
  }
}
