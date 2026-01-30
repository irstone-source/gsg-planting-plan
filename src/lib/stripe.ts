import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover'
    });
  }
  return stripeInstance;
}

// For backwards compatibility
export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop) => {
    return getStripe()[prop as keyof Stripe];
  }
});

export const ACTIVATION_PASS_PRICES = {
  diy: {
    amount: 7900, // £79
    credits: 5,
    vaultSlots: 1
  },
  pro: {
    amount: 24900, // £249
    credits: 20,
    vaultSlots: 5
  }
};
