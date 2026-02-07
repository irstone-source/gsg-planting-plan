'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, CloudRain, Moon, MapPin, Maximize2, Loader2 } from 'lucide-react';

interface StyleStartFormProps {
  styleSlug: string;
  styleName: string;
}

/**
 * StyleStartForm - Minimal input form for DIY track
 * Only asks for essentials: area, postcode, light, soil
 */
export function StyleStartForm({ styleSlug, styleName }: StyleStartFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    areaSqm: 50,
    postcode: '',
    sunExposure: 'mixed' as 'full_sun' | 'partial_shade' | 'full_shade' | 'mixed',
    soilType: 'unknown' as 'clay' | 'loam' | 'sand' | 'chalk' | 'peat' | 'silt' | 'unknown',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(20);

    try {
      const response = await fetch('/api/create-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Style info
          selectedStyleSlug: styleSlug,
          sourceTrack: 'diy',

          // Minimal inputs
          postcode: formData.postcode,
          areaSqm: formData.areaSqm,
          sunExposure: formData.sunExposure,
          soilType: formData.soilType,

          // Defaults for DIY track
          moisture: 'moist',
          style: 'mixed', // Will be overridden by selectedStyleSlug
          maintenanceLevel: 'medium',
        }),
      });

      setProgress(40);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create plan');
      }

      const result = await response.json();

      if (!result.success || !result.planId) {
        throw new Error('Invalid response from server');
      }

      // Start polling for status
      pollPlanStatus(result.planId);
    } catch (error) {
      console.error('Error creating plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create plan';
      alert(`Failed to create plan: ${errorMessage}\n\nPlease try again or contact support.`);
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const pollPlanStatus = async (planId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      attempts++;

      try {
        const response = await fetch(`/api/plan-status?planId=${planId}`);
        const data = await response.json();

        if (data.status === 'complete') {
          setProgress(100);
          router.push(`/plan/${planId}`);
          return;
        }

        if (data.status === 'error') {
          setIsSubmitting(false);
          setProgress(0);
          alert(`Plan generation failed: ${data.message}\n\nPlease try again.`);
          return;
        }

        // Update progress
        const progressPercent = 40 + Math.min(50, (attempts / maxAttempts) * 50);
        setProgress(progressPercent);

        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setIsSubmitting(false);
          setProgress(0);
          alert('Plan generation is taking longer than expected. Please refresh and check your plans.');
        }
      } catch (error) {
        console.error('Error checking plan status:', error);
        setIsSubmitting(false);
        setProgress(0);
        alert('Failed to check plan status. Please try again.');
      }
    };

    poll();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Garden Area Slider */}
      <div className="bg-concrete/20 border border-white/5 p-6">
        <label className="block mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Maximize2 className="h-5 w-5 text-copper" />
            <span className="font-heading text-sm uppercase tracking-wider text-mist">
              Garden Area
            </span>
          </div>

          <div className="mb-4">
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={formData.areaSqm}
              onChange={(e) => setFormData({ ...formData, areaSqm: Number(e.target.value) })}
              className="w-full h-2 bg-dark/50 rounded-lg appearance-none cursor-pointer accent-copper"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-stone">
              {formData.areaSqm} m²
            </span>
            <span className="text-stone/70">
              {formData.areaSqm < 20 ? 'Small patio' :
               formData.areaSqm < 100 ? 'Typical garden' :
               formData.areaSqm < 300 ? 'Large garden' :
               'Very large plot'}
            </span>
          </div>
        </label>
      </div>

      {/* UK Postcode */}
      <div className="bg-concrete/20 border border-white/5 p-6">
        <label className="block">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-copper" />
            <span className="font-heading text-sm uppercase tracking-wider text-mist">
              UK Postcode
            </span>
          </div>
          <input
            type="text"
            value={formData.postcode}
            onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
            placeholder="SW1A 1AA"
            required
            className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none uppercase"
          />
          <p className="text-xs text-stone/70 mt-2">
            This helps us match plants to your local climate
          </p>
        </label>
      </div>

      {/* Light Conditions (Icon Buttons) */}
      <div className="bg-concrete/20 border border-white/5 p-6">
        <div className="mb-4">
          <span className="font-heading text-sm uppercase tracking-wider text-mist block mb-2">
            Light Conditions
          </span>
          <p className="text-xs text-stone/70 mb-4">
            Think about where most sun falls during the day
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, sunExposure: 'full_sun' })}
            className={`p-4 border-2 transition-all ${
              formData.sunExposure === 'full_sun'
                ? 'border-copper bg-copper/10 text-mist'
                : 'border-white/10 bg-dark/30 text-stone hover:border-copper/50'
            }`}
          >
            <Sun className="h-6 w-6 mx-auto mb-2" />
            <span className="text-xs uppercase tracking-wider">Full Sun</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, sunExposure: 'partial_shade' })}
            className={`p-4 border-2 transition-all ${
              formData.sunExposure === 'partial_shade'
                ? 'border-copper bg-copper/10 text-mist'
                : 'border-white/10 bg-dark/30 text-stone hover:border-copper/50'
            }`}
          >
            <CloudRain className="h-6 w-6 mx-auto mb-2" />
            <span className="text-xs uppercase tracking-wider">Partial Shade</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, sunExposure: 'full_shade' })}
            className={`p-4 border-2 transition-all ${
              formData.sunExposure === 'full_shade'
                ? 'border-copper bg-copper/10 text-mist'
                : 'border-white/10 bg-dark/30 text-stone hover:border-copper/50'
            }`}
          >
            <Moon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-xs uppercase tracking-wider">Full Shade</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, sunExposure: 'mixed' })}
            className={`p-4 border-2 transition-all ${
              formData.sunExposure === 'mixed'
                ? 'border-copper bg-copper/10 text-mist'
                : 'border-white/10 bg-dark/30 text-stone hover:border-copper/50'
            }`}
          >
            <div className="h-6 w-6 mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">🌤️</span>
            </div>
            <span className="text-xs uppercase tracking-wider">Mixed</span>
          </button>
        </div>
      </div>

      {/* Soil Type (Plain English) */}
      <div className="bg-concrete/20 border border-white/5 p-6">
        <label className="block">
          <span className="font-heading text-sm uppercase tracking-wider text-mist block mb-4">
            Soil Type
          </span>

          <select
            value={formData.soilType}
            onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
            className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none"
          >
            <option value="unknown">Don't know</option>
            <option value="clay">Clay (heavy, sticky when wet)</option>
            <option value="loam">Loam (dark, crumbly, ideal)</option>
            <option value="sand">Sandy (light, drains very fast)</option>
            <option value="chalk">Chalk (pale, stony, alkaline)</option>
            <option value="peat">Peat (dark, spongy, rare)</option>
            <option value="silt">Silt (smooth, holds moisture)</option>
          </select>

          <p className="text-xs text-stone/70 mt-2">
            This helps avoid plant failures later
          </p>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting || !formData.postcode}
          className="relative px-12 py-4 bg-copper hover:bg-copper/90 disabled:bg-stone/20 disabled:cursor-not-allowed text-dark font-heading text-lg uppercase tracking-wider font-bold transition-all duration-300 hover:shadow-xl hover:shadow-copper/30 disabled:shadow-none"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Your {styleName} Plan...
            </span>
          ) : (
            `Create My ${styleName} Plan`
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {isSubmitting && progress > 0 && (
        <div className="mt-6">
          <div className="h-2 bg-dark/50 overflow-hidden">
            <div
              className="h-full bg-copper transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-stone/70 mt-2">
            Adapting {styleName} to your garden...
          </p>
        </div>
      )}

      {/* Trust Message */}
      <div className="text-center pt-4 border-t border-white/10">
        <p className="text-sm text-stone/70">
          Takes 30-60 seconds • No signup required • Free to try
        </p>
      </div>
    </form>
  );
}
