const fs = require('fs');

const filePath = './src/data/example-plans-expanded.ts';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  ['https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=1200&q=80', '/covers/bournemouth-seaside-shelter-planting.jpg'],
  ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80', '/covers/plymouth-sheltered-coastal-oasis.jpg'],
  ['https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=1200&q=80', '/covers/edinburgh-scottish-wildlife-haven.jpg'],
  ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', '/covers/glasgow-wet-winter-proof-framework.jpg'],
  ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80', '/covers/inverness-highland-hardy-woodland.jpg'],
  ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80', '/covers/swansea-family-coastal-garden.jpg']
];

// Some URLs are reused, so we need to be selective
// Cardiff rain-friendly (currently using same as birmingham, already fixed)
if (content.includes("slug: 'cardiff-rain-friendly-wildlife-garden'")) {
  // Find the Cardiff section and replace its heroImage
  const cardiffMatch = content.match(/(id: 'cardiff-rain-friendly-wildlife'[\s\S]*?heroImage: ')(\/covers\/birmingham-small-space-big-impact\.jpg)(')/);
  if (cardiffMatch) {
    content = content.replace(cardiffMatch[0], cardiffMatch[1] + '/covers/cardiff-rain-friendly-wildlife-garden.jpg' + cardiffMatch[3]);
  }
}

// Exeter and Bath both need unique images (currently might share plymouth URL)
const exeterPattern = /(id: 'exeter-dry-summer-mediterranean'[\s\S]*?heroImage: ')([^']+)(')/;
const exeterMatch = content.match(exeterPattern);
if (exeterMatch && exeterMatch[2] !== '/covers/exeter-dry-summer-mediterranean-border.jpg') {
  content = content.replace(exeterMatch[0], exeterMatch[1] + '/covers/exeter-dry-summer-mediterranean-border.jpg' + exeterMatch[3]);
}

const bathPattern = /(id: 'bath-cotswold-stone-scent'[\s\S]*?heroImage: ')([^']+)(')/;
const bathMatch = content.match(bathPattern);
if (bathMatch && bathMatch[2] !== '/covers/bath-cotswold-stone-and-scent.jpg') {
  content = content.replace(bathMatch[0], bathMatch[1] + '/covers/bath-cotswold-stone-and-scent.jpg' + bathMatch[3]);
}

// Aberdeen needs unique (may share with bournemouth URL)
const aberdeenPattern = /(id: 'aberdeen-very-hardy-coastal'[\s\S]*?heroImage: ')([^']+)(')/;
const aberdeenMatch = content.match(aberdeenPattern);
if (aberdeenMatch && aberdeenMatch[2] !== '/covers/aberdeen-very-hardy-coastal-structure.jpg') {
  content = content.replace(aberdeenMatch[0], aberdeenMatch[1] + '/covers/aberdeen-very-hardy-coastal-structure.jpg' + aberdeenMatch[3]);
}

// Replace remaining generic URLs
replacements.forEach(([oldUrl, newPath]) => {
  content = content.split(oldUrl).join(newPath);
});

fs.writeFileSync(filePath, content);
console.log('✅ All cover image URLs updated to local AI-generated images');
