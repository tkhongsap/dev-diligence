#!/bin/bash

# Build frontend
cd dev-diligence
npm install
npm run build

# Copy built frontend to backend static directory
mkdir -p ../backend/static
cp -r .next/static/* ../backend/static/
cp -r .next/standalone/* ../backend/static/

# Back to root
cd .. 