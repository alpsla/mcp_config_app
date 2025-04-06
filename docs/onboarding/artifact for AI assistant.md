# Project Coding Standards and Workflow Guidelines

## 1. Code Quality Rules

### File Management
- Keep files under 500 lines of code
- When a file approaches 500 lines:
  * Break into smaller, focused components
  * Extract reusable logic into utility functions/hooks
  * Use composition to manage complexity

### Code Cleanliness
- Remove unused code systematically:
  * Eliminate unused imports
  * Remove dead code (commented-out sections)
  * Delete unused variables and functions
  * Clear out unnecessary console.log statements

### Code Structure
- Optimize for single responsibility:
  * Each function/component should have a clear, singular purpose
  * Be easily testable
  * Avoid mixing different types of logic
- Use custom hooks to separate concerns
- Break large components into smaller, focused components

### Code Duplication
- Avoid repeating code:
  * Extract common patterns into utility functions
  * Create shared components
  * Follow DRY (Don't Repeat Yourself) principle
- Create reusable abstractions for repeated logic

## 2. Task Tracking and Status Updates

### Status Update Location
Update the impleme