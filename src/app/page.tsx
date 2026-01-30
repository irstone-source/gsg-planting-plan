import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Camera, MapPin, Sparkles, Users, Handshake } from 'lucide-react';
import { HomeExampleCards } from '@/components/HomeExampleCards';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <div>
              <span className="text-xl font-bold text-green-900 block">PlantingPlans</span>
              <span className="text-xs text-gray-600">Designer results. DIY planting.</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/examples" className="text-gray-700 hover:text-green-600 font-medium">
              Examples
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-green-600 font-medium">
              Pricing
            </Link>
            <Link href="/designers" className="text-gray-700 hover:text-green-600 font-medium">
              Designers
            </Link>
            <Link href="/partners" className="text-gray-700 hover:text-green-600 font-medium">
              Partners
            </Link>
            <Link href="/create">
              <Button className="bg-green-600 hover:bg-green-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Trust Strip */}
      <div className="bg-green-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-center gap-8 text-sm">
          <span>🇬🇧 UK-focused</span>
          <span>📅 Care reminders</span>
          <span>🤝 Designer-friendly</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-green-900">
            Professional Planting Plans for UK Gardens
          </h1>
          <p className="text-xl text-green-700">
            Upload site photos, share your vision, and receive AI-powered plant recommendations with real supplier availability
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/create">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Plan
              </Button>
            </Link>
            <Link href="/examples">
              <Button size="lg" variant="outline">
                View Examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Camera className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Vision Analysis</CardTitle>
              <CardDescription>
                Upload photos of your site. Our AI analyzes light, space, and existing features
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Location Intelligence</CardTitle>
              <CardDescription>
                Automatic RHS hardiness zone detection and climate-appropriate recommendations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sprout className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Real Availability</CardTitle>
              <CardDescription>
                Access to 2,000+ plants from UK wholesale nurseries with availability-aware recommendations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-900">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Upload Site Photos</h3>
                <p className="text-gray-600">
                  Capture your garden from multiple angles. Our AI analyzes light conditions, existing plants, and spatial features.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Share Your Vision</h3>
                <p className="text-gray-600">
                  Tell us about your style preferences, budget, and maintenance expectations. Enter your postcode for climate-specific recommendations.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Get Professional Plan</h3>
                <p className="text-gray-600">
                  Receive a detailed planting plan with species recommendations, quantities, positioning, seasonal interest analysis, and care instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Cards */}
      <HomeExampleCards />

      {/* Work with Professionals */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-green-900">
            Work with Professionals
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            PlantingPlans supports and cooperates with garden professionals. We amplify designers and partner with growers—we don't replace them.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-3" />
                <CardTitle className="text-2xl">For Designers</CardTitle>
                <CardDescription className="text-base">
                  Join our network of garden designers. Get client-ready plan formats, share links, revision tools, and visibility to UK homeowners.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/designers">
                  <Button variant="outline" className="w-full">
                    Learn More & Apply
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Handshake className="h-12 w-12 text-blue-600 mb-3" />
                <CardTitle className="text-2xl">For Partners</CardTitle>
                <CardDescription className="text-base">
                  Garden centres, nurseries, and growers: partner with us to offer ready-made planting plans and increase basket size with fewer returns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/partners">
                  <Button variant="outline" className="w-full">
                    Become a Partner
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto bg-green-600 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ready to Transform Your Garden?</CardTitle>
            <CardDescription className="text-green-100 text-lg">
              Create your first AI-powered planting plan in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/create">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="h-6 w-6 text-green-600" />
                <span className="font-bold text-green-900">PlantingPlans</span>
              </div>
              <p className="text-sm text-gray-600">
                Professional planting plans for UK gardens. Designer results. DIY planting.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/examples" className="hover:text-green-600">Examples</Link></li>
                <li><Link href="/pricing" className="hover:text-green-600">Pricing</Link></li>
                <li><Link href="/create" className="hover:text-green-600">Create Plan</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Professionals</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/designers" className="hover:text-green-600">For Designers</Link></li>
                <li><Link href="/partners" className="hover:text-green-600">For Partners</Link></li>
                <li><Link href="/suppliers" className="hover:text-green-600">For Suppliers</Link></li>
                <li><Link href="/affiliate" className="hover:text-green-600">Affiliate Program</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/tools/image-library" className="hover:text-green-600">Image Library</Link></li>
                <li><Link href="/tools/calculator" className="hover:text-green-600">Cost Calculator</Link></li>
                <li><Link href="/tools/reports" className="hover:text-green-600">Report Generator</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 text-center text-sm text-gray-600">
            <p>© 2026 PlantingPlans. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
