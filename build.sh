#!/bin/bash
set -ex  # Exit on error and print commands

echo "Current directory: $(pwd)"
echo "Listing directory contents:"
ls -la

if [ ! -d "dev-diligence" ]; then
    echo "Error: dev-diligence directory not found!"
    exit 1
fi

echo "Building frontend..."
cd dev-diligence
echo "Inside dev-diligence directory:"
ls -la

# Clean any previous builds
rm -rf .next out

# Install dependencies and build
echo "Installing dependencies..."
npm install --verbose

echo "Building Next.js app..."
npm run build

echo "Exporting static files..."
npm run export

echo "Copying frontend build to backend static..."
mkdir -p ../backend/static
echo "Copying files from out/ to static/"
cp -rv out/* ../backend/static/

echo "Build complete! Contents of backend/static:"
ls -la ../backend/static

cd ..