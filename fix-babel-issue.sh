#!/bin/bash

# Stop on any error
set -e

echo "🔨 Fixing Babel version compatibility issues..."

# Clear node_modules
echo "🧹 Removing node_modules..."
rm -rf node_modules

# Remove lock files
echo "🧹 Removing lock files..."
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

# Create a temporary package.json with explicit babel versions
echo "📝 Updating package.json with compatible Babel versions..."
cat > package.json << 'EOL'
{
  "name": "mcp-config-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@babel/core": "^7.16.0",
    "@babel/preset-env": "^7.16.0",
    "@babel/preset-react": "^7.16.0",
    "@babel/preset-typescript": "^7.16.0",
    "@testing-library/jest-dom": "^5.14.1",
    "@testing-library/react": "^13.0.0",
    "@testing-library/user-event": "^13.2.1",
    "@types/jest": "^27.0.1",
    "@types/node": "^16.7.13",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "ajv": "^6.12.6",
    "ajv-keywords": "^3.5.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "^5.0.1",
    "typescript": "^4.4.2",
    "web-vitals": "^2.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "mock-api": "node mock-api-server.js"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}
EOL

# Install dependencies using pnpm
echo "📦 Installing dependencies with pnpm..."
pnpm install

echo "✅ Babel version fixed and ready!"
echo "Run 'pnpm start' to start the development server."
