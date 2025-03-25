# Unified Directory Structure

## Overview
This document outlines the unified directory structure for integrating the dashboard, pricing page, and homepage components into the existing MCP Config App.

## Structure

```
integrated/
├── public/
│   ├── assets/
│   │   ├── icons/           # All SVG icons used across components
│   │   ├── illustrations/   # All illustrations used across components
│   │   └── logos/           # Logo files
│   └── index.html           # Main HTML entry point
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── homepage/        # Homepage-specific components
│   │   └── pricing/         # Pricing-specific components
│   ├── styles/
│   │   ├── common.css       # Shared styles
│   │   ├── dashboard.css    # Dashboard-specific styles
│   │   ├── homepage.css     # Homepage-specific styles
│   │   └── pricing.css      # Pricing-specific styles
│   └── scripts/
│       ├── common.js        # Shared JavaScript functionality
│       ├── dashboard.js     # Dashboard-specific scripts
│       ├── homepage.js      # Homepage-specific scripts
│       └── pricing.js       # Pricing-specific scripts
```

## Integration with Existing Repository

For integration with the existing React application:

1. Assets (icons, illustrations, logos) should be placed in the `public/images` directory
2. Component files should be integrated into the appropriate directories under `src/components`
3. CSS should be converted to component-specific CSS or styled-components
4. JavaScript functionality should be integrated into React components

## Common Assets
All common assets (icons, illustrations) will be consolidated to avoid duplication, with shared styles and scripts extracted to common files.
