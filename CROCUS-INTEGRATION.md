# Crocus.co.uk Integration

## Overview

The system now integrates with **Crocus.co.uk**, one of the UK's leading online plant retailers, to provide:
- 📸 **High-quality product images**
- 💷 **Real-time pricing** (with sale detection)
- 🛒 **Direct purchase links**
- ⭐ **Customer ratings and reviews**
- 📦 **Stock availability** and pot sizes
- 🔄 **Automatic price updates** (cached for 7 days)

## Why Crocus.co.uk?

- **Comprehensive UK Selection**: 11,000+ plants suitable for UK gardens
- **Quality Imagery**: Professional product photography
- **Reliable Supplier**: Established 1994, trusted by professionals
- **Detailed Product Info**: Pot sizes, ratings, reviews
- **Competitive Pricing**: Regular sales and promotions

## Database Schema

```sql
-- Add these fields to the plants table
ALTER TABLE plants
ADD COLUMN crocus_product_name TEXT,
ADD COLUMN crocus_product_url TEXT,
ADD COLUMN crocus_image_url TEXT,
ADD COLUMN crocus_price_gbp DECIMAL(10, 2),
ADD COLUMN crocus_original_price_gbp DECIMAL(10, 2),
ADD COLUMN crocus_availability TEXT,
ADD COLUMN crocus_pot_size TEXT,
ADD COLUMN crocus_rating DECIMAL(3, 2),
ADD COLUMN crocus_review_count INTEGER,
ADD COLUMN crocus_fetched_at TIMESTAMPTZ;
```

**To apply**: Run the SQL in `/add-retail-fields.sql` via Supabase Dashboard → SQL Editor

## Usage

### 1. Fetch Retail Data for a Plan

```bash
node fetch-crocus-data.mjs <planId> [limit]
```

**Example:**
```bash
node fetch-crocus-data.mjs 416f217f-130a-4b8b-8813-b149dcc6163b 5
```

**Output:**
```
🛒 Fetching Crocus.co.uk retail data...
⏱️  This will take ~2 seconds per plant (rate limiting)...

✅ Crocus data fetch complete!

📊 Summary:
   Total plants: 5
   ✅ Success: 4
   ❌ Errors: 1
   ⏭️  Skipped (recent): 0

🛒 Retail Data:
   1. ✅ Betula pendula
      Product: Silver Birch (Betula pendula)
      Price: £24.99
      Availability: In stock
      Pot Size: 3 litre pot
      Rating: 4.5/5 (127 reviews)
      Link: https://www.crocus.co.uk/plants/_/...
```

### 2. Auto-Update Pricing

The system automatically:
- ✅ **Caches data for 7 days** (prevents excessive scraping)
- ✅ **Skips recent fetches** (reduces load on Crocus)
- ✅ **Rate limits requests** (2 seconds between plants)
- ✅ **Updates stale prices** (older than 7 days)

### 3. View Retail Data

Visit: `http://localhost:3000/examples/scientific-viz`

The page now displays a **"Where to Buy"** section for each plant with:
- Product image from Crocus
- Current price (with sale prices)
- Customer rating and review count
- Stock availability
- Pot size
- Direct "Buy from Crocus" button
- Price last updated timestamp

## API Endpoint

### POST `/api/fetch-crocus-data`

**Request Body:**
```json
{
  "planId": "416f217f-130a-4b8b-8813-b149dcc6163b",
  "limit": 5
}
```

**Response:**
```json
{
  "success": true,
  "planId": "...",
  "results": [
    {
      "plant_id": "...",
      "botanical_name": "Betula pendula",
      "crocus_data": {
        "product_name": "Silver Birch (Betula pendula)",
        "product_url": "https://www.crocus.co.uk/plants/...",
        "image_url": "https://www.crocus.co.uk/images/...",
        "price_gbp": 24.99,
        "original_price_gbp": null,
        "availability": "In stock",
        "pot_size": "3 litre pot",
        "rating": 4.5,
        "review_count": 127,
        "fetched_at": "2026-01-31T23:00:00.000Z"
      },
      "success": true
    }
  ],
  "summary": {
    "total": 5,
    "success": 4,
    "errors": 1,
    "skipped": 0
  }
}
```

## Scraper Details

### How It Works

1. **Search**: Queries Crocus.co.uk search page with botanical name
2. **Parse**: Extracts first matching product using Cheerio (HTML parser)
3. **Extract Data**:
   - Product name and URL
   - Main product image
   - Current price and original price (for sales)
   - Availability status
   - Pot size from description
   - Customer rating and review count
4. **Store**: Updates database with retail information
5. **Cache**: Timestamps fetch to avoid re-scraping for 7 days

### Rate Limiting

- **2 seconds** between requests
- Respects Crocus servers
- Prevents IP blocking
- For 100 plants: ~3.5 minutes total

### Error Handling

- Gracefully handles plants not found on Crocus
- Skips plants with recent data (< 7 days)
- Logs all errors without stopping batch process
- Returns detailed error information per plant

## Ethical Scraping

### ✅ Best Practices Followed

1. **Respectful Rate Limiting**: 2s delays between requests
2. **User-Agent Header**: Identifies as legitimate browser
3. **Image Linking**: Links to Crocus images (not downloading)
4. **Attribution**: Clear "Buy from Crocus" branding
5. **Caching**: 7-day minimum between re-fetches
6. **Terms Compliance**: Personal/educational use, driving traffic to Crocus

### 🚫 What We DON'T Do

- ❌ Download or store their images (we link to them)
- ❌ Scrape without rate limiting
- ❌ Hide our user agent
- ❌ Build a competing retail platform
- ❌ Resell or redistribute their data

### 📜 Legal Considerations

- **UK Law**: Database rights protect Crocus' plant catalog
- **Fair Use**: Linking to products with attribution (legitimate)
- **Commercial Use**: If deploying commercially, consider:
  - Crocus affiliate program (earn commission)
  - Official API partnership (if available)
  - Licensing agreement for high-volume usage

## UI Components

### Where to Buy Section

```tsx
{plant.crocus_product_url && (
  <div className="border-l-4 border-orange-600 pl-4 bg-orange-50 p-4 rounded-r">
    <h3>🛒 Where to Buy</h3>
    {/* Product image, name, rating */}
    {/* Price with sale detection */}
    {/* Stock availability */}
    {/* Buy button linking to Crocus */}
    {/* Price last updated timestamp */}
  </div>
)}
```

**Visual Design:**
- 🟠 Orange accent (Crocus brand color)
- 📸 Product thumbnail (80×80px)
- ⭐ Star rating with review count
- 💷 Large price display with sale strikethrough
- 🛒 Prominent "Buy from Crocus" button
- 📅 Subtle "Price updated" timestamp

## Data Freshness

| Age | Status | Action |
|-----|--------|--------|
| < 7 days | Fresh | Use cached data, skip fetch |
| 7-30 days | Stale | Re-fetch on next request |
| > 30 days | Very Stale | Priority re-fetch |

**Update Strategy:**
- Manual update: `node fetch-crocus-data.mjs <planId>`
- Automatic: Cron job (weekly price updates)
- On-demand: API call when viewing plant

## Future Enhancements

1. **Affiliate Integration**
   - Apply for Crocus affiliate program
   - Earn commission on sales (5-10% typical)
   - Track conversion rates

2. **Price Alerts**
   - Notify users when plants go on sale
   - Track price history
   - Best time to buy recommendations

3. **Stock Monitoring**
   - Alert when out-of-stock plants return
   - Alternative supplier suggestions
   - Pre-order notifications

4. **Multi-Retailer Support**
   - Add RHS Plants, Burncoose, Crocus
   - Price comparison across suppliers
   - Best deal recommendations

5. **Shopping List Export**
   - Generate plant shopping list
   - Calculate total cost
   - Export to CSV/PDF for ordering

## Testing

### Test Single Plant

```bash
# Edit test-crocus.mjs to test a specific plant
node test-crocus.mjs
```

### Test Full Plan

```bash
# Fetch data for 3 plants to test
node fetch-crocus-data.mjs <planId> 3
```

### Verify Database

```sql
SELECT
  botanical_name,
  crocus_product_name,
  crocus_price_gbp,
  crocus_availability,
  crocus_fetched_at
FROM plants
WHERE crocus_product_url IS NOT NULL
ORDER BY crocus_fetched_at DESC;
```

## Troubleshooting

### "No products found"
- Check botanical name spelling
- Plant may not be in Crocus catalog
- Try common name search instead

### "Database update failed"
- Run migration: `add-retail-fields.sql`
- Check Supabase connection
- Verify table permissions

### "Rate limit exceeded"
- Wait 10 minutes before retrying
- Reduce batch size
- Increase delay between requests

## Support

For issues with Crocus integration:
1. Check scraper logs for specific errors
2. Verify plant exists on Crocus.co.uk manually
3. Test with known plants (Betula pendula, Acer campestre)
4. Review rate limiting and caching behavior
