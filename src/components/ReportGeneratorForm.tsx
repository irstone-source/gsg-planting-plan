'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileOutput, ChevronRight, Check } from 'lucide-react';

const EXAMPLE_PLANS = [
  { slug: 'london-contemporary-urban-oasis', title: 'Contemporary Urban Oasis - London' },
  { slug: 'liverpool-courtyard-jungle', title: 'Courtyard Jungle - Liverpool' },
  { slug: 'birmingham-small-space-big-impact', title: 'Small Space Big Impact - Birmingham' },
  { slug: 'brighton-coastal-calm-courtyard', title: 'Coastal Calm Courtyard - Brighton' },
  { slug: 'edinburgh-scottish-wildlife-haven', title: 'Scottish Wildlife Haven - Edinburgh' },
  { slug: 'glasgow-wet-winter-proof-framework', title: 'Wet Winter-Proof Framework - Glasgow' },
  { slug: 'cardiff-rain-friendly-wildlife-garden', title: 'Rain-Friendly Wildlife Garden - Cardiff' },
];

export function ReportGeneratorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);

  // Step 1: Branding
  const [companyName, setCompanyName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#16a34a');
  const [secondaryColor, setSecondaryColor] = useState('#059669');

  // Step 2: Template
  const [template, setTemplate] = useState<'modern' | 'classic' | ''>('');

  // Step 3: Plan Selection
  const [selectedPlan, setSelectedPlan] = useState('');

  const canProceed = (step: number) => {
    if (step === 1) return companyName.trim().length > 0;
    if (step === 2) return template !== '';
    if (step === 3) return selectedPlan !== '';
    return false;
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examplePlanSlug: selectedPlan,
          branding: {
            companyName,
            colorScheme: {
              primary: primaryColor,
              secondary: secondaryColor
            },
            templateId: template
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${companyName.replace(/\s/g, '-')}-${selectedPlan}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        console.error('Failed to generate report:', error);
        alert('Failed to generate report. Please try again.');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step < currentStep
                  ? 'bg-green-600 text-white'
                  : step === currentStep
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step < currentStep ? <Check className="h-5 w-5" /> : step}
            </div>
            {step < 4 && <ChevronRight className="h-5 w-5 text-gray-400" />}
          </div>
        ))}
      </div>

      {/* Step 1: Branding */}
      {currentStep === 1 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Step 1: Company Branding</h3>
              <p className="text-sm text-gray-600">Enter your company details and brand colors</p>
            </div>

            <div>
              <label className="text-sm font-medium">Company Name *</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Green Spaces Design Ltd"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded border"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-10 rounded border"
                  />
                  <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!canProceed(1)}
              className="w-full"
            >
              Next: Choose Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Template */}
      {currentStep === 2 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Step 2: Select Template</h3>
              <p className="text-sm text-gray-600">Choose a report style</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTemplate('modern')}
                className={`p-6 border-2 rounded-lg transition-all ${
                  template === 'modern'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <h4 className="font-bold mb-2">Modern</h4>
                <p className="text-xs text-gray-600">Clean, minimalist design with bold typography</p>
              </button>
              <button
                onClick={() => setTemplate('classic')}
                className={`p-6 border-2 rounded-lg transition-all ${
                  template === 'classic'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <h4 className="font-bold mb-2">Classic</h4>
                <p className="text-xs text-gray-600">Traditional layout with elegant styling</p>
              </button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={!canProceed(2)}
                className="flex-1"
              >
                Next: Select Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Plan Selection */}
      {currentStep === 3 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Step 3: Select Example Plan</h3>
              <p className="text-sm text-gray-600">Choose a plan to generate report for</p>
            </div>

            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">-- Select a plan --</option>
              {EXAMPLE_PLANS.map((plan) => (
                <option key={plan.slug} value={plan.slug}>
                  {plan.title}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(4)}
                disabled={!canProceed(3)}
                className="flex-1"
              >
                Next: Generate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Generate */}
      {currentStep === 4 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Step 4: Generate Report</h3>
              <p className="text-sm text-gray-600">Review and generate your branded report</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Company:</span>
                <span>{companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Template:</span>
                <Badge>{template}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Plan:</span>
                <span className="text-sm">{EXAMPLE_PLANS.find(p => p.slug === selectedPlan)?.title}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">Colors:</span>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: primaryColor }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: secondaryColor }} />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={generateReport}
                disabled={generating}
                className="flex-1"
                size="lg"
              >
                {generating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><FileOutput className="mr-2 h-4 w-4" /> Generate PDF</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
