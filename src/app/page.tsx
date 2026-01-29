import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Camera, MapPin, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-900">GSG Planting Plan Generator</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-green-900">
            AI-Powered Planting Plans for UK Gardens
          </h1>
          <p className="text-xl text-green-700">
            Upload site photos, share your preferences, and receive professional planting recommendations with real supplier availability
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/create">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Planting Plan
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
                Access to 2,000+ plants from UK wholesale nurseries with live stock data
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
                  Receive a detailed planting plan with species recommendations, quantities, positioning, and supplier information in PDF format.
                </p>
              </div>
            </div>
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
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2026 GSG Planting Plan Generator. Professional planting plans for UK gardens.</p>
        </div>
      </footer>
    </div>
  );
}
