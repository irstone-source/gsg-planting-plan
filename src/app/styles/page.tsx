import { Header, Footer, RevealSection } from '@/components/architectural';
import { supabase } from '@/lib/supabase';
import { StyleCardGrid } from '@/components/StyleCard';

export const metadata = {
  title: 'Designer Garden Styles',
  description: 'Browse 10+ garden styles inspired by Chelsea Flower Show, famous designers, and historic UK gardens. Get professional planting plans for £79.',
  keywords: ['garden design styles', 'Chelsea Flower Show', 'Piet Oudolf', 'Monty Don', 'Sissinghurst', 'cottage garden', 'modern garden', 'Dan Pearson', 'wildlife garden'],
  openGraph: {
    title: 'Designer Garden Styles | PlantingPlans',
    description: 'Browse Chelsea-inspired, designer-led garden styles. Piet Oudolf prairie, Dan Pearson meadows, Monty Don cottage gardens & more.',
    url: 'https://plantingplans.co.uk/styles',
    type: 'website',
    images: [
      {
        url: '/og-styles.jpg',
        width: 1200,
        height: 630,
        alt: 'Designer Garden Styles from PlantingPlans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Designer Garden Styles | PlantingPlans',
    description: 'Browse Chelsea-inspired garden styles. Professional planting plans for £79.',
  },
  alternates: {
    canonical: 'https://plantingplans.co.uk/styles',
  },
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
          <StyleCardGrid styles={styles} showAnalytics={true} />
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
