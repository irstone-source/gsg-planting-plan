import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function DebugPlants() {
  const { data: plants, error } = await supabaseAdmin
    .from('plants')
    .select('id, botanical_name, common_name, front_view_image_url, mature_height_cm, mature_spread_cm')
    .in('botanical_name', ['Betula pendula', 'Acer campestre', 'Viburnum tinus', 'Cornus alba'])
    .not('front_view_image_url', 'is', null);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Plant Database Debug</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error.message}
        </div>
      )}

      <p className="mb-4">Found {plants?.length || 0} plants with images</p>

      <div className="space-y-4">
        {plants?.map(plant => (
          <div key={plant.id} className="border p-4 rounded">
            <h2 className="font-bold">{plant.botanical_name}</h2>
            <p className="text-sm text-gray-600">{plant.common_name}</p>
            <p className="text-xs">Height: {plant.mature_height_cm}cm, Spread: {plant.mature_spread_cm}cm</p>
            <p className="text-xs">Image: {plant.front_view_image_url ? '✅ YES' : '❌ NO'}</p>
            {plant.front_view_image_url && (
              <img src={plant.front_view_image_url} alt={plant.botanical_name} className="mt-2 w-32 h-32" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
