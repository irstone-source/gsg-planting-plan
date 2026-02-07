import { StyleGallery } from '@/components/StyleGallery';
import { Header, Footer } from '@/components/architectural';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero Section with Style Gallery */}
      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl uppercase tracking-wider font-bold text-mist mb-6 leading-tight">
              CREATE YOUR PLANTING PLAN
            </h1>
            <p className="text-lg md:text-xl text-stone max-w-3xl mx-auto leading-relaxed">
              Choose a style you're drawn to — we'll adapt it to your garden
            </p>
            <p className="text-sm text-stone/70 mt-4 max-w-2xl mx-auto">
              Professional planting plans in minutes. Plants matched to your conditions. No signup required.
            </p>
          </div>

          {/* Style Gallery */}
          <StyleGallery />

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
