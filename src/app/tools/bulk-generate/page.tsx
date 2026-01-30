import { PlantListUploader } from '@/components/PlantListUploader';

export default function BulkGeneratePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bulk Plant Image Generation
            </h1>
            <p className="text-gray-600">
              Upload a plant list and automatically generate AI images + Google reference photos for all plants
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">What you get:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ AI-generated top view (plan view)</li>
                <li>✓ AI-generated front elevation</li>
                <li>✓ AI-generated foliage closeup</li>
                <li>✓ 3 Google reference images</li>
                <li>✓ Complete metadata JSON</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">Perfect for:</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>✓ Garden designers</li>
                <li>✓ Landscape architects</li>
                <li>✓ Planting plan creation</li>
                <li>✓ Client presentations</li>
                <li>✓ Professional reports</li>
              </ul>
            </div>
          </div>

          <PlantListUploader />

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Coming Soon:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>🤖 AI Plan Critique - Analyze compatibility, spacing, microclimate</li>
              <li>📊 Maintenance Estimates - Calculate annual care requirements</li>
              <li>📄 Branded Reports - Generate professional PDFs for clients</li>
              <li>🌍 Soil & Climate Analysis - UK-specific recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
