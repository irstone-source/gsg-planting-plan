import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { examplePlansExpanded } from '@/data/example-plans-expanded';
import {
  ArrowLeft, MapPin, Sun, Droplets, TreePine, Calendar,
  PoundSterling, Leaf, Sprout, AlertCircle, Lightbulb,
  CheckCircle2, Download, Share2
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

          {/* Design Visualization Mockup */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Design Visualization</h2>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900 italic">
                    <strong>Mockup for illustration purposes.</strong> These images show representative examples
                    of the planting style and plant types. Your actual plan will be tailored to your specific
                    site conditions and preferences.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {plan.galleryImages.map((img, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={img}
                    alt={`Planting design inspiration ${idx + 1}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">Design Inspiration {idx + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Planting Palette with Plant Images */}
          <section>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Planting Palette</h2>
            <p className="text-gray-600 mb-6">
              Layered planting creates year-round structure and seasonal interest
            </p>

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
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1571105277852-5adf08b57a41?w=400&q=80"
                        alt="Betula pendula (Silver Birch)"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600 text-white">Structure</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Betula pendula</h4>
                      <p className="text-sm text-gray-600 mb-2">Silver Birch</p>
                      <p className="text-xs text-gray-500">
                        Elegant native tree with white bark and delicate foliage. Provides height and structure.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=400&q=80"
                        alt="Viburnum tinus"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600 text-white">Evergreen</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Viburnum tinus</h4>
                      <p className="text-sm text-gray-600 mb-2">Laurustinus</p>
                      <p className="text-xs text-gray-500">
                        Evergreen shrub with white winter flowers. Provides year-round screening and structure.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1629059823091-265524e352c0?w=400&q=80"
                        alt="Fargesia bamboo"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600 text-white">Evergreen</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Fargesia bamboo</h4>
                      <p className="text-sm text-gray-600 mb-2">Clumping Bamboo</p>
                      <p className="text-xs text-gray-500">
                        Non-invasive clumping bamboo. Provides instant height and gentle movement.
                      </p>
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
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1597848212624-e530cb6e4051?w=400&q=80"
                        alt="Geranium Rozanne"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-600 text-white">Long-flowering</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Geranium Rozanne</h4>
                      <p className="text-sm text-gray-600 mb-2">Rozanne Cranesbill</p>
                      <p className="text-xs text-gray-500">
                        Award-winning perennial with blue flowers from June-November. Low maintenance and reliable.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&q=80"
                        alt="Alchemilla mollis"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-600 text-white">Foliage</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Alchemilla mollis</h4>
                      <p className="text-sm text-gray-600 mb-2">Lady's Mantle</p>
                      <p className="text-xs text-gray-500">
                        Soft chartreuse flowers and beautiful foliage. Perfect edge softener and incredibly tough.
                      </p>
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
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1551016307-0e481f0a94f6?w=400&q=80"
                        alt="Ferns"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-emerald-600 text-white">Shade-tolerant</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Ferns</h4>
                      <p className="text-sm text-gray-600 mb-2">Mixed shade ferns</p>
                      <p className="text-xs text-gray-500">
                        Lush foliage for shaded areas. Adds texture and jungle feel with minimal care.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1530027644375-9c83053d392e?w=400&q=80"
                        alt="Ajuga reptans"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-emerald-600 text-white">Ground cover</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">Ajuga reptans</h4>
                      <p className="text-sm text-gray-600 mb-2">Bugle</p>
                      <p className="text-xs text-gray-500">
                        Mat-forming ground cover with blue spring flowers. Suppresses weeds effectively.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    <strong>Plant images are representative.</strong> Actual plants vary by season, maturity,
                    and growing conditions. Your custom plan will include specific varieties, sizes, and
                    supplier codes for availability.
                  </p>
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
