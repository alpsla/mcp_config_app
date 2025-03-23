#!/bin/bash

# Stop on any error
set -e

echo "🔨 Fixing MCP Configuration Tool project issues with pnpm..."

# Clear node_modules
echo "🧹 Removing node_modules..."
rm -rf node_modules

# Remove package-lock.json
echo "🧹 Removing package-lock.json if it exists..."
rm -f package-lock.json

# Remove yarn.lock
echo "🧹 Removing yarn.lock if it exists..."
rm -f yarn.lock

# Remove pnpm-lock.yaml
echo "🧹 Removing pnpm-lock.yaml..."
rm -f pnpm-lock.yaml

# Fix react-scripts version
echo "📦 Installing appropriate react-scripts version..."
pnpm add react-scripts@4.0.3

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --no-strict-peer-dependencies

# Specifically install ajv and ajv-keywords
echo "📦 Installing ajv packages..."
pnpm add ajv@6.12.6 ajv-keywords@3.5.2 --save-dev

echo "✅ Project fixed and ready!"
echo "Run 'pnpm start' to start the development server."
