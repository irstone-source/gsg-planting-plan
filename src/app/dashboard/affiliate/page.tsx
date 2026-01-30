import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, TrendingUp, Users, DollarSign, Copy, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AffiliateDashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/dashboard/affiliate');
  }

  // Fetch affiliate data
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <header className="border-b bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-900">PlantingPlans</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">← Back to Dashboard</Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">No Affiliate Account Found</h1>
          <p className="text-gray-600 mb-8">
            You have not applied to the PlantingPlans affiliate program yet.
          </p>
          <Link href="/affiliate">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Apply to Affiliate Program
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${affiliate.code}`;
  const conversionRate = affiliate.total_clicks > 0
    ? ((affiliate.total_conversions / affiliate.total_clicks) * 100).toFixed(1)
    : '0';

  const earningsGBP = (affiliate.total_earnings_pence / 100).toFixed(2);

  // Check if founding creator rate is still active
  const now = new Date();
  const foundingExpiry = affiliate.founding_expires_at ? new Date(affiliate.founding_expires_at) : null;
  const isFoundingActive = foundingExpiry && now < foundingExpiry;
  const currentRate = isFoundingActive ? 30 : 20;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-green-900">PlantingPlans</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge className={isFoundingActive ? "bg-orange-600" : "bg-blue-600"}>
              {currentRate}% Commission
            </Badge>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Main Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Status Banner */}
        {affiliate.status === 'pending' && (
          <Card className="mb-8 border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Application Pending</h3>
              <p className="text-gray-700">
                Your affiliate application is under review. We typically approve applications within 24 hours.
                You will receive an email once approved.
              </p>
            </CardContent>
          </Card>
        )}

        {affiliate.status === 'suspended' && (
          <Card className="mb-8 border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Account Suspended</h3>
              <p className="text-gray-700">
                Your affiliate account has been suspended. Please contact support for more information.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Affiliate Dashboard</h1>
          <p className="text-gray-600">Track your performance and earnings</p>
        </div>

        {/* Stats Overview */}
        {affiliate.status === 'active' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {/* Total Clicks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Clicks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {affiliate.total_clicks}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    total clicks tracked
                  </p>
                </CardContent>
              </Card>

              {/* Conversions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {affiliate.total_conversions}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {conversionRate}% conversion rate
                  </p>
                </CardContent>
              </Card>

              {/* Earnings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    £{earningsGBP}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    total commission earned
                  </p>
                </CardContent>
              </Card>

              {/* Commission Rate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {currentRate}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {isFoundingActive ? 'Founding creator bonus' : 'Standard rate'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Referral Link */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>Share this link to earn commission on purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralUrl}
                    readOnly
                    className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(referralUrl)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Link href={referralUrl} target="_blank">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                  </Link>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-gray-700">
                    Your referral code is <code className="bg-white px-2 py-1 rounded font-mono">{affiliate.code}</code>.
                    Cookies last 30 days, so anyone who clicks your link gets attributed to you for a month!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Founding Creator Status */}
            {isFoundingActive && foundingExpiry && (
              <Card className="mb-8 border-2 border-orange-200">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Badge className="bg-orange-600">Founding Creator</Badge>
                    30% Commission Active
                  </h3>
                  <p className="text-gray-700 mb-2">
                    You are earning 30% commission as a founding creator! This rate expires on{' '}
                    <strong>{foundingExpiry.toLocaleDateString('en-GB')}</strong>, after which you
                    will earn the standard 20% rate.
                  </p>
                  <p className="text-sm text-gray-600">
                    Time remaining: {Math.ceil((foundingExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Quick Links */}
        <div className="flex gap-4">
          <Link href="/affiliate">
            <Button variant="outline">
              View Affiliate Page
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
