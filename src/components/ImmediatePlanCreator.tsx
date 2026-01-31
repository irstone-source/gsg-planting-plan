'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, MapPin, Sun, Droplets, Leaf, Sparkles, Loader2, X } from 'lucide-react';
import Image from 'next/image';

// Form validation schema
const formSchema = z.object({
  // What the client wants - PROMINENT FIELD
  description: z.string().min(20, 'Please describe what you want in at least 20 characters'),

  // Location
  postcode: z.string().min(5, 'Please enter a valid UK postcode'),

  // Site Conditions
  sunExposure: z.enum(['full_sun', 'partial_shade', 'full_shade', 'mixed']),
  soilType: z.enum(['clay', 'loam', 'sand', 'chalk', 'peat', 'silt', 'unknown']),
  moisture: z.enum(['dry', 'moist', 'wet', 'variable']),
  areaSqm: z.number().min(1).optional(),

  // Preferences
  style: z.enum(['cottage', 'contemporary', 'formal', 'wildlife', 'low_maintenance', 'mixed']),
  maintenanceLevel: z.enum(['low', 'medium', 'high']),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ImmediatePlanCreator() {
  const [images, setImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      postcode: '',
      sunExposure: 'mixed',
      soilType: 'unknown',
      moisture: 'moist',
      style: 'mixed',
      maintenanceLevel: 'medium',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setProgress(10);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      images.forEach(image => formData.append('images', image));
      formData.append('data', JSON.stringify(data));

      setProgress(30);

      // Call API endpoint (no auth required)
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        body: formData,
      });

      setProgress(60);

      if (!response.ok) {
        throw new Error('Failed to generate planting plan');
      }

      const result = await response.json();
      setProgress(100);

      // Redirect to results page
      window.location.href = `/plan/${result.planId}`;
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate planting plan. Please try again.');
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* What Do You Want? - PROMINENT */}
      <div className="bg-moss/20 border border-moss/30 p-8 rounded-sm">
        <label className="block mb-4">
          <span className="font-heading text-lg uppercase tracking-wider text-copper mb-2 block">
            What do you want in your garden?
          </span>
          <span className="text-sm text-stone block mb-4">
            Describe your vision, any specific plants you love, colors you want, features you need (wildlife, fragrance, year-round interest, etc.)
          </span>
          <textarea
            {...form.register('description')}
            rows={5}
            placeholder="e.g., I want a low-maintenance cottage garden with lots of purple and white flowers, some fragrant plants for bees, and something interesting in winter. I love lavender and roses but need plants that can handle partial shade and clay soil..."
            className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:outline-none resize-none leading-relaxed"
          />
          {form.formState.errors.description && (
            <span className="text-xs text-red-400 mt-2 block">
              {form.formState.errors.description.message}
            </span>
          )}
        </label>
      </div>

      {/* Image Upload */}
      <div className="bg-concrete/40 border border-white/5 p-8">
        <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-4">
          Upload Site Photos (Optional)
        </h3>
        <div className="border-2 border-dashed border-white/10 rounded-sm p-8 text-center hover:border-copper/50 transition-colors duration-300">
          <Upload className="mx-auto h-10 w-10 text-copper/40 mb-3" aria-hidden="true" />
          <p className="text-stone text-sm mb-4">
            Upload 3-10 photos showing different angles of your garden space
          </p>
          <label className="inline-block px-6 py-2 bg-dark/50 border border-white/10 text-stone text-xs uppercase tracking-wider hover:border-copper hover:text-copper transition-colors duration-300 cursor-pointer">
            Choose Files
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative h-32 overflow-hidden border border-white/10">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-dark/80 border border-copper text-copper rounded-sm p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-copper hover:text-dark"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Site Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Location */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block flex items-center gap-2">
              <MapPin className="h-4 w-4 text-copper" aria-hidden="true" />
              UK Postcode
            </span>
            <input
              type="text"
              {...form.register('postcode')}
              placeholder="e.g., SW1A 1AA"
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:outline-none uppercase"
            />
            {form.formState.errors.postcode && (
              <span className="text-xs text-red-400 mt-1 block">
                {form.formState.errors.postcode.message}
              </span>
            )}
            <span className="text-xs text-stone/70 mt-1 block">
              Helps determine your climate zone
            </span>
          </label>
        </div>

        {/* Area */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Area (m²)
            </span>
            <input
              type="number"
              {...form.register('areaSqm', { valueAsNumber: true })}
              placeholder="e.g., 50"
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:outline-none"
            />
            <span className="text-xs text-stone/70 mt-1 block">
              Optional: helps with quantities
            </span>
          </label>
        </div>

        {/* Sun Exposure */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block flex items-center gap-2">
              <Sun className="h-4 w-4 text-copper" aria-hidden="true" />
              Sun Exposure
            </span>
            <select
              {...form.register('sunExposure')}
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:outline-none appearance-none cursor-pointer"
            >
              <option value="full_sun">Full Sun (6+ hours)</option>
              <option value="partial_shade">Partial Shade (3-6 hours)</option>
              <option value="full_shade">Full Shade (&lt;3 hours)</option>
              <option value="mixed">Mixed Conditions</option>
            </select>
          </label>
        </div>

        {/* Soil Type */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block flex items-center gap-2">
              <Leaf className="h-4 w-4 text-copper" aria-hidden="true" />
              Soil Type
            </span>
            <select
              {...form.register('soilType')}
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:outline-none appearance-none cursor-pointer"
            >
              <option value="unknown">Not Sure</option>
              <option value="clay">Clay</option>
              <option value="loam">Loam</option>
              <option value="sand">Sand</option>
              <option value="chalk">Chalk</option>
              <option value="peat">Peat</option>
              <option value="silt">Silt</option>
            </select>
          </label>
        </div>

        {/* Moisture */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block flex items-center gap-2">
              <Droplets className="h-4 w-4 text-copper" aria-hidden="true" />
              Moisture Level
            </span>
            <select
              {...form.register('moisture')}
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:outline-none appearance-none cursor-pointer"
            >
              <option value="moist">Moist (typical)</option>
              <option value="dry">Dry</option>
              <option value="wet">Wet</option>
              <option value="variable">Variable</option>
            </select>
          </label>
        </div>

        {/* Garden Style */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Garden Style
            </span>
            <select
              {...form.register('style')}
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:outline-none appearance-none cursor-pointer"
            >
              <option value="mixed">Mixed Style</option>
              <option value="cottage">Cottage Garden</option>
              <option value="contemporary">Contemporary</option>
              <option value="formal">Formal</option>
              <option value="wildlife">Wildlife Friendly</option>
              <option value="low_maintenance">Low Maintenance</option>
            </select>
          </label>
        </div>

        {/* Maintenance Level */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Maintenance Level
            </span>
            <select
              {...form.register('maintenanceLevel')}
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:outline-none appearance-none cursor-pointer"
            >
              <option value="low">Low - Minimal upkeep</option>
              <option value="medium">Medium - Regular care</option>
              <option value="high">High - Intensive gardening</option>
            </select>
          </label>
        </div>

        {/* Budget Min */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Budget Min (£)
            </span>
            <input
              type="number"
              {...form.register('budgetMin', { valueAsNumber: true })}
              placeholder="500"
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:outline-none"
            />
          </label>
        </div>

        {/* Budget Max */}
        <div>
          <label className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Budget Max (£)
            </span>
            <input
              type="number"
              {...form.register('budgetMax', { valueAsNumber: true })}
              placeholder="2000"
              className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="space-y-3">
          <div className="h-2 bg-dark/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-copper transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center text-stone uppercase tracking-wider">
            Generating your planting plan...
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isGenerating}
          className="px-12 py-4 bg-copper text-dark font-heading text-sm uppercase tracking-widest font-bold hover:bg-[#D4A373] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Generate My Planting Plan
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-stone/70 uppercase tracking-wider">
        Takes 2-3 minutes • No signup required • Free to try
      </p>
    </form>
  );
}
