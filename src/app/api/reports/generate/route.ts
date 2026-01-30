import { NextRequest, NextResponse } from 'next/server';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { examplePlansExpanded } from '@/data/example-plans-expanded';

export async function POST(request: NextRequest) {
  try {
    const { examplePlanSlug, branding } = await request.json();

    if (!examplePlanSlug || !branding) {
      return NextResponse.json(
        { error: 'examplePlanSlug and branding are required' },
        { status: 400 }
      );
    }

    // Find the example plan
    const plan = examplePlansExpanded.find(p => p.slug === examplePlanSlug);
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    console.log('📄 Generating branded report for:', plan.title);

    // Create branded styles
    const styles = StyleSheet.create({
      page: {
        padding: 40,
        backgroundColor: '#ffffff',
      },
      header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: `3pt solid ${branding.colorScheme.primary}`,
      },
      companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: branding.colorScheme.primary,
        marginBottom: 5,
      },
      planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 10,
      },
      section: {
        marginTop: 20,
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: branding.colorScheme.secondary,
        marginBottom: 10,
      },
      text: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.5,
      },
      grid: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
      },
      gridItem: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 10,
        borderRadius: 4,
      },
      label: {
        fontSize: 9,
        color: '#6b7280',
        marginBottom: 3,
      },
      value: {
        fontSize: 11,
        color: '#1f2937',
        fontWeight: 'bold',
      },
      plantList: {
        marginTop: 10,
      },
      plantItem: {
        fontSize: 9,
        color: '#374151',
        marginBottom: 4,
        paddingLeft: 10,
      },
      footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        paddingTop: 15,
        borderTop: `2pt solid ${branding.colorScheme.secondary}`,
        fontSize: 8,
        color: '#6b7280',
        textAlign: 'center',
      },
    });

    // Create PDF document using createElement
    const BrandedReport = () =>
      createElement(Document, {},
        createElement(Page, { size: 'A4', style: styles.page },
          // Header
          createElement(View, { style: styles.header },
            createElement(Text, { style: styles.companyName }, branding.companyName),
            createElement(Text, { style: styles.text }, 'Professional Planting Plan Report'),
            createElement(Text, { style: styles.planTitle }, plan.title),
            createElement(Text, { style: styles.text }, plan.region)
          ),
          // Overview
          createElement(View, { style: styles.section },
            createElement(Text, { style: styles.sectionTitle }, 'Overview'),
            createElement(Text, { style: styles.text }, plan.description)
          ),
          // Site Details
          createElement(View, { style: styles.section },
            createElement(Text, { style: styles.sectionTitle }, 'Site Details'),
            createElement(View, { style: styles.grid },
              createElement(View, { style: styles.gridItem },
                createElement(Text, { style: styles.label }, 'Area'),
                createElement(Text, { style: styles.value }, `${plan.area}m²`)
              ),
              createElement(View, { style: styles.gridItem },
                createElement(Text, { style: styles.label }, 'Effort Level'),
                createElement(Text, { style: styles.value }, plan.tags.effort)
              ),
              createElement(View, { style: styles.gridItem },
                createElement(Text, { style: styles.label }, 'Budget'),
                createElement(Text, { style: styles.value }, plan.budget)
              ),
              createElement(View, { style: styles.gridItem },
                createElement(Text, { style: styles.label }, 'Plants'),
                createElement(Text, { style: styles.value }, String(plan.totalPlants))
              )
            )
          ),
          // Design Concept
          createElement(View, { style: styles.section },
            createElement(Text, { style: styles.sectionTitle }, 'Design Concept'),
            createElement(Text, { style: styles.text }, plan.designConcept),
            plan.highlights ? createElement(View, { style: styles.plantList },
              ...plan.highlights.map((feature, i) =>
                createElement(Text, { key: i, style: styles.plantItem }, `• ${feature}`)
              )
            ) : null
          ),
          // Plant Palette
          createElement(View, { style: styles.section },
            createElement(Text, { style: styles.sectionTitle }, 'Plant Palette'),
            createElement(Text, { style: styles.text }, 'Structure Layer:'),
            createElement(View, { style: styles.plantList },
              ...plan.plantingPalette.structure.map((plant, i) =>
                createElement(Text, { key: i, style: styles.plantItem }, `• ${plant}`)
              )
            ),
            createElement(Text, { style: styles.text }, 'Seasonal Interest:'),
            createElement(View, { style: styles.plantList },
              ...plan.plantingPalette.seasonal.map((plant, i) =>
                createElement(Text, { key: i, style: styles.plantItem }, `• ${plant}`)
              )
            ),
            createElement(Text, { style: styles.text }, 'Ground Cover:'),
            createElement(View, { style: styles.plantList },
              ...plan.plantingPalette.groundCover.map((plant, i) =>
                createElement(Text, { key: i, style: styles.plantItem }, `• ${plant}`)
              )
            )
          ),
          // Footer
          createElement(View, { style: styles.footer },
            createElement(Text, {},
              `Generated by ${branding.companyName} | ${new Date().toLocaleDateString('en-GB')}`
            )
          )
        )
      );

    // Generate PDF
    const pdfBuffer = await renderToBuffer(createElement(BrandedReport) as any);

    // Create filename
    const filename = `${branding.companyName.replace(/\s/g, '-')}-${plan.slug}.pdf`;

    console.log('✅ Branded report generated:', filename);

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
    console.error('❌ Error generating branded report:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
