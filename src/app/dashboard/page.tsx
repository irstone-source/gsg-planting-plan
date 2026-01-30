import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-auth';
import { checkEntitlements } from '@/lib/entitlements';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, Calendar, CreditCard, Archive, LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const entitlements = await checkEntitlements(user.id);

  // Fetch user's plans
  const { data: plans } = await supabase
    .from('planting_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const daysUntilExpiry = entitlements.expiresAt
    ? Math.ceil((new Date(entitlements.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-900">
            <Sparkles className="h-6 w-6 text-green-600" />
            PlantingPlans
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <form action="/auth/logout" method="post">
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage your planting plans and account</p>
        </div>

        {/* Entitlements Overview */}
        {!entitlements.hasAccess ? (
          <Card className="mb-8 border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                No Active Pass
              </CardTitle>
              <CardDescription>
                Get an Activation Pass to unlock plan generation credits and vault slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing">
                <Button className="bg-green-600 hover:bg-green-700">
                  View Pricing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Credits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {entitlements.creditsRemaining}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  plan generations remaining
                </p>
              </CardContent>
            </Card>

            {/* Vault Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Archive className="h-5 w-5 text-blue-600" />
                  Vault Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {plans?.filter(p => p.in_vault).length || 0} / {entitlements.vaultSlots}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  slots used
                </p>
              </CardContent>
            </Card>

            {/* Expiry */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Pass Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={daysUntilExpiry > 30 ? "bg-green-600" : "bg-orange-600"}>
                  {entitlements.tier?.toUpperCase()}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  {daysUntilExpiry > 0 ? (
                    <>Expires {formatDate(entitlements.expiresAt!.toString())}</>
                  ) : (
                    <>Expired</>
                  )}
                </p>
                {daysUntilExpiry > 0 && daysUntilExpiry <= 30 && (
                  <p className="text-xs text-orange-600 mt-1">
                    {daysUntilExpiry} days remaining
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link href="/create">
            <Button className="bg-green-600 hover:bg-green-700">
              Create New Plan
            </Button>
          </Link>
          <Link href="/examples/hub">
            <Button variant="outline">
              Browse Examples
            </Button>
          </Link>
        </div>

        {/* User's Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Your Planting Plans</CardTitle>
            <CardDescription>
              {plans?.length || 0} plan{plans?.length !== 1 ? 's' : ''} created
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!plans || plans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You have not created any plans yet.</p>
                <Link href="/create">
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Create Your First Plan
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{plan.project_name || 'Untitled Plan'}</h3>
                        {plan.in_vault && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Archive className="h-3 w-3 mr-1" />
                            In Vault
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Created {formatDate(plan.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/plan/${plan.id}`}>
                        <Button variant="outline" size="sm">
                          View Plan
                        </Button>
                      </Link>
                      {entitlements.hasAccess && !plan.in_vault && (
                        <form action={`/api/vault/add`} method="post">
                          <input type="hidden" name="planId" value={plan.id} />
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              (plans?.filter(p => p.in_vault).length || 0) >= entitlements.vaultSlots
                            }
                          >
                            <Archive className="h-4 w-4 mr-1" />
                            Add to Vault
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
