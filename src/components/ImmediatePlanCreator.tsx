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
  const [isDragging, setIsDragging] = useState(false);

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
      const newFiles = Array.from(e.target.files).slice(0, 10 - images.length);
      setImages(prev => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
        .filter(file => file.type.startsWith('image/'))
        .slice(0, 10 - images.length);
      setImages(prev => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate planting plan');
      }

      const result = await response.json();
      setProgress(100);

      // Redirect to results page
      window.location.href = `/plan/${result.planId}`;
    } catch (error) {
      console.error('Error generating plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate planting plan';
      alert(`Failed to generate planting plan: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* What Do You Want? - PROMINENT */}
      <div className="bg-moss/20 border border-moss/30 p-8 rounded-sm">
        <label htmlFor="description" className="block mb-4">
          <span className="font-heading text-lg uppercase tracking-wider text-copper mb-2 block">
            What do you want in your garden?
          </span>
          <span className="text-sm text-stone block mb-4">
            Describe your vision, any specific plants you love, colors you want, features you need (wildlife, fragrance, year-round interest, etc.)
          </span>
          <textarea
            id="description"
            {...form.register('description')}
            rows={5}
            placeholder="e.g., I want a low-maintenance cottage garden with lots of purple and white flowers, some fragrant plants for bees, and something interesting in winter. I love lavender and roses but need plants that can handle partial shade and clay soil..."
            aria-required="true"
            aria-invalid={!!form.formState.errors.description}
            aria-describedby={form.formState.errors.description ? "description-error" : undefined}
            className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none resize-none leading-relaxed"
          />
          {form.formState.errors.description && (
            <span id="description-error" role="alert" className="text-xs text-red-400 mt-2 block">
              {form.formState.errors.description.message}
            </span>
          )}
        </label>
      </div>

      {/* Image Upload */}
      <div className="bg-concrete/40 border border-white/5 p-4 md:p-8">
        <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-4">
          Upload Site Photos (Optional)
        </h3>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-sm p-6 md:p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-copper bg-copper/10 scale-[1.02]'
              : 'border-white/10 hover:border-copper/50'
          }`}
        >
          <Upload
            className={`mx-auto h-10 w-10 mb-3 transition-colors duration-300 ${
              isDragging ? 'text-copper' : 'text-copper/40'
            }`}
            aria-hidden="true"
          />
          <p className="text-stone text-sm mb-2">
            Drag and drop photos here, or click to browse
          </p>
          <p className="text-stone/70 text-xs mb-4">
            Upload 3-10 photos showing different angles of your garden space
          </p>
          <label htmlFor="image-upload" className="inline-block px-6 py-3 bg-dark/50 border border-white/10 text-stone text-xs uppercase tracking-wider hover:border-copper hover:text-copper transition-colors duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-copper/50 touch-manipulation">
            Choose Files
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              aria-label="Upload site photos"
              className="sr-only"
            />
          </label>
          {images.length > 0 && (
            <p className="text-xs text-moss mt-3">
              {images.length}/10 photos uploaded
            </p>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mt-6">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative h-24 sm:h-28 md:h-32 overflow-hidden border border-white/10 rounded-sm">
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
                  className="absolute top-2 right-2 bg-dark/90 border border-copper text-copper rounded-sm p-1.5 md:p-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-copper hover:text-dark touch-manipulation"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Site Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Location */}
        <div>
          <label htmlFor="postcode" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block flex items-center gap-2">
              <MapPin className="h-4 w-4 text-copper" aria-hidden="true" />
              UK Postcode
            </span>
            <input
              id="postcode"
              type="text"
              {...form.register('postcode')}
              placeholder="e.g., SW1A 1AA"
              aria-required="true"
              aria-invalid={!!form.formState.errors.postcode}
              aria-describedby={form.formState.errors.postcode ? "postcode-error" : "postcode-help"}
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none uppercase touch-manipulation"
            />
            {form.formState.errors.postcode && (
              <span id="postcode-error" role="alert" className="text-xs text-red-400 mt-1 block">
                {form.formState.errors.postcode.message}
              </span>
            )}
            <span id="postcode-help" className="text-xs text-stone/70 mt-1 block">
              Helps determine your climate zone
            </span>
          </label>
        </div>

        {/* Area */}
        <div>
          <label htmlFor="areaSqm" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Area (m²)
            </span>
            <input
              id="areaSqm"
              type="number"
              {...form.register('areaSqm', { valueAsNumber: true })}
              placeholder="e.g., 50"
              aria-describedby="area-help"
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none touch-manipulation"
            />
            <span id="area-help" className="text-xs text-stone/70 mt-1 block">
              Optional: helps with quantities
            </span>
          </label>
        </div>

        {/* Sun Exposure */}
        <div>
          <label htmlFor="sunExposure" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block flex items-center gap-2">
              <Sun className="h-4 w-4 text-copper" aria-hidden="true" />
              Sun Exposure
            </span>
            <select
              id="sunExposure"
              {...form.register('sunExposure')}
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none appearance-none cursor-pointer"
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
          <label htmlFor="soilType" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block flex items-center gap-2">
              <Leaf className="h-4 w-4 text-copper" aria-hidden="true" />
              Soil Type
            </span>
            <select
              id="soilType"
              {...form.register('soilType')}
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none appearance-none cursor-pointer"
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
          <label htmlFor="moisture" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block flex items-center gap-2">
              <Droplets className="h-4 w-4 text-copper" aria-hidden="true" />
              Moisture Level
            </span>
            <select
              id="moisture"
              {...form.register('moisture')}
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none appearance-none cursor-pointer"
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
          <label htmlFor="style" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Garden Style
            </span>
            <select
              id="style"
              {...form.register('style')}
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none appearance-none cursor-pointer"
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
          <label htmlFor="maintenanceLevel" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Maintenance Level
            </span>
            <select
              id="maintenanceLevel"
              {...form.register('maintenanceLevel')}
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="low">Low - Minimal upkeep</option>
              <option value="medium">Medium - Regular care</option>
              <option value="high">High - Intensive gardening</option>
            </select>
          </label>
        </div>

        {/* Budget Min */}
        <div>
          <label htmlFor="budgetMin" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Budget Min (£)
            </span>
            <input
              id="budgetMin"
              type="number"
              {...form.register('budgetMin', { valueAsNumber: true })}
              placeholder="500"
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none touch-manipulation"
            />
          </label>
        </div>

        {/* Budget Max */}
        <div>
          <label htmlFor="budgetMax" className="block">
            <span className="font-heading text-xs uppercase tracking-wider text-stone mb-2 block">
              Budget Max (£)
            </span>
            <input
              id="budgetMax"
              type="number"
              {...form.register('budgetMax', { valueAsNumber: true })}
              placeholder="2000"
              className="w-full px-4 py-3 bg-dark/50 border border-white/10 text-mist placeholder:text-stone/50 focus:border-copper focus:ring-2 focus:ring-copper/50 focus:outline-none touch-manipulation"
            />
          </label>
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="space-y-3">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Plan generation progress"
            className="h-2 bg-dark/50 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-copper transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center text-stone uppercase tracking-wider" aria-live="polite">
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
