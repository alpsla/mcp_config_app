# Authentication Module

This directory contains the authentication-related components for the MCP Configuration Tool.

## Structure

- `AuthContext.tsx` - Provides the authentication context and hooks
- `AuthProvider.tsx` - Provides the authentication state management
- `AuthContainer.tsx` - Main authentication UI component with both login and registration forms

## How Authentication Works

1. `AuthProvider` is injected at the root level of the application in `App.tsx`
2. `AuthContainer` is shown to unauthenticated users
3. The `useAuth` hook from `AuthContext` is used throughout the application to access authentication state and functions

## Email Verification

The email verification process is handled in the `VerifyEmail.tsx` component in the pages directory. After a user signs up, they receive an email with a verification link that points to this component.

## Password Reset

Password reset functionality is handled in the `ResetPassword.tsx` component in the pages directory. Users can request a password reset from the login screen.

## Unused Components

Some previously created authentication components are not currently used and have been moved to the `unused` directory for reference.
