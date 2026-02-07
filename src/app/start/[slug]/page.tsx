import { StyleStartForm } from '@/components/StyleStartForm';
import { Header, Footer } from '@/components/architectural';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
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

  return data;
}

export default async function StyleStartPage({ params }: PageProps) {
  const style = await getStyle(params.slug);

  if (!style) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Reassurance Message */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-moss/20 border border-moss/30 rounded-sm mb-6">
              <span className="text-moss text-sm uppercase tracking-wider font-bold">
                ✓ Style Selected
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-5xl uppercase tracking-wider font-bold text-mist mb-4">
              YOUR {style.name.toUpperCase()} PLAN HAS STARTED
            </h1>

            <p className="text-lg text-stone leading-relaxed max-w-2xl mx-auto">
              Great choice. We'll adapt this style to work perfectly in your garden conditions.
            </p>
          </div>

          {/* Style Preview Card */}
          <div className="bg-concrete/40 border border-white/5 p-6 mb-8">
            <div className="flex items-start gap-6">
              {style.hero_image_url && (
                <div className="flex-shrink-0 w-24 h-24 bg-dark/60 rounded-sm overflow-hidden">
                  <img
                    src={style.hero_image_url}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-heading text-lg uppercase tracking-wider text-mist mb-2">
                  {style.name}
                </h3>
                <p className="text-sm text-stone leading-relaxed">
                  {style.short_description}
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-dark/40 text-stone text-xs rounded-sm">
                    {style.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-dark/40 text-stone text-xs rounded-sm">
                    {style.maintenance} maintenance
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Input Form */}
          <StyleStartForm styleSlug={style.slug} styleName={style.name} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const style = await getStyle(params.slug);

  if (!style) {
    return {
      title: 'Style Not Found',
    };
  }

  return {
    title: `Start Your ${style.name} Plan | PlantingPlans`,
    description: `Create a professional ${style.name} planting plan adapted to your garden. ${style.short_description}`,
  };
}
