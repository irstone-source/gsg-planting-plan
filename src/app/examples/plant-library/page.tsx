'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Plant {
  id: string;
  botanical_name: string;
  common_name: string;
  mature_height_cm: number;
  mature_spread_cm: number;
  front_view_image_url: string;
  top_down_image_url: string;
}

const SCALES = [
  { value: 10, label: '1:10 (Detail plans)' },
  { value: 20, label: '1:20 (Garden plans)' },
  { value: 50, label: '1:50 (Small sites)' },
  { value: 100, label: '1:100 (Large landscapes)' },
  { value: 200, label: '1:200 (Masterplans)' },
];

export default function PlantLibrary() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedScale, setSelectedScale] = useState(50); // Default 1:50
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [viewMode, setViewMode] = useState<'plan' | 'elevation'>('plan');

  useEffect(() => {
    async function loadPlants() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data } = await supabase
        .from('plants')
        .select('id, botanical_name, common_name, mature_height_cm, mature_spread_cm, front_view_image_url, top_down_image_url')
        .in('botanical_name', ['Betula pendula', 'Acer campestre', 'Viburnum tinus', 'Cornus alba'])
        .not('front_view_image_url', 'is', null);

      if (data) {
        setPlants(data);
        setSelectedPlant(data[0]);
      }
    }
    loadPlants();
  }, []);

  const calculateDisplaySize = (plant: Plant) => {
    // Calculate size based on scale ratio
    // At 1:50, a 500cm (5m) plant = 10cm on paper = 100px on screen (10px per cm)
    const scaleFactor = 10; // 10px per cm at 1:1
    const realSize = plant.mature_height_cm <= 500 ? 500 :
                     plant.mature_height_cm <= 1000 ? 1000 :
                     plant.mature_height_cm <= 1500 ? 1500 :
                     plant.mature_height_cm <= 2500 ? 2500 : 4000;

    return (realSize / selectedScale) * scaleFactor;
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  if (!selectedPlant) {
    return <div className="p-8">Loading plants...</div>;
  }

  const displaySize = calculateDisplaySize(selectedPlant);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Professional Plant Library
          </h1>
          <p className="text-gray-600">
            Clean, scalable plant visualizations for landscape architecture
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            {/* Plant Selector */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Select Plant
              </h3>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={selectedPlant?.id || ''}
                onChange={(e) => {
                  const plant = plants.find(p => p.id === e.target.value);
                  setSelectedPlant(plant || null);
                }}
              >
                {plants.map(plant => (
                  <option key={plant.id} value={plant.id}>
                    {plant.botanical_name} - {(plant.mature_height_cm / 100).toFixed(1)}m
                  </option>
                ))}
              </select>

              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-bold text-sm text-green-900 mb-2">
                  {selectedPlant.botanical_name}
                </h4>
                <p className="text-sm text-green-800">{selectedPlant.common_name}</p>
                <div className="mt-3 space-y-1 text-xs text-green-700">
                  <p><strong>Height:</strong> {(selectedPlant.mature_height_cm / 100).toFixed(1)}m</p>
                  <p><strong>Spread:</strong> {(selectedPlant.mature_spread_cm / 100).toFixed(1)}m</p>
                </div>
              </div>
            </div>

            {/* Scale Selector */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Drawing Scale
              </h3>
              <div className="space-y-2">
                {SCALES.map(scale => (
                  <button
                    key={scale.value}
                    onClick={() => setSelectedScale(scale.value)}
                    className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-colors ${
                      selectedScale === scale.value
                        ? 'border-green-600 bg-green-50 text-green-900 font-semibold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm">{scale.label}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(selectedPlant.mature_height_cm / scale.value / 100).toFixed(1)}cm on paper
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-900">
                <strong>Current scale:</strong> 1:{selectedScale}<br/>
                Plant appears {(selectedPlant.mature_height_cm / selectedScale / 100).toFixed(1)}cm tall on paper
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                View Type
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('plan')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    viewMode === 'plan'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Plan View
                </button>
                <button
                  onClick={() => setViewMode('elevation')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    viewMode === 'elevation'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Elevation
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 opacity-60 rounded"></div>
                  <span className="text-sm">Dense canopy foliage</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-dashed border-green-800 rounded"></div>
                  <span className="text-sm">Full spread extent</span>
                </div>
                {viewMode === 'elevation' && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded"></div>
                    <span className="text-sm">Human (1.7m for scale)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Download */}
            <button
              onClick={() => {
                const url = viewMode === 'plan' ? selectedPlant.top_down_image_url : selectedPlant.front_view_image_url;
                const filename = `${selectedPlant.botanical_name.toLowerCase().replace(/\s+/g, '-')}-${viewMode}-1-${selectedScale}.png`;
                downloadImage(url, filename);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-lg transition-colors"
            >
              Download at 1:{selectedScale}
            </button>
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Visualization */}
            <div className="bg-white rounded-lg border shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {viewMode === 'plan' ? 'Plan View (Top-Down)' : 'Elevation View (Side)'}
                </h3>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">
                  1:{selectedScale}
                </span>
              </div>

              <div className="relative bg-gray-50 rounded-lg p-12 flex items-center justify-center min-h-[500px]">
                {/* Grid overlay for reference */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="gray" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Plant visualization */}
                <img
                  src={viewMode === 'plan' ? selectedPlant.top_down_image_url : selectedPlant.front_view_image_url}
                  alt={`${selectedPlant.botanical_name} ${viewMode} view`}
                  style={{
                    width: `${displaySize}px`,
                    height: 'auto',
                  }}
                  className="drop-shadow-2xl relative z-10"
                />
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                <p>
                  <strong>Clean PNG:</strong> Transparent background, no embedded text or scale bars.
                  Perfect for importing into CAD, Procreate, or Morpholio Trace.
                </p>
              </div>
            </div>

            {/* Height Comparison Card */}
            {viewMode === 'elevation' && (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  Height Comparison
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Human figure (1.7m average) shown to scale with plant elevation
                </p>
                <div className="bg-gray-50 rounded-lg p-8 flex items-end justify-center gap-12">
                  {/* Human figure */}
                  <div className="text-center">
                    <div className="w-12 h-32 bg-gray-400 rounded-full mx-auto mb-2"></div>
                    <span className="text-xs font-bold text-gray-700">1.7m</span>
                    <span className="text-xs text-gray-500 block">Average person</span>
                  </div>

                  {/* Plant comparison */}
                  <div className="text-center">
                    <div
                      className="bg-green-600 rounded-full mx-auto mb-2"
                      style={{
                        width: `${(selectedPlant.mature_spread_cm / 170) * 48}px`,
                        height: `${(selectedPlant.mature_height_cm / 170) * 128}px`,
                        maxHeight: '400px',
                        maxWidth: '200px',
                      }}
                    ></div>
                    <span className="text-xs font-bold text-gray-700">
                      {(selectedPlant.mature_height_cm / 100).toFixed(1)}m
                    </span>
                    <span className="text-xs text-gray-500 block">{selectedPlant.botanical_name}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
