import { CostCalculatorForm } from '@/components/CostCalculatorForm';
import Link from 'next/link';

export default function CalculatorPage() {
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
              Cost Calculator
            </h1>
            <p className="text-gray-600">
              Estimate project costs with plants, labor, and markup
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-3">What you get:</h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>✓ Plant cost calculations</li>
                <li>✓ Automated labor hours (15 min per plant)</li>
                <li>✓ Customizable markup percentage</li>
                <li>✓ UK VAT calculation (20%)</li>
                <li>✓ Professional cost breakdown</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">How to use:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>1. Add plants with quantities and unit prices</li>
                <li>2. Set site preparation hours</li>
                <li>3. Configure hourly rate and markup</li>
                <li>4. Click Calculate for full breakdown</li>
                <li>5. Use totals for client quotes</li>
              </ul>
            </div>
          </div>

          <CostCalculatorForm />
        </div>
      </div>
    </div>
  );
}
