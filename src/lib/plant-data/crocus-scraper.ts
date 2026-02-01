/**
 * Crocus.co.uk Plant Data Scraper
 * Fetches retail data including images, prices, and purchase links
 */

import * as cheerio from 'cheerio';

export interface CrocusPlantData {
  botanical_name: string;
  product_name: string;
  product_url: string;
  image_url: string;
  price_gbp: number;
  original_price_gbp?: number; // For sale items
  availability: string;
  pot_size?: string;
  rating?: number;
  review_count?: number;
  fetched_at: Date;
}

/**
 * Search Crocus for a plant by botanical name
 */
export async function searchCrocusPlant(botanicalName: string): Promise<CrocusPlantData | null> {
  try {
    // Search URL
    const searchQuery = encodeURIComponent(botanicalName);
    const searchUrl = `https://www.crocus.co.uk/search/_/search.${searchQuery}/`;

    console.log(`🔍 Searching Crocus for: ${botanicalName}`);

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.log(`⚠️ Crocus search failed: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Find the first product in search results
    const firstProduct = $('.product-list-item').first();

    if (firstProduct.length === 0) {
      console.log(`❌ No products found on Crocus for: ${botanicalName}`);
      return null;
    }

    // Extract product data
    const productLink = firstProduct.find('a.product-name').attr('href');
    const productName = firstProduct.find('a.product-name').text().trim();
    const imageUrl = firstProduct.find('img.product-image').attr('src') || firstProduct.find('img').attr('src');

    // Price extraction
    const priceText = firstProduct.find('.price-now, .price').first().text().trim();
    const priceMatch = priceText.match(/£([\d.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

    // Original price (if on sale)
    const originalPriceText = firstProduct.find('.price-was').text().trim();
    const originalPriceMatch = originalPriceText.match(/£([\d.]+)/);
    const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1]) : undefined;

    // Availability
    const availability = firstProduct.find('.availability, .stock-status').text().trim() || 'Check availability';

    // Pot size
    const potSize = firstProduct.find('.pot-size, .size').text().trim();

    // Rating
    const ratingElement = firstProduct.find('.rating, [data-rating]');
    const ratingAttr = ratingElement.attr('data-rating') || ratingElement.attr('title');
    const ratingMatch = ratingAttr?.match(/([\d.]+)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;

    // Review count
    const reviewText = firstProduct.find('.review-count').text().trim();
    const reviewMatch = reviewText.match(/(\d+)/);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : undefined;

    const fullUrl = productLink?.startsWith('http')
      ? productLink
      : `https://www.crocus.co.uk${productLink}`;

    const fullImageUrl = imageUrl?.startsWith('http')
      ? imageUrl
      : imageUrl?.startsWith('//')
      ? `https:${imageUrl}`
      : `https://www.crocus.co.uk${imageUrl}`;

    const plantData: CrocusPlantData = {
      botanical_name: botanicalName,
      product_name: productName,
      product_url: fullUrl,
      image_url: fullImageUrl || '',
      price_gbp: price,
      original_price_gbp: originalPrice,
      availability,
      pot_size: potSize || undefined,
      rating,
      review_count: reviewCount,
      fetched_at: new Date(),
    };

    console.log(`✅ Found on Crocus: ${productName} - £${price}`);

    return plantData;
  } catch (error) {
    console.error(`❌ Error scraping Crocus:`, error);
    return null;
  }
}

/**
 * Fetch detailed product page data (more comprehensive)
 */
export async function fetchCrocusProductDetails(productUrl: string): Promise<Partial<CrocusPlantData> | null> {
  try {
    console.log(`📄 Fetching product details from: ${productUrl}`);

    const response = await fetch(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract more detailed information from product page
    const details: Partial<CrocusPlantData> = {};

    // Main product image (usually higher quality)
    const mainImage = $('.product-image-main img, .main-image img').attr('src');
    if (mainImage) {
      details.image_url = mainImage.startsWith('http')
        ? mainImage
        : mainImage.startsWith('//')
        ? `https:${mainImage}`
        : `https://www.crocus.co.uk${mainImage}`;
    }

    // Additional details
    const productDetails = $('.product-details, .product-info').text();
    if (productDetails) {
      // Extract pot size
      const potMatch = productDetails.match(/(\d+(?:\.\d+)?)\s*(?:litre|ltr|L)\s*pot/i);
      if (potMatch) {
        details.pot_size = potMatch[0];
      }
    }

    return details;
  } catch (error) {
    console.error(`❌ Error fetching product details:`, error);
    return null;
  }
}

/**
 * Batch search for multiple plants
 */
export async function batchSearchCrocus(botanicalNames: string[]): Promise<Map<string, CrocusPlantData>> {
  const results = new Map<string, CrocusPlantData>();

  for (const name of botanicalNames) {
    const data = await searchCrocusPlant(name);
    if (data) {
      results.set(name, data);
    }

    // Rate limiting: wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return results;
}
