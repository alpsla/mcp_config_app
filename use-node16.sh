#!/bin/bash

# Check if nvm is installed
if command -v nvm &> /dev/null; then
  echo "Using nvm to install and use Node.js v16..."
  nvm install 16
  nvm use 16
  
  echo "Switching to alternative package.json..."
  mv package.json package.json.backup
  mv alternative-package.json package.json
  
  echo "Removing node_modules and reinstalling..."
  rm -rf node_modules
  rm -f package-lock.json
  npm install
  
  echo "✅ Now using Node.js v16 with compatible package.json"
  echo "Run 'npm start' to start the development server."
else
  echo "⚠️ nvm not found."
  echo "Please install a compatible Node.js version (v16 recommended)"
  echo "Visit https://github.com/nvm-sh/nvm for instructions on installing nvm"
fi
