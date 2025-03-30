# Component Documentation

This document provides detailed information about each shared component, including props, usage examples, and styling options.

## Table of Contents

1. [CodeQualLogo](#codequal-logo)
2. [Header](#header)
3. [Footer](#footer)
4. [FAQSection](#faqsection)

---

## CodeQual Logo

A standardized logo component that ensures consistent branding across all CodeQual applications.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `className` | string | No | `''` | Custom CSS class to apply to the SVG element |

### Usage

```jsx
import { CodeQualLogo } from '@codequal/shared-components';

// Basic usage
<CodeQualLogo />

// With custom size
<CodeQualLogo className="w-16 h-16" />
```

### Styling

The logo is implemented as an SVG with the following properties:

- Viewbox: `0 0 100 100`
- Default colors: CodeQual blue and green
- Responsive sizing: Apply width/height through className

---

## Header

A responsive header component that includes the CodeQual logo, navigation links, language selector, theme toggle, and authentication controls.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `appName` | string | Yes | - | Name of the application to be displayed |
| `navLinks` | Array<{to: string, label: string}> | Yes | - | Navigation links specific to the application |
| `isAuthenticated` | boolean | No | `false` | Whether a user is currently authenticated |
| `user` | Object | No | `null` | User object if authenticated |
| `signOut` | Function | No | `async () => {}` | Function to call when signing out |
| `onThemeToggle` | Function | No | `() => {}` | Function to call when toggling theme |
| `theme` | string | No | `'light'` | Current theme ('light' or 'dark') |
| `className` | string | No | `''` | Custom CSS class to apply to the header |

### Usage

```jsx
import { Header } from '@codequal/shared-components';

// Basic usage
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/docs', label: 'Documentation' }
];

<Header 
  appName="MCP Config" 
  navLinks={navLinks}
/>

// With authentication and theme
<Header 
  appName="PR Reviewer" 
  navLinks={navLinks}
  isAuthenticated={isUserLoggedIn}
  user={currentUser}
  signOut={handleSignOut}
  onThemeToggle={toggleTheme}
  theme={currentTheme}
/>
```

### Responsive Behavior

- Desktop: Full horizontal navigation
- Mobile: Hamburger menu with dropdown navigation
- Tablet: Compressed navigation items

### Framework-Specific Notes

#### React Router (MCP Config)
- Uses `Link` from 'react-router-dom'
- Uses `useLocation` for active link detection

#### Next.js (PR Reviewer)
- Uses `Link` from 'next/link'
- Uses `useRouter` for active link detection

---

## Footer

A standardized footer component with customizable link sections and CodeQual branding.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `appName` | string | Yes | - | Name of the application to be displayed |
| `platformLinks` | Array<{to: string, label: string}> | No | *Default links* | Platform-specific links |
| `companyLinks` | Array<{to: string, label: string}> | No | *Default links* | Company-related links |
| `legalLinks` | Array<{to: string, label: string}> | No | *Default links* | Legal documentation links |
| `isAuthenticated` | boolean | No | `false` | Whether a user is currently authenticated |
| `className` | string | No | `''` | Custom CSS class to apply to the footer |

### Default Link Sections

```javascript
// Default platformLinks
[
  { to: '/features', label: 'Features' },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' }
]

// Default companyLinks
[
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' }
]

// Default legalLinks
[
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/security', label: 'Security' }
]
```

### Usage

```jsx
import { Footer } from '@codequal/shared-components';

// Basic usage with default links
<Footer appName="MCP Config" />

// With custom platform links
const platformLinks = [
  { to: '/features', label: 'Features' },
  { to: '/integrations', label: 'Integrations' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/api', label: 'API' },
];

<Footer 
  appName="PR Reviewer"
  platformLinks={platformLinks}
/>

// With all custom links
<Footer 
  appName="PR Reviewer"
  platformLinks={platformLinks}
  companyLinks={companyLinks}
  legalLinks={legalLinks}
  isAuthenticated={isUserLoggedIn}
/>
```

### Layout

The footer is organized into a responsive grid:

- Logo and company description
- Platform links
- Company links
- Legal links
- Copyright statement

---

## FAQSection

A reusable FAQ component with accordion functionality.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | No | `'Frequently Asked Questions'` | Section title |
| `faqs` | Array<{question: string, answer: string}> | Yes | - | Array of FAQ items |

### Usage

```jsx
import { FAQSection } from '@codequal/shared-components';

const faqData = [
  {
    question: "What is CodeQual?",
    answer: "CodeQual provides AI-powered tools to improve code quality and save development time."
  },
  {
    question: "How does pricing work?",
    answer: "We offer free and paid plans. You can view our pricing details on our pricing page."
  },
  // Additional FAQ items...
];

<FAQSection 
  title="Frequently Asked Questions" 
  faqs={faqData}
/>
```

### Behavior

- First FAQ item is expanded by default
- Clicking a question toggles the visibility of its answer
- Opening one FAQ item automatically closes others
