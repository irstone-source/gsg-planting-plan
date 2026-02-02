'use client';

/**
 * Style Analytics Tracking Component
 * Tracks style page views and CTA clicks
 */

import { useEffect } from 'react';
import { trackStyleDetailView, trackStyleCTAClick } from '@/lib/analytics';

interface StyleAnalyticsProps {
  styleSlug: string;
  styleName: string;
}

/**
 * Track style detail page view
 * Place this component on style detail pages
 */
export function StyleAnalytics({ styleSlug, styleName }: StyleAnalyticsProps) {
  useEffect(() => {
    // Track page view once on mount
    trackStyleDetailView(styleSlug, styleName);
  }, [styleSlug, styleName]);

  return null; // This is a tracking-only component
}

/**
 * Track CTA click wrapper
 * Use this to wrap CTA buttons/links
 */
export function trackStyleCTA(styleSlug: string, styleName: string, ctaType: 'create_plan' | 'learn_more') {
  return () => {
    trackStyleCTAClick(styleSlug, styleName, ctaType);
  };
}
