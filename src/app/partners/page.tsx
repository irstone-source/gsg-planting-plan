import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, ShoppingCart, MapPin, Award } from 'lucide-react';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'For Partners | PlantingPlans',
  description: 'Partner with PlantingPlans. Garden centres and nurseries can offer ready-made planting plans to increase basket size.'
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-900">
            <Sparkles className="h-6 w-6 text-green-600" />
            PlantingPlans
          </Link>
          <Link href="/">
            <Button variant="ghost">← Back to Home</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-blue-600 text-white">For Garden Centres & Nurseries</Badge>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Turn Browsers into Buyers
          </h1>
          <p className="text-xl text-gray-600">
            Partner with PlantingPlans to offer customers ready-made planting plans. Increase basket size, reduce returns, and build loyalty.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <ShoppingCart className="h-12 w-12 text-blue-600 mb-3" />
              <CardTitle>Bigger Baskets</CardTitle>
              <CardDescription>
                Customers buy complete plans instead of single plants. Average basket size increases 3-5x.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mb-3" />
              <CardTitle>Fewer Returns</CardTitle>
              <CardDescription>
                Climate-appropriate recommendations mean healthier plants and happier customers. Reduce wrong-plant returns.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-12 w-12 text-purple-600 mb-3" />
              <CardTitle>Expert Positioning</CardTitle>
              <CardDescription>
                Position your business as the go-to expert for garden design—not just plant sales.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Join as a Partner</h3>
                <p className="text-gray-600">
                  Fill out the interest form below. We'll review your location and stock range, then set up your partner account.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Offer Ready-Made Plans</h3>
                <p className="text-gray-600">
                  Customers in your area see plans featuring plants you stock. They can purchase the complete plant pack in-store or online.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Grow Your Business</h3>
                <p className="text-gray-600">
                  We drive local customers to your business with location-based recommendations. You fulfill orders and build lasting relationships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans You Can Offer */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Plans You Can Offer Today</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Each plan is a complete planting scheme with species list, quantities, and care instructions. Perfect for upselling.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Urban Garden Schemes
                </CardTitle>
                <CardDescription>
                  Compact designs for city gardens, balconies, and courtyards. £150–£400 plant value per plan.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Wildlife Gardens
                </CardTitle>
                <CardDescription>
                  Pollinator-friendly, low-maintenance schemes. Popular with eco-conscious customers. £200–£500 plant value.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Seasonal Interest
                </CardTitle>
                <CardDescription>
                  Four-season gardens with year-round color. High-value upsell opportunity. £300–£800 plant value.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Shade Solutions
                </CardTitle>
                <CardDescription>
                  Specialized planting for difficult north-facing sites. Solves common customer pain points. £250–£600.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Interest Form */}
      <section className="container mx-auto px-4 pb-20">
        <LeadForm
          type="partner"
          title="Become a Partner"
          description="Join our network of garden centres and nurseries. We'll be in touch within 1–2 business days."
          fields={[
            { name: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Green Thumb Garden Centre', required: true },
            { name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Smith', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'john@greenthumb.co.uk', required: true },
            { name: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '07700 900000' },
            { name: 'city', label: 'City/Town', type: 'text', placeholder: 'London', required: true },
            { name: 'message', label: 'Tell us about your business (optional)', type: 'textarea', placeholder: 'We stock 500+ plant varieties and serve North London customers...' }
          ]}
        />
      </section>
    </div>
  );
}
