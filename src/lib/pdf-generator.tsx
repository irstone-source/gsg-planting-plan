/**
 * PDF Generation using @react-pdf/renderer
 * Creates professional planting plan PDFs for download
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (optional - using default fonts for now)
// Font.register({ family: 'Roboto', src: '...' });

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  // Cover Page
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    color: '#166534', // green-800
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#4b5563', // gray-600
  },
  logo: {
    fontSize: 48,
    marginBottom: 20,
  },
  coverInfo: {
    marginTop: 40,
    padding: 20,
    borderTop: '2px solid #166534',
  },
  coverInfoText: {
    fontSize: 12,
    marginBottom: 5,
    color: '#374151', // gray-700
  },
  // Section Headers
  sectionHeader: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#166534',
    fontFamily: 'Helvetica-Bold',
    borderBottom: '2px solid #22c55e', // green-500
    paddingBottom: 5,
  },
  subsectionHeader: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 8,
    color: '#166534',
    fontFamily: 'Helvetica-Bold',
  },
  // Content
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#374151',
  },
  // Lists
  listItem: {
    fontSize: 10,
    marginBottom: 5,
    marginLeft: 10,
    color: '#374151',
  },
  bullet: {
    width: 5,
    marginRight: 5,
  },
  // Tables
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb', // gray-200
    paddingVertical: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6', // gray-100
    borderBottom: '2px solid #166534',
    paddingVertical: 10,
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
  },
  tableHeaderCell: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
  },
  // Plant Cards
  plantCard: {
    marginBottom: 12,
    padding: 10,
    border: '1px solid #e5e7eb',
    borderRadius: 4,
    backgroundColor: '#fafaf9', // stone-50
  },
  plantName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
    marginBottom: 2,
  },
  plantCommon: {
    fontSize: 9,
    color: '#6b7280', // gray-500
    marginBottom: 5,
  },
  plantDetails: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 3,
  },
  // Summary Box
  summaryBox: {
    padding: 15,
    backgroundColor: '#f0fdf4', // green-50
    border: '1px solid #86efac', // green-300
    borderRadius: 4,
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#166534',
    fontFamily: 'Helvetica-Bold',
  },
  summaryValue: {
    fontSize: 10,
    color: '#166534',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af', // gray-400
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  pageNumber: {
    fontSize: 8,
    color: '#9ca3af',
  },
  // Badge
  badge: {
    fontSize: 8,
    backgroundColor: '#dcfce7', // green-100
    color: '#166534',
    padding: '3px 8px',
    borderRadius: 3,
    marginLeft: 5,
  },
});

interface PlantingPlanPDFProps {
  plan: any;
  siteAnalysis: any;
  recommendations: any[];
  visionData: any;
}

export const PlantingPlanPDF: React.FC<PlantingPlanPDFProps> = ({
  plan,
  siteAnalysis,
  recommendations,
  visionData,
}) => {
  const totalPlants = recommendations.reduce((sum, r) => sum + r.quantity, 0);
  const totalCost = plan.total_cost || 0;

  // Group recommendations by category
  const byCategory: Record<string, any[]> = {};
  recommendations.forEach(rec => {
    const cat = rec.plants?.category || 'OTHER';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(rec);
  });

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.logo}>🌿</Text>
          <Text style={styles.title}>Planting Plan</Text>
          <Text style={styles.subtitle}>Professional Garden Design by GSG</Text>

          <View style={styles.coverInfo}>
            <Text style={styles.coverInfoText}>Location: {siteAnalysis.postcode}</Text>
            <Text style={styles.coverInfoText}>RHS Zone: {siteAnalysis.rhs_zone}</Text>
            <Text style={styles.coverInfoText}>Style: {plan.style.replace('_', ' ')}</Text>
            <Text style={styles.coverInfoText}>
              Created: {new Date(plan.created_at).toLocaleDateString('en-GB')}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Generated by GSG Planting Plan Generator</Text>
          <Text>© 2026 Green Space Gardens</Text>
        </View>
      </Page>

      {/* Site Analysis Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionHeader}>Site Analysis</Text>

        <Text style={styles.subsectionHeader}>Location & Climate</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Postcode:</Text>
            <Text style={styles.summaryValue}>{siteAnalysis.postcode}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>RHS Hardiness Zone:</Text>
            <Text style={styles.summaryValue}>{siteAnalysis.rhs_zone}</Text>
          </View>
          {siteAnalysis.area_sqm && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Area:</Text>
              <Text style={styles.summaryValue}>{siteAnalysis.area_sqm} m²</Text>
            </View>
          )}
        </View>

        <Text style={styles.subsectionHeader}>Site Conditions</Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Sun Exposure: </Text>
          {visionData?.sunExposure?.assessment?.replace('_', ' ') || siteAnalysis.sun_exposure}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Soil Type: </Text>
          {siteAnalysis.soil_type}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Moisture: </Text>
          {siteAnalysis.moisture}
        </Text>

        {visionData?.sunExposure?.details && (
          <>
            <Text style={styles.subsectionHeader}>Sun Exposure Details</Text>
            <Text style={styles.paragraph}>{visionData.sunExposure.details}</Text>
          </>
        )}

        {visionData?.challenges && visionData.challenges.length > 0 && (
          <>
            <Text style={styles.subsectionHeader}>Site Challenges</Text>
            {visionData.challenges.map((challenge: string, idx: number) => (
              <Text key={idx} style={styles.listItem}>• {challenge}</Text>
            ))}
          </>
        )}

        {visionData?.opportunities && visionData.opportunities.length > 0 && (
          <>
            <Text style={styles.subsectionHeader}>Design Opportunities</Text>
            {visionData.opportunities.map((opp: string, idx: number) => (
              <Text key={idx} style={styles.listItem}>• {opp}</Text>
            ))}
          </>
        )}

        {visionData?.overallAssessment && (
          <>
            <Text style={styles.subsectionHeader}>Overall Assessment</Text>
            <Text style={styles.paragraph}>{visionData.overallAssessment}</Text>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} fixed />
        </View>
      </Page>

      {/* Design Rationale Page */}
      {plan.design_rationale && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionHeader}>Design Concept</Text>
          <Text style={styles.paragraph}>{plan.design_rationale}</Text>

          <Text style={styles.subsectionHeader}>Your Preferences</Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Garden Style: </Text>
            {plan.style.replace('_', ' ')}
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Maintenance Level: </Text>
            {plan.maintenance_level}
          </Text>
          {plan.budget_min && (
            <Text style={styles.paragraph}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Budget Range: </Text>
              £{plan.budget_min} - £{plan.budget_max || 'flexible'}
            </Text>
          )}
          {plan.special_requirements && (
            <>
              <Text style={styles.subsectionHeader}>Special Requirements</Text>
              <Text style={styles.paragraph}>{plan.special_requirements}</Text>
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} fixed />
          </View>
        </Page>
      )}

      {/* Plant Recommendations - Summary Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionHeader}>Plant Recommendations Summary</Text>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Plants:</Text>
            <Text style={styles.summaryValue}>{totalPlants}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Plant Varieties:</Text>
            <Text style={styles.summaryValue}>{recommendations.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Estimated Cost:</Text>
            <Text style={styles.summaryValue}>£{totalCost.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.subsectionHeader}>Plants by Category</Text>
        {Object.keys(byCategory).map(category => (
          <Text key={category} style={styles.listItem}>
            • {category}: {byCategory[category].length} varieties, {' '}
            {byCategory[category].reduce((sum: number, r: any) => sum + r.quantity, 0)} plants
          </Text>
        ))}

        <View style={styles.footer}>
          <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} fixed />
        </View>
      </Page>

      {/* Plant Recommendations - Detail Pages */}
      {Object.keys(byCategory).map(category => (
        <Page key={category} size="A4" style={styles.page}>
          <Text style={styles.sectionHeader}>{category}S</Text>

          {byCategory[category].map((rec: any, idx: number) => (
            <View key={idx} style={styles.plantCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.plantName}>{rec.plants?.botanical_name}</Text>
                  {rec.plants?.common_name && (
                    <Text style={styles.plantCommon}>{rec.plants.common_name}</Text>
                  )}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.plantDetails}>Qty: {rec.quantity}</Text>
                  <Text style={styles.plantDetails}>{rec.plants?.size}</Text>
                  {rec.plants?.is_peat_free && (
                    <Text style={styles.badge}>Peat-free</Text>
                  )}
                </View>
              </View>

              <Text style={[styles.plantDetails, { marginTop: 5 }]}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Position: </Text>
                {rec.position}
              </Text>
              <Text style={styles.plantDetails}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Rationale: </Text>
                {rec.rationale}
              </Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} fixed />
          </View>
        </Page>
      ))}

      {/* Shopping List Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionHeader}>Shopping List</Text>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { width: '40%' }]}>Plant Name</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Size</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Quantity</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Price</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Total</Text>
          </View>

          {recommendations.map((rec: any, idx: number) => {
            const price = rec.plants?.price_gbp || 0;
            const total = price * rec.quantity;
            return (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '40%' }]}>
                  {rec.plants?.botanical_name}
                </Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  {rec.plants?.size}
                </Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  {rec.quantity}
                </Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  £{price.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  £{total.toFixed(2)}
                </Text>
              </View>
            );
          })}

          <View style={[styles.tableRow, { borderTop: '2px solid #166534', marginTop: 10 }]}>
            <Text style={[styles.tableHeaderCell, { width: '70%' }]}>Total</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>{totalPlants}</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>£{totalCost.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={[styles.paragraph, { marginTop: 20, fontSize: 8, fontStyle: 'italic' }]}>
          * Prices are estimates based on typical UK nursery pricing for the specified container sizes.
          Actual prices may vary. Check availability and current pricing with your preferred supplier.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} fixed />
        </View>
      </Page>

      {/* Maintenance Guide Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionHeader}>Maintenance Guide</Text>

        <Text style={styles.subsectionHeader}>Establishment (Year 1)</Text>
        <Text style={styles.listItem}>• Water regularly during dry spells (2-3 times per week)</Text>
        <Text style={styles.listItem}>• Apply 5-7cm mulch around plants to retain moisture</Text>
        <Text style={styles.listItem}>• Remove weeds as they appear</Text>
        <Text style={styles.listItem}>• Deadhead flowering perennials to encourage more blooms</Text>
        <Text style={styles.listItem}>• Monitor for pests and diseases</Text>

        <Text style={styles.subsectionHeader}>Spring (March-May)</Text>
        <Text style={styles.listItem}>• Apply general-purpose fertilizer to borders</Text>
        <Text style={styles.listItem}>• Refresh mulch layer</Text>
        <Text style={styles.listItem}>• Prune spring-flowering shrubs after bloom</Text>
        <Text style={styles.listItem}>• Divide overcrowded perennials</Text>

        <Text style={styles.subsectionHeader}>Summer (June-August)</Text>
        <Text style={styles.listItem}>• Water during dry periods</Text>
        <Text style={styles.listItem}>• Deadhead flowering plants regularly</Text>
        <Text style={styles.listItem}>• Cut back herbaceous perennials after flowering</Text>
        <Text style={styles.listItem}>• Trim hedges and formal topiary</Text>

        <Text style={styles.subsectionHeader}>Autumn (September-November)</Text>
        <Text style={styles.listItem}>• Plant new additions</Text>
        <Text style={styles.listItem}>• Divide and replant overgrown perennials</Text>
        <Text style={styles.listItem}>• Cut back dead herbaceous stems (or leave for wildlife)</Text>
        <Text style={styles.listItem}>• Clear fallen leaves from lawns</Text>

        <Text style={styles.subsectionHeader}>Winter (December-February)</Text>
        <Text style={styles.listItem}>• Prune deciduous trees and shrubs while dormant</Text>
        <Text style={styles.listItem}>• Protect tender plants from frost</Text>
        <Text style={styles.listItem}>• Plan next season's planting</Text>
        <Text style={styles.listItem}>• Check tree stakes and ties</Text>

        <View style={styles.footer}>
          <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} fixed />
        </View>
      </Page>
    </Document>
  );
};
