import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileText,
  Image,
  Brain,
  Sparkles,
  Download,
  FileSpreadsheet,
  CheckCircle,
  Search,
  Layers,
  Calculator,
  FileOutput
} from 'lucide-react';

export default function ProfessionalsPage() {
  const tools = [
    {
      id: 'bulk-generate',
      title: 'Bulk Plant Image Generation',
      description: 'Upload plant lists and automatically generate AI images + Google reference photos for all plants',
      icon: Upload,
      href: '/tools/bulk-generate',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'CSV or text paste input',
        '3 AI views per plant (top, front, foliage)',
        '3 Google reference photos per plant',
        'Complete metadata JSON files',
        'Batch processing'
      ],
      status: 'Live'
    },
    {
      id: 'plan-critique',
      title: 'AI Plan Critique',
      description: 'Get professional analysis of planting plans powered by Claude Sonnet 4.5',
      icon: Brain,
      href: '/tools/plan-critique',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Plant compatibility analysis',
        'UK-specific advice',
        'Seasonal interest assessment',
        'Maintenance time estimates',
        'Professional scoring (1-10)'
      ],
      status: 'Live'
    },
    {
      id: 'image-library',
      title: 'Plant Image Library',
      description: 'Browse and search the complete database of AI-generated plant images',
      icon: Image,
      href: '/tools/image-library',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Search by scientific/common name',
        'Filter by plant type',
        'View all growth stages',
        'Download images',
        'Preview references'
      ],
      status: 'Coming Soon'
    },
    {
      id: 'plan-generator',
      title: 'Custom Plan Generator',
      description: 'Create custom planting plans with progressive refinement of preferences',
      icon: Sparkles,
      href: '/create',
      color: 'from-orange-500 to-red-500',
      features: [
        'Photo upload analysis',
        'Progressive preference refinement',
        'Climate-specific recommendations',
        'Budget optimization',
        'Supplier integration'
      ],
      status: 'Beta'
    },
    {
      id: 'report-generator',
      title: 'Branded Report Generator',
      description: 'Generate professional PDF reports with your branding for client presentations',
      icon: FileOutput,
      href: '/tools/reports',
      color: 'from-indigo-500 to-purple-500',
      features: [
        'Custom branding',
        'Professional templates',
        'Plant specifications',
        'Maintenance schedules',
        'Client-ready PDFs'
      ],
      status: 'Coming Soon'
    },
    {
      id: 'cost-calculator',
      title: 'Cost Calculator',
      description: 'Calculate accurate project costs with real supplier pricing',
      icon: Calculator,
      href: '/tools/calculator',
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Live supplier pricing',
        'Bulk discounts',
        'Labor estimates',
        'Material quantities',
        'Export quotes'
      ],
      status: 'Coming Soon'
    }
  ];

  const stats = [
    { label: 'Plant Images', value: '52+', icon: Image },
    { label: 'API Calls', value: '4', icon: Layers },
    { label: 'Example Plans', value: '4', icon: FileSpreadsheet },
    { label: 'Active Tools', value: '2', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">← Back to Home</span>
          </Link>
          <Badge className="bg-purple-600 text-white">Professional Tools</Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-purple-100 text-purple-900 px-4 py-2 text-sm">
            Professional Designer Tools
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Complete Toolkit for Garden Professionals
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered tools to accelerate your workflow, from plant image generation to client reports
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  className={
                    tool.status === 'Live'
                      ? 'bg-green-600 text-white'
                      : tool.status === 'Beta'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-400 text-white'
                  }
                >
                  {tool.status}
                </Badge>
              </div>

              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${tool.color} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <tool.icon className="h-16 w-16 text-white opacity-90" />
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Features:</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link href={tool.href}>
                  <Button
                    className="w-full"
                    disabled={tool.status === 'Coming Soon'}
                    variant={tool.status === 'Live' ? 'default' : 'outline'}
                  >
                    {tool.status === 'Coming Soon' ? 'Coming Soon' : 'Open Tool'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Quick Start Guide
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-purple-900">For New Projects</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Upload your plant list to <strong>Bulk Generator</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Run plan through <strong>AI Critique</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Generate client reports (coming soon)</span>
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-purple-900">For Existing Clients</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Browse <strong>Image Library</strong> for plant visuals</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Use <strong>Cost Calculator</strong> for quotes</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Export branded proposals</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
