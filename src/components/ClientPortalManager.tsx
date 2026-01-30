'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Link as LinkIcon, Copy, CheckCircle } from 'lucide-react';

const EXAMPLE_PLANS = [
  { slug: 'london-contemporary-urban-oasis', title: 'Contemporary Urban Oasis - London' },
  { slug: 'liverpool-courtyard-jungle', title: 'Courtyard Jungle - Liverpool' },
  { slug: 'birmingham-small-space-big-impact', title: 'Small Space Big Impact - Birmingham' },
  { slug: 'brighton-coastal-calm-courtyard', title: 'Coastal Calm Courtyard - Brighton' },
  { slug: 'edinburgh-scottish-wildlife-haven', title: 'Scottish Wildlife Haven - Edinburgh' },
  { slug: 'glasgow-wet-winter-proof-framework', title: 'Wet Winter-Proof Framework - Glasgow' },
  { slug: 'cardiff-rain-friendly-wildlife-garden', title: 'Rain-Friendly Wildlife Garden - Cardiff' },
];

export function ClientPortalManager() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [password, setPassword] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [allowComments, setAllowComments] = useState(true);
  const [creating, setCreating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createShareLink = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/portal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          password: password || null,
          expiryDays,
          allowComments
        })
      });

      const data = await response.json();
      if (data.success) {
        const fullUrl = `${window.location.origin}/portal/${data.shareId}`;
        setShareLink(fullUrl);
      } else {
        alert('Failed to create share link');
      }
    } catch (err) {
      console.error('Error creating share link:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setShareLink(null);
    setSelectedPlan('');
    setPassword('');
    setExpiryDays(7);
    setAllowComments(true);
  };

  return (
    <div className="space-y-6">
      {!shareLink ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Create Shared Link</h3>
              <p className="text-sm text-gray-600">
                Generate a secure link to share plans with clients
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Select Plan *</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full p-3 border rounded-md mt-1"
              >
                <option value="">-- Select a plan --</option>
                {EXAMPLE_PLANS.map((plan) => (
                  <option key={plan.slug} value={plan.slug}>
                    {plan.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Password (optional)</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank for no password"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Expires in (days)</label>
                <Input
                  type="number"
                  min="1"
                  max="90"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value) || 7)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={(e) => setAllowComments(e.target.checked)}
                  />
                  <span className="text-sm">Allow comments</span>
                </label>
              </div>
            </div>

            <Button
              onClick={createShareLink}
              disabled={!selectedPlan || creating}
              className="w-full"
              size="lg"
            >
              {creating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Link...</>
              ) : (
                <><LinkIcon className="mr-2 h-4 w-4" /> Create Share Link</>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="font-bold text-lg text-green-900">Share Link Created!</h3>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Share this link with your client:</p>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {password && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-900">
                  <strong>Password:</strong> {password}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Make sure to share this password with your client separately.
                </p>
              </div>
            )}

            <div className="text-sm text-gray-600 space-y-1">
              <p>• Expires in {expiryDays} days</p>
              <p>• Comments: {allowComments ? 'Enabled' : 'Disabled'}</p>
            </div>

            <Button onClick={resetForm} variant="outline" className="w-full">
              Create Another Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
