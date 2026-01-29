import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { supabase } from '@/lib/supabase';
import { PlantingPlanPDF } from '@/lib/pdf-generator';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const planId = searchParams.get('planId');

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'planId is required' },
        { status: 400 }
      );
    }

    console.log('📄 Generating PDF for plan:', planId);

    // Fetch plan with all related data
    const { data: plan, error } = await supabase
      .from('planting_plans')
      .select(`
        *,
        site_analyses (*),
        plant_recommendations (
          *,
          plants (*)
        )
      `)
      .eq('id', planId)
      .single();

    if (error || !plan) {
      console.error('❌ Plan not found:', error);
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    const siteAnalysis = plan.site_analyses;
    const visionData = siteAnalysis.vision_analysis;
    const recommendations = plan.plant_recommendations || [];

    console.log('✓ Plan data loaded:', {
      recommendations: recommendations.length,
      totalCost: plan.total_cost,
    });

    // Render PDF
    console.log('🎨 Rendering PDF...');
    const pdfBuffer = await renderToBuffer(
      createElement(PlantingPlanPDF, {
        plan,
        siteAnalysis,
        recommendations,
        visionData,
      }) as any // Type assertion needed for react-pdf compatibility
    );

    console.log('✓ PDF rendered successfully');

    // Create filename
    const filename = `planting-plan-${siteAnalysis.postcode.replace(/\s/g, '')}-${new Date().toISOString().split('T')[0]}.pdf`;

    console.log('✅ PDF generated:', filename);

    // Return PDF as downloadable file
    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('❌ Error generating PDF:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
