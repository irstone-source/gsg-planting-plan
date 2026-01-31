import Link from 'next/link';
import { MagneticButton } from '@/components/architectural';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark text-mist flex items-center justify-center">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="font-heading text-9xl md:text-[12rem] uppercase tracking-wider font-bold text-copper/20">
              404
            </h1>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist">
              PAGE NOT FOUND
            </h2>
            <p className="text-lg text-stone max-w-lg mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <MagneticButton href="/" variant="copper">
              RETURN HOME
            </MagneticButton>
            <MagneticButton href="/examples/hub" variant="ghost">
              VIEW EXAMPLES
            </MagneticButton>
          </div>

          {/* Quick Links */}
          <div className="pt-12 border-t border-white/5">
            <p className="text-xs uppercase tracking-widest text-stone mb-4">
              Quick Links
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/pricing" className="text-stone hover:text-copper transition-colors">
                Pricing
              </Link>
              <span className="text-stone/30">•</span>
              <Link href="/designers" className="text-stone hover:text-copper transition-colors">
                For Designers
              </Link>
              <span className="text-stone/30">•</span>
              <Link href="/partners" className="text-stone hover:text-copper transition-colors">
                Partners
              </Link>
              <span className="text-stone/30">•</span>
              <Link href="/create" className="text-stone hover:text-copper transition-colors">
                Create Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
