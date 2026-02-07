'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { RevealSection } from '@/components/architectural';
import { Loader2 } from 'lucide-react';

interface DesignerStyle {
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
  best_for?: string[];
}

interface StyleGalleryProps {
  initialStyles?: DesignerStyle[];
}

/**
 * StyleGallery Component
 * Hero-style display of designer styles on homepage
 * Optimized for style-first onboarding with clear CTAs
 */
export function StyleGallery({ initialStyles }: StyleGalleryProps) {
  const router = useRouter();
  const [styles, setStyles] = useState<DesignerStyle[]>(initialStyles || []);
  const [loading, setLoading] = useState(!initialStyles);

  useEffect(() => {
    if (!initialStyles) {
      fetchStyles();
    }
  }, [initialStyles]);

  async function fetchStyles() {
    try {
      const { data, error } = await supabase
        .from('designer_styles')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(12); // Show top 12 most viewed styles

      if (error) throw error;
      setStyles(data || []);
    } catch (error) {
      console.error('Error fetching styles:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-copper" />
      </div>
    );
  }

  return (
    <RevealSection className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {styles.map((style, index) => (
          <StyleHeroCard
            key={style.id}
            style={style}
            index={index}
            onSelect={() => router.push(`/start/${style.slug}`)}
          />
        ))}
      </div>
    </RevealSection>
  );
}

/**
 * StyleHeroCard - Individual style card optimized for conversion
 */
interface StyleHeroCardProps {
  style: DesignerStyle;
  index: number;
  onSelect: () => void;
}

function StyleHeroCard({ style, index, onSelect }: StyleHeroCardProps) {
  return (
    <div
      className="group relative bg-concrete/40 backdrop-blur-md border border-white/5 overflow-hidden hover:border-copper/50 transition-all duration-500 hover:shadow-2xl hover:shadow-copper/20"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Hero Image */}
      <div className="relative h-64 bg-dark/60 overflow-hidden">
        {style.hero_image_url ? (
          <Image
            src={style.hero_image_url}
            alt={style.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-10 font-heading uppercase tracking-wider text-center px-4">
              {style.style_category}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 backdrop-blur text-dark text-xs uppercase tracking-wider font-bold rounded-sm ${
            style.difficulty === 'beginner' ? 'bg-moss/90' :
            style.difficulty === 'intermediate' ? 'bg-copper/90' :
            'bg-red-700/90'
          }`}>
            {style.difficulty}
          </span>
          <span className="px-3 py-1 bg-dark/80 backdrop-blur text-mist text-xs uppercase tracking-wider rounded-sm">
            {style.maintenance} maintenance
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Designer Name */}
        {style.designer_name && (
          <p className="text-xs text-copper uppercase tracking-wider mb-2">
            Inspired by {style.designer_name}
          </p>
        )}

        {/* Style Name */}
        <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-3">
          {style.name}
        </h3>

        {/* Description (Emotional) */}
        <p className="text-sm text-stone leading-relaxed mb-4 line-clamp-3">
          {style.short_description}
        </p>

        {/* Best For Tags */}
        {style.best_for && style.best_for.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {style.best_for.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-stone/70 px-2 py-1 bg-dark/40 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-stone/70 uppercase tracking-wider mb-1">
              Est. Cost
            </p>
            <span className="text-lg font-bold text-mist">
              £{style.estimated_cost_min}-{style.estimated_cost_max}
            </span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onSelect}
            className="px-6 py-3 bg-copper hover:bg-copper/90 text-dark font-heading text-sm uppercase tracking-wider font-bold transition-all duration-300 hover:shadow-lg hover:shadow-copper/50 active:scale-95"
          >
            Start with this style
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-copper/30 pointer-events-none transition-colors duration-500" />
    </div>
  );
}

// Animation keyframes
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
