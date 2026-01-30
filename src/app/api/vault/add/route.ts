import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-auth';
import { checkEntitlements } from '@/lib/entitlements';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const formData = await request.formData();
    const planId = formData.get('planId') as string;

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    // Check entitlements
    const entitlements = await checkEntitlements(user.id);

    if (!entitlements.hasAccess) {
      return NextResponse.json({ error: 'Active pass required' }, { status: 403 });
    }

    // Check current vault count
    const { data: vaultedPlans } = await supabase
      .from('planting_plans')
      .select('id')
      .eq('user_id', user.id)
      .eq('in_vault', true);

    if ((vaultedPlans?.length || 0) >= entitlements.vaultSlots) {
      return NextResponse.json(
        { error: 'Vault is full. Remove a plan first or upgrade your pass.' },
        { status: 403 }
      );
    }

    // Add to vault
    const { error } = await supabase
      .from('planting_plans')
      .update({ in_vault: true })
      .eq('id', planId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Vault add error:', error);
      return NextResponse.json({ error: 'Failed to add to vault' }, { status: 500 });
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error: any) {
    console.error('Vault API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
