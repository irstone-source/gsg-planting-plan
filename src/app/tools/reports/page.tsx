import { ReportGeneratorForm } from '@/components/ReportGeneratorForm';
import Link from 'next/link';

export default function ReportsPage() {
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
              Branded Report Generator
            </h1>
            <p className="text-gray-600">
              Create professional client reports with your company branding
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-3">What you get:</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li>✓ Custom company branding</li>
                <li>✓ Professional PDF reports</li>
                <li>✓ Complete plant specifications</li>
                <li>✓ Design concept documentation</li>
                <li>✓ Client-ready presentations</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">How to use:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>1. Enter your company name and colors</li>
                <li>2. Choose modern or classic template</li>
                <li>3. Select an example plan</li>
                <li>4. Generate and download branded PDF</li>
                <li>5. Share with clients</li>
              </ul>
            </div>
          </div>

          <ReportGeneratorForm />
        </div>
      </div>
    </div>
  );
}
