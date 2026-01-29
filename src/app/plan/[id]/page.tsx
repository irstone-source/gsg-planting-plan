import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sprout, MapPin, Sun, Droplets, TreePine, AlertCircle, Lightbulb, Download, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch plan with site analysis
  const { data: plan, error } = await supabase
    .from('planting_plans')
    .select(`
      *,
      site_analyses (*)
    `)
    .eq('id', id)
    .single();

  if (error || !plan) {
    notFound();
  }

  const siteAnalysis = plan.site_analyses;
  const visionData = siteAnalysis.vision_analysis;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-900">GSG Planting Plan Generator</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Back Button */}
          <Link href="/create">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create Another Plan
            </Button>
          </Link>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-green-900">Your Planting Plan</h1>
            <div className="flex items-center gap-4">
              <Badge variant={plan.status === 'completed' ? 'default' : 'secondary'}>
                {plan.status}
              </Badge>
              <span className="text-gray-600">
                Created {new Date(plan.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Location Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Location & Climate
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Postcode</p>
                <p className="font-semibold text-lg">{siteAnalysis.postcode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">RHS Hardiness Zone</p>
                <p className="font-semibold text-lg">{siteAnalysis.rhs_zone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Site Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Site Conditions</CardTitle>
              <CardDescription>Based on your input and photo analysis</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Sun Exposure</span>
                </div>
                <p className="text-gray-700 capitalize">
                  {visionData?.sunExposure?.assessment?.replace('_', ' ') || siteAnalysis.sun_exposure}
                </p>
                {visionData?.sunExposure?.confidence && (
                  <p className="text-sm text-gray-600">
                    Confidence: {visionData.sunExposure.confidence}%
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Moisture</span>
                </div>
                <p className="text-gray-700 capitalize">{siteAnalysis.moisture}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">Soil Type</span>
                </div>
                <p className="text-gray-700 capitalize">{siteAnalysis.soil_type}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vision Analysis Details */}
          {visionData && (
            <>
              {/* Challenges */}
              {visionData.challenges && visionData.challenges.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Site Challenges
                    </CardTitle>
                    <CardDescription>
                      Considerations identified from your site photos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {visionData.challenges.map((challenge: string, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-orange-600 mt-1">•</span>
                          <span className="text-gray-700">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Opportunities */}
              {visionData.opportunities && visionData.opportunities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-600" />
                      Design Opportunities
                    </CardTitle>
                    <CardDescription>
                      Positive features to leverage in your planting design
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {visionData.opportunities.map((opportunity: string, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-gray-700">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Overall Assessment */}
              {visionData.overallAssessment && (
                <Card>
                  <CardHeader>
                    <CardTitle>Site Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {visionData.overallAssessment}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Design Rationale */}
          {plan.design_rationale && (
            <Card>
              <CardHeader>
                <CardTitle>Design Rationale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{plan.design_rationale}</p>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Your Preferences</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Garden Style</p>
                <p className="font-semibold capitalize">{plan.style.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Maintenance Level</p>
                <p className="font-semibold capitalize">{plan.maintenance_level}</p>
              </div>
              {plan.budget_min && (
                <div>
                  <p className="text-sm text-gray-600">Budget Range</p>
                  <p className="font-semibold">
                    £{plan.budget_min} - £{plan.budget_max || 'flexible'}
                  </p>
                </div>
              )}
              {plan.special_requirements && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Special Requirements</p>
                  <p className="font-semibold">{plan.special_requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Plant Recommendations Placeholder */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle>Plant Recommendations</CardTitle>
              <CardDescription>Coming in Day 3</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Plant recommendations will be generated based on your site conditions, preferences,
                and available stock from UK nurseries.
              </p>
              <p className="text-sm text-gray-600">
                This will include specific plants, quantities, positioning advice, and cost estimates.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button disabled variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF (Coming in Day 4)
            </Button>
            <Link href="/create">
              <Button variant="outline">Create New Plan</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
