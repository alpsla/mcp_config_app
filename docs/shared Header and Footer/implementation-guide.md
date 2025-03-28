# Implementation Guide

This guide provides step-by-step instructions for implementing the shared CodeQual components in your application.

## Table of Contents

1. [Current Implementation Approach](#current-implementation-approach)
2. [Prerequisites](#prerequisites)
3. [Adding Components to a New Project](#adding-components-to-a-new-project)
4. [Migrating from Application-Specific Components](#migrating-from-application-specific-components)
5. [Framework-Specific Adaptations](#framework-specific-adaptations)
6. [Troubleshooting](#troubleshooting)

## Current Implementation Approach

Currently, we're using a direct file sharing approach where the components are copied between projects. In the future, we'll move to an npm package for easier integration.

## Prerequisites

Before implementing these components, ensure your project has:

1. React (16.8+ for Hooks support)
2. A CSS solution (plain CSS, SCSS, Tailwind, etc.)
3. If using TypeScript, proper type definitions
4. For React Router projects: `react-router-dom` 
5. For Next.js projects: `next/link` and other required imports

## Adding Components to a New Project

### Step 1: Create the Directory Structure

```bash
# Create component directories
mkdir -p src/components/common
mkdir -p src/styles/components  # If using CSS files
```

### Step 2: Copy Component Files

Copy these files from the shared repository or another CodeQual project:

**For React Router (e.g., MCP Config)**
```
src/components/common/CodeQualLogo.jsx
src/components/common/Header.jsx
src/components/common/Footer.jsx
src/components/common/FAQItem.jsx
src/components/common/FAQSection.jsx

# If using CSS files
src/styles/components/Header.css
src/styles/components/Footer.css
src/styles/components/FAQ.css
```

**For Next.js (e.g., PR Reviewer)**
```
src/components/common/CodeQualLogo.tsx
src/components/common/SharedHeader.tsx
src/components/common/SharedFooter.tsx
```

### Step 3: Install Required Dependencies

For icon support:
```bash
# For React Router projects
npm install lucide-react

# For Next.js projects (if not already included)
# usually already included in Next.js projects
```

### Step 4: Implement in Your Application

Here's a minimal implementation example:

```jsx
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  // Define app-specific props
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' }
  ];
  
  return (
    <>
      <Header 
        appName="Your App Name"
        navLinks={navLinks}
      />
      
      <main>
        {/* Your application content here */}
      </main>
      
      <Footer 
        appName="Your App Name"
      />
    </>
  );
}
```

## Migrating from Application-Specific Components

If you're replacing existing components with the shared ones:

### Step 1: Analyze Existing Implementation

Identify any custom functionality in your current header/footer that needs to be preserved.

### Step 2: Prepare Data for Shared Components

Format your navigation links and other data to match the expected props format.

### Step 3: Replace Components Incrementally

Start with a single page to test the implementation before expanding to all pages.

### Step 4: Test Thoroughly

Test across different screen sizes and scenarios (logged in/out, different themes, etc.).

## Framework-Specific Adaptations

### React Router (e.g., MCP Config)

The components use:
- `Link` from react-router-dom
- `useLocation` hook for active link detection
- `to` prop for navigation

```jsx
import { Link, useLocation } from 'react-router-dom';

// Inside component
const location = useLocation();
const isActive = location.pathname === link.to;

// In JSX
<Link to={link.to}>...</Link>
```

### Next.js (e.g., PR Reviewer)

The components use:
- `Link` from next/link
- `useRouter` hook for active link detection
- `href` prop for navigation

```jsx
import Link from 'next/link';
import { useRouter } from 'next/router';

// Inside component
const router = useRouter();
const isActive = router.pathname === link.href;

// In JSX
<Link href={link.href}>...</Link>
```

### Adapting Between Frameworks

If moving components between frameworks:

1. Update import statements
2. Change routing hooks
3. Update link props (`to` ↔ `href`)
4. Adjust CSS imports if necessary

## CSS Implementation

### Option 1: CSS Files (MCP Config approach)

Import CSS files in your components:

```jsx
import '../../styles/components/Header.css';
```

### Option 2: Tailwind CSS (PR Reviewer approach)

Use Tailwind utility classes directly in the components:

```jsx
<header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700/80 bg-white/95">
```

### Option 3: CSS-in-JS

If using styled-components or Emotion, adapt the components accordingly.

## Troubleshooting

### Common Issues

1. **Missing Icons**: Ensure you've installed the required icon library (e.g., lucide-react).

2. **Routing Issues**: Check that you're using the correct routing components for your framework.

3. **Theme Toggling Doesn't Work**: Ensure you're passing the correct theme state and toggle function.

4. **Style Conflicts**: If you have existing global styles, they might conflict with the component styles. Use more specific selectors or CSS modules.

5. **Authentication State Not Reflected**: Make sure you're passing the correct `isAuthenticated` prop.

### Getting Help

If you encounter issues not covered here:

1. Check the component props documentation
2. Review the implementation in other CodeQual applications
3. Contact the CodeQual development team
