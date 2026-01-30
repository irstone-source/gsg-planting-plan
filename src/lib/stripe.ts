import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover'
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
