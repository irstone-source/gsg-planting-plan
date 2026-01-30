import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

export default function PortalPage({ params }: { params: { shareId: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shared Planting Plan
          </h1>
          <p className="text-gray-600">
            View your personalized garden design
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="font-bold text-lg">Secure Access</h2>
                <p className="text-sm text-gray-600">Share ID: {params.shareId}</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Setup Required</h3>
              <p className="text-sm text-yellow-800 mb-4">
                The Client Portal feature requires database tables to be created in Supabase.
                Please run the SQL commands from <code className="bg-yellow-100 px-2 py-1 rounded">supabase-schema.sql</code> in your Supabase console.
              </p>
              <div className="text-sm text-yellow-700 space-y-2">
                <p><strong>Tables needed:</strong></p>
                <ul className="list-disc list-inside pl-4">
                  <li>shared_plan_links</li>
                  <li>portal_comments</li>
                  <li>portal_approvals</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-gray-900">What clients will see:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Plan Details</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Complete plant list</li>
                    <li>• Design concept</li>
                    <li>• Site analysis</li>
                    <li>• Maintenance guide</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Interactive Features</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Leave comments</li>
                    <li>• Approve design</li>
                    <li>• View plant images</li>
                    <li>• Download PDF</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Implementation Notes:</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                This page is a placeholder demonstrating the Client Portal concept.
                A complete implementation would include:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Password verification form</li>
                <li>Full plan display with images</li>
                <li>Comment thread with real-time updates</li>
                <li>Approval button with confirmation</li>
                <li>View tracking and analytics</li>
              </ul>
              <p className="pt-2">
                <Badge>Status: Framework Complete</Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
