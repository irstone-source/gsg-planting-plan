import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Make sure .env.local contains:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const designerStyles = [
  // Show Gardens (3 styles for MVP)
  {
    slug: 'chelsea-2023-gold-modern',
    name: 'Chelsea 2023 Gold: Modern Minimalist',
    designer_name: 'Various Award Winners',
    source_type: 'show_garden',
    source_name: 'RHS Chelsea Flower Show 2023',
    year: 2023,
    award: 'Gold Medal',
    style_category: 'modern',
    difficulty: 'intermediate',
    maintenance: 'medium',
    short_description: 'Clean lines, architectural plants, and restrained color palettes define this award-winning contemporary style from Chelsea 2023.',
    long_description: `This planting plan draws inspiration from the gold medal-winning modern gardens at RHS Chelsea Flower Show 2023, where minimalist design met botanical excellence.

The contemporary aesthetic emphasizes:
- Architectural form over excessive color
- Structural plants with year-round presence
- Restrained palette of greens, silvers, and whites
- Geometric planting patterns
- Low-maintenance, high-impact species
- Drought-tolerant selections for sustainability

Perfect for UK gardens that want:
- Contemporary, uncluttered aesthetics
- Low-maintenance elegance
- Year-round structure
- Urban or courtyard settings
- Modern architecture harmony`,
    design_principles: [
      'Minimalist planting with maximum impact',
      'Architectural plants providing structure',
      'Restrained color palette',
      'Geometric or linear arrangements',
      'Year-round interest through form'
    ],
    best_for: ['modern gardens', 'urban spaces', 'courtyards', 'contemporary architecture', 'low maintenance'],
    estimated_cost_min: 800,
    estimated_cost_max: 1500,
    plants_count: 18,
    seo_title: 'Chelsea 2023 Gold Medal Modern Garden Style | UK Planting Plans',
    seo_description: 'Get the award-winning Chelsea Flower Show 2023 modern garden look adapted for your UK garden. Clean lines, architectural plants, £800-1500. AI-generated custom plans.',
    seo_keywords: ['Chelsea Flower Show', 'modern garden design', 'contemporary planting', 'minimalist garden', 'architectural plants', 'award winning garden'],
    attribution_text: 'This planting plan is inspired by gold medal-winning modern gardens at RHS Chelsea Flower Show 2023. Plant selections adapted for UK growing conditions. Not affiliated with or endorsed by RHS.',
    source_links: [
      {
        title: 'RHS Chelsea Flower Show',
        url: 'https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show'
      }
    ]
  },

  {
    slug: 'chelsea-wildlife-haven',
    name: 'Chelsea Wildlife Garden Gold Medal',
    designer_name: 'Chris Packham / RHS',
    source_type: 'show_garden',
    source_name: 'RHS Chelsea Flower Show',
    year: 2023,
    award: 'Gold Medal',
    style_category: 'wildlife',
    difficulty: 'beginner',
    maintenance: 'low',
    short_description: 'Native perennials, wildflowers, and wildlife-friendly planting inspired by award-winning naturalistic Chelsea gardens.',
    long_description: `This style celebrates biodiversity and wildlife-friendly gardening, inspired by Chris Packham's advocacy and RHS Chelsea's wildlife-focused show gardens.

Key characteristics:
- Native UK plants supporting pollinators
- Naturalistic, informal planting
- Year-round food sources for wildlife
- Habitat creation (dense planting, seed heads retained)
- Low-intervention, sustainable approach
- Wildflower meadow elements

Best suited for:
- Wildlife enthusiasts
- Eco-conscious gardeners
- Rural or semi-rural settings
- Gardens with space for naturalistic areas
- Low-maintenance, nature-first approach`,
    design_principles: [
      'Native species prioritized for wildlife',
      'Naturalistic, meadow-like planting',
      'Year-round wildlife food sources',
      'Low intervention and sustainability',
      'Dense planting for habitat creation'
    ],
    best_for: ['wildlife gardens', 'eco-conscious', 'naturalistic', 'rural settings', 'pollinator-friendly'],
    estimated_cost_min: 400,
    estimated_cost_max: 800,
    plants_count: 20,
    seo_title: 'Chelsea Wildlife Garden Style | Native UK Plants for Pollinators',
    seo_description: 'Create a wildlife haven with native plants inspired by Chelsea gold medal gardens. Support pollinators, £400-800. Perfect for eco-conscious UK gardeners.',
    seo_keywords: ['wildlife garden', 'native plants UK', 'pollinator garden', 'Chelsea wildlife', 'eco garden', 'wildflower meadow'],
    attribution_text: 'Inspired by wildlife-focused show gardens at RHS Chelsea and conservation advocacy. Plant selections adapted for UK wildlife. Not affiliated with RHS or Chris Packham.',
    source_links: [
      {
        title: 'RHS Plants for Pollinators',
        url: 'https://www.rhs.org.uk/science/conservation-biodiversity/wildlife/plants-for-pollinators'
      }
    ]
  },

  {
    slug: 'chelsea-urban-retreat',
    name: 'Chelsea Urban Oasis',
    designer_name: 'Small Space Award Winners',
    source_type: 'show_garden',
    source_name: 'RHS Chelsea Flower Show - Small Garden Category',
    award: 'Gold Medal',
    style_category: 'contemporary',
    difficulty: 'intermediate',
    maintenance: 'medium',
    short_description: 'Layered, intimate planting for small urban gardens, inspired by Chelsea\'s award-winning compact designs.',
    long_description: `Drawing from Chelsea's Small Garden category winners, this style maximizes impact in limited space through clever layering and plant selection.

Design approach:
- Vertical layering (climbers, shrubs, perennials, ground cover)
- Compact varieties with long seasons
- Multi-functional plants (screening + beauty)
- Container integration
- Year-round structure in small footprints
- Sensory elements (scent, touch, sound)

Perfect for:
- Urban gardens (typically <20m²)
- Courtyard gardens
- Balconies with soil beds
- Narrow side passages
- Front gardens`,
    design_principles: [
      'Vertical layering maximizes space',
      'Compact plant varieties',
      'Multi-functional species',
      'Year-round interest essential',
      'Intimate, enclosed atmosphere'
    ],
    best_for: ['small gardens', 'urban', 'courtyards', 'limited space', 'city gardens'],
    estimated_cost_min: 600,
    estimated_cost_max: 1000,
    plants_count: 15,
    seo_title: 'Chelsea Small Garden Style | Urban Planting Plans UK',
    seo_description: 'Transform your small urban garden with Chelsea-winning design principles. Maximize space with layered planting, £600-1000. Perfect for city gardens.',
    seo_keywords: ['small garden design', 'urban garden', 'Chelsea small garden', 'compact planting', 'courtyard garden', 'city garden'],
    attribution_text: 'Inspired by award-winning small gardens at RHS Chelsea Flower Show. Adapted for typical UK urban garden conditions. Not affiliated with RHS.',
    source_links: [
      {
        title: 'RHS Small Garden Ideas',
        url: 'https://www.rhs.org.uk/garden-design/small'
      }
    ]
  },

  // Famous Designers (3 styles for MVP)
  {
    slug: 'piet-oudolf-prairie',
    name: 'Piet Oudolf Prairie Style',
    designer_name: 'Piet Oudolf',
    source_type: 'designer',
    source_name: 'International designer portfolio',
    style_category: 'prairie',
    difficulty: 'intermediate',
    maintenance: 'medium',
    short_description: 'Naturalistic planting with ornamental grasses and late-season perennials, creating movement and year-round interest.',
    long_description: `This planting plan draws inspiration from the revolutionary naturalistic design principles of Dutch designer Piet Oudolf, whose work at the High Line in New York, Hauser & Wirth Somerset, and numerous RHS show gardens has redefined contemporary garden design.

Oudolf's signature style emphasizes:
- Ornamental grasses providing structure and movement
- Late-flowering perennials for autumn and winter interest
- Naturalistic drifts rather than formal planting
- Plants chosen for their structural qualities as much as flowers
- Year-round visual interest through seed heads and winter silhouettes

This style works beautifully in UK gardens, particularly in:
- Medium to large gardens (20m²+)
- Full sun to partial shade
- Well-drained soil
- Low to medium maintenance (cut back once in late winter)`,
    design_principles: [
      'Naturalistic drifts and flowing patterns',
      'Emphasis on structure and form over pure color',
      'Year-round interest including winter seed heads',
      'Repeated use of signature plants for rhythm',
      'Grasses providing vertical accents and movement'
    ],
    best_for: ['medium to large gardens', 'full sun', 'modern aesthetic', 'year-round interest', 'low maintenance'],
    estimated_cost_min: 700,
    estimated_cost_max: 1200,
    plants_count: 18,
    seo_title: 'Piet Oudolf Prairie Style Garden Plan | UK Adaptation',
    seo_description: 'Get Piet Oudolf\'s iconic prairie planting style adapted for your UK garden. Naturalistic design with grasses and perennials, £700-1200. AI-generated custom plans.',
    seo_keywords: ['Piet Oudolf garden', 'prairie planting UK', 'naturalistic garden design', 'ornamental grasses', 'Oudolf style planting', 'modern perennial garden'],
    attribution_text: 'This planting plan is inspired by the naturalistic design principles popularized by Piet Oudolf. Plant selections are adapted for UK growing conditions. Not affiliated with or endorsed by Piet Oudolf.',
    source_links: [
      {
        title: 'Piet Oudolf Official Website',
        url: 'https://oudolf.com'
      },
      {
        title: 'The High Line, New York',
        url: 'https://www.thehighline.org/gardens/'
      }
    ]
  },

  {
    slug: 'monty-don-cottage',
    name: 'Monty Don Cottage Garden',
    designer_name: 'Monty Don',
    source_type: 'tv_featured',
    source_name: 'BBC Gardeners\' World',
    style_category: 'cottage',
    difficulty: 'intermediate',
    maintenance: 'medium',
    short_description: 'Romantic, abundant cottage garden planting inspired by Monty Don\'s Longmeadow garden, with roses, clematis, and traditional perennials.',
    long_description: `Inspired by Monty Don's beloved Longmeadow garden featured on BBC Gardeners' World, this style celebrates traditional English cottage garden planting with a contemporary twist.

Characteristic features:
- Roses as backbone plants
- Clematis for vertical interest
- Traditional perennials (delphiniums, geraniums, salvias)
- Abundant, overflowing planting
- Mixed heights and textures
- Romantic, informal aesthetic
- Seasonal succession for year-round color

Ideal for:
- Traditional cottage-style properties
- Gardeners who love classic English style
- Medium to large gardens
- Those willing to invest in regular maintenance
- Gardens with existing structures (walls, fences) for climbers`,
    design_principles: [
      'Abundant, overflowing cottage aesthetic',
      'Roses and clematis as key features',
      'Traditional perennial combinations',
      'Informal, romantic atmosphere',
      'Seasonal succession planting'
    ],
    best_for: ['cottage gardens', 'traditional style', 'romantic planting', 'established gardens', 'climber support'],
    estimated_cost_min: 600,
    estimated_cost_max: 1000,
    plants_count: 18,
    seo_title: 'Monty Don Cottage Garden Style | Longmeadow-Inspired Plans',
    seo_description: 'Create a romantic cottage garden inspired by Monty Don\'s Longmeadow. Roses, clematis, traditional perennials, £600-1000. BBC Gardeners\' World style.',
    seo_keywords: ['Monty Don garden', 'cottage garden design', 'Longmeadow', 'BBC Gardeners World', 'English cottage garden', 'traditional planting'],
    attribution_text: 'Inspired by the cottage garden principles demonstrated at Longmeadow and on BBC Gardeners\' World. Plant selections adapted for typical UK conditions. Not affiliated with or endorsed by Monty Don or BBC.',
    source_links: [
      {
        title: 'Monty Don Official Site',
        url: 'https://www.montydon.com'
      },
      {
        title: 'BBC Gardeners\' World',
        url: 'https://www.bbc.co.uk/gardeners-world'
      }
    ]
  },

  {
    slug: 'dan-pearson-meadow',
    name: 'Dan Pearson Wildflower Meadow',
    designer_name: 'Dan Pearson',
    source_type: 'designer',
    source_name: 'Award-winning naturalistic designer',
    style_category: 'meadow',
    difficulty: 'beginner',
    maintenance: 'low',
    short_description: 'Natural meadow planting with wildflowers, grasses, and native perennials inspired by Dan Pearson\'s naturalistic approach.',
    long_description: `Dan Pearson's work celebrates the beauty of natural plant communities, creating meadow-style plantings that blur the line between garden and wild landscape.

Design philosophy:
- Native and near-native plants
- Meadow-like naturalistic planting
- Grasses and wildflowers integrated
- Minimal intervention approach
- Self-sustaining plant communities
- Seasonal transformation

Best for:
- Large gardens or wild areas
- Rural or semi-rural settings
- Gardeners seeking low-maintenance beauty
- Wildlife-friendly spaces
- Sustainable, ecological approach`,
    design_principles: [
      'Naturalistic, meadow-like aesthetic',
      'Native and near-native species',
      'Self-sustaining plant communities',
      'Minimal intervention required',
      'Seasonal transformation celebrated'
    ],
    best_for: ['large gardens', 'rural settings', 'wildlife-friendly', 'low maintenance', 'naturalistic'],
    estimated_cost_min: 400,
    estimated_cost_max: 700,
    plants_count: 22,
    seo_title: 'Dan Pearson Meadow Style | Wildflower Garden Plans UK',
    seo_description: 'Create a natural wildflower meadow inspired by Dan Pearson\'s acclaimed designs. Native plants, low maintenance, £400-700. Perfect for ecological gardens.',
    seo_keywords: ['Dan Pearson garden', 'wildflower meadow', 'naturalistic planting', 'native plants UK', 'meadow garden', 'ecological design'],
    attribution_text: 'Inspired by Dan Pearson\'s naturalistic design principles and meadow planting approach. Adapted for UK growing conditions. Not affiliated with or endorsed by Dan Pearson.',
    source_links: [
      {
        title: 'Dan Pearson Studio',
        url: 'https://www.danpearsonstudio.com'
      }
    ]
  },

  // Historic Gardens (2 styles for MVP)
  {
    slug: 'sissinghurst-white-garden',
    name: 'Sissinghurst White Garden',
    designer_name: 'Vita Sackville-West',
    source_type: 'historic_garden',
    source_name: 'Sissinghurst Castle Garden',
    year: 1950,
    style_category: 'formal',
    difficulty: 'intermediate',
    maintenance: 'medium',
    short_description: 'Elegant white and silver planting inspired by Vita Sackville-West\'s iconic White Garden at Sissinghurst.',
    long_description: `One of the most famous garden rooms in England, Sissinghurst's White Garden demonstrates the power of a monochromatic color scheme to create elegance and sophistication.

Design characteristics:
- White flowers exclusively
- Silver and gray foliage for contrast
- Formal structure with romantic planting
- Layered heights creating depth
- Year-round interest through foliage
- Moonlit garden effect

Perfect for:
- Formal gardens or structured spaces
- Gardeners seeking elegance
- Shaded or partially shaded areas (many white flowers tolerate shade)
- Evening gardens (white flowers glow at dusk)
- Creating a sense of calm and serenity`,
    design_principles: [
      'Monochromatic white color scheme',
      'Silver and gray foliage for texture',
      'Formal structure with soft planting',
      'Layered heights for depth',
      'Evening luminescence'
    ],
    best_for: ['formal gardens', 'evening interest', 'partial shade', 'elegant style', 'structured spaces'],
    estimated_cost_min: 700,
    estimated_cost_max: 1200,
    plants_count: 16,
    seo_title: 'Sissinghurst White Garden Style | Vita Sackville-West Inspired',
    seo_description: 'Create an elegant white garden inspired by Sissinghurst Castle. Monochromatic planting with silver foliage, £700-1200. Historic UK garden style.',
    seo_keywords: ['Sissinghurst garden', 'white garden', 'Vita Sackville-West', 'monochromatic planting', 'historic garden', 'formal garden'],
    attribution_text: 'Inspired by the White Garden at Sissinghurst Castle Garden, created by Vita Sackville-West. Plant selections adapted for modern UK gardens. Not affiliated with National Trust.',
    source_links: [
      {
        title: 'Sissinghurst Castle Garden',
        url: 'https://www.nationaltrust.org.uk/visit/kent/sissinghurst-castle-garden'
      }
    ]
  },

  {
    slug: 'great-dixter-exotic',
    name: 'Great Dixter Exotic Garden',
    designer_name: 'Christopher Lloyd',
    source_type: 'historic_garden',
    source_name: 'Great Dixter House & Gardens',
    year: 1993,
    style_category: 'exotic',
    difficulty: 'advanced',
    maintenance: 'high',
    short_description: 'Bold, experimental exotic planting inspired by Christopher Lloyd\'s revolutionary approach at Great Dixter.',
    long_description: `Christopher Lloyd\'s decision to replace Great Dixter's famous rose garden with exotic planting was revolutionary, creating one of the UK's most influential exotic borders.

Defining features:
- Bold, tropical-looking plants (cannas, bananas, dahlias)
- Hot color scheme (reds, oranges, purples)
- Dramatic foliage contrasts
- Annual refresh each spring
- High-maintenance but spectacular
- Experimental, fearless approach

Best for:
- Adventurous gardeners
- Those seeking maximum drama
- Sheltered, sunny positions
- Gardeners willing to lift tender plants annually
- Contemporary aesthetic with historic roots`,
    design_principles: [
      'Bold, tropical-looking hardy plants',
      'Hot color scheme and dramatic contrasts',
      'Experimental, fearless combinations',
      'Foliage as important as flowers',
      'Annual planting refresh'
    ],
    best_for: ['adventurous gardeners', 'sunny sheltered spots', 'dramatic impact', 'contemporary style', 'high maintenance'],
    estimated_cost_min: 800,
    estimated_cost_max: 1400,
    plants_count: 16,
    seo_title: 'Great Dixter Exotic Garden Style | Christopher Lloyd Inspired',
    seo_description: 'Create a bold exotic garden inspired by Christopher Lloyd\'s Great Dixter. Cannas, dahlias, tropical foliage, £800-1400. Dramatic UK planting.',
    seo_keywords: ['Great Dixter', 'Christopher Lloyd', 'exotic garden', 'tropical planting UK', 'bold planting', 'canna dahlias'],
    attribution_text: 'Inspired by the Exotic Garden at Great Dixter, created by Christopher Lloyd. Plant selections adapted for UK conditions. Not affiliated with Great Dixter.',
    source_links: [
      {
        title: 'Great Dixter House & Gardens',
        url: 'https://www.greatdixter.co.uk'
      }
    ]
  },

  // BBC Gardeners' World (2 styles for MVP)
  {
    slug: 'gardeners-world-family-garden',
    name: 'Gardeners\' World Family Garden',
    designer_name: 'Monty Don / BBC',
    source_type: 'tv_featured',
    source_name: 'BBC Gardeners\' World',
    style_category: 'contemporary',
    difficulty: 'beginner',
    maintenance: 'medium',
    short_description: 'Practical, family-friendly planting combining beauty with productivity, inspired by BBC Gardeners\' World demonstrations.',
    long_description: `This style reflects the practical, accessible approach demonstrated on BBC Gardeners' World, combining ornamental beauty with edible plants and family-friendly features.

Key characteristics:
- Mix of ornamental and edible plants
- Robust plants tolerant of play/activity
- Year-round interest
- Easy maintenance for busy families
- Wildlife-friendly
- Educational opportunities for children

Perfect for:
- Families with children
- Gardens with active use
- Those wanting beauty AND productivity
- First-time gardeners
- Gardens serving multiple purposes`,
    design_principles: [
      'Ornamental and edible plants combined',
      'Robust, child-tolerant species',
      'Practical, low-fuss approach',
      'Year-round family engagement',
      'Educational planting'
    ],
    best_for: ['family gardens', 'children', 'productive gardens', 'beginners', 'multi-purpose spaces'],
    estimated_cost_min: 500,
    estimated_cost_max: 900,
    plants_count: 18,
    seo_title: 'BBC Gardeners\' World Family Garden | Child-Friendly Planting',
    seo_description: 'Create a beautiful, practical family garden inspired by BBC Gardeners\' World. Mix ornamental and edible plants, £500-900. Perfect for children.',
    seo_keywords: ['family garden', 'BBC Gardeners World', 'child-friendly planting', 'productive garden', 'Monty Don', 'beginner garden'],
    attribution_text: 'Inspired by family garden principles demonstrated on BBC Gardeners\' World. Not affiliated with or endorsed by BBC or presenters.',
    source_links: [
      {
        title: 'BBC Gardeners\' World',
        url: 'https://www.bbc.co.uk/gardeners-world'
      }
    ]
  }
];

async function seedDesignerStyles() {
  console.log('🌱 Starting designer styles seed...\n');

  for (const style of designerStyles) {
    console.log(`Seeding: ${style.name}...`);

    const { data, error } = await supabase
      .from('designer_styles')
      .upsert(style, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error seeding ${style.slug}:`, error.message);
    } else {
      console.log(`✅ ${style.name} seeded successfully`);
    }
  }

  console.log('\n✨ Designer styles seeding complete!');
  console.log(`\nSeeded ${designerStyles.length} styles:`);
  console.log('- 3 Show Gardens (Chelsea)');
  console.log('- 3 Famous Designers (Oudolf, Monty Don, Dan Pearson)');
  console.log('- 2 Historic Gardens (Sissinghurst, Great Dixter)');
  console.log('- 2 BBC Gardeners\' World\n');
}

seedDesignerStyles().catch(console.error);
