# Unused Authentication Components

This directory contains authentication components that were created but are not currently used in the application. They have been moved here for reference rather than deleted entirely.

## Components

- `LoginForm.tsx` - A standalone login form component
- `RegisterForm.tsx` - A standalone registration form component
- `RegistrationForm.tsx` - Another standalone registration form component

## Why These Are Unused

The application currently uses the `AuthContainer.tsx` component directly, which contains its own integrated login and registration functionality. These separate component files are redundant.

## When to Use These

If you decide to refactor the authentication flow to use separate components for login and registration (for example, if you want to create dedicated routes for each), these components could be moved back to the main auth directory and integrated with your routing solution.
