import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'Pricing | PlantingPlans',
  description: 'Simple, transparent pricing for professional planting plans. Get early access to PlantingPlans.'
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
          <Badge className="bg-green-600 text-white">Simple Pricing</Badge>
          <h1 className="text-5xl font-bold tracking-tight text-green-900">
            Professional Plans. Clear Pricing.
          </h1>
          <p className="text-xl text-gray-600">
            No hidden fees. No monthly subscriptions. Get early access to PlantingPlans Pro.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free (Current) */}
          <Card className="relative">
            <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
              Available Now
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Free Access</CardTitle>
              <div className="text-4xl font-bold mt-4">£0</div>
              <CardDescription>Try it today, no payment required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Create unlimited planting plans</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>AI-powered plant selection</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>UK climate recommendations</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Access to 2,000+ plants</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>View example plans</span>
                </li>
              </ul>
              <Link href="/create" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Creating
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* DIY Pass (Coming Soon) */}
          <Card className="relative border-2 border-gray-300">
            <Badge className="absolute top-4 right-4 bg-yellow-600 text-white">
              Coming in v2
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">DIY Pass</CardTitle>
              <div className="text-4xl font-bold mt-4">
                £79
                <span className="text-base font-normal text-gray-600"> / 3 months</span>
              </div>
              <CardDescription>For keen gardeners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Everything in Free, plus:</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>5 plan generation credits</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>1 saved plan (permanent access)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Monthly care reminders</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Designer marketplace access</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Pro Pass (Coming Soon) */}
          <Card className="relative border-2 border-green-600 shadow-xl">
            <Badge className="absolute top-4 right-4 bg-green-600 text-white">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Pro Pass</CardTitle>
              <div className="text-4xl font-bold mt-4">
                £249
                <span className="text-base font-normal text-gray-600"> / 3 months</span>
              </div>
              <CardDescription>For professionals & enthusiasts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Everything in DIY, plus:</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>20 plan generation credits</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>5 saved plans (permanent access)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Priority support (24h response)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Branded report generator</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Cost calculator</span>
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Early Access Form */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Get Early Access</h2>
            <p className="text-gray-600">
              Be the first to know when PlantingPlans Pro launches. We'll send you exclusive early bird pricing.
            </p>
          </div>

          <LeadForm
            type="pricing"
            title="Join the Waitlist"
            description="Get notified when we launch and receive exclusive early bird pricing."
            fields={[
              { name: 'name', label: 'Name', type: 'text', placeholder: 'John Smith', required: true },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', required: true },
              { name: 'interest', label: 'Which plan interests you?', type: 'select', placeholder: '', required: true, options: ['DIY Pass (£79)', 'Pro Pass (£249)', 'Not sure yet'] },
              { name: 'message', label: 'Anything you would like to tell us? (optional)', type: 'textarea', placeholder: 'I am planning a front garden redesign...' }
            ]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 pb-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">What happens to my saved plans after 3 months?</h3>
              <p className="text-gray-600">
                Plans you've marked as "saved" remain accessible forever, even after your pass expires. Other plans show a summary view but full details require an active pass.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Can I upgrade from DIY to Pro?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade anytime and pay only the difference. Your expiry date stays the same.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">What's a plan generation credit?</h3>
              <p className="text-gray-600">
                Each credit generates one complete planting plan using AI. Plans include plant selection, care instructions, seasonal interest analysis, and supplier recommendations.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Do you work with garden designers?</h3>
              <p className="text-gray-600">
                Yes! We partner with professional designers and offer tools that complement their services. Visit our <Link href="/designers" className="text-green-600 hover:underline">Designers page</Link> to learn more.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">What are care reminders?</h3>
              <p className="text-gray-600">
                We send monthly emails with seasonal care tasks for your saved plans—pruning schedules, feeding reminders, and pest watch alerts specific to UK gardens.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
