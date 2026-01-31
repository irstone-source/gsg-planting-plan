import { Header, Footer, ArchitecturalCard, RevealSection } from '@/components/architectural';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

export const metadata = {
  title: 'Affiliate Program | PlantingPlans',
  description: 'Join PlantingPlans Founding Creator Program. 30% commission for first 30 days, then 20% standard. Share professional planting plans with your audience.'
};

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              FOUNDING CREATOR PROGRAM
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-2xl mx-auto">
              Earn commission by sharing professional planting plans with your audience. 30% rate for founding creators, 20% standard.
            </p>
            <p className="text-sm uppercase tracking-widest text-copper">
              For content creators, bloggers, and influencers
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Commission Highlight */}
      <RevealSection className="py-20 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-concrete/60 backdrop-blur-md border border-white/5 p-12 text-center">
            <div className="mb-8">
              <span className="font-heading text-7xl md:text-8xl font-bold text-copper block mb-4">
                30%
              </span>
              <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-4">
                FOUNDING CREATOR RATE
              </h2>
              <p className="text-lg text-stone max-w-2xl mx-auto leading-relaxed">
                First 30 days after approval: earn 30% commission on all referrals. After that, 20% standard rate for life.
              </p>
            </div>

            <div className="border-t border-white/10 pt-8 mt-8">
              <p className="text-sm uppercase tracking-widest text-stone mb-4">
                Earning Examples
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-dark/50 p-6 border border-white/5">
                  <p className="text-xs uppercase tracking-wider text-copper mb-2">DIY Pass (£79)</p>
                  <p className="text-2xl font-bold text-mist mb-1">£23.70</p>
                  <p className="text-xs text-stone">per referral @ 30%</p>
                </div>
                <div className="bg-dark/50 p-6 border border-white/5">
                  <p className="text-xs uppercase tracking-wider text-copper mb-2">Pro Pass (£249)</p>
                  <p className="text-2xl font-bold text-mist mb-1">£74.70</p>
                  <p className="text-xs text-stone">per referral @ 30%</p>
                </div>
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
              HOW IT WORKS
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
                    Apply to Join
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Fill out the application with your audience size, channels, and content focus. Most applications approved within 24 hours. We look for authentic creators in home/garden/lifestyle space.
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
                    Get Your Affiliate Code
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Receive unique referral code (e.g., SARAH30) and affiliate link. Access dashboard to track clicks, conversions, and earnings. Marketing assets and swipe copy provided.
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
                    Share & Earn
                  </h3>
                  <p className="text-stone leading-relaxed">
                    Share your affiliate link in videos, blog posts, newsletters, or social media. 30-day cookie window. Earn 30% commission for first 30 days, then 20% for life. Monthly payouts via Stripe.
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
              WHY JOIN NOW
            </h2>
            <p className="text-stone text-lg">
              Founding creators get premium benefits and early access to new features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ArchitecturalCard
              title="PREMIUM COMMISSION"
              description="30% commission rate for your first 30 days as founding creator. Then 20% standard rate for life. No caps, no tiers, no minimums."
              delay={0}
            />
            <ArchitecturalCard
              title="HIGH CONVERSION"
              description="Solves real pain point for UK homeowners. Professional planting plans at DIY prices. Activation pass model (not subscription) converts well."
              delay={0.1}
            />
            <ArchitecturalCard
              title="MARKETING SUPPORT"
              description="Complete asset library: banners, swipe copy, plant images, example plans. Dedicated affiliate newsletter with conversion tips."
              delay={0.2}
            />
            <ArchitecturalCard
              title="REAL-TIME TRACKING"
              description="Dashboard shows clicks, conversions, earnings, and attribution. 30-day cookie window. Last-click attribution. Export reports anytime."
              delay={0.3}
            />
          </div>
        </div>
      </RevealSection>

      {/* Who This Is For */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-center mb-16">
              PERFECT FOR
            </h2>

            <div className="space-y-8">
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Gardening Content Creators
                </h3>
                <p className="text-stone leading-relaxed">
                  YouTubers, bloggers, and podcasters covering gardening, plants, or landscape design. Your audience is already looking for planting guidance.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Home & Lifestyle Influencers
                </h3>
                <p className="text-stone leading-relaxed">
                  Instagram creators, TikTok accounts, or Pinterest influencers in home improvement, DIY, or outdoor living. Natural fit for your aesthetic audience.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Niche Communities
                </h3>
                <p className="text-stone leading-relaxed">
                  Facebook groups, Subreddits, Discord servers, or email lists focused on UK gardening, homeownership, or sustainability. Share value with your community and earn commission.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Complementary Businesses
                </h3>
                <p className="text-stone leading-relaxed">
                  Garden coaches, horticultural consultants, or sustainable living educators. Offer PlantingPlans as a resource and earn affiliate income.
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
                APPLY TO JOIN
              </h2>
              <p className="text-stone text-lg">
                Join as a founding creator and lock in 30% commission for your first 30 days.
              </p>
            </div>

            <LeadCaptureForm
              type="affiliate"
              title="FOUNDING CREATOR APPLICATION"
              description="Tell us about your audience and how you plan to share PlantingPlans. Most applications approved within 24 hours."
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
                  How long is the founding creator rate?
                </h3>
                <p className="text-stone leading-relaxed">
                  30 days from approval. You earn 30% commission on all referrals during this period. After 30 days, you move to the standard 20% rate for life.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  What's the cookie window?
                </h3>
                <p className="text-stone leading-relaxed">
                  30 days. If someone clicks your link and purchases within 30 days, you get commission. Last-click attribution (if multiple affiliate links clicked, last one wins).
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  When do I get paid?
                </h3>
                <p className="text-stone leading-relaxed">
                  Monthly payouts via Stripe on the 1st of each month. Minimum £50 balance required for payout (rolls over to next month if under). No setup fees or transaction charges.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Do I need a certain audience size?
                </h3>
                <p className="text-stone leading-relaxed">
                  No minimum followers required. We care more about engagement and audience fit than size. Active community of 500+ engaged followers beats 50K inactive ones.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  Can I promote if I'm also a customer?
                </h3>
                <p className="text-stone leading-relaxed">
                  Absolutely. Best affiliates are active users. Share your own experience with PlantingPlans. Just disclose affiliate relationship per FTC/ASA guidelines.
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                  What marketing materials do you provide?
                </h3>
                <p className="text-stone leading-relaxed">
                  Complete asset library: banners (all sizes), swipe copy for emails/posts, plant images, example plan screenshots, and conversion-optimized landing pages. Updated monthly with new assets.
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
