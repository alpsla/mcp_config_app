# GitHub Repository Setup for Shared Components

This document outlines the process for setting up a GitHub repository for the shared CodeQual components and publishing them as an npm package.

## Table of Contents

1. [Repository Setup](#repository-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Package Publication](#package-publication)
5. [Integration Guide](#integration-guide)
6. [CI/CD Setup](#cicd-setup)

## Repository Setup

### Creating the Repository

1. Create a new repository on GitHub:
   - Name: `codequal-shared-components`
   - Description: "Shared UI components for CodeQual applications"
   - Visibility: Private (initially, can be made public later)
   - Initialize with README
   - Add .gitignore for Node

2. Clone the repository locally:
   ```bash
   git clone https://github.com/your-organization/codequal-shared-components.git
   cd codequal-shared-components
   ```

3. Set up basic npm package:
   ```bash
   npm init
   ```

### Repository Configuration

1. Configure GitHub branch protection:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require linear history

2. Set up issue templates:
   - Bug report template
   - Feature request template
   - Component request template

3. Create a CONTRIBUTING.md file with guidelines for contributors.

## Project Structure

We recommend the following project structure:

```
codequal-shared-components/
├── .github/                  # GitHub configuration
│   └── workflows/            # GitHub Actions
├── src/                      # Source code
│   ├── components/           # Component definitions
│   │   ├── CodeQualLogo/     # Component-specific directory
│   │   │   ├── index.tsx     # Main component
│   │   │   └── styles.css    # Component styles (if not using Tailwind)
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── FAQSection/
│   ├── styles/               # Shared styles
│   │   ├── variables.css     # CSS variables
│   │   └── index.css         # Main style entry
│   ├── utils/                # Utility functions
│   └── index.ts              # Main entry point
├── dist/                     # Compiled output (gitignored)
├── examples/                 # Example implementations
│   ├── react-router/         # For React Router apps
│   └── nextjs/               # For Next.js apps
├── .storybook/               # Storybook configuration
├── stories/                  # Storybook stories
├── tests/                    # Test files
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
├── rollup.config.js          # Bundler configuration
└── README.md                 # Repository documentation
```

## Development Workflow

### Project Setup

1. Install core dependencies:
   ```bash
   npm install --save-dev typescript react react-dom @types/react
   npm install --save-dev rollup rollup-plugin-typescript2 rollup-plugin-terser
   npm install --save-dev @storybook/react
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   npm install --save-dev eslint prettier
   ```

2. Configure TypeScript (tsconfig.json):
   ```json
   {
     "compilerOptions": {
       "target": "es5",
       "module": "esnext",
       "lib": ["dom", "esnext"],
       "jsx": "react",
       "declaration": true,
       "declarationDir": "dist",
       "sourceMap": true,
       "outDir": "dist",
       "strict": true,
       "moduleResolution": "node",
       "allowSyntheticDefaultImports": true,
       "esModuleInterop": true
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist", "examples"]
   }
   ```

3. Configure Rollup (rollup.config.js) for bundling:
   ```javascript
   import typescript from 'rollup-plugin-typescript2';
   import { terser } from 'rollup-plugin-terser';
   import pkg from './package.json';

   export default {
     input: 'src/index.ts',
     output: [
       {
         file: pkg.main,
         format: 'cjs',
         exports: 'named',
         sourcemap: true,
       },
       {
         file: pkg.module,
         format: 'esm',
         exports: 'named',
         sourcemap: true,
       },
     ],
     plugins: [
       typescript({
         useTsconfigDeclarationDir: true,
       }),
       terser(),
     ],
     external: ['react', 'react-dom'],
   };
   ```

4. Set up Storybook for component development and testing:
   ```bash
   npx sb init
   ```

### Component Development Process

1. Create a new component directory:
   ```bash
   mkdir -p src/components/NewComponent
   ```

2. Implement the component with TypeScript:
   ```tsx
   // src/components/NewComponent/index.tsx
   import React from 'react';
   
   export interface NewComponentProps {
     // Define component props
   }
   
   export const NewComponent: React.FC<NewComponentProps> = (props) => {
     // Implement component
     return (
       <div>
         {/* Component JSX */}
       </div>
     );
   };
   ```

3. Create a Storybook story:
   ```tsx
   // stories/NewComponent.stories.tsx
   import React from 'react';
   import { NewComponent } from '../src/components/NewComponent';
   
   export default {
     title: 'Components/NewComponent',
     component: NewComponent,
   };
   
   export const Default = () => <NewComponent />;
   ```

4. Write tests:
   ```tsx
   // tests/NewComponent.test.tsx
   import React from 'react';
   import { render, screen } from '@testing-library/react';
   import { NewComponent } from '../src/components/NewComponent';
   
   describe('NewComponent', () => {
     it('renders correctly', () => {
       render(<NewComponent />);
       // Add assertions
     });
   });
   ```

5. Export the component:
   ```tsx
   // src/index.ts
   export * from './components/NewComponent';
   ```

## Package Publication

### Initial Setup

1. Update package.json with appropriate fields:
   ```json
   {
     "name": "@codequal/shared-components",
     "version": "0.1.0",
     "description": "Shared UI components for CodeQual applications",
     "main": "dist/index.js",
     "module": "dist/index.esm.js",
     "types": "dist/index.d.ts",
     "files": [
       "dist"
     ],
     "scripts": {
       "build": "rollup -c",
       "test": "jest",
       "storybook": "start-storybook -p 6006",
       "build-storybook": "build-storybook",
       "prepare": "npm run build"
     },
     "peerDependencies": {
       "react": ">=16.8.0",
       "react-dom": ">=16.8.0"
     }
   }
   ```

2. Set up npm organization and access:
   ```bash
   npm login  # Log in to npm
   ```

3. If using GitHub Packages instead:
   ```
   // .npmrc
   @your-org:registry=https://npm.pkg.github.com
   ```

### Publishing Process

1. Build the package:
   ```bash
   npm run build
   ```

2. Publish to npm:
   ```bash
   npm publish --access private  # For scoped private packages
   ```

3. For GitHub Packages:
   ```bash
   npm publish
   ```

### Versioning Strategy

Follow semantic versioning (SemVer):

- **Major version**: Breaking changes
- **Minor version**: New features, no breaking changes
- **Patch version**: Bug fixes, no breaking changes

## Integration Guide

### Installing the Package

1. Add the package to your project:
   ```bash
   npm install @codequal/shared-components
   ```

2. If using GitHub Packages:
   ```
   // .npmrc in your project
   @your-org:registry=https://npm.pkg.github.com
   ```

### Using Components

```jsx
import { Header, Footer } from '@codequal/shared-components';

function App() {
  return (
    <>
      <Header 
        appName="My App" 
        navLinks={[
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About' }
        ]}
      />
      
      {/* App content */}
      
      <Footer 
        appName="My App"
      />
    </>
  );
}
```

## CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Build and Publish

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        registry-url: 'https://registry.npmjs.org'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build package
      run: npm run build
    
    - name: Publish to npm
      if: startsWith(github.ref, 'refs/tags/v')
      run: npm publish
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Release Automation

1. Set up automatic versioning with standard-version:
   ```bash
   npm install --save-dev standard-version
   ```

2. Add to package.json:
   ```json
   {
     "scripts": {
       "release": "standard-version"
     }
   }
   ```

3. To create a new release:
   ```bash
   npm run release
   git push --follow-tags origin main
   ```

## Conclusion

By following this guide, you'll have a properly structured GitHub repository for shared components that can be used across all CodeQual applications. The npm package approach allows for versioned updates and easier integration.

For any questions or assistance with setting up the repository, contact the CodeQual development team.
