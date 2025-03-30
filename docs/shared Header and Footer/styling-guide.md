# Styling Guide for Shared Components

This guide provides information about the styling approach, conventions, and customization options for the CodeQual shared components.

## Table of Contents

1. [Styling Approaches](#styling-approaches)
2. [CSS Variables](#css-variables)
3. [Theme Support](#theme-support)
4. [Responsive Design](#responsive-design)
5. [Customization](#customization)
6. [Best Practices](#best-practices)

## Styling Approaches

The CodeQual shared components support multiple styling approaches to accommodate different application needs:

### 1. CSS Files (MCP Config Approach)

In this approach, styles are defined in separate CSS files and imported into components.

**Implementation:**
```jsx
// Component
import React from 'react';
import './Component.css';

// Component implementation
```

**Benefits:**
- Separation of concerns
- Familiar to most developers
- Easy to override with more specific selectors

### 2. Tailwind CSS (PR Reviewer Approach)

In this approach, Tailwind utility classes are used directly in the component markup.

**Implementation:**
```jsx
// Component
const Component = () => (
  <div className="flex items-center p-4 bg-white dark:bg-gray-800">
    {/* Component content */}
  </div>
);
```

**Benefits:**
- No context switching between files
- Highly composable
- Reduced CSS bundle size

### 3. Hybrid Approach

For the most flexibility, components can use a hybrid approach where base styling is done with CSS files and variations are handled with utility classes.

**Implementation:**
```jsx
// Component.css
.component {
  /* Base styles */
}

// Component.jsx
const Component = ({ className = '' }) => (
  <div className={`component ${className}`}>
    {/* Component content */}
  </div>
);
```

**Benefits:**
- Core styles are encapsulated
- Easy customization via props
- Works well with both styling paradigms

## CSS Variables

To ensure consistency across components and support theme customization, we use CSS variables for key properties.

### Core Variables

```css
:root {
  /* Color Variables */
  --primary: #3A86FF;
  --primary-dark: #2563EB;
  --secondary: #8338EC;
  --secondary-dark: #6D28D9;
  --neutral-bg: #F8F9FA;
  --neutral-light: #E9ECEF;
  --neutral-medium: #CED4DA;
  --neutral-dark: #6C757D;
  --text: #212529;
  --text-light: #495057;
  --success: #38B000;
  --warning: #FFBE0B;
  --white: #FFFFFF;
  
  /* Spacing Variables */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-xxl: 3rem;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Shadow */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Dark Theme Variables

When dark mode is enabled, these variables should be overridden:

```css
:root.dark {
  --primary: #3B82F6;
  --primary-dark: #2563EB;
  --neutral-bg: #1E293B;
  --neutral-light: #334155;
  --neutral-medium: #475569;
  --neutral-dark: #94A3B8;
  --text: #F8FAFC;
  --text-light: #E2E8F0;
  --white: #0F172A;
}
```

## Theme Support

Components support both light and dark themes through CSS variables and conditional classes.

### Implementation

#### CSS Variables Approach

```css
.component {
  background-color: var(--neutral-bg);
  color: var(--text);
}
```

#### Tailwind Approach

```jsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
```

### Toggling Themes

The components accept a `theme` prop and an `onThemeToggle` function to handle theme switching:

```jsx
const [theme, setTheme] = useState('light');

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  
  // For CSS variable approach
  document.documentElement.className = newTheme;
  
  // For Tailwind
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

<Header 
  theme={theme}
  onThemeToggle={toggleTheme}
/>
```

## Responsive Design

Components are designed to be responsive across different screen sizes. We use these breakpoints:

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Laptop**: 768px - 992px
- **Desktop**: 992px - 1200px
- **Large Desktop**: > 1200px

### Implementation

#### CSS Media Queries

```css
/* Mobile First Approach */
.component {
  /* Base styles (mobile) */
}

@media (min-width: 576px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 768px) {
  .component {
    /* Laptop styles */
  }
}

@media (min-width: 992px) {
  .component {
    /* Desktop styles */
  }
}
```

#### Tailwind Classes

```jsx
<div className="flex flex-col md:flex-row p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

## Customization

Components can be customized in several ways:

### 1. Props

Most styling variants can be controlled via props:

```jsx
<Button 
  variant="primary" 
  size="large"
  rounded
/>
```

### 2. Class Name Prop

All components accept a `className` prop for additional customization:

```jsx
<Header className="with-shadow sticky-top" />
```

### 3. CSS Overrides

Target specific components with CSS selectors:

```css
/* Make the header fixed for a specific page */
.product-page .header {
  position: fixed;
}
```

### 4. Theme Customization

Override CSS variables for site-wide customization:

```css
:root {
  --primary: #FF6B6B; /* Custom primary color */
}
```

## Best Practices

### 1. Keep the Brand Consistent

- Use the provided CSS variables for colors
- Maintain the CodeQual logo's appearance
- Don't drastically change component layouts

### 2. Responsive Considerations

- Test all customizations on different screen sizes
- Ensure tap targets are adequate on mobile
- Watch for content overflow

### 3. Accessibility

- Maintain color contrast ratios (4.5:1 minimum)
- Ensure interactive elements are keyboard accessible
- Keep text at readable sizes (minimum 16px for body text)

### 4. Theme Compatibility

- Always check both light and dark themes
- Use the `dark:` variant for Tailwind styles
- Use CSS variables for component-specific styles

### 5. Performance

- Avoid excessive nested selectors
- Use CSS utility classes where possible
- Consider code-splitting for large style imports

### 6. Workflow Optimization

- Use the component props API first
- Only use CSS overrides when necessary
- Keep customizations organized in separate files

## Conclusion

By following these guidelines, we can maintain a consistent look and feel across all CodeQual applications while providing flexibility for app-specific needs. The shared components are designed to accommodate different styling approaches and offer customization options without compromising the core brand identity.
