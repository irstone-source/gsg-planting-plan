'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ArchitecturalCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  delay?: number;
  children?: ReactNode;
}

export function ArchitecturalCard({ icon, title, description, delay = 0, children }: ArchitecturalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        boxShadow: '0 0 30px -10px rgba(192, 139, 92, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      }}
      className="group bg-concrete/60 backdrop-blur-md border border-white/5 p-8 transition-all duration-500 ease-out hover:border-white/20"
    >
      {icon && (
        <div className="mb-6 text-copper opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-xs uppercase tracking-[0.2em] font-bold text-mist mb-4">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-stone">
        {description}
      </p>
      {children}
    </motion.div>
  );
}
