'use client';

import { useState, useEffect } from 'react';
import { Download, Loader2, Camera } from 'lucide-react';
import { PlantEvidenceUploadModal } from '@/components/PlantEvidenceUploadModal';

type RenderStyle = 'scientific' | 'watercolor' | 'marker' | 'hand-drawn';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Scale = '1:10' | '1:20' | '1:50' | '1:100' | '1:200';

interface PlantSymbolData {
  botanical_name: string;
  common_name: string;
  botanical_params: {
    spread_cm: number;
    height_cm: number;
    scale_box_cm: number;
    center_cm: { x: number; y: number };
    leaf_habit: 'deciduous' | 'evergreen' | 'semi_evergreen';
    crown_texture: 'fine' | 'medium' | 'coarse' | 'needle';
    crown_density_value: number;
    winter_interest?: 'white_bark' | 'red_stems' | 'berries' | 'flowers' | null;
  };
  outline_cm: Array<{ x: number; y: number }>;
}

// Sample Betula pendula data (from betula-outline-data.json)
const SAMPLE_PLANTS: Record<string, PlantSymbolData> = {
  'Betula pendula': {
    botanical_name: 'Betula pendula',
    common_name: 'Silver Birch',
    botanical_params: {
      spread_cm: 1000,
      height_cm: 2500,
      scale_box_cm: 2500,
      center_cm: { x: 1250, y: 1250 },
      leaf_habit: 'deciduous',
      crown_texture: 'fine',
      crown_density_value: 0.35,
      winter_interest: 'white_bark'
    },
    outline_cm: [
      { x: 1750, y: 1250 }, { x: 1768, y: 1318 }, { x: 1766, y: 1388 },
      { x: 1740, y: 1453 }, { x: 1697, y: 1508 }, { x: 1648, y: 1556 },
      { x: 1602, y: 1602 }, { x: 1558, y: 1652 }, { x: 1512, y: 1705 },
      { x: 1458, y: 1751 }, { x: 1392, y: 1780 }, { x: 1321, y: 1786 },
      { x: 1250, y: 1770 }, { x: 1185, y: 1745 }, { x: 1124, y: 1722 },
      { x: 1062, y: 1704 }, { x: 997, y: 1688 }, { x: 934, y: 1661 },
      { x: 882, y: 1618 }, { x: 846, y: 1560 }, { x: 828, y: 1494 },
      { x: 819, y: 1428 }, { x: 810, y: 1368 }, { x: 794, y: 1310 },
      { x: 774, y: 1250 }, { x: 761, y: 1186 }, { x: 767, y: 1121 },
      { x: 794, y: 1061 }, { x: 837, y: 1011 }, { x: 884, y: 969 },
      { x: 927, y: 927 }, { x: 965, y: 879 }, { x: 1005, y: 826 },
      { x: 1054, y: 777 }, { x: 1114, y: 744 }, { x: 1182, y: 734 },
      { x: 1250, y: 742 }, { x: 1315, y: 760 }, { x: 1377, y: 776 },
      { x: 1442, y: 787 }, { x: 1511, y: 798 }, { x: 1579, y: 821 },
      { x: 1639, y: 861 }, { x: 1681, y: 920 }, { x: 1704, y: 988 },
      { x: 1717, y: 1057 }, { x: 1729, y: 1122 }, { x: 1746, y: 1185 }
    ]
  }
};

const STYLES: Array<{ value: RenderStyle; label: string; description: string }> = [
  { value: 'scientific', label: 'Scientific', description: 'Clean baseline + dashed outline' },
  { value: 'watercolor', label: 'Watercolor', description: 'Gradient + cluster blobs' },
  { value: 'marker', label: 'Marker', description: 'Bold fill + dot pattern' },
  { value: 'hand-drawn', label: 'Hand-drawn', description: 'Soft fill + hatch overlay' }
];

const SEASONS: Array<{ value: Season; label: string; icon: string }> = [
  { value: 'spring', label: 'Spring', icon: '🌱' },
  { value: 'summer', label: 'Summer', icon: '☀️' },
  { value: 'autumn', label: 'Autumn', icon: '🍂' },
  { value: 'winter', label: 'Winter', icon: '❄️' }
];

const SCALES: Array<{ value: Scale; label: string }> = [
  { value: '1:10', label: '1:10 (Detail plans)' },
  { value: '1:20', label: '1:20 (Garden plans)' },
  { value: '1:50', label: '1:50 (Small sites)' },
  { value: '1:100', label: '1:100 (Large landscapes)' },
  { value: '1:200', label: '1:200 (Masterplans)' }
];

export default function PlantLibrarySymbols() {
  const [selectedPlant, setSelectedPlant] = useState<string>('Betula pendula');
  const [style, setStyle] = useState<RenderStyle>('watercolor');
  const [season, setSeason] = useState<Season>('summer');
  const [scale, setScale] = useState<Scale>('1:50');
  const [svg, setSvg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderTime, setRenderTime] = useState<number>(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Render symbol whenever parameters change
  useEffect(() => {
    renderSymbol();
  }, [selectedPlant, style, season, scale]);

  async function renderSymbol() {
    setIsLoading(true);
    setError(null);

    try {
      const plantData = SAMPLE_PLANTS[selectedPlant];
      if (!plantData) {
        throw new Error('Plant data not found');
      }

      const response = await fetch('/api/plant/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_data: plantData,
          style,
          season,
          scale,
          seed: 12345 // Deterministic seed for consistent rendering
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to render symbol');
      }

      const data = await response.json();
      setSvg(data.svg);
      setRenderTime(data.metadata.render_time_ms);
    } catch (err: any) {
      setError(err.message);
      console.error('Rendering error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function downloadSVG() {
    const plantData = SAMPLE_PLANTS[selectedPlant];
    const safeName = plantData.botanical_name.replace(/ /g, '_');
    const filename = `${safeName}__${style}__${season}__${scale.replace(':', '-')}.svg`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  const plantData = SAMPLE_PLANTS[selectedPlant];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-900">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌿 Professional Plant Symbol Renderer
          </h1>
          <p className="text-gray-600">
            4 styles × 4 seasons × 5 scales = Dynamic symbol generation
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
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {Object.keys(SAMPLE_PLANTS).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>

              {plantData && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-bold text-sm text-green-900 mb-2">
                    {plantData.botanical_name}
                  </h4>
                  <p className="text-sm text-green-800">{plantData.common_name}</p>
                  <div className="mt-3 space-y-1 text-xs text-green-700">
                    <p><strong>Height:</strong> {(plantData.botanical_params.height_cm / 100).toFixed(1)}m</p>
                    <p><strong>Spread:</strong> {(plantData.botanical_params.spread_cm / 100).toFixed(1)}m</p>
                    <p><strong>Leaf Habit:</strong> {plantData.botanical_params.leaf_habit}</p>
                    <p><strong>Texture:</strong> {plantData.botanical_params.crown_texture}</p>
                    <p><strong>Density:</strong> {plantData.botanical_params.crown_density_value.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Style Selector */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Rendering Style
              </h3>
              <div className="space-y-2">
                {STYLES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      style === s.value
                        ? 'border-green-600 bg-green-50 text-green-900 font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-900'
                    }`}
                  >
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Season Selector */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Season
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {SEASONS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSeason(s.value)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      season === s.value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale Selector */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Drawing Scale
              </h3>
              <div className="space-y-2">
                {SCALES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setScale(s.value)}
                    className={`w-full px-4 py-2 text-left rounded-lg border-2 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      scale === s.value
                        ? 'border-green-600 bg-green-50 text-green-900 font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-900'
                    }`}
                  >
                    <div className="text-sm">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={downloadSVG}
                disabled={!svg || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download SVG
              </button>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center justify-center gap-2"
              >
                <Camera className="h-5 w-5" />
                Upload Evidence
              </button>
            </div>

            {renderTime > 0 && (
              <div className="text-xs text-gray-500 text-center">
                Rendered in {renderTime}ms
              </div>
            )}
          </div>

          {/* Right Column: Symbol Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Symbol Preview
                </h3>
                <div className="flex gap-2 text-sm">
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded font-mono">
                    {scale}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-900 rounded">
                    {style}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded">
                    {season}
                  </span>
                </div>
              </div>

              {/* Symbol Display */}
              <div className="relative bg-gray-50 rounded-lg p-12 flex items-center justify-center min-h-[600px]">
                {isLoading && (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                    <p className="text-gray-600">Generating symbol...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center">
                    <p className="text-red-600 font-semibold mb-2">Rendering Error</p>
                    <p className="text-sm text-gray-600">{error}</p>
                  </div>
                )}

                {svg && !isLoading && !error && (
                  <div
                    className="max-w-full max-h-full"
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                )}
              </div>

              {svg && !isLoading && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                  <p>
                    <strong>Clean SVG:</strong> True-to-scale with mm units.
                    No heavy filters. Perfect for CAD, Procreate, or Morpholio Trace.
                  </p>
                </div>
              )}
            </div>

            {/* Technical Info */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Leaf Habit</p>
                  <p className="font-semibold text-gray-900">{plantData?.botanical_params.leaf_habit}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Crown Texture</p>
                  <p className="font-semibold text-gray-900">{plantData?.botanical_params.crown_texture}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Crown Density</p>
                  <p className="font-semibold text-gray-900">{plantData?.botanical_params.crown_density_value.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Winter Interest</p>
                  <p className="font-semibold text-gray-900">
                    {plantData?.botanical_params.winter_interest || 'None'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>4-Layer Stack:</strong> Canopy mass → Cluster blobs → Texture overlay → Spread outline
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <strong>Poisson Sampling:</strong> ~{plantData?.botanical_params.crown_texture === 'fine' ? '140' : plantData?.botanical_params.crown_texture === 'medium' ? '130' : '120'} cluster blobs for this plant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Upload Modal */}
      <PlantEvidenceUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        botanicalName={plantData.botanical_name}
        wfoId={undefined}
      />
    </div>
  );
}
