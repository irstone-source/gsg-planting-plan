import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-concrete/40">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <span className="font-heading text-lg uppercase tracking-wider font-bold text-mist block mb-1">
                PlantingPlans
              </span>
              <span className="text-xs uppercase tracking-widest text-stone">
                Designer results. DIY planting.
              </span>
            </div>
            <p className="text-sm text-stone leading-relaxed">
              Precision planting plans built around UK gardens.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] font-bold text-mist mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/examples/hub" className="text-sm text-stone hover:text-mist transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-stone hover:text-mist transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-sm text-stone hover:text-mist transition-colors">
                  Start Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Professionals */}
          <div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] font-bold text-mist mb-4">
              Professionals
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/designers" className="text-sm text-stone hover:text-mist transition-colors">
                  For Designers
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-stone hover:text-mist transition-colors">
                  For Garden Centres
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="text-sm text-stone hover:text-mist transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] font-bold text-mist mb-4">
              Tools
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tools/calculator" className="text-sm text-stone hover:text-mist transition-colors">
                  Plant Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/image-library" className="text-sm text-stone hover:text-mist transition-colors">
                  Image Library
                </Link>
              </li>
              <li>
                <Link href="/tools/plan-critique" className="text-sm text-stone hover:text-mist transition-colors">
                  Plan Critique
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs uppercase tracking-wider text-stone">
            © {new Date().getFullYear()} PlantingPlans. Built for DIY gardeners and professionals.
          </p>
          <p className="text-xs uppercase tracking-wider text-stone">
            UK-first horticultural intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
