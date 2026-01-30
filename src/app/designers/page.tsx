import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, FileText, Share2, Eye, Zap } from 'lucide-react';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'For Designers | PlantingPlans',
  description: 'Join PlantingPlans as a garden designer. Get client-ready plan formats, share links, and visibility to UK homeowners.'
};

export default function DesignersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
          <Badge className="bg-purple-600 text-white">For Garden Designers</Badge>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            We Amplify Designers. We Don't Replace Them.
          </h1>
          <p className="text-xl text-gray-600">
            Join our network and get client-ready plan formats, shareable links, revision tools, and visibility to UK homeowners.
          </p>
        </div>
      </section>

      {/* Trust Message */}
      <section className="container mx-auto px-4 pb-12">
        <Card className="max-w-3xl mx-auto bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <p className="text-lg text-center text-purple-900">
              PlantingPlans supports professional designers by providing tools that complement—not replace—your expertise.
              We believe great gardens need a designer's vision, and we're here to make your workflow smoother.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Designers Join PlantingPlans</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <FileText className="h-12 w-12 text-purple-600 mb-3" />
              <CardTitle>Client-Ready Formats</CardTitle>
              <CardDescription>
                Transform your designs into polished, shareable plans with plant specifications, care guides, and seasonal interest analysis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Share2 className="h-12 w-12 text-blue-600 mb-3" />
              <CardTitle>Shareable Links</CardTitle>
              <CardDescription>
                Send secure links to clients for feedback and approval. Track revisions and keep everyone aligned throughout the project.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Eye className="h-12 w-12 text-green-600 mb-3" />
              <CardTitle>Visibility</CardTitle>
              <CardDescription>
                Get featured in our designer directory. Reach UK homeowners actively looking for professional garden design services.
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
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Apply to Join</h3>
                <p className="text-gray-600">
                  Fill out the application form below. We review your portfolio and verify your credentials. Most applications are approved within 48 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
                <p className="text-gray-600">
                  Set up your designer profile with portfolio images, service areas, specialties, and pricing. You control what clients see.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Get Leads & Collaborate</h3>
                <p className="text-gray-600">
                  Receive qualified leads from homeowners in your service area. Use our tools to share plans, gather feedback, and manage revisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Designer Tools</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to streamline your workflow and deliver exceptional client experiences.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Quick Concept Generation
                </CardTitle>
                <CardDescription>
                  Use AI to rapidly explore planting concepts. Test ideas in minutes, not hours. You stay in creative control.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Professional Reports
                </CardTitle>
                <CardDescription>
                  Generate branded PDFs with your logo, custom colors, and professional layouts. Impress clients from first contact.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-green-600" />
                  Client Collaboration
                </CardTitle>
                <CardDescription>
                  Share live links with clients. They can comment, request changes, and approve designs—all in one place.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Lead Generation
                </CardTitle>
                <CardDescription>
                  Get featured in our designer directory. Connect with homeowners actively seeking professional design services.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="container mx-auto px-4 pb-20">
        <LeadForm
          type="designer"
          title="Apply to Join"
          description="Tell us about your design practice. We'll review your application and get back to you within 48 hours."
          fields={[
            { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Sarah Johnson', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'sarah@gardendesigns.co.uk', required: true },
            { name: 'region', label: 'Service Region', type: 'text', placeholder: 'Greater London', required: true },
            { name: 'website', label: 'Website or Instagram', type: 'text', placeholder: '@yourhandle or yoursite.com' },
            { name: 'services', label: 'Services You Offer', type: 'textarea', placeholder: 'Full garden design, planting plans, consultation...', required: true },
            { name: 'message', label: 'Tell us about your design approach (optional)', type: 'textarea', placeholder: 'I specialize in naturalistic planting with a focus on wildlife...' }
          ]}
        />
      </section>
    </div>
  );
}
