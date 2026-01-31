#!/usr/bin/env node

/**
 * Simple internal link checker
 * Crawls the Next.js build output to find broken internal links
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../.next/server/app');
const VALID_ROUTES = new Set();
const BROKEN_LINKS = [];

// Extract routes from build directory
function extractRoutes(dir, baseRoute = '') {
  if (!fs.existsSync(dir)) {
    console.error('❌ Build directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const route = path.join(baseRoute, entry.name);

    if (entry.isDirectory()) {
      // Handle dynamic routes like [slug]
      if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
        VALID_ROUTES.add(route.replace(/\[.*?\]/g, '*'));
      } else if (!entry.name.startsWith('_')) {
        extractRoutes(fullPath, route);
      }
    } else if (entry.name === 'page.html' || entry.name === 'route.js') {
      // Add the parent directory as a valid route
      const routePath = baseRoute === '' ? '/' : baseRoute;
      VALID_ROUTES.add(routePath);
    }
  }
}

// Check if a link is valid
function isValidLink(link) {
  // External links
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return true;
  }

  // Anchors
  if (link.startsWith('#')) {
    return true;
  }

  // Remove query params and hash
  const cleanLink = link.split('?')[0].split('#')[0];

  // Check exact match
  if (VALID_ROUTES.has(cleanLink)) {
    return true;
  }

  // Check against dynamic routes
  for (const route of VALID_ROUTES) {
    if (route.includes('*')) {
      const pattern = route.replace(/\*/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(cleanLink)) {
        return true;
      }
    }
  }

  return false;
}

// Extract links from HTML/JSX files
function checkLinksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Match href and Link components
  const linkPatterns = [
    /href=["']([^"']+)["']/g,
    /<Link\s+[^>]*href=["']([^"']+)["']/g,
  ];

  const foundLinks = new Set();

  for (const pattern of linkPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const link = match[1];
      // Only check internal links
      if (!link.startsWith('http') && !link.startsWith('//') && !link.startsWith('mailto:')) {
        foundLinks.add(link);
      }
    }
  }

  // Check each link
  for (const link of foundLinks) {
    if (!isValidLink(link)) {
      BROKEN_LINKS.push({
        file: filePath.replace(process.cwd(), ''),
        link,
      });
    }
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking internal links...\n');

  // Step 1: Extract all valid routes from build
  console.log('📋 Extracting routes from build...');
  extractRoutes(BUILD_DIR);

  // Add known API routes
  const apiDir = path.join(__dirname, '../src/app/api');
  if (fs.existsSync(apiDir)) {
    function findRoutes(dir, basePath = '/api') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          findRoutes(fullPath, `${basePath}/${entry.name}`);
        } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
          VALID_ROUTES.add(basePath);
        }
      });
    }
    findRoutes(apiDir);
  }

  console.log(`✅ Found ${VALID_ROUTES.size} valid routes\n`);

  // Step 2: Check all source files for broken links
  console.log('🔎 Scanning source files for links...');

  function findSourceFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        findSourceFiles(fullPath, files);
      } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
        files.push(fullPath);
      }
    });
    return files;
  }

  const srcDir = path.join(process.cwd(), 'src');
  const sourceFiles = findSourceFiles(srcDir);

  for (const file of sourceFiles) {
    checkLinksInFile(file);
  }

  // Step 3: Report results
  console.log('\n📊 Results:');

  if (BROKEN_LINKS.length === 0) {
    console.log('✅ No broken internal links found!');
    process.exit(0);
  } else {
    console.log(`❌ Found ${BROKEN_LINKS.length} potentially broken links:\n`);

    // Group by file
    const byFile = {};
    BROKEN_LINKS.forEach(({ file, link }) => {
      if (!byFile[file]) byFile[file] = [];
      byFile[file].push(link);
    });

    Object.entries(byFile).forEach(([file, links]) => {
      console.log(`\n${file}:`);
      links.forEach(link => console.log(`  - ${link}`));
    });

    console.log('\n⚠️  Note: Some links may be dynamic or use client-side routing. Please review manually.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
