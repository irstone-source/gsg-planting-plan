import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = JSON.parse(formData.get('data') as string);
    const images = formData.getAll('images');

    console.log('Received plan generation request:', {
      dataFields: Object.keys(data),
      imageCount: images.length,
    });

    // TODO: Implement actual plan generation logic
    // For now, return a mock plan ID
    const mockPlanId = `plan_${Date.now()}`;

    // In the future, this will:
    // 1. Upload images to storage
    // 2. Call Claude Vision API for site analysis
    // 3. Process location data (postcode to RHS zone)
    // 4. Query plant database based on conditions
    // 5. Generate planting recommendations
    // 6. Save plan to database
    // 7. Return plan ID

    return NextResponse.json({
      success: true,
      planId: mockPlanId,
      message: 'Plan generation started',
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}
