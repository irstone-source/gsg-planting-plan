import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-auth';

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

    // Remove from vault
    const { error } = await supabase
      .from('planting_plans')
      .update({ in_vault: false })
      .eq('id', planId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Vault remove error:', error);
      return NextResponse.json({ error: 'Failed to remove from vault' }, { status: 500 });
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error: any) {
    console.error('Vault remove API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
