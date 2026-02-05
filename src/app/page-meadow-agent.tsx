import { Header, Footer, RevealSection } from '@/components/architectural';
import { Sparkles, MessageCircle, Leaf, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { MeadowPhaseTimeline } from '@/components/visuals/MeadowPhaseTimeline';
import { SeasonalProgression } from '@/components/visuals/SeasonalProgression';
import { ManagementCalendar } from '@/components/visuals/ManagementCalendar';

export default function MeadowAgentHomePage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero Section - Agent-First */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-moss/20 border border-moss/30 text-moss text-xs uppercase tracking-widest font-bold rounded-sm">
              Introducing Style-Bound Planting Agents
            </div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider font-bold text-mist">
              Talk To A Planting
              <br />
              <span className="text-copper">Expert</span> Not A Chatbot
            </h1>

            <p className="text-xl md:text-2xl text-stone leading-relaxed max-w-3xl mx-auto">
              Work with a naturalistic meadow expert trained in Dan Pearson's philosophy.
              <br className="hidden md:block" />
              Guided authority. Hard constraints. What will actually work in your garden.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/agents/meadow">
                <button className="px-10 py-5 bg-moss text-dark font-heading text-base uppercase tracking-wider font-bold hover:bg-[#8BA888] transition-colors flex items-center gap-3">
                  <MessageCircle className="h-5 w-5" />
                  Start Conversation →
                </button>
              </Link>
              <Link href="/styles/dan-pearson-meadow">
                <button className="px-10 py-5 bg-concrete/60 border border-white/10 text-mist font-heading text-base uppercase tracking-wider font-bold hover:bg-concrete/80 transition-colors">
                  View Style Details
                </button>
              </Link>
            </div>

            <p className="text-xs text-stone/70 uppercase tracking-wider">
              Free • No signup required • Prototype V1
            </p>
          </div>
        </div>
      </RevealSection>

      {/* What Makes This Different */}
      <RevealSection className="pb-20 bg-concrete/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist text-center mb-12">
              Not Another Generic AI
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-dark/50 border border-moss/30 p-8 text-center">
                <div className="h-12 w-12 bg-moss/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-6 w-6 text-moss" />
                </div>
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-3">
                  Style-Bound
                </h3>
                <p className="text-sm text-stone leading-relaxed">
                  Trained exclusively in Dan Pearson's naturalistic meadow philosophy.
                  Cannot be convinced to blend styles or break rules.
                </p>
              </div>

              <div className="bg-dark/50 border border-copper/30 p-8 text-center">
                <div className="h-12 w-12 bg-copper/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-copper" />
                </div>
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-3">
                  Hard Constraints
                </h3>
                <p className="text-sm text-stone leading-relaxed">
                  Enforces density limits, soil requirements, UK native species only.
                  Pushes back on bad ideas with clear explanations.
                </p>
              </div>

              <div className="bg-dark/50 border border-stone/30 p-8 text-center">
                <div className="h-12 w-12 bg-stone/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-stone" />
                </div>
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-3">
                  Realistic Timelines
                </h3>
                <p className="text-sm text-stone leading-relaxed">
                  Sets proper expectations for 3-year establishment.
                  Explains trade-offs between cost, density, and patience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Visual Education - How Meadows Actually Work */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-4">
                How Meadows Actually Work
              </h2>
              <p className="text-lg text-stone max-w-2xl mx-auto">
                Before you talk to the agent, understand what you're creating.
                Meadows are not instant, but they're worth the patience.
              </p>
            </div>

            {/* Phase Timeline */}
            <RevealSection>
              <MeadowPhaseTimeline />
            </RevealSection>

            {/* Seasonal Progression */}
            <RevealSection>
              <SeasonalProgression />
            </RevealSection>

            {/* Management Calendar */}
            <RevealSection>
              <ManagementCalendar />
            </RevealSection>
          </div>
        </div>
      </RevealSection>

      {/* CTA - Start Conversation */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-moss/20 to-copper/20 border-2 border-moss/40 p-12 text-center">
            <Sparkles className="h-12 w-12 text-moss mx-auto mb-6" />
            <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-4">
              Ready To Create Your Meadow?
            </h2>
            <p className="text-lg text-stone mb-8 leading-relaxed">
              The agent will ask about your site conditions, challenge assumptions,
              and guide you to a plan that will actually work.
            </p>
            <Link href="/agents/meadow">
              <button className="inline-block px-10 py-5 bg-moss text-dark font-heading text-base uppercase tracking-wider font-bold hover:bg-[#8BA888] transition-colors">
                Start Conversation →
              </button>
            </Link>
            <p className="text-xs text-stone/70 mt-4 uppercase tracking-wider">
              Takes 10-15 minutes • Conversational interface • No commitment
            </p>
          </div>
        </div>
      </RevealSection>

      {/* What's Coming Next */}
      <RevealSection className="pb-20 bg-concrete/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-8">
              More Agents Coming
            </h2>
            <p className="text-lg text-stone mb-8 leading-relaxed">
              We're building style-bound experts for different design philosophies.
              Each one constrained by authentic planting rules.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-dark/50 border border-white/10 p-6 opacity-60">
                <div className="mb-3">
                  <span className="px-3 py-1 bg-stone/20 border border-stone/30 text-stone text-xs uppercase tracking-wider rounded-sm">
                    Coming Soon
                  </span>
                </div>
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-2">
                  Piet Oudolf Prairie Agent
                </h3>
                <p className="text-sm text-stone">
                  Structure-first perennial design with winter interest and architectural form.
                </p>
              </div>

              <div className="bg-dark/50 border border-white/10 p-6 opacity-60">
                <div className="mb-3">
                  <span className="px-3 py-1 bg-stone/20 border border-stone/30 text-stone text-xs uppercase tracking-wider rounded-sm">
                    Coming Soon
                  </span>
                </div>
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-2">
                  Chelsea Wildlife Garden Agent
                </h3>
                <p className="text-sm text-stone">
                  Maximum biodiversity with layered habitats and year-round ecological value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Prototype Notice */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto bg-copper/10 border border-copper/30 p-8 text-center">
            <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-3 font-bold">
              This Is A Prototype
            </h3>
            <p className="text-sm text-stone leading-relaxed">
              Style-bound agents are a new concept. This is V1 of our Dan Pearson Meadow expert.
              We're testing whether constrained AI can deliver better planting advice than
              generic chatbots. Your feedback shapes what comes next.
            </p>
          </div>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}
