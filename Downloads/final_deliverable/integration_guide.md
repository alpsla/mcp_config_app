# Integration Guide for MCP Config App

This document provides step-by-step instructions for integrating the unified design components (Dashboard, Homepage, and Pricing page) into the existing MCP Config App repository.

## Overview

We've combined three separate design packages into a unified structure with:
- Consolidated assets (icons, illustrations, logos)
- Organized component structure
- Consistent styling approach
- React-compatible components

## Integration Steps

### 1. Asset Integration

Copy the unified assets to your public directory:

```bash
# Create directories if they don't exist
mkdir -p public/images/icons
mkdir -p public/images/illustrations
mkdir -p public/images/logos

# Copy assets
cp -r combined_project/integrated/public/assets/icons/* public/images/icons/
cp -r combined_project/integrated/public/assets/illustrations/* public/images/illustrations/
cp -r combined_project/integrated/public/assets/logos/* public/images/logos/
```

### 2. Component Integration

#### Dashboard Component

1. Copy the Dashboard component to your components directory:

```bash
cp combined_project/integrated/src/components/dashboard/Dashboard.jsx src/components/dashboard/
```

2. Update the import paths in the Dashboard component to match your project structure:
   - Update CSS imports to point to your CSS location
   - Update asset paths to match your public directory structure

3. Add the Dashboard component to your routes in your main router file:

```jsx
import Dashboard from './components/dashboard/Dashboard';

// In your Routes component
<Route path="/dashboard" element={<Dashboard />} />
```

#### Homepage Component

1. Copy the Homepage component to your components directory:

```bash
cp combined_project/integrated/src/components/homepage/Homepage.jsx src/pages/
```

2. Update the import paths in the Homepage component to match your project structure:
   - Update CSS imports to point to your CSS location
   - Update asset paths to match your public directory structure

3. Add the Homepage component to your routes:

```jsx
import Homepage from './pages/Homepage';

// In your Routes component
<Route path="/" element={<Homepage />} />
```

#### Pricing Component

1. Copy the Pricing component to your components directory:

```bash
cp combined_project/integrated/src/components/pricing/Pricing.jsx src/components/pricing/
```

2. Update the import paths in the Pricing component to match your project structure:
   - Update CSS imports to point to your CSS location
   - Update asset paths to match your public directory structure

3. Add the Pricing component to your routes:

```jsx
import Pricing from './components/pricing/Pricing';

// In your Routes component
<Route path="/pricing" element={<Pricing />} />
```

### 3. Style Integration

1. Copy the CSS files to your styles directory:

```bash
mkdir -p src/styles
cp combined_project/integrated/src/styles/common.css src/styles/
cp combined_project/integrated/src/styles/dashboard.css src/styles/
cp combined_project/integrated/src/styles/homepage.css src/styles/
cp combined_project/integrated/src/styles/pricing.css src/styles/
```

2. Import the styles in your components or in your main index.js/App.js file:

```jsx
// In index.js or App.js for global styles
import './styles/common.css';

// In specific components
import '../styles/dashboard.css';
```

### 4. Script Integration

1. Copy the JavaScript files to your scripts directory:

```bash
mkdir -p src/scripts
cp combined_project/integrated/src/scripts/common.js src/scripts/
cp combined_project/integrated/src/scripts/dashboard.js src/scripts/
cp combined_project/integrated/src/scripts/homepage.js src/scripts/
cp combined_project/integrated/src/scripts/pricing.js src/scripts/
```

2. Import the scripts in your components as needed:

```jsx
// Example: Importing scripts in a component
import { useEffect } from 'react';
import '../scripts/dashboard.js';

const Dashboard = () => {
  useEffect(() => {
    // Initialize any script functionality here
  }, []);
  
  // Component JSX
};
```

## Alternative Integration Approach: Component Conversion

For a more React-native approach, consider converting the HTML/CSS/JS into proper React components:

1. Convert CSS to CSS modules or styled-components
2. Convert JavaScript functionality to React hooks and state management
3. Break down large components into smaller, reusable components
4. Use React Router for navigation between pages

## Testing

After integration, test the following:

1. Navigation between pages works correctly
2. All assets load properly
3. Responsive design works on different screen sizes
4. No CSS conflicts with existing styles
5. All interactive elements function correctly

## Troubleshooting

- **CSS Conflicts**: If you experience styling issues, consider using CSS modules or styled-components to scope styles
- **Asset Paths**: Ensure all asset paths are correctly updated to match your project structure
- **React Router**: Make sure your route configuration is correct and components are properly imported
