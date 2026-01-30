export interface PlantImageData {
  scientific: string;
  common: string;
  type: string;
  slug: string;
  views: {
    top: string[];
    front: string[];
    side: string[];
    foliage: string[];
  };
  references: { url: string; thumbnail: string; source: string; title: string }[];
  metadata: { directory: string; totalFiles: number };
}

// Function to scan /public/plants/ directory
export async function scanPlantImages(): Promise<PlantImageData[]> {
  const fs = require('fs').promises;
  const path = require('path');

  const plantsDir = path.join(process.cwd(), 'public', 'plants');
  const entries = await fs.readdir(plantsDir, { withFileTypes: true });

  const plants: PlantImageData[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const plantDir = path.join(plantsDir, slug);

    // Try to load google-images.json for metadata
    let metadata: any = { scientific: slug, common: slug, type: 'plant' };
    try {
      const metadataPath = path.join(plantDir, 'google-images.json');
      const jsonData = await fs.readFile(metadataPath, 'utf8');
      metadata = JSON.parse(jsonData);
    } catch (e) {
      // No metadata, use slug as fallback
    }

    // Scan for image files
    const files = await fs.readdir(plantDir);
    const views = {
      top: files.filter((f: string) => f.startsWith('top')),
      front: files.filter((f: string) => f.startsWith('front')),
      side: files.filter((f: string) => f.startsWith('side')),
      foliage: files.filter((f: string) => f.startsWith('foliage'))
    };

    plants.push({
      scientific: metadata.scientific || slug,
      common: metadata.common || slug,
      type: metadata.type || 'plant',
      slug,
      views,
      references: metadata.references || [],
      metadata: { directory: slug, totalFiles: files.length }
    });
  }

  return plants;
}
