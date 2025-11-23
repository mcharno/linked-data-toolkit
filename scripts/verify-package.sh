#!/bin/bash

# Package Verification Script
# Run this before publishing to npm

set -e  # Exit on error

echo "🔍 Verifying package before publishing..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node version: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ ^v18 ]] && [[ ! "$NODE_VERSION" =~ ^v2 ]]; then
    echo -e "${YELLOW}   ⚠️  Warning: Node 18+ recommended${NC}"
fi
echo ""

# Clean install
echo "🧹 Clean installing dependencies..."
rm -rf node_modules package-lock.json
npm install
echo ""

# Run linter
echo "🔎 Running linter..."
npm run lint || {
    echo -e "${RED}❌ Linting failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Linting passed${NC}"
echo ""

# Type check
echo "📝 Running type check..."
npm run type-check || {
    echo -e "${RED}❌ Type check failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Type check passed${NC}"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test || {
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Tests passed${NC}"
echo ""

# Build
echo "🏗️  Building package..."
npm run build || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Build succeeded${NC}"
echo ""

# Verify dist files exist
echo "📂 Verifying build output..."
if [ ! -f "dist/index.js" ]; then
    echo -e "${RED}❌ dist/index.js not found${NC}"
    exit 1
fi
if [ ! -f "dist/index.mjs" ]; then
    echo -e "${RED}❌ dist/index.mjs not found${NC}"
    exit 1
fi
if [ ! -f "dist/index.d.ts" ]; then
    echo -e "${RED}❌ dist/index.d.ts not found${NC}"
    exit 1
fi
if [ ! -f "dist/cli.js" ]; then
    echo -e "${RED}❌ dist/cli.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ All required files present${NC}"
echo ""

# Check CLI shebang
echo "🔧 Checking CLI shebang..."
if head -n 1 dist/cli.js | grep -q "^#!/usr/bin/env node"; then
    echo -e "${GREEN}✅ CLI has correct shebang${NC}"
else
    echo -e "${RED}❌ CLI missing shebang line${NC}"
    exit 1
fi
echo ""

# Preview package contents
echo "📦 Previewing package contents..."
npm pack --dry-run
echo ""

# Check package size
echo "📏 Checking package size..."
PACKAGE_SIZE=$(npm pack --dry-run 2>&1 | grep "Unpacked size:" | awk '{print $3}')
echo "   Unpacked size: $PACKAGE_SIZE"
echo ""

# Verify required files
echo "📄 Verifying required files..."
REQUIRED_FILES=("README.md" "LICENSE" "CHANGELOG.md" "ARCHAEOLOGICAL.md" "MIGRATION.md")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}   ✅ $file${NC}"
    else
        echo -e "${RED}   ❌ $file missing${NC}"
        exit 1
    fi
done
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Package verification complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "  1. Review the output above"
echo "  2. Check package contents: npm pack"
echo "  3. Test locally: npm install -g ./$(npm pack)"
echo "  4. Publish: npm publish --access public"
echo ""
