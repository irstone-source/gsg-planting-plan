import { ImmediatePlanCreator } from '@/components/ImmediatePlanCreator';
import { Header, Footer } from '@/components/architectural';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero Section with Immediate Form */}
      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl uppercase tracking-wider font-bold text-mist mb-6 leading-tight">
              CREATE YOUR PLANTING PLAN
            </h1>
            <p className="text-lg md:text-xl text-stone max-w-3xl mx-auto leading-relaxed">
              Tell us about your garden. Get a professional planting plan in minutes — with plants that actually suit your conditions.
            </p>
          </div>

          {/* Immediate Plan Creator */}
          <ImmediatePlanCreator />

          {/* Quick Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-concrete/40 border border-white/5 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-3">
                UK Climate Smart
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                Plants matched to your postcode's hardiness zone and seasonal patterns
              </p>
            </div>
            <div className="bg-concrete/40 border border-white/5 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-3">
                Site Specific
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                AI analyzes your sun, soil, and moisture to recommend plants that will thrive
              </p>
            </div>
            <div className="bg-concrete/40 border border-white/5 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-3">
                Ready to Plant
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                Shopping list, quantities, spacing — everything you need to buy and plant
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
