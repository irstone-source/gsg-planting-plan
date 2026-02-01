import { ExamplesHub } from '@/components/ExamplesHub';
import { StickyPricingCTA } from '@/components/StickyPricingCTA';

export const metadata = {
  title: 'Example Planting Plans | PlantingPlans',
  description: 'Browse 14 professional planting plans tailored to UK gardens. Filter by size, conditions, style, and maintenance level. Architectural design meets botanical expertise.'
};

export default function ExamplesHubPage() {
  return (
    <>
      <ExamplesHub />
      <StickyPricingCTA />
    </>
  );
}
