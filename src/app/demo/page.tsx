import { Header, Footer, RevealSection } from '@/components/architectural';
import { DemoGenerator } from '@/components/DemoGenerator';

export const metadata = {
  title: 'Free Demo - Try PlantingPlans | PlantingPlans',
  description: 'Generate your first planting plan for free. No signup required. See how PlantingPlans works before you buy.',
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              Try It Free
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-2xl mx-auto">
              Generate your first planting plan for free. No signup required. No credit card needed.
              See exactly what you get before you buy.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Demo Generator */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <DemoGenerator />
          </div>
        </div>
      </RevealSection>

      {/* Trust Signals */}
      <RevealSection className="py-20 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-copper mb-2">95%+</div>
                <div className="text-sm uppercase tracking-wider text-stone">
                  Botanical Accuracy
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-copper mb-2">3 min</div>
                <div className="text-sm uppercase tracking-wider text-stone">
                  Average Time to Plan
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-copper mb-2">12,000+</div>
                <div className="text-sm uppercase tracking-wider text-stone">
                  Plant Database
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}
