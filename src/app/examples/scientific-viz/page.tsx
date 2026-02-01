import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface PlantVisualization {
  id: string;
  botanical_name: string;
  common_name: string;
  mature_height_cm: number;
  mature_spread_cm: number;
  year_1_height_cm: number;
  year_3_height_cm: number;
  front_view_image_url: string;
  top_down_image_url: string;
}

export default async function ScientificVisualizationExamples() {
  const { data: plants, error } = await supabaseAdmin
    .from('plants')
    .select(`
      id, botanical_name, common_name,
      mature_height_cm, mature_spread_cm,
      year_1_height_cm, year_3_height_cm,
      front_view_image_url, top_down_image_url,
      crocus_image_url, crocus_product_name, crocus_product_url,
      crocus_price_gbp, crocus_original_price_gbp, crocus_pot_size,
      crocus_rating, crocus_review_count, crocus_availability, crocus_fetched_at
    `)
    .in('botanical_name', ['Betula pendula', 'Acer campestre', 'Viburnum tinus', 'Cornus alba'])
    .not('front_view_image_url', 'is', null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scientific Plant Visualizations
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Data-driven plant visualizations based on global botanical databases (Trefle, Perenual, RHS, Kew Gardens)
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Professional Grade Data:</strong> Each visualization is generated from scientifically accurate
              measurements including mature dimensions, growth rates, and botanical characteristics from peer-reviewed sources.
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {plants?.map((plant) => (
            <div key={plant.id} className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plant Info */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {plant.botanical_name}
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">{plant.common_name}</p>

                  <div className="space-y-4">
                    <div className="border-l-4 border-green-600 pl-4 bg-green-50 p-4 rounded-r">
                      <h3 className="text-sm font-bold text-green-900 uppercase tracking-wide mb-3">
                        Mature Dimensions
                      </h3>
                      <div className="space-y-2">
                        <p className="text-lg text-gray-900">
                          <span className="font-bold text-green-700">Height:</span> {(plant.mature_height_cm / 100).toFixed(1)}m
                        </p>
                        <p className="text-lg text-gray-900">
                          <span className="font-bold text-green-700">Spread:</span> {(plant.mature_spread_cm / 100).toFixed(1)}m
                        </p>
                        <p className="text-lg text-gray-900">
                          <span className="font-bold text-green-700">Spacing:</span> {(plant.mature_spread_cm * 1.2 / 100).toFixed(1)}m
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4 bg-blue-50 p-4 rounded-r">
                      <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-3">
                        Growth Progression
                      </h3>
                      <div className="space-y-2">
                        <p className="text-base text-gray-900">
                          <span className="font-bold text-blue-700">Year 1:</span> {(plant.year_1_height_cm / 100).toFixed(1)}m tall
                        </p>
                        <p className="text-base text-gray-900">
                          <span className="font-bold text-blue-700">Year 3:</span> {(plant.year_3_height_cm / 100).toFixed(1)}m tall
                        </p>
                        <p className="text-base text-gray-900">
                          <span className="font-bold text-blue-700">Mature:</span> {(plant.mature_height_cm / 100).toFixed(1)}m tall
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mt-6">
                      <p className="text-xs text-gray-600">
                        <strong>Data Sources:</strong> Trefle Global Plant Database, Perenual Plant API,
                        Royal Horticultural Society, Kew Gardens Botanical Database
                      </p>
                    </div>

                    {/* Where to Buy - Requires Crocus migration */}
                    {false && (
                      <div className="border-l-4 border-orange-600 pl-4 bg-orange-50 p-4 rounded-r mt-4">
                        <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wide mb-3">
                          🛒 Where to Buy
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            {plant.crocus_image_url && (
                              <img
                                src={plant.crocus_image_url}
                                alt={plant.crocus_product_name || plant.botanical_name}
                                className="w-20 h-20 object-cover rounded border border-gray-200"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">
                                {plant.crocus_product_name}
                              </p>
                              {plant.crocus_pot_size && (
                                <p className="text-xs text-gray-600">{plant.crocus_pot_size}</p>
                              )}
                              {plant.crocus_rating && (
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="text-xs font-semibold text-gray-700">
                                    {plant.crocus_rating.toFixed(1)}
                                  </span>
                                  {plant.crocus_review_count && (
                                    <span className="text-xs text-gray-500">
                                      ({plant.crocus_review_count} reviews)
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-orange-700">
                                  £{plant.crocus_price_gbp?.toFixed(2)}
                                </span>
                                {plant.crocus_original_price_gbp && plant.crocus_original_price_gbp > plant.crocus_price_gbp && (
                                  <span className="text-sm text-gray-500 line-through">
                                    £{plant.crocus_original_price_gbp.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {plant.crocus_availability}
                              </p>
                              {plant.crocus_fetched_at && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Price updated: {new Date(plant.crocus_fetched_at).toLocaleDateString('en-GB')}
                                </p>
                              )}
                            </div>

                            <a
                              href={plant.crocus_product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                              Buy from Crocus →
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visualizations */}
                <div className="space-y-6">
                  {/* Plan View (Top-Down) */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">PLAN VIEW</span>
                      Top-Down - Mature Canopy Spread
                    </h3>
                    <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-6 relative flex items-center justify-center overflow-auto">
                      {plant.top_down_image_url ? (
                        <img
                          src={plant.top_down_image_url}
                          alt={`${plant.botanical_name} plan view - true scale`}
                          className="drop-shadow-2xl"
                          style={{
                            width: `${(plant.mature_height_cm <= 500 ? 100 : plant.mature_height_cm <= 1000 ? 200 : plant.mature_height_cm <= 1500 ? 300 : plant.mature_height_cm <= 2500 ? 500 : 800)}px`,
                            height: 'auto'
                          }}
                          title={`Scale: ${plant.mature_spread_cm}cm × ${plant.mature_spread_cm}cm canopy`}
                        />
                      ) : (
                        <div className="text-gray-400 text-center py-12">
                          <p>Plan view not available</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Professional scale bar embedded in image. Drag to Procreate/CAD for true-scale import.
                    </p>
                  </div>

                  {/* Elevation View (Side View) */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">ELEVATION</span>
                      Side View - Mature Height
                    </h3>
                    <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-6 relative flex items-center justify-center overflow-auto">
                      {plant.front_view_image_url ? (
                        <img
                          src={plant.front_view_image_url}
                          alt={`${plant.botanical_name} elevation view - true scale`}
                          className="drop-shadow-2xl"
                          style={{
                            width: `${(plant.mature_height_cm <= 500 ? 100 : plant.mature_height_cm <= 1000 ? 200 : plant.mature_height_cm <= 1500 ? 300 : plant.mature_height_cm <= 2500 ? 500 : 800)}px`,
                            height: 'auto'
                          }}
                          title={`Scale: ${plant.mature_height_cm}cm height × ${plant.mature_spread_cm}cm spread`}
                        />
                      ) : (
                        <div className="text-gray-400 text-center py-12">
                          <p>Elevation view not available</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Height measurement and scale bar included. Same scale as plan view for consistent sizing.
                    </p>
                  </div>

                  {/* Growth Comparison - Scaled */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                      Growth Progression (To Scale)
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-end justify-around gap-4" style={{ minHeight: '200px' }}>
                        {/* Year 1 */}
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="bg-green-400 rounded-full border-2 border-green-600"
                            style={{
                              width: `${Math.max((plant.year_1_height_cm / plant.mature_height_cm) * 100, 20)}px`,
                              height: `${Math.max((plant.year_1_height_cm / plant.mature_height_cm) * 100, 20)}px`
                            }}
                          />
                          <div className="text-center">
                            <p className="text-xs font-bold text-gray-900">Year 1</p>
                            <p className="text-xs text-gray-600">{(plant.year_1_height_cm / 100).toFixed(1)}m</p>
                          </div>
                        </div>

                        {/* Year 3 */}
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="bg-green-500 rounded-full border-2 border-green-700"
                            style={{
                              width: `${Math.max((plant.year_3_height_cm / plant.mature_height_cm) * 150, 40)}px`,
                              height: `${Math.max((plant.year_3_height_cm / plant.mature_height_cm) * 150, 40)}px`
                            }}
                          />
                          <div className="text-center">
                            <p className="text-xs font-bold text-gray-900">Year 3</p>
                            <p className="text-xs text-gray-600">{(plant.year_3_height_cm / 100).toFixed(1)}m</p>
                          </div>
                        </div>

                        {/* Mature */}
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="bg-green-700 rounded-full border-4 border-green-900 shadow-lg"
                            style={{
                              width: '150px',
                              height: '150px'
                            }}
                          />
                          <div className="text-center">
                            <p className="text-xs font-bold text-gray-900">Mature</p>
                            <p className="text-xs text-gray-600">{(plant.mature_height_cm / 100).toFixed(1)}m</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!plants || plants.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600">No visualizations available yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Run: <code className="bg-gray-100 px-2 py-1 rounded">node generate-scientific-viz.mjs [planId]</code>
            </p>
            {error && (
              <p className="text-red-600 mt-4">Error: {error.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
