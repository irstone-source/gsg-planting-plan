import { ExamplesHub } from '@/components/ExamplesHub';
import { StickyPricingCTA } from '@/components/StickyPricingCTA';

export const metadata = {
  title: 'Example Plans, Designer Styles & Plant Symbols | PlantingPlans',
  description: 'Browse 14 professional planting plans, 9 designer-inspired styles (Chelsea, Piet Oudolf, Monty Don), and parametric plant symbol library. Scientific visualization meets landscape architecture.'
};

export default function ExamplesHubPage() {
  return (
    <>
      <ExamplesHub />
      <StickyPricingCTA />
    </>
  );
}
