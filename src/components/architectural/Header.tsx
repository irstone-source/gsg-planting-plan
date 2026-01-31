'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark/80 backdrop-blur-md"
    >
      <nav className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <div className="flex flex-col">
            <span className="font-heading text-lg uppercase tracking-wider font-bold text-mist group-hover:text-copper transition-colors duration-300">
              PlantingPlans
            </span>
            <span className="text-[10px] uppercase tracking-widest text-stone">
              Designer results. DIY planting.
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/examples/hub"
            className="text-sm uppercase tracking-wider text-stone hover:text-mist transition-colors duration-300"
          >
            Examples
          </Link>
          <Link
            href="/pricing"
            className="text-sm uppercase tracking-wider text-stone hover:text-mist transition-colors duration-300"
          >
            Pricing
          </Link>
          <Link
            href="/designers"
            className="text-sm uppercase tracking-wider text-stone hover:text-mist transition-colors duration-300"
          >
            For Designers
          </Link>
          <Link
            href="/partners"
            className="text-sm uppercase tracking-wider text-stone hover:text-mist transition-colors duration-300"
          >
            Partners
          </Link>
          <Link
            href="/create"
            className="px-6 py-2 bg-copper text-dark text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors duration-300"
          >
            Start
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-mist">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>
    </motion.header>
  );
}
