'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, MapPin, Sun, Droplets, Leaf, Palette, Calendar, PoundSterling, Sparkles, Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
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
  specialRequirements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function PlantingPlanForm() {
  const [currentTab, setCurrentTab] = useState('images');
  const [images, setImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

      // Call API endpoint
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Create Your Planting Plan</CardTitle>
          <CardDescription>
            Share details about your site and preferences to receive AI-powered planting recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="images">
                <Upload className="mr-2 h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="site">
                <MapPin className="mr-2 h-4 w-4" />
                Site Details
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Palette className="mr-2 h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Site Photos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload 3-10 photos showing different angles of your garden space
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="max-w-xs mx-auto"
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setCurrentTab('site')}>
                  Continue to Site Details
                </Button>
              </div>
            </TabsContent>

            {/* Site Details Tab */}
            <TabsContent value="site">
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <MapPin className="text-gray-400" />
                            <Input placeholder="e.g., SW1A 1AA" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your postcode helps us determine climate zone and plant suitability
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sunExposure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sun Exposure</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sun exposure" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full_sun">Full Sun (6+ hours)</SelectItem>
                            <SelectItem value="partial_shade">Partial Shade (3-6 hours)</SelectItem>
                            <SelectItem value="full_shade">Full Shade (&lt;3 hours)</SelectItem>
                            <SelectItem value="mixed">Mixed Conditions</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="soilType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Soil Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select soil type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="clay">Clay</SelectItem>
                            <SelectItem value="loam">Loam</SelectItem>
                            <SelectItem value="sand">Sand</SelectItem>
                            <SelectItem value="chalk">Chalk</SelectItem>
                            <SelectItem value="peat">Peat</SelectItem>
                            <SelectItem value="silt">Silt</SelectItem>
                            <SelectItem value="unknown">Not Sure</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="moisture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moisture Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select moisture level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dry">Dry</SelectItem>
                            <SelectItem value="moist">Moist</SelectItem>
                            <SelectItem value="wet">Wet</SelectItem>
                            <SelectItem value="variable">Variable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="areaSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approximate Area (m²)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 50"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Optional: helps with quantity recommendations</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentTab('images')}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setCurrentTab('preferences')}>
                      Continue to Preferences
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Garden Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cottage">Cottage Garden</SelectItem>
                            <SelectItem value="contemporary">Contemporary</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="wildlife">Wildlife Friendly</SelectItem>
                            <SelectItem value="low_maintenance">Low Maintenance</SelectItem>
                            <SelectItem value="mixed">Mixed Style</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maintenanceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select maintenance level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low - Minimal upkeep</SelectItem>
                            <SelectItem value="medium">Medium - Regular care</SelectItem>
                            <SelectItem value="high">High - Intensive gardening</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budgetMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Min (£)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="500"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Max (£)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2000"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Pet-friendly plants, fragrant flowers, year-round interest..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Any specific needs or preferences for your planting plan
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isGenerating && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <p className="text-sm text-center text-gray-600">
                        Generating your planting plan...
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentTab('site')}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isGenerating || images.length === 0}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Planting Plan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
