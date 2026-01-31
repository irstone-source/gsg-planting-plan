#!/bin/bash

# PlantingPlans - Quick Deployment Script
# This script helps you deploy to GitHub and Vercel

set -e

echo "🚀 PlantingPlans Deployment Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found package.json"

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Git repository not initialized${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Git repository initialized"

# Run build test
echo ""
echo "📦 Running build test..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed. Fix errors before deploying."
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠${NC}  You have uncommitted changes"
    read -p "Commit them now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add -A
        read -p "Commit message: " commit_msg
        git commit -m "$commit_msg"
        echo -e "${GREEN}✓${NC} Changes committed"
    fi
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo -e "${YELLOW}⚠${NC}  No Git remote configured"
    echo ""
    echo "Choose deployment method:"
    echo "1) Create GitHub repo via CLI (requires 'gh' installed)"
    echo "2) I'll create it manually on GitHub.com"
    read -p "Enter choice (1 or 2): " choice

    case $choice in
        1)
            if command -v gh &> /dev/null; then
                echo ""
                read -p "Repository name (default: gsg-planting-plan): " repo_name
                repo_name=${repo_name:-gsg-planting-plan}

                read -p "Make repository public? (y/n): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    visibility="--public"
                else
                    visibility="--private"
                fi

                gh repo create "$repo_name" $visibility --source=. --remote=origin --push
                echo -e "${GREEN}✓${NC} Repository created and pushed to GitHub"
            else
                echo -e "${RED}Error: 'gh' CLI not installed${NC}"
                echo "Install: https://cli.github.com/"
                exit 1
            fi
            ;;
        2)
            echo ""
            echo "Manual setup instructions:"
            echo "1. Go to: https://github.com/new"
            echo "2. Create repository (DO NOT initialize with README)"
            echo "3. Copy the remote URL"
            echo ""
            read -p "Enter your GitHub repository URL: " repo_url
            git remote add origin "$repo_url"
            git branch -M main
            git push -u origin main
            echo -e "${GREEN}✓${NC} Repository pushed to GitHub"
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
else
    echo -e "${GREEN}✓${NC} Git remote configured"
    echo ""
    read -p "Push to GitHub now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin main
        echo -e "${GREEN}✓${NC} Pushed to GitHub"
    fi
fi

# Deployment summary
echo ""
echo "=========================================="
echo -e "${GREEN}✓ Ready for Vercel Deployment${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to: https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Add environment variables (see DEPLOYMENT-CHECKLIST.md)"
echo "4. Click Deploy"
echo ""
echo "Required environment variables:"
echo "  • ANTHROPIC_API_KEY"
echo "  • NEXT_PUBLIC_SUPABASE_URL"
echo "  • NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  • NEXT_PUBLIC_APP_URL"
echo ""
echo "See full checklist: DEPLOYMENT-CHECKLIST.md"
echo ""
