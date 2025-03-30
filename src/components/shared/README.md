# Shared Components

This folder contains shared components that are designed to be reused across multiple CodeQual projects, including:
- MCP Configuration Tool
- PR Reviewer

## Components

### SharedHeader

A consistent header component with the proper green logo in a circle and navigation links:

```jsx
<SharedHeader 
  navLinks={[
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/documentation', label: 'Documentation' }
  ]}
  isAuthenticated={true}         // Whether user is authenticated
  onSignOut={handleSignOut}      // Sign out function
  languageSelector={true}        // Whether to show language selector
/>
```

Key features:
- Brand logo is clickable, linked to home
- Includes Home link in the navigation
- Uses circular green logo icon
- Shows "MCP Config" as the subtitle
- Consistent with screenshots

### SharedFooter

A consistent light-themed footer component with the logo and standard CodeQual sections:

```jsx
<SharedFooter />
```

The footer includes:
- Clickable logo that navigates to home
- "MCP Config" as a clickable brand name
- Three section layout with PLATFORM, COMPANY, LEGAL
- Light theme to match the screenshots
- Standard navigation links

## Styling

- Both header and footer use a light theme with proper spacing
- Brand names and logos are clickable, navigating to home page
- The header includes the Home link by default
- The footer uses the same green logo found in the header 
- All components are responsive and mobile-friendly

## Component Design Guidelines

These components follow specific design guidelines from the screenshots:

### Header
- Uses light background with border bottom
- Shows the circular green logo
- Displays "CodeQual" and "MCP Config" as the branding
- Includes "Home" link in the navigation
- Includes language selector and sign in/out button
- Brand name is clickable, navigating to home

### Footer
- Light theme with subtle border top
- Logo in the left column
- Three-column layout with PLATFORM, COMPANY, LEGAL sections
- Copyright statement centered at the bottom
- Brand name is clickable, navigating to home

## Usage Guidelines

1. Import the components directly from the shared folder
2. For the header, customize the navigation links if needed
3. The footer requires no props as it's standardized
4. Ensure the Home link is always present in the navigation
5. Keep the logo and brand name clickable for consistent UX

## Updating Shared Components

When modifying shared components:

1. Test changes in all applications that use the components
2. Maintain the CodeQual branding and design system
3. Ensure clickable elements work as expected
4. Preserve the Home link in navigation
5. Keep the light theme consistent across all pages
