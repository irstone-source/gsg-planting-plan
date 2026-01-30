import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, DollarSign, Target, Zap } from 'lucide-react';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'Affiliate Program | PlantingPlans',
  description: 'Join the PlantingPlans Founding Creator Program. Earn commission by sharing professional planting plans with your audience.'
};

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
          <Badge className="bg-orange-600 text-white">Founding Creator Program</Badge>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Earn by Sharing Great Garden Design
          </h1>
          <p className="text-xl text-gray-600">
            Join our Founding Creator Program and earn commission by introducing your audience to professional planting plans.
          </p>
        </div>
      </section>

      {/* Commission Highlight */}
      <section className="container mx-auto px-4 pb-12">
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="pt-8 text-center">
            <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-4xl font-bold mb-2">Up to 30% Commission</h2>
            <p className="text-lg opacity-90">
              Founding Creators earn premium commission rates during our launch period
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Why Join */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Join as a Founding Creator?</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-orange-600 mb-3" />
              <CardTitle>High Conversion</CardTitle>
              <CardDescription>
                Our product solves a real pain point for UK homeowners. Detailed plans at DIY prices convert well.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-3" />
              <CardTitle>Perfect Audience</CardTitle>
              <CardDescription>
                Ideal for gardening YouTubers, bloggers, Instagram creators, and anyone with a home/garden audience.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mb-3" />
              <CardTitle>Easy to Share</CardTitle>
              <CardDescription>
                We provide marketing materials, swipe copy, and visual assets. Just share your unique link.
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
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Apply to Join</h3>
                <p className="text-gray-600">
                  Fill out the application form below. We review your audience and approve most applications within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Get Your Unique Link</h3>
                <p className="text-gray-600">
                  Receive your personal referral link and access to marketing materials. We track clicks and conversions automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Share & Earn</h3>
                <p className="text-gray-600">
                  Share your link in videos, blog posts, social media, or newsletters. Earn commission on every purchase made through your link.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Perfect For</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Content creators, educators, and influencers in the home, garden, and lifestyle space.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Gardening YouTubers
                </CardTitle>
                <CardDescription>
                  Feature PlantingPlans in your garden tour videos, tutorials, or design walkthroughs. Natural fit for your content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Home & Lifestyle Bloggers
                </CardTitle>
                <CardDescription>
                  Write about garden transformations or seasonal planting. Our tool helps your readers achieve the looks you feature.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Instagram Garden Creators
                </CardTitle>
                <CardDescription>
                  Share beautiful garden inspiration? Help your followers recreate the designs with detailed planting plans.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Newsletter Publishers
                </CardTitle>
                <CardDescription>
                  Running a home improvement or gardening newsletter? Introduce your subscribers to a tool they'll genuinely love.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="container mx-auto px-4 pb-20">
        <LeadForm
          type="affiliate"
          title="Apply to the Founding Creator Program"
          description="Join our exclusive launch group and start earning commission."
          fields={[
            { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Emma Wilson', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'emma@example.com', required: true },
            { name: 'channels', label: 'Your Channel(s)', type: 'textarea', placeholder: 'YouTube: @EmmasGarden (25k subs), Instagram: @emmsgarden (10k followers)...', required: true },
            { name: 'audienceSize', label: 'Total Audience Size', type: 'select', placeholder: '', required: true, options: ['Under 1,000', '1,000–5,000', '5,000–10,000', '10,000–50,000', '50,000+'] },
            { name: 'message', label: 'How would you promote PlantingPlans? (optional)', type: 'textarea', placeholder: 'I create weekly garden tour videos and could feature PlantingPlans in my spring planting series...' }
          ]}
        />
      </section>
    </div>
  );
}
