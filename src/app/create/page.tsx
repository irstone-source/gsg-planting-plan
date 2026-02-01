import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-auth';
import { checkEntitlements } from '@/lib/entitlements';
import { PlantingPlanForm } from '@/components/planting-plan/PlantingPlanForm';
import { Sparkles, AlertCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function CreatePage({
  searchParams,
}: {
  searchParams: { style?: string };
}) {
  const authSupabase = createServerClient();
  const { data: { user } } = await authSupabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/create');
  }

  const entitlements = await checkEntitlements(user.id);

  // Fetch designer style if provided
  let designerStyle = null;
  if (searchParams.style) {
    const { data } = await supabase
      .from('designer_styles')
      .select('id, slug, name, designer_name, style_category, design_principles')
      .eq('slug', searchParams.style)
      .single();

    designerStyle = data;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-900">PlantingPlans</span>
          </Link>
          <div className="flex items-center gap-4">
            {entitlements.hasAccess && (
              <Badge variant="outline" className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                {entitlements.creditsRemaining} credits
              </Badge>
            )}
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* No Active Pass Warning */}
        {!entitlements.hasAccess && (
          <Card className="mb-8 border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6 flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">No Active Activation Pass</h3>
                <p className="text-gray-700 mb-4">
                  You need an active Activation Pass to generate planting plans. Get a DIY Pass (£79) or Pro Pass (£249) to unlock plan generation credits.
                </p>
                <Link href="/pricing">
                  <Button className="bg-green-600 hover:bg-green-700">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Credits Warning */}
        {entitlements.hasAccess && entitlements.creditsRemaining === 0 && (
          <Card className="mb-8 border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6 flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Out of Credits</h3>
                <p className="text-gray-700 mb-4">
                  You have used all {entitlements.tier === 'diy' ? '5' : '20'} plan generation credits from your {entitlements.tier?.toUpperCase()} Pass. Upgrade to get more credits or wait for your next pass.
                </p>
                <Link href="/pricing">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Upgrade Pass
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Generation Form */}
        {entitlements.hasAccess && entitlements.creditsRemaining > 0 ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Create a Planting Plan</h1>
              <p className="text-gray-600">
                Generate a professional planting plan using AI. This will consume 1 credit.
              </p>
            </div>

            {/* Designer Style Badge */}
            {designerStyle && (
              <Card className="mb-6 border-2 border-green-200 bg-green-50">
                <CardContent className="pt-6 flex items-start gap-4">
                  <Sparkles className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Style Selected: {designerStyle.name}</h3>
                    {designerStyle.designer_name && (
                      <p className="text-sm text-gray-700 mb-2">
                        Inspired by {designerStyle.designer_name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Your plan will be adapted to this style using the design principles and plant palette that define this approach.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <PlantingPlanForm preselectedStyle={designerStyle?.slug} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Unlock plan generation by getting an Activation Pass
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
