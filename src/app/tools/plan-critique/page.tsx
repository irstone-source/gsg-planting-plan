import { PlanCritiqueUploader } from '@/components/PlanCritiqueUploader';

export default function PlanCritiquePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              AI Plan Critique
            </h1>
            <p className="text-lg text-gray-600">
              Get professional analysis of your planting plan from an expert UK garden designer AI
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">🌱 Compatibility Analysis</h3>
              <p className="text-sm text-blue-800">
                Companion planting, allelopathy, root competition, and growth habit compatibility
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">📏 Space Planning</h3>
              <p className="text-sm text-green-800">
                Mature sizes, spacing requirements, overcrowding risks, and effective layering
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">🌍 UK-Specific Advice</h3>
              <p className="text-sm text-purple-800">
                Hardiness zones, soil types, climate suitability, and regional considerations
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-2">🌸 Seasonal Interest</h3>
              <p className="text-sm text-orange-800">
                Year-round color, spring flowers, autumn foliage, winter structure
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">⏱️ Maintenance Estimates</h3>
              <p className="text-sm text-yellow-800">
                Annual time requirements, pruning schedules, watering needs, difficulty ratings
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-lg">
              <h3 className="font-bold text-pink-900 mb-2">💡 Expert Recommendations</h3>
              <p className="text-sm text-pink-800">
                Improvements, alternatives, additions, and professional scoring (1-10)
              </p>
            </div>
          </div>

          {/* Main Upload Component */}
          <PlanCritiqueUploader />

          {/* Coming Soon */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">🚀 Coming Soon:</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div>✓ PDF Report Generation with Branding</div>
              <div>✓ Soil Database Integration (BGS, LandIS)</div>
              <div>✓ Microclimate Analysis Maps</div>
              <div>✓ Cost Estimation Tools</div>
              <div>✓ Supplier Recommendations</div>
              <div>✓ Client Presentation Templates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
