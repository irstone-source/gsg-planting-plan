'use client';

/**
 * Style CTA Button with Analytics Tracking
 */

import Link from 'next/link';
import { trackStyleCTAClick } from '@/lib/analytics';

interface StyleCTAButtonProps {
  styleSlug: string;
  styleName: string;
  className?: string;
  children: React.ReactNode;
}

export function StyleCTAButton({ styleSlug, styleName, className, children }: StyleCTAButtonProps) {
  const handleClick = () => {
    trackStyleCTAClick(styleSlug, styleName, 'create_plan');
  };

  return (
    <Link
      href={`/create?style=${styleSlug}`}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
