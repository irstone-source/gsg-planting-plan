import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabase_service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  // Test Supabase connection
  let supabaseTest = { connected: false, error: null };
  try {
    const { data, error } = await supabase
      .from('planting_plans')
      .select('id')
      .limit(1);

    supabaseTest = {
      connected: !error,
      error: error?.message || null,
    };
  } catch (e) {
    supabaseTest = {
      connected: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    env_vars: checks,
    supabase_test: supabaseTest,
    timestamp: new Date().toISOString(),
  });
}
