import { Header, Footer, ArchitecturalCard, RevealSection } from '@/components/architectural';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

export const metadata = {
  title: 'Access Pricing | PlantingPlans',
  description: 'PlantingPlans activation pass pricing. Designer results. DIY planting.'
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              ACCESS PRICING
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-2xl mx-auto">
              We're launching PlantingPlans as an access product — because gardens change, seasons shift, and plans need continuity.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Access Tiers */}
      <RevealSection className="py-20 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* DIY ACCESS */}
            <ArchitecturalCard
              title="DIY ACCESS"
              description="Plans, palettes, care rhythm, reminders, and a place to store your garden's 'brain'."
              delay={0}
            >
              <div className="mt-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-widest text-copper font-bold">
                    Launching
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-stone">
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>5 plan generation credits</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>1 saved plan (permanent access)</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Monthly care reminders</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Designer marketplace access</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>3 months access</span>
                  </li>
                </ul>
              </div>
            </ArchitecturalCard>

            {/* PRO ACCESS */}
            <ArchitecturalCard
              title="PRO ACCESS"
              description="Client-ready share links, revision workflows, critique tools, and a structured plan format you can sell."
              delay={0.1}
            >
              <div className="mt-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-widest text-copper font-bold">
                    Launching
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-stone">
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Everything in DIY, plus:</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>20 plan generation credits</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>5 saved plans (permanent access)</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Priority support (24h response)</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Branded report generator</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Cost calculator</span>
                  </li>
                </ul>
              </div>
            </ArchitecturalCard>

            {/* ACTIVATION PASS */}
            <ArchitecturalCard
              title="ACTIVATION PASS"
              description="One-time payment. No recurring fees. Plans in your vault stay forever."
              delay={0.2}
            >
              <div className="mt-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-widest text-copper font-bold">
                    Launching
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-stone">
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Pay once, use for 3 months</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Saved plans accessible forever</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>No subscription lock-in</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-copper font-mono">—</span>
                    <span>Reactivate anytime</span>
                  </li>
                </ul>
              </div>
            </ArchitecturalCard>
          </div>
        </div>
      </RevealSection>

      {/* Early Access Form */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <LeadCaptureForm
              type="pricing"
              title="JOIN THE EARLY ACCESS LIST"
              description="Be the first to know when we launch. Exclusive early bird pricing for founding members."
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
                  What happens to my saved plans after 3 months?
                </h3>
                <p className="text-stone leading-relaxed">
                  Plans you've marked as "saved" remain accessible forever, even after your pass expires. Other plans show a summary view but full details require an active pass.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Can I upgrade from DIY to Pro?
                </h3>
                <p className="text-stone leading-relaxed">
                  Yes! You can upgrade anytime and pay only the difference. Your expiry date stays the same.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  What's a plan generation credit?
                </h3>
                <p className="text-stone leading-relaxed">
                  Each credit generates one complete planting plan using AI. Plans include plant selection, care instructions, seasonal interest analysis, and supplier recommendations.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Do you work with garden designers?
                </h3>
                <p className="text-stone leading-relaxed">
                  Yes! We partner with professional designers and offer tools that complement their services. Visit our <a href="/designers" className="text-copper hover:text-[#D4A373] transition-colors underline">Designers page</a> to learn more.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  What are care reminders?
                </h3>
                <p className="text-stone leading-relaxed">
                  We send monthly emails with seasonal care tasks for your saved plans—pruning schedules, feeding reminders, and pest watch alerts specific to UK gardens.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Why not a subscription?
                </h3>
                <p className="text-stone leading-relaxed">
                  Gardens aren't monthly. An activation pass gives you focused time to plan, plant, and learn—without the pressure of recurring fees. Your saved plans stay with you permanently.
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
