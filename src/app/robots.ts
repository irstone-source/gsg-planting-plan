import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration
 * Allows all search engines to crawl the site
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://plantingplans.co.uk/sitemap.xml',
  };
}
