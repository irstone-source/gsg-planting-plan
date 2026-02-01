#!/bin/bash
#
# World Flora Online Data Download Script
# Downloads and extracts WFO Darwin Core Archive
#

set -e

echo "🌿 Downloading World Flora Online Plant List (June 2025)"
echo "=================================================="
echo ""

# Create data directory
mkdir -p data/wfo
cd data/wfo

# Download Darwin Core Archive (~200-300MB compressed)
echo "📥 Downloading Darwin Core Archive..."
curl -L -o DarwinCore.zip "https://zenodo.org/records/15704590/files/DarwinCore.zip?download=1"

# Extract
echo "📦 Extracting archive..."
unzip -o DarwinCore.zip

# Show what we got
echo ""
echo "✅ Download complete! Files extracted:"
ls -lh

echo ""
echo "📊 Quick stats:"
echo "  Taxon records: $(wc -l < taxon.txt) lines"
echo "  Size: $(du -h taxon.txt | cut -f1)"

echo ""
echo "🎯 Next steps:"
echo "  1. Run: node scripts/import-wfo-taxonomy.mjs"
echo "  2. This will parse taxon.txt and load into Supabase"
echo ""
