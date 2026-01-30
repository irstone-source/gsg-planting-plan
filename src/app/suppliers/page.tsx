import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Truck, TrendingUp, Users, MapPin, Package } from 'lucide-react';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'For Suppliers | PlantingPlans',
  description: 'Join PlantingPlans as a plant supplier or nursery. Connect with customers through curated planting plans.'
};

export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
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
          <Badge className="bg-emerald-600 text-white">For Wholesale Nurseries & Growers</Badge>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Connect with Customers Through Curated Plans
          </h1>
          <p className="text-xl text-gray-600">
            Join PlantingPlans as a supplier. Get your plants featured in professionally designed planting schemes shown to UK homeowners.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Nurseries Join PlantingPlans</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Truck className="h-12 w-12 text-emerald-600 mb-3" />
              <CardTitle>Direct to Consumer</CardTitle>
              <CardDescription>
                Reach homeowners directly. Bypass traditional wholesale channels and sell complete plant collections at better margins.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-12 w-12 text-blue-600 mb-3" />
              <CardTitle>Predictable Demand</CardTitle>
              <CardDescription>
                Pre-curated plans mean predictable orders. Better planning, less waste, improved cash flow.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-600 mb-3" />
              <CardTitle>Volume Sales</CardTitle>
              <CardDescription>
                Sell complete plant collections, not individual plants. Average order value 5-10x higher than single-plant sales.
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
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Register Your Stock</h3>
                <p className="text-gray-600">
                  Submit your plant list with availability, sizes, and pricing. We integrate with your systems or provide simple upload tools.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Get Featured in Plans</h3>
                <p className="text-gray-600">
                  Your plants are automatically included in AI-generated planting plans. Customers see which plants you stock and can purchase directly.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Fulfill Orders</h3>
                <p className="text-gray-600">
                  Receive orders for complete plant collections. Ship directly to customers or arrange pickup. You handle fulfillment your way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">What We Look For</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We partner with UK nurseries and growers who meet these criteria:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  UK-Based Availability
                </CardTitle>
                <CardDescription>
                  Plants available for UK delivery or collection. We prioritize suppliers with good UK coverage and reliable logistics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Variety & Quality
                </CardTitle>
                <CardDescription>
                  Stock list of 100+ plant species. Consistent quality and sizing. Good plant health standards.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  Fulfillment Capability
                </CardTitle>
                <CardDescription>
                  Able to fulfill orders within 5-7 business days. Packaging suitable for courier delivery or customer pickup.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Transparent Pricing
                </CardTitle>
                <CardDescription>
                  Clear wholesale or trade pricing. Volume discounts welcome. Competitive rates for direct-to-consumer sales.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="container mx-auto px-4 pb-20">
        <LeadForm
          type="supplier"
          title="Register as a Supplier"
          description="Tell us about your nursery or growing operation. We'll review your details and get back to you within 2–3 business days."
          fields={[
            { name: 'businessName', label: 'Business/Nursery Name', type: 'text', placeholder: 'Green Valley Nurseries Ltd', required: true },
            { name: 'name', label: 'Contact Name', type: 'text', placeholder: 'James Green', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'james@greenvalley.co.uk', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', placeholder: '01234 567890', required: true },
            { name: 'location', label: 'Location (City/County)', type: 'text', placeholder: 'Hertfordshire', required: true },
            { name: 'stockRange', label: 'Estimated Stock Range', type: 'select', placeholder: '', required: true, options: ['Under 100 species', '100–500 species', '500–1,000 species', '1,000+ species'] },
            { name: 'deliveryRegions', label: 'Delivery/Coverage Regions', type: 'textarea', placeholder: 'Southeast England, London, Home Counties...', required: true },
            { name: 'message', label: 'Additional Information (optional)', type: 'textarea', placeholder: 'We specialize in native perennials and have our own fleet for local delivery...' }
          ]}
        />
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 pb-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">How do you integrate with our systems?</h3>
              <p className="text-gray-600">
                We can connect to existing APIs, import CSV files, or provide a simple web portal for updating stock and pricing.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">What commission do you charge?</h3>
              <p className="text-gray-600">
                We take a small platform fee on orders (typically 10-15%). You set your own prices and keep the rest. We'll discuss specifics during onboarding.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Can we sell directly to customers?</h3>
              <p className="text-gray-600">
                Yes! Orders come through PlantingPlans, but you fulfill directly to the customer. You control fulfillment, delivery, and customer service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">What size orders should we expect?</h3>
              <p className="text-gray-600">
                Typical orders range from £150–£800 plant value (20-50 plants). Much larger than individual plant sales.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
