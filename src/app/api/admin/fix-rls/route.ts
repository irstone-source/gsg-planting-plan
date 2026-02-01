import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  // This endpoint runs the RLS policy fix migration
  // It should only be called once to fix the database

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key needed for admin operations
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Read the SQL migration file
    const fs = require('fs');
    const path = require('path');
    const sqlPath = path.join(process.cwd(), 'fix-rls-policies.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0 && !s.startsWith('--'));

    const results = [];
    for (const statement of statements) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error('Error executing statement:', error);
          results.push({ statement: statement.substring(0, 50) + '...', error: error.message });
        } else {
          results.push({ statement: statement.substring(0, 50) + '...', success: true });
        }
      } catch (err: any) {
        results.push({ statement: statement.substring(0, 50) + '...', error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'RLS policies migration completed',
      results
    });

  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
