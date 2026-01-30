import { ClientPortalManager } from '@/components/ClientPortalManager';
import Link from 'next/link';

export default function ClientPortalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/professionals" className="text-green-600 hover:text-green-700">
            ← Back to Professional Tools
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Client Portal
            </h1>
            <p className="text-gray-600">
              Create secure shareable links for client collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Features:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Secure password-protected links</li>
                <li>✓ Expiring access (1-90 days)</li>
                <li>✓ Client comments and feedback</li>
                <li>✓ Plan approval workflow</li>
                <li>✓ View tracking</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">How to use:</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>1. Select a plan to share</li>
                <li>2. Set password (optional) and expiry</li>
                <li>3. Enable/disable comments</li>
                <li>4. Copy link and share with client</li>
                <li>5. Track views and feedback</li>
              </ul>
            </div>
          </div>

          <ClientPortalManager />

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Notes:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Shared links are accessible without login</li>
              <li>• Password must be shared separately with client</li>
              <li>• Links automatically expire after set duration</li>
              <li>• Comments and approvals are tracked in real-time</li>
              <li>• Database tables must be created in Supabase console</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
