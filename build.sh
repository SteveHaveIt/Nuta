#!/bin/bash

# Nuta E-commerce Build Script
# Optimized for Render.com and other deployment platforms
# Prevents timeout issues during build process

set -e

echo "🚀 Starting Nuta E-commerce Build Process..."
echo "================================================"

# Step 1: Clean previous builds
echo "📦 Cleaning previous builds..."
rm -rf dist build .next out coverage || true
rm -rf node_modules/.cache || true

# Step 2: Install dependencies with optimizations
echo "📥 Installing dependencies..."
export NODE_ENV=production
export npm_config_maxsockets=5
pnpm install --frozen-lockfile --prefer-offline

# Step 3: Build client
echo "🎨 Building client application..."
cd client
pnpm build
cd ..

# Step 4: Build server (if needed)
echo "🔧 Compiling TypeScript..."
pnpm tsc --noEmit

# Step 5: Verify build
echo "✅ Verifying build..."
if [ -d "dist" ] || [ -d "client/dist" ]; then
  echo "✅ Build completed successfully!"
else
  echo "❌ Build verification failed!"
  exit 1
fi

echo ""
echo "================================================"
echo "✅ Build process completed successfully!"
echo "================================================"
