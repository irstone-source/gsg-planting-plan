/**
 * Philosophy Section Component
 * Displays long-form design philosophy content with quotes, principles, and references
 */

import React from 'react';
import { DesignPhilosophy } from '@/data/design-philosophies';
import { ExternalLink, Check, BookOpen } from 'lucide-react';

interface PhilosophySectionProps {
  philosophy: DesignPhilosophy;
}

export function PhilosophySection({ philosophy }: PhilosophySectionProps) {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="max-w-3xl">
        <h2 className="text-3xl font-light text-stone-900 mb-4">
          Design Philosophy
        </h2>
        <p className="text-stone-600 leading-relaxed text-lg">
          {philosophy.introduction}
        </p>
      </div>

      {/* Key Principles */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-8">
        <h3 className="text-2xl font-light text-stone-900 mb-6 flex items-center gap-2">
          <Check className="w-6 h-6 text-copper-600" />
          Key Principles
        </h3>
        <PrinciplesList principles={philosophy.keyPrinciples} />
      </div>

      {/* Notable Quotes */}
      <div className="space-y-8">
        <h3 className="text-2xl font-light text-stone-900">
          What the Designers Say
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {philosophy.notableQuotes.map((quote, idx) => (
            <QuoteBlock key={idx} quote={quote} />
          ))}
        </div>
      </div>

      {/* Philosophy Sections */}
      <div className="space-y-10">
        {philosophy.sections.map((section, idx) => (
          <div key={idx} className="max-w-3xl">
            <h3 className="text-xl font-medium text-stone-900 mb-4">
              {section.heading}
            </h3>
            <div className="prose prose-stone max-w-none">
              {section.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="text-stone-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            {section.quote && (
              <div className="mt-6">
                <QuoteBlock
                  quote={{
                    text: section.quote.text,
                    author: section.quote.author,
                    context: section.quote.source
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* References */}
      <div className="border-t border-stone-200 pt-8">
        <h3 className="text-2xl font-light text-stone-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-copper-600" />
          References & Further Reading
        </h3>
        <ReferenceLinks references={philosophy.references} />
      </div>
    </div>
  );
}

/**
 * Quote Block Component
 */
interface QuoteBlockProps {
  quote: {
    text: string;
    author: string;
    context: string;
  };
}

function QuoteBlock({ quote }: QuoteBlockProps) {
  return (
    <blockquote className="border-l-4 border-copper-600 pl-6 py-2 bg-stone-50 rounded-r-lg">
      <p className="text-stone-700 italic text-lg mb-3 leading-relaxed">
        "{quote.text}"
      </p>
      <footer className="text-sm">
        <cite className="font-medium text-stone-900 not-italic">
          {quote.author}
        </cite>
        <span className="text-stone-500 block mt-1">
          {quote.context}
        </span>
      </footer>
    </blockquote>
  );
}

/**
 * Principles List Component
 */
interface PrinciplesListProps {
  principles: string[];
}

function PrinciplesList({ principles }: PrinciplesListProps) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {principles.map((principle, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-copper-100 flex items-center justify-center mt-0.5">
            <Check className="w-4 h-4 text-copper-700" />
          </span>
          <span className="text-stone-700 leading-relaxed">
            {principle}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Reference Links Component
 */
interface ReferenceLinksProps {
  references: {
    title: string;
    url: string;
    type: 'book' | 'article' | 'garden' | 'interview';
  }[];
}

function ReferenceLinks({ references }: ReferenceLinksProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return '📚';
      case 'garden':
        return '🌿';
      case 'interview':
        return '🎙️';
      default:
        return '📄';
    }
  };

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {references.map((ref, idx) => (
        <li key={idx}>
          <a
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 border border-stone-200 rounded-lg hover:border-copper-400 hover:bg-stone-50 transition-colors group"
          >
            <span className="text-2xl flex-shrink-0">
              {getTypeIcon(ref.type)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-900 group-hover:text-copper-700 transition-colors">
                {ref.title}
              </div>
              <div className="text-sm text-stone-500 capitalize">
                {ref.type}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400 flex-shrink-0 mt-1" />
          </a>
        </li>
      ))}
    </ul>
  );
}
