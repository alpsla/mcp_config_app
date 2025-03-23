#!/bin/bash

# Stop on any error
set -e

echo "🔨 Fixing MCP Configuration Tool project issues..."

# Clear node_modules
echo "🧹 Removing node_modules..."
rm -rf node_modules

# Remove package-lock.json
echo "🧹 Removing package-lock.json..."
rm -f package-lock.json

# Remove yarn.lock
echo "🧹 Removing yarn.lock if it exists..."
rm -f yarn.lock

# Remove pnpm-lock.yaml
echo "🧹 Removing pnpm-lock.yaml if it exists..."
rm -f pnpm-lock.yaml

# Skip cache clearing as it can sometimes cause issues
echo "🔄 Skipping npm cache clearing..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Specifically install ajv and ajv-keywords
echo "📦 Installing ajv packages..."
npm install ajv@6.12.6 ajv-keywords@3.5.2 --save-dev --legacy-peer-deps

# Fix package versions
echo "🔧 Fixing package versions..."
npm dedupe

echo "✅ Project fixed and ready!"
echo "Run 'npm start' to start the development server."
