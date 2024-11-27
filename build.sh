#!/bin/bash

echo "Building frontend..."
cd dev-diligence
npm install
npm run build
npm run export

echo "Copying frontend build to backend static..."
mkdir -p ../backend/static
cp -r out/* ../backend/static/

echo "Back to root..."
cd ..