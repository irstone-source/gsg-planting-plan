import Link from 'next/link';
import { Header, Footer, ArchitecturalCard, RevealSection } from '@/components/architectural';
import {
  Upload,
  Brain,
  Image,
  Sparkles,
  FileOutput,
  Calculator,
  Share2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'Professional Tools | PlantingPlans',
  description: 'Complete toolkit for garden design professionals. AI-powered workflow acceleration.'
};

export default function ProfessionalsPage() {
  const tools = [
    {
      id: 'bulk-generate',
      title: 'Bulk Plant Image Generation',
      description: 'Upload plant lists and automatically generate AI images + Google reference photos for all plants',
      icon: Upload,
      href: '/tools/bulk-generate',
      features: [
        'CSV or text paste input',
        '3 AI views per plant (top, front, foliage)',
        '3 Google reference photos per plant',
        'Complete metadata JSON files',
        'Batch processing'
      ],
      status: 'Live',
      badge: 'bg-moss/90'
    },
    {
      id: 'plan-critique',
      title: 'AI Plan Critique',
      description: 'Get professional analysis of planting plans powered by Claude Sonnet 4.5',
      icon: Brain,
      href: '/tools/plan-critique',
      features: [
        'Plant compatibility analysis',
        'UK-specific advice',
        'Seasonal interest assessment',
        'Maintenance time estimates',
        'Professional scoring (1-10)'
      ],
      status: 'Live',
      badge: 'bg-moss/90'
    },
    {
      id: 'image-library',
      title: 'Plant Image Library',
      description: 'Browse and search the complete database of AI-generated plant images',
      icon: Image,
      href: '/tools/image-library',
      features: [
        'Search by scientific/common name',
        'Filter by plant type',
        'View all growth stages',
        'Download images',
        'Preview references'
      ],
      status: 'Live',
      badge: 'bg-moss/90'
    },
    {
      id: 'plan-generator',
      title: 'Custom Plan Generator',
      description: 'Create custom planting plans with progressive refinement of preferences',
      icon: Sparkles,
      href: '/create',
      features: [
        'Photo upload analysis',
        'Progressive preference refinement',
        'Climate-specific recommendations',
        'Budget optimization',
        'Supplier integration'
      ],
      status: 'Beta',
      badge: 'bg-copper/90'
    },
    {
      id: 'report-generator',
      title: 'Branded Report Generator',
      description: 'Generate professional PDF reports with your branding for client presentations',
      icon: FileOutput,
      href: '/tools/reports',
      features: [
        'Custom branding',
        'Professional templates',
        'Plant specifications',
        'Maintenance schedules',
        'Client-ready PDFs'
      ],
      status: 'Live',
      badge: 'bg-moss/90'
    },
    {
      id: 'cost-calculator',
      title: 'Cost Calculator',
      description: 'Calculate accurate project costs with real supplier pricing',
      icon: Calculator,
      href: '/tools/calculator',
      features: [
        'Live supplier pricing',
        'Bulk discounts',
        'Labor estimates',
        'Material quantities',
        'Export quotes'
      ],
      status: 'Live',
      badge: 'bg-moss/90'
    }
  ];

  const stats = [
    { label: 'Plant Images', value: '52+' },
    { label: 'API Endpoints', value: '4' },
    { label: 'Example Plans', value: '4' },
    { label: 'Active Tools', value: '5' }
  ];

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-2 bg-concrete/40 border border-copper/30 text-copper text-xs uppercase tracking-widest font-bold rounded-sm mb-4">
              Professional Designer Tools
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              COMPLETE TOOLKIT
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-2xl mx-auto">
              AI-powered workflow acceleration for garden design professionals.
              From plant image generation to client reports.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Stats */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-concrete/60 backdrop-blur-md border border-white/5 p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold text-copper mb-2">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wider text-stone">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Tools Grid */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tools.map((tool, index) => (
              <ArchitecturalCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                delay={index * 0.1}
              >
                {/* Icon & Status Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-16 w-16 bg-concrete/40 rounded-sm flex items-center justify-center">
                    <tool.icon className="h-8 w-8 text-copper" />
                  </div>
                  <span className={`px-3 py-1 ${tool.badge} backdrop-blur text-dark text-xs uppercase tracking-wider font-bold rounded-sm`}>
                    {tool.status}
                  </span>
                </div>

                {/* Features */}
                <div className="mb-6 space-y-3">
                  <p className="text-sm uppercase tracking-wider text-copper font-bold">
                    Features:
                  </p>
                  <ul className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-stone">
                        <CheckCircle className="h-4 w-4 text-moss flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link href={tool.href}>
                  <button className="w-full bg-copper text-dark py-3 px-6 text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors flex items-center justify-center gap-2">
                    {tool.status === 'Coming Soon' ? 'Coming Soon' : 'Open Tool'}
                    {tool.status !== 'Coming Soon' && <ArrowRight className="h-4 w-4" />}
                  </button>
                </Link>
              </ArchitecturalCard>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Quick Start Guide */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-concrete/60 backdrop-blur-md border border-white/5 p-8 md:p-12">
            <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-8 text-center">
              Quick Start Guide
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-4">
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-copper mb-4">
                  New Projects
                </h3>
                <ol className="space-y-4">
                  {[
                    'Upload your plant list to Bulk Generator',
                    'Run plan through AI Critique',
                    'Generate client reports'
                  ].map((step, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-8 h-8 bg-copper text-dark rounded-sm flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-stone pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-copper mb-4">
                  Existing Clients
                </h3>
                <ol className="space-y-4">
                  {[
                    'Browse Image Library for plant visuals',
                    'Use Cost Calculator for quotes',
                    'Export branded proposals'
                  ].map((step, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-8 h-8 bg-copper text-dark rounded-sm flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-stone pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}
