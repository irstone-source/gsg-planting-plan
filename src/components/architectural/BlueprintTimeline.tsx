'use client';

import { motion } from 'framer-motion';

interface TimelineStep {
  number: string;
  title: string;
  description: string;
}

interface BlueprintTimelineProps {
  steps: TimelineStep[];
}

export function BlueprintTimeline({ steps }: BlueprintTimelineProps) {
  return (
    <div className="space-y-12">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-8 items-start group"
        >
          {/* Blueprint Number */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 border-2 border-copper/30 flex items-center justify-center relative group-hover:border-copper/60 transition-colors duration-300">
              <span className="font-mono text-2xl font-bold text-copper">
                {step.number}
              </span>
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-copper"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-copper"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-copper"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-copper"></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pt-2">
            <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-3">
              {step.title}
            </h3>
            <p className="text-stone leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
