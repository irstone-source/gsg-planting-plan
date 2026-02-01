import { Header, Footer, RevealSection } from '@/components/architectural';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

// Map designer style slugs to their corresponding example plan slugs
function getExampleSlug(styleSlug: string): string {
  const mapping: Record<string, string> = {
    'piet-oudolf-prairie': 'piet-oudolf-prairie-style',
    'monty-don-cottage': 'monty-don-cottage-garden',
    'chelsea-2023-gold-modern': 'chelsea-2023-gold-modern',
    'chelsea-wildlife-haven': 'chelsea-wildlife-haven',
    'chelsea-urban-retreat': 'chelsea-urban-retreat',
    'dan-pearson-meadow': 'dan-pearson-meadow',
    'sissinghurst-white-garden': 'sissinghurst-white-garden',
    'great-dixter-exotic': 'great-dixter-exotic',
    'gardeners-world-family-garden': 'gardeners-world-family-garden',
  };

  return mapping[styleSlug] || styleSlug;
}

async function getStyle(slug: string) {
  const { data, error } = await supabase
    .from('designer_styles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  // Increment view count
  await supabase
    .from('designer_styles')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id);

  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const style = await getStyle(slug);

  if (!style) {
    return {
      title: 'Style Not Found | PlantingPlans',
    };
  }

  return {
    title: style.seo_title || `${style.name} | PlantingPlans`,
    description: style.seo_description || style.short_description,
    keywords: style.seo_keywords || [style.name, style.designer_name, style.style_category],
  };
}

export default async function StylePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const style = await getStyle(slug);

  if (!style) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* Breadcrumbs */}
          <RevealSection>
            <div className="text-sm mb-8 text-stone">
              <Link href="/styles" className="text-copper hover:underline">
                Designer Styles
              </Link>
              {' '}/{' '}
              <span>{style.name}</span>
            </div>
          </RevealSection>

          {/* Hero Image */}
          <RevealSection>
            <div className="relative h-96 rounded-sm overflow-hidden mb-12 bg-concrete/40">
              {style.hero_image_url ? (
                <Image
                  src={style.hero_image_url}
                  alt={style.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-20 font-heading uppercase tracking-wider">
                    {style.style_category}
                  </span>
                </div>
              )}
            </div>
          </RevealSection>

          {/* Title & Designer */}
          <RevealSection>
            <div className="mb-12">
              <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-wider font-bold text-mist mb-4">
                {style.name}
              </h1>
              {style.designer_name && (
                <p className="text-xl text-copper">
                  Inspired by {style.designer_name}
                </p>
              )}
              {style.award && (
                <p className="text-lg text-stone mt-2">
                  {style.award} • {style.source_name} {style.year}
                </p>
              )}
            </div>
          </RevealSection>

          {/* Meta Info */}
          <RevealSection>
            <div className="grid grid-cols-3 gap-4 p-8 bg-concrete/60 backdrop-blur-md border border-white/5 mb-12">
              <div>
                <p className="text-sm text-stone mb-2 uppercase tracking-wider">Difficulty</p>
                <p className="font-heading text-lg uppercase tracking-wider text-mist">{style.difficulty}</p>
              </div>
              <div>
                <p className="text-sm text-stone mb-2 uppercase tracking-wider">Maintenance</p>
                <p className="font-heading text-lg uppercase tracking-wider text-mist">{style.maintenance}</p>
              </div>
              <div>
                <p className="text-sm text-stone mb-2 uppercase tracking-wider">Est. Cost</p>
                <p className="font-heading text-lg uppercase tracking-wider text-mist">
                  £{style.estimated_cost_min}-{style.estimated_cost_max}
                </p>
              </div>
            </div>
          </RevealSection>

          {/* Description */}
          <RevealSection>
            <div className="prose prose-invert max-w-none mb-16">
              <div
                className="text-stone leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: style.long_description.replace(/\n/g, '<br /><br />') }}
              />
            </div>
          </RevealSection>

          {/* Example Plan CTA */}
          <RevealSection>
            <div className="bg-concrete/60 backdrop-blur-md border border-copper/30 p-10 mb-16">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-copper/20 border border-copper flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-copper" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-2xl uppercase tracking-wider font-bold text-mist mb-3">
                    See This Style in Action
                  </h2>
                  <p className="text-stone mb-6 leading-relaxed">
                    View a complete example planting plan using this style. See the full plant palette,
                    site analysis, and maintenance schedule with interactive plant visualizations.
                  </p>
                  <Link
                    href={`/examples/${getExampleSlug(style.slug)}`}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-copper text-dark font-heading text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors"
                  >
                    View Example Plan
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Design Principles */}
          {style.design_principles && Array.isArray(style.design_principles) && (
            <RevealSection>
              <div className="mb-16">
                <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-8">
                  Key Design Principles
                </h2>
                <ul className="space-y-4">
                  {style.design_principles.map((principle: string, i: number) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="h-6 w-6 text-copper flex-shrink-0 mt-1" />
                      <span className="text-stone text-lg leading-relaxed">{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          )}

          {/* Best For */}
          {style.best_for && style.best_for.length > 0 && (
            <RevealSection>
              <div className="mb-16">
                <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-8">
                  Best For
                </h2>
                <div className="flex flex-wrap gap-3">
                  {style.best_for.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-5 py-3 bg-concrete/60 border border-copper/30 text-copper rounded-sm text-sm uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}

          {/* CTA */}
          <RevealSection>
            <div className="bg-gradient-to-r from-copper/20 to-moss/20 border-2 border-copper/40 p-12 text-center mb-16">
              <Sparkles className="h-12 w-12 text-copper mx-auto mb-6" />
              <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-4">
                Get Your Custom Version
              </h2>
              <p className="text-lg text-stone mb-8 max-w-2xl mx-auto leading-relaxed">
                Our AI will adapt this style for your specific garden conditions,
                size, and budget. Generate your personalized planting plan in minutes.
              </p>
              <Link
                href={`/create?style=${style.slug}`}
                className="inline-block px-10 py-5 bg-copper text-dark font-heading text-base uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors"
              >
                Create My Custom Plan → £79
              </Link>
            </div>
          </RevealSection>

          {/* Attribution */}
          <RevealSection>
            <div className="border-t border-white/10 pt-12">
              <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                Attribution & Sources
              </h3>
              <p className="text-sm text-stone mb-6 leading-relaxed">
                {style.attribution_text}
              </p>

              {style.source_links && Array.isArray(style.source_links) && style.source_links.length > 0 && (
                <div>
                  <p className="text-sm font-heading uppercase tracking-wider text-mist mb-3">Learn More:</p>
                  <ul className="space-y-2">
                    {style.source_links.map((link: any, i: number) => (
                      <li key={i}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-copper hover:underline inline-flex items-center gap-2"
                        >
                          {link.title}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </RevealSection>

          {/* Legal Footer */}
          <RevealSection>
            <div className="mt-12 p-6 bg-concrete/40 border border-white/5 text-sm text-stone">
              <strong className="text-mist">For Rights Holders:</strong> If you would like to discuss
              partnership opportunities, request attribution changes, or request
              removal of content, please contact us at{' '}
              <a href="mailto:hello@plantingplans.co.uk" className="text-copper hover:underline">
                hello@plantingplans.co.uk
              </a>
            </div>
          </RevealSection>
        </div>
      </div>

      <Footer />
    </div>
  );
}
