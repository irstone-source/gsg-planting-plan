import { Badge } from '@/components/ui/badge';
import { PlantImageViewer } from '@/components/PlantImageViewer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EdinburghWildlifeHavenPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header with AI-generated cover */}
      <div className="relative h-96 bg-gradient-to-br from-green-900 to-emerald-700">
        <Image
          src="/covers/edinburgh-wildlife-haven.jpg"
          alt="Edinburgh Wildlife Haven"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-end pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Examples
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">
            Edinburgh Wildlife Haven
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            A naturalistic Scottish garden designed for pollinators and wildlife
          </p>
          <div className="flex gap-3 mt-6">
            <Badge className="bg-white/20 text-white border-white/30">Edinburgh, Scotland</Badge>
            <Badge className="bg-white/20 text-white border-white/30">12m × 9m</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Wildlife & Native</Badge>
          </div>
        </div>
      </div>

      {/* Rest of content - same structure as other examples */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Plant cards grid - will add later */}
        <p className="text-gray-600">Full planting plan coming soon...</p>
      </div>
    </div>
  );
}
