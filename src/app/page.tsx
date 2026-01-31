import { Header, Footer, MagneticButton, ArchitecturalCard, BlueprintTimeline, RevealSection } from '@/components/architectural';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center pt-32">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl uppercase tracking-wider font-bold text-mist mb-8 leading-tight">
            ARCHITECTURAL VISION<br />
            FOR UK GARDENS
          </h1>
          <p className="text-lg md:text-xl text-stone max-w-3xl mx-auto mb-12 leading-relaxed">
            Precision planting plans built around your light, soil, and lifestyle — so what you plant thrives and the design looks intentional from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <MagneticButton href="/examples/hub" variant="copper">
              VIEW EXAMPLES
            </MagneticButton>
            <MagneticButton href="/pricing" variant="ghost">
              GET EARLY ACCESS
            </MagneticButton>
          </div>

          <p className="text-xs uppercase tracking-widest text-stone mt-12">
            Built for DIY gardeners and professionals. Designer-friendly. UK-first.
          </p>
        </div>
      </section>

      {/* What You Get Section */}
      <RevealSection className="py-32 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-center mb-16">
              A PLAN YOU CAN ACTUALLY PLANT
            </h2>

            <div className="space-y-6 text-stone">
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  A planting palette you can visualise: structure, seasonal interest, ground layer
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  Quantities + spacing logic (so it doesn't look sparse or overcrowded)
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  A care rhythm that fits real life (with reminders and seasonal prompts)
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  Sourcing guidance and substitutions when plants aren't available (v2)
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Features Grid */}
      <RevealSection className="py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <ArchitecturalCard
              title="VISION ANALYSIS"
              description="Read your garden's light, exposure, and constraints — then design to suit, not to hope."
              delay={0}
            />
            <ArchitecturalCard
              title="UK LOCATION INTELLIGENCE"
              description="UK-first climate context and hardiness guidance to reduce failure risk."
              delay={0.1}
            />
            <ArchitecturalCard
              title="DELIVERABLE PLANTING"
              description="Plans structured for buying and planting — with pro-ready outputs and partnership pathways."
              delay={0.2}
            />
          </div>
        </div>
      </RevealSection>

      {/* How It Works */}
      <RevealSection className="py-32 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-center mb-16">
              FROM INSPIRATION TO INSTALLATION
            </h2>

            <BlueprintTimeline
              steps={[
                {
                  number: '01',
                  title: 'Capture your space',
                  description: 'Photos + a few details. No measuring marathon.',
                },
                {
                  number: '02',
                  title: 'Generate the system',
                  description: 'A layered planting scheme with roles, spacing and intent.',
                },
                {
                  number: '03',
                  title: 'Keep it alive',
                  description: 'Care prompts, seasonal rhythm, and support when you need it.',
                },
              ]}
            />

            <div className="mt-12 text-center">
              <Link
                href="/examples/hub"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-copper hover:text-[#D4A373] transition-colors"
              >
                See what you could get
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Authority Strip */}
      <RevealSection className="py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold mb-8">
              BUILT WITH — NOT AGAINST — PROFESSIONALS
            </h2>
            <p className="text-lg text-stone leading-relaxed mb-12 max-w-2xl mx-auto">
              PlantingPlans is infrastructure: faster planning, clearer client delivery, and a structured format designers can sell and reuse. We amplify professional horticulture.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton href="/designers" variant="ghost">
                FOR DESIGNERS
              </MagneticButton>
              <MagneticButton href="/partners" variant="ghost">
                FOR GARDEN CENTRES
              </MagneticButton>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Final CTA */}
      <RevealSection className="py-32 bg-concrete/40">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold mb-8">
            START WITH CONFIDENCE
          </h2>
          <p className="text-lg text-stone mb-12 max-w-2xl mx-auto">
            Join the early access list and be among the first to build gardens that thrive from day one.
          </p>
          <MagneticButton href="/pricing" variant="copper">
            GET EARLY ACCESS
          </MagneticButton>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}
