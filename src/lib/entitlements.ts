import { supabase } from './supabase';

export async function checkEntitlements(userId: string) {
  const { data: pass } = await supabase
    .from('activation_passes')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!pass) {
    return {
      hasAccess: false,
      tier: null,
      creditsRemaining: 0,
      vaultSlots: 0,
      expiresAt: null
    };
  }

  const now = new Date();
  const expiresAt = new Date(pass.expires_at);
  const hasAccess = now < expiresAt;

  return {
    hasAccess,
    tier: pass.tier,
    creditsRemaining: pass.credits_remaining,
    vaultSlots: pass.vault_slots,
    expiresAt
  };
}

export async function consumeCredit(userId: string): Promise<boolean> {
  const { data: pass } = await supabase
    .from('activation_passes')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!pass || pass.credits_remaining <= 0) {
    return false;
  }

  const { error } = await supabase
    .from('activation_passes')
    .update({ credits_remaining: pass.credits_remaining - 1 })
    .eq('id', pass.id);

  return !error;
}
