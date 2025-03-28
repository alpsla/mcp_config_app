# Contributing to CodeQual Shared Components

Thank you for your interest in contributing to the CodeQual shared components! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Pull Request Guidelines](#pull-request-guidelines)
5. [Component Design Guidelines](#component-design-guidelines)
6. [Documentation Guidelines](#documentation-guidelines)
7. [Testing Guidelines](#testing-guidelines)
8. [Release Process](#release-process)

## Code of Conduct

All contributors are expected to adhere to our Code of Conduct. Please read it before participating.

- Be respectful and inclusive
- Provide constructive feedback
- Be collaborative
- Focus on what's best for the community
- Respect the work of others

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm (v7.x or later)
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/codequal-shared-components.git
   cd codequal-shared-components
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Storybook for component development:
   ```bash
   npm run storybook
   ```

## Development Process

### Branching Strategy

We use a simplified Git flow approach:

- `main`: Production-ready code, release tags
- `develop`: Integration branch for feature work
- `feature/*`: New features and enhancements
- `fix/*`: Bug fixes
- `refactor/*`: Code refactoring with no functionality changes
- `docs/*`: Documentation updates

### Creating a New Feature

1. Ensure you're starting from the latest code:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Develop your feature with regular commits
4. Push your branch and create a PR against `develop`

### Creating a New Component

1. Create a new branch:
   ```bash
   git checkout -b feature/component-name
   ```

2. Create the component directory structure:
   ```bash
   mkdir -p src/components/ComponentName
   touch src/components/ComponentName/index.tsx
   touch src/components/ComponentName/styles.css  # If using CSS
   ```

3. Create Storybook stories:
   ```bash
   touch stories/ComponentName.stories.tsx
   ```

4. Create tests:
   ```bash
   touch tests/ComponentName.test.tsx
   ```

5. Export the component from the main entry point:
   ```typescript
   // src/index.ts
   export * from './components/ComponentName';
   ```

## Pull Request Guidelines

### Checklist

- [ ] Component follows the [Component Design Guidelines](#component-design-guidelines)
- [ ] Component is well-documented
- [ ] Component includes Storybook stories
- [ ] Component has adequate test coverage
- [ ] No lint errors or warnings
- [ ] Code is properly formatted
- [ ] Pull request title follows conventional commits format

### PR Template

```markdown
## Description
[Describe the changes made and why they are needed]

## Type of Change
- [ ] New feature (non-breaking change adding functionality)
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update
- [ ] Refactoring

## How to Test
[Provide steps to test the changes]

## Screenshots (if applicable)
[Add screenshots to demonstrate visual changes]

## Related Issues
[Link any related issues]
```

### Review Process

1. All PRs require at least one approval from a core team member
2. All CI checks must pass
3. PR should be rebased on the latest code before merging
4. PRs should be merged by squashing commits

## Component Design Guidelines

### General Principles

1. **Composable**: Components should be modular and support composition
2. **Accessible**: Follow WCAG 2.1 AA standards
3. **Customizable**: Support customization via props
4. **Consistent**: Follow established patterns
5. **Cross-browser compatible**: Support major browsers
6. **Framework agnostic**: Avoid framework-specific features when possible

### Component Structure

Each component should:

1. Have a clear, single responsibility
2. Accept a standard set of common props (className, style, etc.)
3. Implement appropriate ARIA attributes
4. Support both controlled and uncontrolled modes (if applicable)
5. Include appropriate default props
6. Have comprehensive TypeScript types

### Styling Requirements

1. Follow the [Styling Guide](./styling-guide.md)
2. Support both light and dark themes
3. Be responsive across all screen sizes
4. Use the CodeQual color palette and design tokens

## Documentation Guidelines

### Component Documentation

Each component should be documented with:

1. **Description**: What the component does and when to use it
2. **Props API**: All available props with types and descriptions
3. **Examples**: Basic and advanced usage examples
4. **Accessibility**: Accessibility considerations
5. **Related Components**: Links to related components

### Documentation Format

```jsx
/**
 * A component that displays [description].
 *
 * @example
 * <ComponentName prop1="value" />
 *
 * @accessibility
 * - Implements ARIA role="..."
 * - Supports keyboard navigation
 */
export interface ComponentNameProps {
  /**
   * Description of prop1
   * @default defaultValue
   */
  prop1?: string;
  
  // Other props...
}
```

## Testing Guidelines

### Types of Tests

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **Visual Regression Tests**: Ensure visual stability
4. **Accessibility Tests**: Verify accessibility compliance

### Test Requirements

Each component should have:

1. Unit tests for all behaviors and variants
2. Tests for error states and edge cases
3. Accessibility tests
4. Tests for keyboard navigation (if interactive)

### Example Test

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName prop1="value" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major version**: Breaking changes
- **Minor version**: New features (no breaking changes)
- **Patch version**: Bug fixes (no breaking changes)

### Release Steps

1. Merge feature branches into `develop`
2. Test thoroughly in the integration environment
3. Create a release branch:
   ```bash
   git checkout -b release/vX.Y.Z develop
   ```

4. Update version in package.json
5. Update CHANGELOG.md
6. Create a PR from the release branch to `main`
7. After approval and merge, tag the release:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

8. Merge `main` back into `develop`

## Conclusion

Thank you for contributing to the CodeQual shared components! By following these guidelines, you help ensure that our components remain high-quality, consistent, and maintainable.

If you have any questions or need assistance, please reach out to the team or open an issue.
