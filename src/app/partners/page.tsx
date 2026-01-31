import { Header, Footer, ArchitecturalCard, RevealSection } from '@/components/architectural';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

export const metadata = {
  title: 'For Partners | PlantingPlans',
  description: 'Partner with PlantingPlans. Garden centres offer exclusive redemption codes. 15-25% revenue share on all activations.'
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              PARTNER WITH US
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-2xl mx-auto">
              Garden centres and nurseries: offer exclusive redemption codes to customers. Revenue share on every activation.
            </p>
            <p className="text-sm uppercase tracking-widest text-copper">
              Turn foot traffic into recurring revenue
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Value Proposition */}
      <RevealSection className="py-20 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-concrete/60 backdrop-blur-md border border-white/5 p-12">
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-center mb-8">
              HOW IT WORKS
            </h2>
            <div className="space-y-6 text-stone">
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono text-2xl">15-25%</span>
                <p className="leading-relaxed">
                  Revenue share on every activation code redeemed. Your code = your customers = your recurring income stream.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  Exclusive redemption codes: customers apply your code at checkout for 10-30% discount. You earn 15-25% of the transaction.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  Zero setup cost. No integration required. We handle payments, plan delivery, and support. You promote the code.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-copper font-mono">—</span>
                <p className="leading-relaxed">
                  Dashboard access: track redemptions, earnings, and customer attribution in real-time.
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
              PARTNER WORKFLOW
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
                    Register & Get Your Code
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Apply below with business details and location. We assign a unique redemption code (e.g., "WYEVALE15"). Set your discount rate (10-30%) and revenue share (15-25%).
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
                    Promote to Customers
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Display code at checkout, on receipts, in-store signage, or email campaigns. "Get 15% off PlantingPlans with code WYEVALE15". We provide marketing assets.
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
                    Earn Revenue Share
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Customers apply your code at checkout. You earn 15-25% of the transaction. Payouts monthly via Stripe. Track redemptions in partner dashboard.
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
              WHY PARTNER WITH US
            </h2>
            <p className="text-stone text-lg">
              Turn customer interactions into revenue streams without inventory or fulfillment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ArchitecturalCard
              title="ZERO SETUP COST"
              description="No integration fees. No platform charges. Just promote your code and earn revenue share. Marketing assets provided."
              delay={0}
            />
            <ArchitecturalCard
              title="RECURRING REVENUE"
              description="Customers purchase activation passes (not one-time). Your code attribution stays active for 30 days from first click."
              delay={0.1}
            />
            <ArchitecturalCard
              title="DASHBOARD ACCESS"
              description="Real-time tracking: redemptions, earnings, customer locations, conversion rates. Export reports for accounting."
              delay={0.2}
            />
            <ArchitecturalCard
              title="CO-MARKETING"
              description="Featured in local partner directory. We drive UK gardeners to your business through location-based recommendations."
              delay={0.3}
            />
          </div>
        </div>
      </RevealSection>

      {/* Use Cases */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-center mb-16">
              WHO THIS WORKS FOR
            </h2>

            <div className="space-y-8">
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Garden Centres & Nurseries
                </h3>
                <p className="text-stone leading-relaxed">
                  Offer redemption codes to customers purchasing plants. "Plan your planting with PlantingPlans—15% off with code NURSERY15". Drives repeat visits and positions you as design authority.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Landscape Suppliers
                </h3>
                <p className="text-stone leading-relaxed">
                  Partner with trade customers and contractors. Bulk codes for project-based use. Revenue share on every plan generated for their clients.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Garden Design Consultancies
                </h3>
                <p className="text-stone leading-relaxed">
                  Offer PlantingPlans as a lead magnet or consultation tool. Co-brand the experience and earn revenue share on every activation from your audience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Application Form */}
      <RevealSection className="py-20 bg-concrete/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold mb-6">
                BECOME A PARTNER
              </h2>
              <p className="text-stone text-lg">
                Register your business and get your exclusive redemption code. Most applications approved within 48 hours.
              </p>
            </div>

            <LeadCaptureForm
              type="partner"
              title="REGISTER INTEREST"
              description="We'll review your application and set up your partner account with a unique redemption code."
            />
          </div>
        </div>
      </RevealSection>

      {/* FAQ */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-center mb-16">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="space-y-8">
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  How much can I earn?
                </h3>
                <p className="text-stone leading-relaxed">
                  Depends on your customer volume. Example: 50 redemptions/month at £79 average (DIY pass) = £593-£987 monthly revenue share (15-25%). Pro passes (£249) earn proportionally more.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  What's the discount rate?
                </h3>
                <p className="text-stone leading-relaxed">
                  You choose: 10-30% off for your customers. Higher discount = more redemptions but lower revenue share per transaction. We recommend 15% as optimal balance.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  How is attribution tracked?
                </h3>
                <p className="text-stone leading-relaxed">
                  30-day cookie window from first click. If customer applies your code at checkout within 30 days, you get attribution. Last-click wins if multiple codes used.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Do I need to fulfill anything?
                </h3>
                <p className="text-stone leading-relaxed">
                  No. We handle plan generation, delivery, support, and payments. You promote the code and earn revenue share. No inventory, no fulfillment, no customer service.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Can I have multiple codes?
                </h3>
                <p className="text-stone leading-relaxed">
                  Yes. Create location-specific codes (NURSERY_LONDON, NURSERY_MANCHESTER) or campaign-specific codes for tracking. All roll up to your partner dashboard.
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
