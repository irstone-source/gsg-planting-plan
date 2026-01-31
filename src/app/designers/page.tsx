import { Header, Footer, ArchitecturalCard, RevealSection } from '@/components/architectural';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

export const metadata = {
  title: 'For Designers | PlantingPlans',
  description: 'Join PlantingPlans as a garden designer. 80% commission on all plans sold. Infrastructure that amplifies professional horticulture.'
};

export default function DesignersPage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              WE AMPLIFY DESIGNERS
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-2xl mx-auto">
              PlantingPlans is infrastructure: faster planning, clearer client delivery, and a structured format designers can sell and reuse.
            </p>
            <p className="text-sm uppercase tracking-widest text-copper">
              Built with—not against—professionals
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Value Proposition */}
      <RevealSection className="py-20 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-concrete/60 backdrop-blur-md border border-white/5 p-12">
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-center mb-8">
              WHAT YOU GET
            </h2>
            <div className="space-y-6 text-stone">
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono text-2xl">80%</span>
                <p className="leading-relaxed">
                  You keep 80% of every plan you sell through the platform. We handle payments, hosting, and delivery. You focus on design.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  Structured plan format: planting palettes, spacing logic, care rhythm, seasonal prompts—ready for client handoff.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  Client portal: shareable links, revision tracking, password protection, expiring access—professional delivery without custom dev.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  Visibility: featured in designer directory, seen by UK homeowners actively looking for professional guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* How It Works */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-center mb-16">
              YOUR WORKFLOW
            </h2>

            <div className="space-y-12">
              <div className="flex gap-6 items-start">
                <div className="w-20 h-20 border-2 border-copper/30 flex items-center justify-center relative flex-shrink-0">
                  <span className="font-mono text-2xl font-bold text-copper">01</span>
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-copper"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-copper"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-copper"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-copper"></div>
                </div>
                <div>
                  <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-3">
                    Apply & Get Approved
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Submit your portfolio, credentials, and service areas. Most applications approved within 48 hours. We verify professional credentials and design quality.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-20 h-20 border-2 border-copper/30 flex items-center justify-center relative flex-shrink-0">
                  <span className="font-mono text-2xl font-bold text-copper">02</span>
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-copper"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-copper"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-copper"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-copper"></div>
                </div>
                <div>
                  <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-3">
                    Create & List Plans
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Upload your planting plans in our structured format. Set your pricing. Control visibility and featured images. Plans appear in designer marketplace and search results.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-20 h-20 border-2 border-copper/30 flex items-center justify-center relative flex-shrink-0">
                  <span className="font-mono text-2xl font-bold text-copper">03</span>
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-copper"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-copper"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-copper"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-copper"></div>
                </div>
                <div>
                  <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-3">
                    Receive Leads & Payments
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Get qualified leads from homeowners in your service areas. When clients purchase your plans, payments processed automatically. 80% paid out monthly. No invoicing, no chasing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Benefits Grid */}
      <RevealSection className="py-20 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold mb-6">
              DESIGNED FOR PROFESSIONALS
            </h2>
            <p className="text-stone text-lg">
              Tools that complement—not replace—your expertise and workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ArchitecturalCard
              title="CLIENT PORTALS"
              description="Share plans via secure links. Password protection, expiring access (1-90 days), client comments, and approval workflow built in."
              delay={0}
            />
            <ArchitecturalCard
              title="REVISION TRACKING"
              description="Version control for planting plans. Track changes, revert if needed, and keep clients aligned throughout the project."
              delay={0.1}
            />
            <ArchitecturalCard
              title="CRITIQUE TOOLS"
              description="AI-powered plan review: compatibility analysis, seasonal interest assessment, maintenance estimates. Use before client handoff."
              delay={0.2}
            />
            <ArchitecturalCard
              title="MARKETPLACE VISIBILITY"
              description="Featured in designer directory with portfolio, service areas, specialties, and pricing. Reach homeowners actively seeking professional design."
              delay={0.3}
            />
          </div>
        </div>
      </RevealSection>

      {/* Application Form */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold mb-6">
                REQUEST DESIGNER ACCESS
              </h2>
              <p className="text-stone text-lg">
                Join our network of professional garden designers. 80% commission. Full infrastructure support.
              </p>
            </div>

            <LeadCaptureForm
              type="designer"
              title="APPLY TO JOIN"
              description="We'll review your application and respond within 48 hours. Please include your portfolio or website."
            />
          </div>
        </div>
      </RevealSection>

      {/* FAQ */}
      <RevealSection className="py-20 bg-concrete/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-center mb-16">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="space-y-8">
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Do I need to be RHS qualified?
                </h3>
                <p className="text-stone leading-relaxed">
                  Not required, but we do verify professional credentials. We look for design portfolio, client testimonials, and demonstrated horticultural knowledge.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  How much can I charge for plans?
                </h3>
                <p className="text-stone leading-relaxed">
                  You set your own pricing. Typical range: £150-£500 per plan depending on complexity, size, and your experience level. Platform suggests pricing based on market rates.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  What if I already have my own clients?
                </h3>
                <p className="text-stone leading-relaxed">
                  Perfect. Use PlantingPlans tools for your existing clients (client portals, structured formats, critique tools) and optionally list plans for new leads through the marketplace.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Can I sell the same plan multiple times?
                </h3>
                <p className="text-stone leading-relaxed">
                  Yes. Create template plans for common scenarios (e.g., "Cottage Garden Border", "Urban Balcony Collection") and sell to multiple clients. Reusable formats = better margins.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Is this a full-time business opportunity?
                </h3>
                <p className="text-stone leading-relaxed">
                  It can be. Some designers earn £2-5K/month from platform sales alone. Others use it as supplementary income alongside site visits and full-garden designs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}
