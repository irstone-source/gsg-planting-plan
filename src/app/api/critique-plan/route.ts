import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { plants, siteInfo } = await request.json();

    if (!plants || !Array.isArray(plants)) {
      return NextResponse.json({ error: 'Invalid plants data' }, { status: 400 });
    }

    // Build comprehensive analysis prompt
    const prompt = buildCritiquePrompt(plants, siteInfo);

    // Call Claude for analysis
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const analysis = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse structured response
    const critique = parseAnalysis(analysis);

    return NextResponse.json({
      success: true,
      critique,
      rawAnalysis: analysis
    });

  } catch (error: any) {
    console.error('Critique error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate critique' },
      { status: 500 }
    );
  }
}

function buildCritiquePrompt(plants: any[], siteInfo: any) {
  const plantList = plants.map(p =>
    `- ${p.scientific || p.name} (${p.common || 'unknown'}) - ${p.type || 'plant'}`
  ).join('\n');

  return `You are an expert UK garden designer and horticulturist. Analyze this planting plan and provide professional critique.

**Site Information:**
${siteInfo ? JSON.stringify(siteInfo, null, 2) : 'No specific site information provided'}

**Proposed Plants:**
${plantList}

Provide a comprehensive analysis covering:

1. **Plant Compatibility**
   - Companion planting benefits/conflicts
   - Growth habit compatibility
   - Root competition issues
   - Allelopathy concerns

2. **Space Requirements**
   - Mature sizes at 5-10 years
   - Recommended spacing
   - Overcrowding risks
   - Layering effectiveness (canopy, understory, ground)

3. **Soil & Site Conditions**
   - pH requirements
   - Drainage needs
   - Nutrient requirements
   - Nitrogen fixers (if any)

4. **Microclimate Suitability**
   - Sun/shade requirements
   - Wind tolerance
   - Hardiness zones (UK-specific)
   - Frost sensitivity

5. **Seasonal Interest**
   - Spring interest (flowers, foliage)
   - Summer display
   - Autumn color
   - Winter structure/evergreens
   - Year-round balance assessment

6. **Maintenance Requirements**
   - Annual time estimate (hours/year)
   - Pruning schedule
   - Watering needs
   - Pest/disease susceptibility
   - Maintenance difficulty rating

7. **Recommendations**
   - Suggested improvements
   - Alternative plants to consider
   - Plant additions for gaps
   - Removal suggestions

8. **Professional Score**
   - Overall plan rating (1-10)
   - Strengths summary
   - Key concerns

Format response as structured JSON with these sections.`;
}

function parseAnalysis(analysis: string): any {
  try {
    // Try to extract JSON if present
    const jsonMatch = analysis.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback: return structured text
    return {
      compatibility: extractSection(analysis, 'Plant Compatibility'),
      spacing: extractSection(analysis, 'Space Requirements'),
      soil: extractSection(analysis, 'Soil & Site Conditions'),
      microclimate: extractSection(analysis, 'Microclimate Suitability'),
      seasonal: extractSection(analysis, 'Seasonal Interest'),
      maintenance: extractSection(analysis, 'Maintenance Requirements'),
      recommendations: extractSection(analysis, 'Recommendations'),
      score: extractSection(analysis, 'Professional Score'),
      fullAnalysis: analysis
    };
  } catch (error) {
    return { fullAnalysis: analysis };
  }
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`\\*\\*${sectionName}\\*\\*[\\s\\S]*?(?=\\*\\*|$)`, 'i');
  const match = text.match(regex);
  return match ? match[0] : '';
}
