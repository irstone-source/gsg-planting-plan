import Link from 'next/link';
import Image from 'next/image';
import { ArchitecturalCard } from '@/components/architectural';

/**
 * StyleCard Component
 * Displays a designer style in a card format with image, badges, and metadata
 */

interface StyleCardProps {
  style: {
    id: string;
    slug: string;
    name: string;
    short_description: string;
    designer_name?: string;
    style_category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    maintenance: 'low' | 'medium' | 'high';
    estimated_cost_min: number;
    estimated_cost_max: number;
    hero_image_url?: string;
  };
  index?: number;
  showAnalytics?: boolean;
}

export function StyleCard({ style, index = 0, showAnalytics = false }: StyleCardProps) {
  return (
    <Link href={`/styles/${style.slug}`}>
      <ArchitecturalCard
        title={style.name}
        description={style.short_description}
        delay={index * 0.1}
      >
        {/* Hero Image */}
        <div className="relative h-48 bg-concrete/40 mb-4 rounded-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {style.hero_image_url ? (
            <Image
              src={style.hero_image_url}
              alt={style.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-20 font-heading uppercase tracking-wider">
                {style.style_category}
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-copper/90 backdrop-blur text-dark text-xs uppercase tracking-wider font-bold rounded-sm">
              {style.style_category}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 backdrop-blur text-dark text-xs uppercase tracking-wider font-bold rounded-sm ${
              style.difficulty === 'beginner' ? 'bg-moss/90' :
              style.difficulty === 'intermediate' ? 'bg-copper/90' :
              'bg-red-700/90'
            }`}>
              {style.difficulty}
            </span>
          </div>

          {/* Maintenance Badge - Bottom Left */}
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-dark/80 backdrop-blur text-mist text-xs uppercase tracking-wider rounded-sm">
              {style.maintenance} maintenance
            </span>
          </div>
        </div>

        {/* Designer Name */}
        {style.designer_name && (
          <p className="text-sm text-copper uppercase tracking-wider mb-3">
            Inspired by {style.designer_name}
          </p>
        )}

        {/* Price Range & CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-stone/70 uppercase tracking-wider mb-1">
              Est. Cost
            </p>
            <span className="text-lg font-bold text-mist">
              £{style.estimated_cost_min}-{style.estimated_cost_max}
            </span>
          </div>
          <span className="text-copper hover:underline text-sm uppercase tracking-wider transition-colors">
            View Style →
          </span>
        </div>
      </ArchitecturalCard>
    </Link>
  );
}

/**
 * StyleCardGrid Component
 * Grid layout for multiple StyleCards
 */
interface StyleCardGridProps {
  styles: StyleCardProps['style'][];
  showAnalytics?: boolean;
}

export function StyleCardGrid({ styles, showAnalytics = false }: StyleCardGridProps) {
  if (styles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-stone mb-4">
          No designer styles available yet.
        </p>
        <p className="text-sm text-stone/70">
          Check back soon - we're curating the best UK garden styles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {styles.map((style, index) => (
        <StyleCard
          key={style.id}
          style={style}
          index={index}
          showAnalytics={showAnalytics}
        />
      ))}
    </div>
  );
}
