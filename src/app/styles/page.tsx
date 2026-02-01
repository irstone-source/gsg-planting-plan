import { Header, Footer, RevealSection, ArchitecturalCard } from '@/components/architectural';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Designer Garden Styles | PlantingPlans',
  description: 'Browse 10+ garden styles inspired by Chelsea Flower Show, famous designers, and historic UK gardens. Get professional planting plans for £79.',
  keywords: ['garden design styles', 'Chelsea Flower Show', 'Piet Oudolf', 'Monty Don', 'Sissinghurst', 'cottage garden', 'modern garden'],
};

async function getDesignerStyles() {
  const { data, error } = await supabase
    .from('designer_styles')
    .select('*')
    .order('view_count', { ascending: false });

  if (error) {
    console.error('Error fetching designer styles:', error);
    return [];
  }

  return data || [];
}

export default async function StylesPage() {
  const styles = await getDesignerStyles();

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              DESIGNER GARDEN STYLES
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-2xl mx-auto">
              Get the £100,000 Chelsea Flower Show look adapted for your UK garden.
              Professional planting plans inspired by award-winning designers and show gardens.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Styles Grid */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {styles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-stone mb-4">
                No designer styles available yet.
              </p>
              <p className="text-sm text-stone/70">
                Check back soon - we're curating the best UK garden styles.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {styles.map((style, index) => (
                <Link key={style.id} href={`/styles/${style.slug}`}>
                  <ArchitecturalCard
                    title={style.name}
                    description={style.short_description}
                    delay={index * 0.1}
                  >
                    {/* Hero Image Placeholder */}
                    <div className="relative h-48 bg-concrete/40 mb-4 rounded-sm overflow-hidden">
                      {style.hero_image_url ? (
                        <Image
                          src={style.hero_image_url}
                          alt={style.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl opacity-20">{style.style_category}</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-copper/90 backdrop-blur text-dark text-xs uppercase tracking-wider font-bold rounded-sm">
                          {style.style_category}
                        </span>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-moss/90 backdrop-blur text-dark text-xs uppercase tracking-wider font-bold rounded-sm">
                          {style.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Designer Name */}
                    {style.designer_name && (
                      <p className="text-sm text-copper uppercase tracking-wider mb-3">
                        Inspired by {style.designer_name}
                      </p>
                    )}

                    {/* Price Range */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <span className="text-lg font-bold text-mist">
                        £{style.estimated_cost_min}-{style.estimated_cost_max}
                      </span>
                      <span className="text-copper hover:underline text-sm uppercase tracking-wider">
                        View Style →
                      </span>
                    </div>
                  </ArchitecturalCard>
                </Link>
              ))}
            </div>
          )}
        </div>
      </RevealSection>

      {/* Legal Disclaimer */}
      <RevealSection className="py-20 bg-concrete/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
            <h4 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
              Important Disclaimer
            </h4>
            <p className="text-sm text-stone mb-4 leading-relaxed">
              PlantingPlans provides educational content and planting plan adaptations
              inspired by famous gardens and designers. We are not affiliated with or
              endorsed by the designers, gardens, or organizations mentioned on this site.
            </p>
            <p className="text-sm text-stone mb-4 leading-relaxed">
              All plant lists are compiled from publicly available sources. Design
              principles are analyzed for educational purposes under fair use.
            </p>
            <p className="text-sm text-stone leading-relaxed">
              <strong className="text-mist">For Rights Holders:</strong> If you would like to discuss partnership
              opportunities, request attribution changes, or request removal of content,
              please contact us at{' '}
              <a href="mailto:hello@plantingplans.co.uk" className="text-copper hover:underline">
                hello@plantingplans.co.uk
              </a>
            </p>
          </div>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}
