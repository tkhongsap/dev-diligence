#!/bin/bash

echo "Building frontend..."
cd dev-diligence

# Clean any previous builds
rm -rf .next out

# Install dependencies and build
npm install
npm run build
npm run export

echo "Copying frontend build to backend static..."
mkdir -p ../backend/static
# Copy all frontend build files
cp -r out/* ../backend/static/

echo "Build complete!"
cd ..