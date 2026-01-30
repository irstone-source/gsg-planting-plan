'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function PlanCritiqueUploader() {
  const [analyzing, setAnalyzing] = useState(false);
  const [critique, setCritique] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [plantInput, setPlantInput] = useState('');
  const [siteInfo, setSiteInfo] = useState({
    location: '',
    soilType: '',
    sunExposure: '',
    gardenSize: ''
  });

  const handleAnalyze = async () => {
    if (!plantInput.trim()) {
      setError('Please enter your plant list');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setCritique(null);

    try {
      // Parse plant list
      const lines = plantInput.split('\n').filter(l => l.trim());
      const plants = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        return {
          scientific: parts[0] || '',
          common: parts[1] || '',
          type: parts[2] || 'plant'
        };
      });

      // Call critique API
      const response = await fetch('/api/critique-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plants,
          siteInfo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setCritique(data.critique);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Plant List Input */}
      <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold">Enter Your Planting Plan</h3>
        </div>

        <textarea
          value={plantInput}
          onChange={(e) => setPlantInput(e.target.value)}
          placeholder="Enter your plant list, one per line:
Betula pendula, Silver Birch, tree
Viburnum tinus, Laurustinus, shrub
Fargesia murielae, Umbrella Bamboo, bamboo
Geranium 'Rozanne', Rozanne Cranesbill, perennial"
          className="w-full h-40 p-3 border rounded-lg text-sm font-mono resize-none mb-4"
          disabled={analyzing}
        />

        {/* Site Information (Optional) */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Location (e.g., London, UK)"
            value={siteInfo.location}
            onChange={(e) => setSiteInfo({...siteInfo, location: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
            disabled={analyzing}
          />
          <input
            type="text"
            placeholder="Soil type (e.g., clay, loam)"
            value={siteInfo.soilType}
            onChange={(e) => setSiteInfo({...siteInfo, soilType: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
            disabled={analyzing}
          />
          <input
            type="text"
            placeholder="Sun exposure (e.g., full sun, part shade)"
            value={siteInfo.sunExposure}
            onChange={(e) => setSiteInfo({...siteInfo, sunExposure: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
            disabled={analyzing}
          />
          <input
            type="text"
            placeholder="Garden size (e.g., 10m x 8m)"
            value={siteInfo.gardenSize}
            onChange={(e) => setSiteInfo({...siteInfo, gardenSize: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
            disabled={analyzing}
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={analyzing || !plantInput.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Plan...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Get Professional Critique
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Analysis Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Critique Results */}
      {critique && (
        <div className="bg-white border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-900">Professional Critique Complete</h3>
          </div>

          {critique.fullAnalysis && (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {critique.fullAnalysis}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
