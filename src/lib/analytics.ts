/**
 * Analytics Tracking Utility
 * Privacy-friendly event tracking for PlantingPlans
 */

// Analytics event types
export type AnalyticsEvent =
  | 'page_view'
  | 'style_view'
  | 'style_detail_view'
  | 'style_cta_click'
  | 'create_plan_start'
  | 'plan_generated'
  | 'checkout_start'
  | 'purchase_complete';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, string | number | boolean>;
}

/**
 * Track an analytics event
 * Supports multiple analytics providers
 */
export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  // Google Analytics 4 (gtag)
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, properties);
  }

  // Plausible Analytics (if configured)
  if (typeof window !== 'undefined' && typeof (window as any).plausible === 'function') {
    (window as any).plausible(event, { props: properties });
  }

  // PostHog (if configured)
  if (typeof window !== 'undefined' && typeof (window as any).posthog === 'object') {
    (window as any).posthog?.capture(event, properties);
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  trackEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track style gallery view
 */
export function trackStyleGalleryView() {
  trackEvent('page_view', {
    page_type: 'style_gallery',
    page_path: '/styles',
  });
}

/**
 * Track individual style detail view
 */
export function trackStyleDetailView(styleSlug: string, styleName: string) {
  trackEvent('style_detail_view', {
    style_slug: styleSlug,
    style_name: styleName,
    page_path: `/styles/${styleSlug}`,
  });
}

/**
 * Track CTA click from style page
 */
export function trackStyleCTAClick(styleSlug: string, styleName: string, ctaType: 'create_plan' | 'learn_more') {
  trackEvent('style_cta_click', {
    style_slug: styleSlug,
    style_name: styleName,
    cta_type: ctaType,
  });
}

/**
 * Track create plan flow start
 */
export function trackCreatePlanStart(source?: string, styleSlug?: string) {
  trackEvent('create_plan_start', {
    source: source || 'direct',
    style_slug: styleSlug || 'none',
  });
}

/**
 * Track plan generation completion
 */
export function trackPlanGenerated(planId: string, styleSlug?: string) {
  trackEvent('plan_generated', {
    plan_id: planId,
    style_slug: styleSlug || 'none',
  });
}

/**
 * Track checkout start
 */
export function trackCheckoutStart(productType: string, price: number) {
  trackEvent('checkout_start', {
    product_type: productType,
    price: price,
    currency: 'GBP',
  });
}

/**
 * Track purchase completion
 */
export function trackPurchaseComplete(orderId: string, revenue: number, productType: string) {
  trackEvent('purchase_complete', {
    transaction_id: orderId,
    value: revenue,
    currency: 'GBP',
    product_type: productType,
  });

  // Enhanced e-commerce for GA4
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'purchase', {
      transaction_id: orderId,
      value: revenue,
      currency: 'GBP',
      items: [
        {
          item_name: productType,
          item_category: 'planting_plan',
          price: revenue,
          quantity: 1,
        },
      ],
    });
  }
}
