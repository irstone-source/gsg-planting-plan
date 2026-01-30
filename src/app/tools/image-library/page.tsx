import { ImageLibraryBrowser } from '@/components/ImageLibraryBrowser';
import Link from 'next/link';

export default function ImageLibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/professionals" className="text-green-600 hover:text-green-700">
            ← Back to Professional Tools
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Plant Image Library
            </h1>
            <p className="text-gray-600">
              Browse and download 52+ AI-generated botanical illustrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">Features:</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>✓ Search by scientific or common name</li>
                <li>✓ Filter by plant type</li>
                <li>✓ Multiple views (top, front, foliage)</li>
                <li>✓ High-resolution AI-generated images</li>
                <li>✓ Reference photos from Google Images</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Perfect for:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Client presentations</li>
                <li>✓ Planting plan illustrations</li>
                <li>✓ Design mood boards</li>
                <li>✓ Educational materials</li>
                <li>✓ Professional reports</li>
              </ul>
            </div>
          </div>

          <ImageLibraryBrowser />
        </div>
      </div>
    </div>
  );
}
