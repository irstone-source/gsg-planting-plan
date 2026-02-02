import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

/**
 * Dynamic sitemap for PlantingPlans
 * Includes all designer style pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://plantingplans.co.uk';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/styles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/designers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/affiliate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch all designer styles from database
  const { data: styles, error } = await supabase
    .from('designer_styles')
    .select('slug, updated_at')
    .order('slug');

  if (error || !styles) {
    console.error('Error fetching styles for sitemap:', error);
    return staticPages;
  }

  // Dynamic style pages
  const stylePages: MetadataRoute.Sitemap = styles.map((style) => ({
    url: `${baseUrl}/styles/${style.slug}`,
    lastModified: style.updated_at ? new Date(style.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...stylePages];
}
