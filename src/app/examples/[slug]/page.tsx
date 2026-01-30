import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { examplePlansExpanded } from '@/data/example-plans-expanded';
import { PlantImageViewer } from '@/components/PlantImageViewer';
import {
  ArrowLeft, MapPin, Sun, Droplets, TreePine, Calendar,
  PoundSterling, Leaf, Sprout, AlertCircle, Lightbulb,
  CheckCircle2, Download, Share2, RefreshCw, Lock, ExternalLink, Image as ImageIcon
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return examplePlansExpanded.map((plan) => ({
    slug: plan.slug,
  }));
}

export default async function ExamplePlanPage({ params }: PageProps) {
  const { slug } = await params;
  const plan = examplePlansExpanded.find(p => p.slug === slug);

  if (!plan) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-900">GSG Planting Plan Generator</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Examples
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src={plan.heroImage}
          alt={plan.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto max-w-5xl">
            <div className="flex gap-3 mb-4">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                {plan.rhsZone}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                {plan.tags.feeling[0]}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                {plan.tags.effort}
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-3">{plan.title}</h1>
            <p className="text-xl text-green-50 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {plan.region} • {plan.postcode}
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Snapshot Bar */}
      <div className="sticky top-[73px] z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Area</p>
                <p className="font-semibold">{plan.area}m²</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Maintenance</p>
                <p className="font-semibold">{plan.tags.effort}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PoundSterling className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Budget</p>
                <p className="font-semibold">{plan.budget}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Plants</p>
                <p className="font-semibold">{plan.totalPlants}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Best for</p>
                <p className="font-semibold text-xs">{plan.tags.useCase[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-12">

          {/* Overview */}
          <section>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {plan.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {plan.tags.place.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
              {plan.tags.gardenType.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
              {plan.tags.feeling.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
              {plan.tags.useCase.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
              {plan.tags.constraint.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </section>

          <Separator />

          {/* Site Analysis */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Site Analysis</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <Sun className="h-8 w-8 text-yellow-500 mb-2" />
                  <CardTitle className="text-lg">Sun Exposure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{plan.siteAnalysis.sun}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TreePine className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Soil Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{plan.siteAnalysis.soil}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                  <CardTitle className="text-lg">Moisture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{plan.siteAnalysis.moisture}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Site Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.siteAnalysis.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-orange-600 mt-1">•</span>
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    Design Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.siteAnalysis.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700">{opp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Design Concept */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Design Concept</h2>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {plan.designConcept}
                </p>
                <div className="space-y-3">
                  <p className="font-semibold text-green-900 mb-2">Key Features:</p>
                  {plan.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{highlight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Planting Palette with Plant Images */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Planting Palette</h2>
            <p className="text-gray-600 mb-4">
              Layered planting creates year-round structure and seasonal interest
            </p>

            {/* Plant Swap Feature Notice */}
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-purple-900 mb-2">Plant Customization Available</p>
                    <p className="text-sm text-purple-800 mb-3">
                      Don't like a plant recommendation? Swap it for an alternative that suits your site conditions and style preferences.
                    </p>
                    <div className="flex flex-wrap gap-3 items-center">
                      <Badge variant="secondary" className="bg-white text-purple-900">
                        <Lock className="h-3 w-3 mr-1" />
                        Basic Plan: 3 swaps included
                      </Badge>
                      <Badge variant="secondary" className="bg-white text-purple-900">
                        Premium Plan: Unlimited swaps
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-300 text-purple-900 hover:bg-purple-100"
                        disabled
                      >
                        Upgrade Plan (Coming Soon)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {/* Structure Layer */}
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <TreePine className="h-6 w-6" />
                  Structure Layer (Trees & Shrubs)
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Provides framework and year-round presence
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="overflow-hidden">
                    <PlantImageViewer
                      scientificName="Betula pendula"
                      commonName="Silver Birch"
                      badgeColor="bg-green-600 text-white"
                      badgeText="Structure"
                      wikiImage="Betula_pendula_m1.JPG"
                    />
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Betula pendula</h4>
                      <p className="text-sm text-gray-600 mb-2">Silver Birch</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Elegant native tree with white bark and delicate foliage. Provides height and structure.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2 w-full"
                        disabled
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Swap Plant (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <PlantImageViewer
                      scientificName="Viburnum tinus"
                      commonName="Laurustinus"
                      badgeColor="bg-green-600 text-white"
                      badgeText="Evergreen"
                      wikiImage="Viburnum_tinus.JPG"
                    />
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Viburnum tinus</h4>
                      <p className="text-sm text-gray-600 mb-2">Laurustinus</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Evergreen shrub with white winter flowers. Provides year-round screening and structure.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2 w-full"
                        disabled
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Swap Plant (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <PlantImageViewer
                      scientificName="Fargesia murielae"
                      commonName="Umbrella Bamboo"
                      badgeColor="bg-green-600 text-white"
                      badgeText="Evergreen"
                      wikiImage="Fargesia-murielae.JPG"
                    />
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Fargesia murielae</h4>
                      <p className="text-sm text-gray-600 mb-2">Umbrella Bamboo</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Non-invasive clumping bamboo. Provides instant height and gentle movement.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2 w-full"
                        disabled
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Swap Plant (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Seasonal Layer */}
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Sprout className="h-6 w-6" />
                  Seasonal Layer (Perennials)
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Flowers and foliage through the seasons
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden">
                    <PlantImageViewer
                      scientificName="Geranium 'Rozanne'"
                      commonName="Rozanne Cranesbill"
                      badgeColor="bg-blue-600 text-white"
                      badgeText="Long-flowering"
                      wikiImage="Geranium_'Rozanne'.JPG"
                    />
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Geranium 'Rozanne'</h4>
                      <p className="text-sm text-gray-600 mb-2">Rozanne Cranesbill</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Award-winning perennial with blue flowers from June-November. Low maintenance and reliable.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2 w-full"
                        disabled
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Swap Plant (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <PlantImageViewer
                      scientificName="Alchemilla mollis"
                      commonName="Lady's Mantle"
                      badgeColor="bg-blue-600 text-white"
                      badgeText="Foliage"
                      wikiImage="Alchemilla_mollis_Lady's_Mantle_MN_2007.JPG"
                    />
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Alchemilla mollis</h4>
                      <p className="text-sm text-gray-600 mb-2">Lady's Mantle</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Soft chartreuse flowers and beautiful foliage. Perfect edge softener and incredibly tough.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2 w-full"
                        disabled
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Swap Plant (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Ground Cover Layer */}
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Leaf className="h-6 w-6" />
                  Ground Cover Layer
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Suppresses weeds and completes the layers
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden">
                    <PlantImageViewer
                      scientificName="Dryopteris filix-mas"
                      commonName="Male Fern"
                      badgeColor="bg-emerald-600 text-white"
                      badgeText="Shade-tolerant"
                      wikiImage="Dryopteris_filix-mas_001.jpg"
                    />
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Dryopteris filix-mas</h4>
                      <p className="text-sm text-gray-600 mb-2">Male Fern</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Lush deciduous fern for shaded areas. Adds texture and architectural interest with minimal care.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2 w-full"
                        disabled
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Swap Plant (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <PlantImageViewer
                      scientificName="Ajuga reptans"
                      commonName="Bugle"
                      badgeColor="bg-emerald-600 text-white"
                      badgeText="Ground cover"
                      wikiImage="Ajuga_reptans_-_Bugle_rampante.JPG"
                    />
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Ajuga reptans</h4>
                      <p className="text-sm text-gray-600 mb-2">Bugle</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Mat-forming ground cover with blue spring flowers. Suppresses weeds effectively.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2 w-full"
                        disabled
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Swap Plant (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 mb-3">
                      <strong>These are indicative images.</strong> Actual plant appearance varies by season,
                      maturity, and growing conditions. Always confirm size, condition, and specific variety
                      upon ordering from your chosen supplier.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-blue-50 border-blue-300 text-blue-900"
                      disabled
                    >
                      <Download className="mr-2 h-4 w-4" />
                      View Full Purchasing Guide & Checklist
                    </Button>
                    <p className="text-xs text-blue-800 mt-2">
                      Professional horticultural guidance on sourcing, sizing, and quality checks customized to your plan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Care Plan Preview */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Care Plan Preview</h2>
            <p className="text-gray-600 mb-6">
              Understanding the time commitment and techniques required to keep your planting looking its best
            </p>

            {/* Annual Care Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Annual Care Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-700 mb-2">12-18 hours</p>
                  <p className="text-sm text-gray-600">
                    Spread across the year in simple seasonal tasks
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Homeowner Friendly</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-blue-900 mb-2">Yes, achievable</p>
                  <p className="text-sm text-gray-600">
                    Suitable for someone with good health and mobility. No specialized equipment required.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <PoundSterling className="h-8 w-8 text-amber-600 mb-2" />
                  <CardTitle className="text-lg">Professional Care Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-amber-700 mb-2">£350-550</p>
                  <p className="text-sm text-gray-600">
                    Per year for professional gardener maintenance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Care by Species */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">Care Requirements by Species</h3>

              {/* Structure Layer Care */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900">Structure Layer (Trees & Shrubs)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Betula pendula */}
                    <div className="pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">Betula pendula (Silver Birch)</h4>
                          <p className="text-sm text-gray-600">Annual care time: 1-2 hours</p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/betula/pendula/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Techniques Required:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Light formative pruning in late summer (once established)</li>
                            <li>• Remove dead or damaged branches</li>
                            <li>• No regular pruning needed</li>
                            <li>• Minimal watering after establishment (1-2 years)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Homeowner Notes:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Very low maintenance once established</li>
                            <li>• May need stepladder for pruning mature trees</li>
                            <li>• No specialist skills required</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Viburnum tinus */}
                    <div className="pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">Viburnum tinus (Laurustinus)</h4>
                          <p className="text-sm text-gray-600">Annual care time: 2-3 hours</p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/viburnum/tinus/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Techniques Required:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Light trim after flowering (spring)</li>
                            <li>• Remove any frost-damaged shoots</li>
                            <li>• Shape maintenance if used for screening</li>
                            <li>• Water during dry spells in first 2 years</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Homeowner Notes:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Simple hand pruning with secateurs</li>
                            <li>• Very forgiving and tough</li>
                            <li>• Suitable for beginners</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Fargesia murielae */}
                    <div className="pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">Fargesia murielae (Umbrella Bamboo)</h4>
                          <p className="text-sm text-gray-600">Annual care time: 1-2 hours</p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/7049/fargesia-murielae/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Techniques Required:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Remove dead canes at base in spring</li>
                            <li>• Thin out oldest canes every 2-3 years</li>
                            <li>• Water well during dry periods</li>
                            <li>• Mulch annually to retain moisture</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Homeowner Notes:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Non-invasive clumping type (no spreading)</li>
                            <li>• Minimal intervention needed</li>
                            <li>• Simple cutting with loppers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seasonal Layer Care */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900">Seasonal Layer (Perennials)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Geranium Rozanne */}
                    <div className="pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">Geranium 'Rozanne'</h4>
                          <p className="text-sm text-gray-600">Annual care time: 1 hour</p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/geranium/rozanne/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Techniques Required:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Cut back to ground level in late autumn</li>
                            <li>• Optional: deadhead to prolong flowering</li>
                            <li>• Water during establishment only</li>
                            <li>• No feeding required once established</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Homeowner Notes:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Exceptionally low maintenance</li>
                            <li>• RHS Award of Garden Merit winner</li>
                            <li>• Perfect for beginners</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Alchemilla mollis */}
                    <div className="pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">Alchemilla mollis (Lady's Mantle)</h4>
                          <p className="text-sm text-gray-600">Annual care time: 1 hour</p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/alchemilla/mollis/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Techniques Required:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Cut back foliage after flowering (July)</li>
                            <li>• Remove spent flowers to prevent self-seeding</li>
                            <li>• No watering needed once established</li>
                            <li>• Incredibly drought-tolerant</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Homeowner Notes:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• One of the easiest perennials to grow</li>
                            <li>• Tolerates virtually any conditions</li>
                            <li>• No specialist knowledge needed</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ground Cover Layer Care */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-900">Ground Cover Layer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Dryopteris filix-mas */}
                    <div className="pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">Dryopteris filix-mas (Male Fern)</h4>
                          <p className="text-sm text-gray-600">Annual care time: 30 minutes</p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/6061/dryopteris-filix-mas/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Techniques Required:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Remove dead fronds in early spring</li>
                            <li>• Apply mulch annually to retain moisture</li>
                            <li>• Water during very dry spells</li>
                            <li>• No pruning or feeding required</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Homeowner Notes:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Minimal care required</li>
                            <li>• Perfect for neglected shady areas</li>
                            <li>• Extremely low maintenance</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Ajuga reptans */}
                    <div className="pb-6 border-b last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">Ajuga reptans (Bugle)</h4>
                          <p className="text-sm text-gray-600">Annual care time: 30 minutes</p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/ajuga/reptans/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Techniques Required:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Trim back after flowering if needed</li>
                            <li>• Remove any spreading growth from paths</li>
                            <li>• No regular maintenance required</li>
                            <li>• Self-sufficient once established</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Homeowner Notes:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Almost zero maintenance</li>
                            <li>• Excellent weed suppressor</li>
                            <li>• Thrives on neglect</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Professional Care Option */}
            <Card className="mt-6 bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Professional Gardener Cost Breakdown:</strong> The estimated annual cost of
                      £350-550 assumes 3-4 seasonal visits (spring tidy, summer maintenance, autumn cutback,
                      winter check) at £100-150 per visit for a garden of this size. Costs vary by region
                      and specific contractor rates.
                    </p>
                    <p className="text-xs text-gray-600">
                      Your custom plan includes a detailed care calendar with month-by-month tasks and estimated
                      time requirements to help you plan whether to maintain the garden yourself or budget for
                      professional help.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Seasonal Color Palette */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Seasonal Color Palette</h2>
            <p className="text-gray-600 mb-6">
              Understanding the colors and visual interest your garden will display throughout the year
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Spring */}
              <Card className="bg-gradient-to-br from-pink-50 to-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Sprout className="h-6 w-6 text-pink-500" />
                    Spring (March-May)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#F8BBD0'}} title="Viburnum pink-white" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_04.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_DT1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#5C6BC0'}} title="Ajuga blue" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_-_Bugle_rampante.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_003.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_flowers.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#AED581'}} title="Fresh lime green" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_001.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_Fiddleheads_3648px.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_m1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Viburnum tinus:</strong> White-pink flowers in clusters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Ajuga reptans:</strong> Blue flower spikes emerge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-lime-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Ferns unfurling:</strong> Fresh lime-green fronds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Betula pendula:</strong> Delicate bright green catkins and leaves</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Summer */}
              <Card className="bg-gradient-to-br from-blue-50 to-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Sun className="h-6 w-6 text-yellow-500" />
                    Summer (June-August)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#4A90E2'}} title="Geranium blue" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Geranium_'Rozanne'.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Geranium_Rozanne_6zz.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Geranium_hybride_'Rozanne'_bloemen.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#C5E1A5'}} title="Alchemilla chartreuse" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Alchemilla_mollis_Lady's_Mantle_MN_2007.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Alchemilla_mollis_inflorescence_001.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Alchemilla_mollis_flowers.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#2E7D32'}} title="Deep green foliage" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Fargesia-murielae.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_001.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Geranium 'Rozanne':</strong> Continuous blue flowers (peak season)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Alchemilla mollis:</strong> Frothy lime-yellow flowers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Fargesia bamboo:</strong> Lush green architectural foliage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Ferns:</strong> Peak lushness with deep green fronds</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Autumn */}
              <Card className="bg-gradient-to-br from-amber-50 to-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Leaf className="h-6 w-6 text-amber-600" />
                    Autumn (September-November)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#FFD54F'}} title="Golden birch leaves" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_m1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_autumn.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_003.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#A67C52'}} title="Bronze ferns" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_001.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_autumn.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_LC0226.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#6A1B9A'}} title="Purple-bronze Ajuga" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_-_Bugle_rampante.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_'Atropurpurea'.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_leaves.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Betula pendula:</strong> Golden yellow autumn foliage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Geranium 'Rozanne':</strong> Still flowering until first frost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Ferns:</strong> Bronze and copper tones before dormancy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Ajuga reptans:</strong> Purple-bronze foliage intensifies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Winter */}
              <Card className="bg-gradient-to-br from-slate-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <TreePine className="h-6 w-6 text-slate-600" />
                    Winter (December-February)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md border border-gray-200" style={{backgroundColor: '#F5F5F5'}} title="White birch bark" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_bark.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_m1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_003.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#2D5016'}} title="Deep evergreen" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Fargesia-murielae.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_leaves.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#F8BBD0'}} title="Pink winter blooms" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_04.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_DT1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_flowers.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#6A1B9A'}} title="Purple foliage" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_'Atropurpurea'.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_-_Bugle_rampante.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_leaves.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Betula pendula:</strong> Stunning white bark stands out against winter sky</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
                      <span><strong>Viburnum tinus:</strong> Evergreen structure with winter blooms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Fargesia bamboo:</strong> Year-round green foliage and elegant stems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-700 mt-0.5 flex-shrink-0" />
                      <span><strong>Ajuga reptans:</strong> Purple-tinged foliage adds winter color</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-900 mb-2">
                      <strong>Year-Round Interest:</strong> This planting scheme ensures something of interest in every season.
                    </p>
                    <p className="text-xs text-green-800">
                      The evergreen structure plants (Viburnum, Bamboo, Ajuga) provide consistent presence, while deciduous plants
                      (Birch, Ferns) offer dramatic seasonal change. Long-flowering perennials bridge the gap between spring and autumn.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Shopping List Preview */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Shopping List Preview</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Total Plants</span>
                    <span className="text-2xl font-bold text-green-700">{plan.totalPlants}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Estimated Cost</span>
                    <span className="text-2xl font-bold text-green-700">£{plan.totalCost.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">
                  Full shopping list with quantities, sizes, and supplier codes included in your custom plan
                </p>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Maintenance Rhythm */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Maintenance Rhythm</h2>
            <p className="text-gray-600 mb-6">
              Simple seasonal tasks keep your garden looking its best
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(plan.maintenanceRhythm).map(([season, tasks]) => (
                <Card key={season}>
                  <CardHeader>
                    <CardTitle className="text-green-900">{season}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tasks.map((task, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* CTA Section */}
          <section className="bg-green-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">
              Create Your Own Custom Planting Plan
            </h2>
            <p className="text-xl mb-2 text-green-50 max-w-2xl mx-auto">
              Get a professional planting plan tailored specifically to your garden's conditions,
              your style preferences, and your local climate zone.
            </p>
            <p className="text-lg mb-8 text-green-100">
              Upload photos of your space → AI analysis → Plant recommendations → Download PDF
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/create">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-6"
                >
                  <Sprout className="mr-2 h-5 w-5" />
                  Start Creating Your Plan
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                disabled
              >
                <Download className="mr-2 h-5 w-5" />
                Download Example PDF
              </Button>
            </div>
            <p className="text-sm mt-6 text-green-100">
              Takes 5 minutes • Professional results • Real plant availability
            </p>
          </section>

          {/* Similar Plans */}
          <section>
            <h3 className="text-2xl font-bold text-green-900 mb-6">Similar Plans You Might Like</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {examplePlansExpanded
                .filter(p => p.id !== plan.id && p.tags.feeling.some(f => plan.tags.feeling.includes(f)))
                .slice(0, 3)
                .map(similarPlan => (
                  <Link key={similarPlan.id} href={`/examples/${similarPlan.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={similarPlan.heroImage}
                          alt={similarPlan.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{similarPlan.title}</CardTitle>
                        <CardDescription>{similarPlan.region}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2026 GSG Planting Plan Generator. Professional planting plans for UK gardens.</p>
        </div>
      </footer>
    </div>
  );
}
