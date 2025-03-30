# CodeQual Shared Components

This directory contains documentation for the shared Header and Footer components used across CodeQual applications, including MCP Config and PR Reviewer.

## Table of Contents

1. [Overview](./overview.md)
2. [Component Documentation](./component-documentation.md)
3. [Implementation Guide](./implementation-guide.md)
4. [GitHub Repository Setup](./github-repository-setup.md)
5. [Styling Guide](./styling-guide.md)
6. [Contributing Guidelines](./contributing.md)

## Quick Start

To use the shared components in your CodeQual application:

1. Install the components (once the npm package is available):
   ```bash
   npm install @codequal/shared-components
   ```

2. Import and use the components:
   ```jsx
   import { Header, Footer } from '@codequal/shared-components';
   
   function App() {
     return (
       <>
         <Header 
           appName="Your App Name" 
           navLinks={[...]} 
         />
         
         {/* Your app content */}
         
         <Footer 
           appName="Your App Name"
           platformLinks={[...]}
         />
       </>
     );
   }
   ```

3. See the [Implementation Guide](./implementation-guide.md) for detailed instructions.

## Current Status

Currently, the shared components are implemented directly in each application. We plan to move these into a shared npm package in the future for better maintainability.

## Contact

For questions or support, contact the CodeQual development team.
