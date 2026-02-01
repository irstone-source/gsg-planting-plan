'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  gardenSize: string;
  sunlight: string;
  soilType: string;
  style: string;
  maintenance: string;
  region: string;
  email?: string;
}

export function DemoGenerator() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    gardenSize: '',
    sunlight: '',
    soilType: '',
    style: '',
    maintenance: '',
    region: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((currentStep + 1) as Step);
    } else {
      generatePlan();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);

    try {
      // Store form data in localStorage for anonymous users
      localStorage.setItem('demo-plan-data', JSON.stringify(formData));

      // Redirect to a demo plan result page
      // In production, this would call the API to generate a real plan
      router.push('/demo/result?free=true');
    } catch (error) {
      console.error('Error generating demo plan:', error);
      setIsGenerating(false);
    }
  };

  const updateField = (key: keyof FormData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.gardenSize !== '';
      case 2:
        return formData.sunlight !== '';
      case 3:
        return formData.soilType !== '';
      case 4:
        return formData.style !== '';
      case 5:
        return formData.maintenance !== '';
      case 6:
        return formData.region !== '';
      default:
        return false;
    }
  };

  return (
    <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs uppercase tracking-wider text-stone">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-xs uppercase tracking-wider text-stone">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-dark/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-copper transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] flex flex-col justify-between">
        {currentStep === 1 && (
          <div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-4">
              How big is your garden space?
            </h2>
            <p className="text-stone mb-8">
              We'll calculate the right number of plants and spacing for your area.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'small', label: 'Small (up to 20m²)', desc: 'Patio, balcony, small courtyard' },
                { value: 'medium', label: 'Medium (20-50m²)', desc: 'Typical back garden' },
                { value: 'large', label: 'Large (50-100m²)', desc: 'Generous garden space' },
                { value: 'xlarge', label: 'Extra Large (100m²+)', desc: 'Large garden or estate' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('gardenSize', option.value)}
                  className={`p-6 text-left border-2 transition-all ${
                    formData.gardenSize === option.value
                      ? 'border-copper bg-copper/10'
                      : 'border-white/10 hover:border-copper/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-heading text-lg uppercase tracking-wider text-mist">
                      {option.label}
                    </span>
                    {formData.gardenSize === option.value && (
                      <Check className="h-5 w-5 text-copper flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-stone">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-4">
              How much sunlight does it get?
            </h2>
            <p className="text-stone mb-8">
              This determines which plants will thrive in your space.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'full-sun', label: 'Full Sun (6+ hours)', desc: 'South-facing, unshaded' },
                { value: 'partial-sun', label: 'Partial Sun (3-6 hours)', desc: 'East or West-facing' },
                { value: 'partial-shade', label: 'Partial Shade (2-3 hours)', desc: 'Filtered light, dappled shade' },
                { value: 'full-shade', label: 'Full Shade (<2 hours)', desc: 'North-facing, heavily shaded' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('sunlight', option.value)}
                  className={`p-6 text-left border-2 transition-all ${
                    formData.sunlight === option.value
                      ? 'border-copper bg-copper/10'
                      : 'border-white/10 hover:border-copper/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-heading text-lg uppercase tracking-wider text-mist">
                      {option.label}
                    </span>
                    {formData.sunlight === option.value && (
                      <Check className="h-5 w-5 text-copper flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-stone">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-4">
              What's your soil type?
            </h2>
            <p className="text-stone mb-8">
              Not sure? Most UK gardens are clay or loam. We'll recommend plants that work with your soil.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'clay', label: 'Clay', desc: 'Heavy, sticky, holds water' },
                { value: 'loam', label: 'Loam', desc: 'Balanced, fertile, ideal' },
                { value: 'sand', label: 'Sandy', desc: 'Light, drains quickly' },
                { value: 'chalk', label: 'Chalky', desc: 'Alkaline, free-draining' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('soilType', option.value)}
                  className={`p-6 text-left border-2 transition-all ${
                    formData.soilType === option.value
                      ? 'border-copper bg-copper/10'
                      : 'border-white/10 hover:border-copper/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-heading text-lg uppercase tracking-wider text-mist">
                      {option.label}
                    </span>
                    {formData.soilType === option.value && (
                      <Check className="h-5 w-5 text-copper flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-stone">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-4">
              What style appeals to you?
            </h2>
            <p className="text-stone mb-8">
              We'll match plants to your aesthetic preferences.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'contemporary', label: 'Contemporary', desc: 'Clean lines, architectural plants' },
                { value: 'cottage', label: 'Cottage Garden', desc: 'Romantic, abundant blooms' },
                { value: 'wildlife', label: 'Wildlife-Friendly', desc: 'Native plants, attract pollinators' },
                { value: 'tropical', label: 'Tropical', desc: 'Bold foliage, exotic feel' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('style', option.value)}
                  className={`p-6 text-left border-2 transition-all ${
                    formData.style === option.value
                      ? 'border-copper bg-copper/10'
                      : 'border-white/10 hover:border-copper/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-heading text-lg uppercase tracking-wider text-mist">
                      {option.label}
                    </span>
                    {formData.style === option.value && (
                      <Check className="h-5 w-5 text-copper flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-stone">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-4">
              How much time can you spend on maintenance?
            </h2>
            <p className="text-stone mb-8">
              Be honest - we'll recommend plants that match your lifestyle.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'minimal', label: 'Minimal (1-2 hours/month)', desc: 'Low-maintenance, drought-tolerant' },
                { value: 'moderate', label: 'Moderate (3-5 hours/month)', desc: 'Balanced care, seasonal tasks' },
                { value: 'high', label: 'High (5+ hours/month)', desc: 'More demanding plants, frequent care' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('maintenance', option.value)}
                  className={`p-6 text-left border-2 transition-all ${
                    formData.maintenance === option.value
                      ? 'border-copper bg-copper/10'
                      : 'border-white/10 hover:border-copper/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-heading text-lg uppercase tracking-wider text-mist">
                      {option.label}
                    </span>
                    {formData.maintenance === option.value && (
                      <Check className="h-5 w-5 text-copper flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-stone">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-4">
              Where are you located?
            </h2>
            <p className="text-stone mb-8">
              We'll recommend plants suited to your UK hardiness zone.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'south', label: 'South England', desc: 'Milder winters (H4-H5)' },
                { value: 'midlands', label: 'Midlands', desc: 'Moderate climate (H4)' },
                { value: 'north', label: 'North England', desc: 'Cooler winters (H3-H4)' },
                { value: 'scotland', label: 'Scotland', desc: 'Cold hardy (H3)' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('region', option.value)}
                  className={`p-6 text-left border-2 transition-all ${
                    formData.region === option.value
                      ? 'border-copper bg-copper/10'
                      : 'border-white/10 hover:border-copper/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-heading text-lg uppercase tracking-wider text-mist">
                      {option.label}
                    </span>
                    {formData.region === option.value && (
                      <Check className="h-5 w-5 text-copper flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-stone">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/10">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-sm uppercase tracking-wider text-stone hover:text-mist transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isGenerating}
            className="flex items-center gap-2 bg-copper text-dark px-8 py-4 text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : currentStep === totalSteps ? (
              <>
                <Sparkles className="h-4 w-4" />
                Generate My Free Plan
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
