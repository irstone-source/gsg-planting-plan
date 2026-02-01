import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Header, Footer } from '@/components/architectural';
import { MapPin, Sun, Droplets, Leaf, AlertCircle, Lightbulb, Download, ArrowLeft, Calendar } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch plan with site analysis and recommendations
  const { data: plan, error } = await supabase
    .from('planting_plans')
    .select(`
      *,
      site_analyses (*),
      plant_recommendations (
        *,
        plants (
          *,
          generated_image_url
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !plan) {
    notFound();
  }

  const siteAnalysis = plan.site_analyses;
  const visionData = siteAnalysis.vision_analysis;
  const recommendations = plan.plant_recommendations || [];

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero Section */}
      <div className="bg-moss/10 border-b border-white/5">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-stone hover:text-copper transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Create Another Plan
            </Link>

            <h1 className="font-heading text-4xl md:text-6xl uppercase tracking-wider font-bold text-mist mb-4">
              Your Planting Plan
            </h1>

            <div className="flex items-center gap-6 text-sm uppercase tracking-wider">
              <span className={`px-3 py-1 ${
                plan.status === 'completed'
                  ? 'bg-copper text-dark'
                  : 'bg-concrete border border-white/10 text-stone'
              }`}>
                {plan.status}
              </span>
              <div className="flex items-center gap-2 text-stone">
                <Calendar className="h-4 w-4" />
                {new Date(plan.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Location & Climate */}
          <section className="bg-concrete/40 border border-white/5 p-8">
            <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location & Climate
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone mb-2">Postcode</p>
                <p className="font-heading text-2xl text-mist uppercase">{siteAnalysis.postcode}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-stone mb-2">RHS Hardiness Zone</p>
                <p className="font-heading text-2xl text-mist">{siteAnalysis.rhs_zone}</p>
              </div>
            </div>
          </section>

          {/* Site Conditions */}
          <section className="bg-concrete/40 border border-white/5 p-8">
            <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-2">
              Site Conditions
            </h2>
            <p className="text-xs uppercase tracking-wider text-stone mb-6">
              Based on your input and photo analysis
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-copper">
                  <Sun className="h-5 w-5" />
                  <span className="font-heading text-xs uppercase tracking-wider">Sun Exposure</span>
                </div>
                <p className="text-mist capitalize leading-relaxed">
                  {visionData?.sunExposure?.assessment?.replace('_', ' ') || siteAnalysis.sun_exposure}
                </p>
                {visionData?.sunExposure?.confidence && (
                  <p className="text-xs text-stone">
                    Confidence: {visionData.sunExposure.confidence}%
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-copper">
                  <Droplets className="h-5 w-5" />
                  <span className="font-heading text-xs uppercase tracking-wider">Moisture</span>
                </div>
                <p className="text-mist capitalize leading-relaxed">{siteAnalysis.moisture}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-copper">
                  <Leaf className="h-5 w-5" />
                  <span className="font-heading text-xs uppercase tracking-wider">Soil Type</span>
                </div>
                <p className="text-mist capitalize leading-relaxed">{siteAnalysis.soil_type}</p>
              </div>
            </div>
          </section>

          {/* Vision Analysis - Challenges */}
          {visionData?.challenges && visionData.challenges.length > 0 && (
            <section className="bg-moss/10 border border-moss/30 p-8">
              <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Site Challenges
              </h2>
              <p className="text-xs uppercase tracking-wider text-stone mb-6">
                Considerations identified from your site photos
              </p>
              <ul className="space-y-3">
                {visionData.challenges.map((challenge: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-stone leading-relaxed">
                    <span className="text-copper mt-1">—</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Vision Analysis - Opportunities */}
          {visionData?.opportunities && visionData.opportunities.length > 0 && (
            <section className="bg-concrete/40 border border-white/5 p-8">
              <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Design Opportunities
              </h2>
              <p className="text-xs uppercase tracking-wider text-stone mb-6">
                Positive features to leverage in your planting design
              </p>
              <ul className="space-y-3">
                {visionData.opportunities.map((opportunity: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-stone leading-relaxed">
                    <span className="text-copper mt-1">—</span>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Overall Assessment */}
          {visionData?.overallAssessment && (
            <section className="bg-concrete/40 border border-white/5 p-8">
              <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-6">
                Site Assessment
              </h2>
              <p className="text-stone leading-relaxed">
                {visionData.overallAssessment}
              </p>
            </section>
          )}

          {/* Design Rationale */}
          {plan.design_rationale && (
            <section className="bg-concrete/40 border border-white/5 p-8">
              <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-6">
                Design Rationale
              </h2>
              <p className="text-stone leading-relaxed">{plan.design_rationale}</p>
            </section>
          )}

          {/* Your Preferences */}
          <section className="bg-concrete/40 border border-white/5 p-8">
            <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-6">
              Your Preferences
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone mb-2">Garden Style</p>
                <p className="text-mist capitalize">{plan.style.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-stone mb-2">Maintenance Level</p>
                <p className="text-mist capitalize">{plan.maintenance_level}</p>
              </div>
              {plan.budget_min && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone mb-2">Budget Range</p>
                  <p className="text-mist">
                    £{plan.budget_min} - £{plan.budget_max || 'flexible'}
                  </p>
                </div>
              )}
              {plan.special_requirements && (
                <div className="md:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-stone mb-2">Special Requirements</p>
                  <p className="text-mist leading-relaxed">{plan.special_requirements}</p>
                </div>
              )}
            </div>
          </section>

          <div className="h-px bg-white/10" />

          {/* Plant Recommendations */}
          {recommendations.length > 0 ? (
            <>
              {/* Summary Stats */}
              <section className="bg-moss/10 border border-moss/30 p-8">
                <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-6">
                  Plant Recommendations Summary
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-2">Total Plants</p>
                    <p className="font-heading text-4xl text-mist">
                      {recommendations.reduce((sum: number, r: any) => sum + r.quantity, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-2">Total Cost</p>
                    <p className="font-heading text-4xl text-mist">
                      £{plan.total_cost?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-2">Plant Varieties</p>
                    <p className="font-heading text-4xl text-mist">
                      {recommendations.length}
                    </p>
                  </div>
                </div>
              </section>

              {/* Plant List by Category */}
              {['TREE', 'SHRUB', 'HERBACEOUS', 'CLIMBER', 'GRASS', 'BAMBOO', 'FERN', 'CONIFER'].map(category => {
                const categoryPlants = recommendations.filter((r: any) => r.plants?.category === category);
                if (categoryPlants.length === 0) return null;

                return (
                  <section key={category} className="bg-concrete/40 border border-white/5 p-8">
                    <h2 className="font-heading text-lg uppercase tracking-wider text-copper mb-6">
                      {category.toLowerCase()}s
                    </h2>
                    <div className="space-y-6">
                      {categoryPlants.map((rec: any, idx: number) => (
                        <div key={idx} className="flex gap-6 border-l-2 border-copper/30 pl-6 pb-6">
                          {/* Plant Image */}
                          {rec.plants?.generated_image_url && (
                            <div className="flex-shrink-0">
                              <div className="w-32 h-32 rounded-sm overflow-hidden border border-white/10 bg-mist/5">
                                <img
                                  src={rec.plants.generated_image_url}
                                  alt={`${rec.plants.botanical_name} botanical illustration`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}

                          {/* Plant Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <h3 className="font-heading text-lg text-mist italic mb-1">
                                  {rec.plants?.botanical_name}
                                </h3>
                                {rec.plants?.common_name && (
                                  <p className="text-sm text-copper uppercase tracking-wider">
                                    {rec.plants.common_name}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-heading text-copper text-xl">
                                  × {rec.quantity}
                                </p>
                                <p className="text-xs uppercase tracking-wider text-stone">
                                  {rec.plants?.size}
                                </p>
                              </div>
                            </div>

                            {rec.position && (
                              <div>
                                <span className="text-xs uppercase tracking-wider text-copper">Position: </span>
                                <span className="text-stone text-sm">{rec.position}</span>
                              </div>
                            )}

                            {rec.rationale && (
                              <p className="text-stone text-sm leading-relaxed">
                                {rec.rationale}
                              </p>
                            )}

                            {rec.plants?.is_peat_free && (
                              <span className="inline-block px-2 py-1 bg-moss/20 border border-moss/40 text-xs uppercase tracking-wider text-stone">
                                Peat-free
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </>
          ) : (
            <section className="bg-moss/10 border border-moss/30 p-8">
              <h2 className="font-heading text-sm uppercase tracking-wider text-copper mb-4">
                Plant Recommendations
              </h2>
              <p className="text-stone leading-relaxed mb-4">
                Plant recommendations are being generated based on your site conditions, preferences,
                and available stock from UK nurseries.
              </p>
              <p className="text-xs uppercase tracking-wider text-stone">
                This may take a few moments. Please refresh the page to see the results.
              </p>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {recommendations.length > 0 ? (
              <a
                href={`/api/generate-pdf?planId=${id}`}
                download
                className="px-8 py-3 bg-copper text-dark font-heading text-sm uppercase tracking-widest hover:bg-[#D4A373] transition-colors duration-300 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            ) : (
              <button
                disabled
                className="px-8 py-3 bg-concrete border border-white/10 text-stone/50 font-heading text-sm uppercase tracking-widest cursor-not-allowed flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                PDF (Generating...)
              </button>
            )}

            <Link
              href="/"
              className="px-8 py-3 bg-dark/50 border border-white/10 text-stone font-heading text-sm uppercase tracking-widest hover:border-copper hover:text-copper transition-all duration-300"
            >
              Create New Plan
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
