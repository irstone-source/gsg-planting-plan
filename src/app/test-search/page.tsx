'use client';

import { useState } from 'react';
import PlantAutocomplete from '@/components/plant-search/PlantAutocomplete';

export default function TestSearchPage() {
  const [selectedPlant, setSelectedPlant] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🌿 Plant Search Demo
        </h1>
        <p className="text-gray-600 mb-8">
          Powered by World Flora Online - 108,714 species
        </p>

        {/* Search Component */}
        <div className="mb-8">
          <PlantAutocomplete
            onSelect={(plant) => setSelectedPlant(plant)}
            placeholder="Search by scientific name (e.g., Betula pendula, Quercus robur)..."
            className="max-w-2xl"
          />
        </div>

        {/* Selected Plant Display */}
        {selectedPlant && (
          <div className="bg-white border-2 border-green-500 rounded-lg p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  <span className="italic">{selectedPlant.scientific_name}</span>
                </h2>
                {selectedPlant.authority && (
                  <p className="text-gray-600 mt-1">
                    Authority: {selectedPlant.authority}
                  </p>
                )}
              </div>
              <div className="text-sm text-green-600 font-medium px-3 py-1 bg-green-100 rounded">
                {(selectedPlant.similarity * 100).toFixed(0)}% match
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  WFO ID
                </div>
                <div className="font-mono text-sm text-gray-900">
                  {selectedPlant.wfo_id}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Family
                </div>
                <div className="text-gray-900">
                  {selectedPlant.family}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Genus
                </div>
                <div className="text-gray-900 italic">
                  {selectedPlant.genus}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Rank
                </div>
                <div className="text-gray-900 capitalize">
                  {selectedPlant.rank}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Data from World Flora Online - Accepted name as of 2025
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Example Searches */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Try searching for:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'Betula pendula',
              'Quercus robur',
              'Acer platanoides',
              'Rosa canina',
              'Lavandula',
              'Viburnum tinus',
              'Cornus alba',
              'Taxus baccata'
            ].map((name) => (
              <button
                key={name}
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  if (input) {
                    input.value = name;
                    input.focus();
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
                aria-label={`Search for ${name}`}
                className="px-4 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-left focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <span className="italic">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">108,714</div>
            <div className="text-sm text-gray-600">Plant species</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">31</div>
            <div className="text-sm text-gray-600">Plant families</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">Instant</div>
            <div className="text-sm text-gray-600">Fuzzy search</div>
          </div>
        </div>
      </div>
    </div>
  );
}
