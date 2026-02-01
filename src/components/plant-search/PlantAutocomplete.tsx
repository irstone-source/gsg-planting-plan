'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface PlantResult {
  wfo_id: string;
  scientific_name: string;
  common_name: string;
  authority: string;
  family: string;
  genus: string;
  rank: string;
  similarity: number;
  display_name: string;
}

interface PlantAutocompleteProps {
  onSelect: (plant: PlantResult) => void;
  placeholder?: string;
  className?: string;
}

export default function PlantAutocomplete({
  onSelect,
  placeholder = 'Search plants by scientific or common name...',
  className = ''
}: PlantAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlantResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/plants/search?q=${encodeURIComponent(query)}&limit=20`);
        const data = await res.json();

        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
          setSelectedIndex(0);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (plant: PlantResult) => {
    onSelect(plant);
    setQuery(plant.scientific_name);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          role="combobox"
          aria-label="Search for plants by scientific or common name"
          aria-expanded={isOpen && results.length > 0}
          aria-autocomplete="list"
          aria-controls="plant-search-results"
          className="w-full pl-10 pr-10 py-3 text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          id="plant-search-results"
          role="listbox"
          aria-label="Plant search results"
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {results.map((plant, index) => (
            <button
              key={plant.wfo_id}
              onClick={() => handleSelect(plant)}
              role="option"
              aria-selected={index === selectedIndex}
              className={`w-full px-4 py-3 text-left hover:bg-green-50 transition focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 ${
                index === selectedIndex ? 'bg-green-50' : ''
              } ${index !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    <span className="italic">{plant.scientific_name}</span>
                    {plant.authority && (
                      <span className="ml-1 text-sm text-gray-500 font-normal">
                        {plant.authority}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {plant.family}
                  </div>
                </div>
                <div className="ml-4 text-xs text-gray-400">
                  {(plant.similarity * 100).toFixed(0)}% match
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No plants found for "{query}"
        </div>
      )}
    </div>
  );
}
