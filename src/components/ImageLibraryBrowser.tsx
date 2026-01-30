'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';

export function ImageLibraryBrowser() {
  const [plants, setPlants] = useState<any[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [plantType, setPlantType] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    filterPlants();
  }, [searchTerm, plantType, plants]);

  const fetchPlants = async () => {
    try {
      const res = await fetch('/api/plant-images');
      const data = await res.json();
      if (data.success) {
        setPlants(data.plants);
      }
    } catch (err) {
      console.error('Failed to fetch plants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPlants = () => {
    let filtered = plants;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.scientific.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (plantType !== 'all') {
      filtered = filtered.filter(p => p.type === plantType);
    }

    setFilteredPlants(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by scientific or common name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={plantType}
          onChange={(e) => setPlantType(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="all">All Types</option>
          <option value="tree">Trees</option>
          <option value="shrub">Shrubs</option>
          <option value="perennial">Perennials</option>
          <option value="bamboo">Bamboo</option>
          <option value="grass">Grasses</option>
        </select>
      </div>

      {/* Results Count */}
      <p className="text-gray-600">
        Showing <span className="font-bold text-green-700">{filteredPlants.length}</span> of {plants.length} plants
      </p>

      {/* Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlants.map((plant) => (
          <Card key={plant.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div
              className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 relative cursor-pointer"
              onClick={() => setSelectedImage(`/plants/${plant.slug}/${plant.views.top[0]}`)}
            >
              {plant.views.top[0] && (
                <Image
                  src={`/plants/${plant.slug}/${plant.views.top[0]}`}
                  alt={plant.common}
                  fill
                  className="object-cover"
                />
              )}
              <Badge className="absolute top-2 right-2 bg-white text-gray-700">
                {plant.type}
              </Badge>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-bold text-sm text-gray-900">{plant.scientific}</h3>
              <p className="text-xs text-gray-600 mb-3">{plant.common}</p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span>{Object.values(plant.views).flat().length} images</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={selectedImage}
              alt="Plant"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
