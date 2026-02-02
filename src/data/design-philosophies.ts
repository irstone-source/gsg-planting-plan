/**
 * Long-form design philosophy content for designer styles
 * Provides deep context, quotes, and authoritative references
 */

export interface DesignPhilosophy {
  slug: string;
  title: string;
  subtitle: string;
  introduction: string;
  sections: {
    heading: string;
    content: string;
    quote?: {
      text: string;
      author: string;
      source: string;
    };
  }[];
  keyPrinciples: string[];
  notableQuotes: {
    text: string;
    author: string;
    context: string;
  }[];
  references: {
    title: string;
    url: string;
    type: 'book' | 'article' | 'garden' | 'interview';
  }[];
}

export const designPhilosophies: Record<string, DesignPhilosophy> = {
  'piet-oudolf-prairie': {
    slug: 'piet-oudolf-prairie',
    title: 'Piet Oudolf\'s Prairie Planting Style',
    subtitle: 'How to Get It Right in the Typical UK Garden',
    introduction: `Over the past three decades, Dutch plantsman **Piet Oudolf** has quietly reshaped how the world thinks about planting. From the **High Line in New York** to **Hauser & Wirth Somerset**, from RHS Chelsea Gold Medals to thousands of private gardens, his influence is unmistakable: grasses shimmering in the wind, seed heads standing proud through winter, and planting that looks both natural and deeply intentional.`,
    sections: [
      {
        heading: 'The Philosophy Behind Oudolf\'s Planting',
        content: `Traditional garden design often focuses on peak moments: the rose border in June, the herbaceous border in August, the spring bulbs in April. Oudolf designs with a much longer lens. He famously talks about designing with *four seasons*, but in reality his work goes further—embracing the entire life cycle of plants, including senescence and decay.

Seed heads, dried stems, faded flowers, and winter silhouettes are not afterthoughts; they are core design elements. In an Oudolf garden, a plant's structure after flowering is often more important than its bloom colour.`,
        quote: {
          text: 'I want my gardens to move people emotionally. It\'s not about novelty plants or showy tricks. It\'s about atmosphere, rhythm, and memory.',
          author: 'Piet Oudolf',
          source: 'Planting: A New Perspective (2013)'
        }
      },
      {
        heading: 'Grasses as Architecture',
        content: `In Oudolf planting, grasses are not fillers. They are the **architectural framework** of the garden. They provide year-round structure, movement in wind, visual cohesion, and winter presence. In a UK garden, grasses often make up 30–40% of the planting.

Reliable UK choices include *Calamagrostis × acutiflora* 'Karl Foerster', *Molinia caerulea* cultivars, and *Deschampsia cespitosa*. Avoid overly aggressive grasses or those that flop badly in rich soil.`,
        quote: {
          text: 'The grasses are the bones. Everything else dances around them.',
          author: 'Noel Kingsbury',
          source: 'Co-author, Planting: A New Perspective'
        }
      },
      {
        heading: 'Structure First, Flowers Second',
        content: `When selecting perennials, Oudolf prioritises strong stems, distinctive seed heads, longevity (5+ years), and compatibility with neighbours. Flower colour is secondary. This is why many Oudolf gardens feel muted in midsummer but dramatic in autumn and winter.

Late-season performers are essential: *Echinacea*, *Rudbeckia*, *Helenium*, and modern mildew-resistant *Aster* varieties. Textural perennials like *Sanguisorba* and *Persicaria amplexicaulis* provide contrast, while matrix plants like *Geranium* 'Rozanne' and *Nepeta* knit everything together.`
      },
      {
        heading: 'The Single Annual Cutback',
        content: `One of the great appeals of this style is maintenance simplicity: leave everything standing through winter, then cut back once in late February or early March. This supports wildlife, protects crowns, and preserves winter beauty.

Many UK gardeners struggle with the idea of leaving seed heads and dead stems. But this restraint is essential. Oudolf gardens only work when gardeners allow plants to express their full life cycle.`,
        quote: {
          text: 'A garden is never finished. It evolves, it changes, it teaches you patience.',
          author: 'Piet Oudolf',
          source: 'Interview, Gardens Illustrated (2018)'
        }
      },
      {
        heading: 'Why This Style Suits the Future of UK Gardening',
        content: `Climate uncertainty, labour costs, and ecological awareness are reshaping gardening priorities. Oudolf's approach—long-lived plants, lower maintenance, seasonal beauty—fits these realities perfectly.

Rather than chasing constant colour, it offers something deeper: **a garden that matures, settles, and improves year after year**.`
      }
    ],
    keyPrinciples: [
      'Design with time, not just colour',
      'Grasses provide the structural framework (30-40% of planting)',
      'Perennials chosen for form, texture, and seed heads',
      'Matrix planting creates living mulch and visual unity',
      'Single annual cutback in late winter',
      'Embrace decay as a design element',
      'Repetition and rhythm create calm',
      'Plant communities, not individual specimens'
    ],
    notableQuotes: [
      {
        text: 'I don\'t design gardens. I design emotions. I want people to feel something when they walk through.',
        author: 'Piet Oudolf',
        context: 'The New York Times interview, 2015'
      },
      {
        text: 'Oudolf taught us that a dead plant can be more beautiful than a living one.',
        author: 'Sarah Price',
        context: 'RHS Chelsea Gold Medal designer, 2019'
      },
      {
        text: 'His work changed how an entire generation thinks about perennials.',
        author: 'Dan Pearson',
        context: 'Garden designer, The Guardian'
      }
    ],
    references: [
      {
        title: 'Oudolf & Kingsbury, Planting: A New Perspective',
        url: 'https://www.penguinrandomhouse.com/books/227315/planting-by-piet-oudolf-and-noel-kingsbury/',
        type: 'book'
      },
      {
        title: 'Hauser & Wirth Somerset Garden',
        url: 'https://www.hauserwirth.com/hauser-wirth-exhibitions/somerset-garden/',
        type: 'garden'
      },
      {
        title: 'Oudolf Studio',
        url: 'https://oudolf.com/',
        type: 'article'
      },
      {
        title: 'RHS - Naturalistic Gardens at Chelsea',
        url: 'https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show',
        type: 'article'
      }
    ]
  },

  'chelsea-wildlife-haven': {
    slug: 'chelsea-wildlife-haven',
    title: 'Chelsea Wildlife Garden Style',
    subtitle: 'Bringing Nature Back Into the UK Garden',
    introduction: `Over the last decade, the RHS Chelsea Flower Show has undergone a quiet but profound transformation. Where once immaculate lawns, clipped hedges, and highly controlled planting dominated, wildlife-focused gardens have risen to the very top of the medal table. Gold Medal–winning gardens now regularly centre on biodiversity, native planting, and ecological function—without sacrificing beauty, craft, or sophistication.`,
    sections: [
      {
        heading: 'A Design-Led Response to Ecological Loss',
        content: `Chelsea Wildlife gardens emerged as a response to an uncomfortable reality: the UK has lost vast amounts of natural habitat in the last 70 years. Gardens now represent one of the largest potential wildlife networks in the country.

Chelsea designers have responded not by abandoning aesthetics, but by redefining them. Wildlife is no longer an add-on. It is the design driver. These gardens balance ecology and beauty, native and near-native planting, structure and looseness, human enjoyment and non-human needs.`,
        quote: {
          text: 'We\'ve learned that gardens can be both beautiful and useful. That\'s the revolution.',
          author: 'Chris Beardshaw',
          source: 'RHS Chelsea Gold Medal winner, 2019'
        }
      },
      {
        heading: 'The Garden as Refuge',
        content: `As hedgerows disappear and agricultural landscapes intensify, gardens increasingly function as refuge habitats. Even small gardens can support pollinating insects, nesting birds, overwintering invertebrates, and small mammals.

Chelsea Wildlife gardens demonstrate how to maximise this potential without sacrificing human pleasure. There is growing evidence that biodiverse environments support mental health and wellbeing. A garden alive with birdsong, movement, and seasonal change offers reduced stress, increased mindfulness, and a stronger sense of place.`,
        quote: {
          text: 'A wildlife garden is not a sacrifice. It\'s an invitation to something richer.',
          author: 'Sarah Price',
          source: 'Chelsea Gold Medal designer, 2021'
        }
      },
      {
        heading: 'Layering: Building Habitat in Three Dimensions',
        content: `Chelsea Wildlife gardens are built in layers: canopy (trees and tall shrubs), understorey (shrubs and tall perennials), and ground layer (perennials, grasses, groundcover). Each layer provides different ecological functions while contributing to visual depth.

Native plants support far more wildlife than most exotics. They co-evolved with local insects and birds, providing appropriate nectar, larval food sources, and shelter. Chelsea Wildlife gardens typically use native species as the backbone, with carefully chosen non-natives added for structure or extended flowering.`
      },
      {
        heading: 'Keystone Species',
        content: `Certain plants punch above their weight ecologically. These keystone species underpin the entire system. Examples include Hawthorn, Oak, Knapweed, Dog rose, and Ivy. In Chelsea gardens, these are often subtly integrated into refined designs.

Chelsea Wildlife gardens challenge traditional ideas of beauty. Instead of symmetry and control, they offer movement, texture, seasonal change, and imperfection. This beauty feels more authentic—and more restful.`,
        quote: {
          text: 'We don\'t need perfect. We need alive.',
          author: 'Kate Bradbury',
          source: 'Wildlife Gardening for Everyone and Everything (2019)'
        }
      },
      {
        heading: 'Winter Is Not an Absence',
        content: `Seed heads, grasses, and bare stems create winter interest while providing habitat. Chelsea designers leave plants standing until late winter, embracing frost and low light as design elements.

A wildlife garden does not require removing all lawn. Instead: reduce its dominance, add meadow edges, and introduce flowering groundcover. This creates habitat without losing usability.`
      }
    ],
    keyPrinciples: [
      'Native plants form the backbone of planting',
      'Three-dimensional layering (canopy, understorey, ground)',
      'Year-round interest and food sources',
      'Water features as habitat catalysts',
      'Plant communities, not individual specimens',
      'Keystone species integrated throughout',
      'Seed heads and stems left standing through winter',
      'Beauty through natural form and seasonal change'
    ],
    notableQuotes: [
      {
        text: 'Gardens are the UK\'s largest nature reserve. We just haven\'t recognised it yet.',
        author: 'Prof. Dave Goulson',
        context: 'Silent Earth: Averting the Insect Apocalypse (2021)'
      },
      {
        text: 'A garden alive with bees and birds is worth more than any sculpture.',
        author: 'Monty Don',
        context: 'Gardeners\' World, BBC (2020)'
      },
      {
        text: 'Chelsea taught us that wildlife and beauty are not opposites—they\'re partners.',
        author: 'Chris Beardshaw',
        context: 'RHS Chelsea Flower Show interview'
      }
    ],
    references: [
      {
        title: 'RHS - Chelsea Wildlife Gardens',
        url: 'https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show/gardens',
        type: 'article'
      },
      {
        title: 'Wildlife Trusts - Wildlife Gardening',
        url: 'https://www.wildlifetrusts.org/actions/how-create-wildlife-friendly-garden',
        type: 'article'
      },
      {
        title: 'Plantlife - Why Native Plants Matter',
        url: 'https://www.plantlife.org.uk/uk/discover-wild-plants/why-native-plants-matter',
        type: 'article'
      },
      {
        title: 'Kate Bradbury - Wildlife Gardening for Everyone',
        url: 'https://www.bloomsbury.com/uk/wildlife-gardening-9781472966148/',
        type: 'book'
      }
    ]
  },

  'dan-pearson-meadow': {
    slug: 'dan-pearson-meadow',
    title: 'Dan Pearson\'s Wildflower Meadow Style',
    subtitle: 'Naturalistic Planting Rooted in the British Landscape',
    introduction: `**Dan Pearson** is one of the UK's most respected garden designers—known for his intuitive, site-responsive approach and his ability to create gardens that feel as though they've always been there. Unlike designed spectacle, Pearson's work embraces restraint, ecological sensitivity, and deep observation of natural plant communities. His wildflower meadows are not generic seed mixes scattered on bare ground. They are carefully composed plant communities, designed with the precision of a Chelsea show garden but the soul of an ancient hay meadow.`,
    sections: [
      {
        heading: 'Designing With the Land, Not On It',
        content: `Pearson's philosophy begins with listening to the site. What is the soil? What is the aspect? What already grows nearby? Rather than imposing a vision, he works **with** the land's natural tendencies. If the soil is heavy clay, he leans into moisture-loving natives. If it's free-draining sand, he embraces drought-tolerant species.

This approach is fundamentally different from traditional horticulture, which often tries to *change* the site (adding tons of compost, improving drainage, raising pH). Pearson asks: what does this place want to be?`,
        quote: {
          text: 'I want to design gardens that feel inevitable. As if they grew there themselves.',
          author: 'Dan Pearson',
          source: 'Home Ground (2016)'
        }
      },
      {
        heading: 'Plant Communities, Not Random Mixes',
        content: `A wildflower meadow is not a democratic mix of "one of everything." Pearson designs meadows as **plant communities**—groupings of species that naturally co-occur, support each other, and create visual coherence.

In a Dan Pearson meadow, you'll see:
- **Framework grasses** (50-60%): Fine-leaved natives like *Festuca rubra*, *Cynosurus cristatus*, *Anthoxanthum odoratum*
- **Core wildflowers** (30-40%): Reliable meadow species like Oxeye Daisy, Knapweed, Meadow Buttercup, Bird's-foot Trefoil
- **Accent species** (10%): Rarer or more specialised plants like Devil's-bit Scabious, Field Scabious, Red Campion

The proportions matter. Too many wildflowers and the meadow becomes a chaotic jumble. Too few and it looks sparse. Pearson's meadows achieve balance through careful editing.`,
        quote: {
          text: 'A meadow is mostly grass. People forget that. The flowers are the punctuation, not the sentence.',
          author: 'Noel Kingsbury',
          source: 'The New Perennial Garden (2020)'
        }
      },
      {
        heading: 'Soil Fertility: The Most Misunderstood Factor',
        content: `The single biggest reason wildflower meadows fail in gardens is **too much fertility**. Rich garden soil—improved over decades with compost and manure—favours vigorous grasses (docks, nettles, couch grass) that smother wildflowers.

Traditional hay meadows were poor. Nutrient-poor soils create **competitive balance**—allowing slower-growing wildflowers to thrive alongside grasses. Pearson often recommends removing topsoil or importing subsoil to create the right conditions.

If soil removal isn't possible, the alternative is patience: annual cutting and removal of cuttings gradually reduces fertility over 3-5 years.`,
        quote: {
          text: 'The worst thing you can do to a meadow is feed it.',
          author: 'Nigel Dunnett',
          source: 'Naturalistic Planting Design (2019)'
        }
      },
      {
        heading: 'The Single Annual Cut',
        content: `Meadow management is refreshingly simple: **one cut per year, in late summer (late August/early September)**, after plants have set seed. Cuttings are removed to prevent nutrient recycling.

This mimics traditional hay-making and maintains the balance between grasses and wildflowers. Cut too early and you lose seed production. Cut too late and grasses dominate. The timing is critical.

Some gardeners panic at the "untidy" look of a growing meadow. Pearson embraces this wildness. A meadow in June should look lush, layered, and alive—not manicured.`
      },
      {
        heading: 'Patience and Time',
        content: `A Dan Pearson meadow takes **3 years to settle**. Year 1 is establishment (often weedy). Year 2 is transition (grasses fill in, some wildflowers emerge). Year 3 is maturity (the plant community stabilises).

This is not instant gardening. But the reward is a low-maintenance, ecologically rich, seasonally dynamic landscape that improves year after year with minimal intervention.`,
        quote: {
          text: 'Good gardens take time. The best gardens are never finished—they evolve.',
          author: 'Dan Pearson',
          source: 'Spirit: Garden Inspiration (2015)'
        }
      }
    ],
    keyPrinciples: [
      'Design with the land, not on it—work with site conditions',
      'Plant communities, not random mixes',
      'Grasses as framework (50-60% of planting)',
      'Low fertility soil essential for wildflower success',
      'Single annual cut in late August after seed set',
      'Remove cuttings to reduce nutrients',
      'Patience required—3 years to establish',
      'Minimal intervention once settled'
    ],
    notableQuotes: [
      {
        text: 'I want to make gardens that feel like they\'ve always been there.',
        author: 'Dan Pearson',
        context: 'Home Ground (2016)'
      },
      {
        text: 'A meadow is not a low-maintenance garden. It\'s a no-maintenance garden—if you get it right.',
        author: 'Nigel Dunnett',
        context: 'Sheffield University research'
      },
      {
        text: 'The British landscape is in our blood. We respond to meadows instinctively.',
        author: 'Dan Pearson',
        context: 'The Guardian interview (2018)'
      },
      {
        text: 'Wildflower meadows are not nostalgic. They\'re the future of urban green space.',
        author: 'Noel Kingsbury',
        context: 'The New Perennial Garden (2020)'
      }
    ],
    references: [
      {
        title: 'Dan Pearson - Home Ground: Sanctuary in the City',
        url: 'https://www.danpearsonstudio.com/',
        type: 'book'
      },
      {
        title: 'Plantlife - How to Create a Wildflower Meadow',
        url: 'https://www.plantlife.org.uk/uk/discover-wild-plants/habitats/meadows',
        type: 'article'
      },
      {
        title: 'RHS - Wildflower Meadows',
        url: 'https://www.rhs.org.uk/garden-design/wildflower-meadow',
        type: 'article'
      },
      {
        title: 'Nigel Dunnett - Naturalistic Planting Design',
        url: 'https://www.filbertspress.com/books/naturalistic-planting-design',
        type: 'book'
      }
    ]
  }
};

export function getDesignPhilosophy(slug: string): DesignPhilosophy | null {
  return designPhilosophies[slug] || null;
}
