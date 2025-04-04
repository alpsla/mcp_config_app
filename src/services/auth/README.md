# MCP Configuration Tool Authentication System

This directory contains the refactored authentication system for the MCP Configuration Tool. The system has been redesigned to improve maintainability, error handling, and robustness.

## Architecture Overview

The authentication system follows a modular design pattern with these key components:

### Directory Structure

```
src/services/auth/
├── core/                 - Core authentication functionality
│   ├── authClient.ts     - Supabase client initialization
│   └── authService.ts    - Core authentication functions
├── email/                - Email authentication
│   ├── emailAuthService.ts  - Email auth functions
│   └── emailTemplates.ts    - Email templates
├── oauth/                - OAuth authentication
│   └── oauthService.ts      - OAuth auth functions
├── profile/              - Profile management
│   └── profileService.ts    - Profile management functions
├── sql/                  - SQL scripts
│   └── create_user_profile_function.sql - RPC function for profile creation
├── types/                - Type definitions
│   └── authTypes.ts      - Shared types and interfaces
└── index.ts              - Main export file
```

## Key Features

### Multi-Strategy Profile Creation

To solve the persistent profile creation issues, we've implemented a multi-strategy approach:

1. **Direct Insert**: First attempt with standard insert operation
2. **Upsert Approach**: Second attempt using upsert if direct insert fails
3. **RPC Function**: Final fallback using a database function with elevated privileges

### Improved Error Handling

- Comprehensive error logging throughout the authentication process
- Graceful fallback mechanisms at every step
- Clear error messages with actionable information

### Better Code Organization

- Smaller, focused modules with clear responsibilities
- Separation of concerns (auth, profile management, email, OAuth)
- Improved testability with isolated components

## Usage

Import the authentication service from the main index file:

```typescript
import { 
  authService,
  getCurrentUser,
  signInWithEmail,
  // ... other specific functions as needed
} from '@/services/auth';
```

## Backward Compatibility

For backward compatibility, the old authentication service at `src/services/supabase/authService.ts` has been updated to re-export functions from the new modular system. Existing code using the old import path will continue to work.

## Database Components

### RPC Function

The SQL directory contains a database function that bypasses RLS policies to create user profiles:

```sql
CREATE OR REPLACE FUNCTION create_user_profile(user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
...
$$;
```

This function needs to be executed in your Supabase SQL editor. It provides a reliable fallback mechanism for profile creation when other approaches fail.

## Implementation Notes

1. **Profile Creation**
   - The `verifyAndEnsureProfile` function in `profile/profileService.ts` handles profile creation with the multi-strategy approach
   - It first tries a direct insert, then upsert, and finally the RPC function
   - Each attempt has detailed error logging to help diagnose issues

2. **Supabase Client**
   - The Supabase client is initialized once in `core/authClient.ts`
   - It's used consistently across all modules to ensure a single instance

3. **Email Templates**
   - Email templates are defined in `email/emailTemplates.ts`
   - They can be customized without modifying the core authentication logic

4. **Error Handling**
   - All functions return consistent result objects with `success` and `error` properties
   - Error messages are preserved throughout the stack for better debugging

## RLS Policies

The following Row Level Security policies should be implemented in Supabase:

```sql
-- Add service role policy to allow bypass of RLS
DROP POLICY IF EXISTS "Allow service role full access to profiles" ON public.profiles;
CREATE POLICY "Allow service role full access to profiles" 
ON public.profiles
FOR ALL
TO service_role
USING (true);

-- Add policy for anonymous access during profile creation
DROP POLICY IF EXISTS "Allow anonymous access for initial profile creation" ON public.profiles;
CREATE POLICY "Allow anonymous access for initial profile creation"
ON public.profiles
FOR ALL
TO anon
USING (true);

-- Individual user access
CREATE POLICY "Allow individual users to read their own profile" 
ON public.profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow individual users to insert their own profile" 
ON public.profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow individual users to update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id);
```

## Deployment Steps

1. **Deploy SQL Functions**
   - Execute the SQL in `sql/create_user_profile_function.sql` in your Supabase SQL Editor
   - Verify the function was created successfully
   - Test the function by running: `SELECT create_user_profile('user-id-here')`

2. **Update JWT Secret (if necessary)**
   - Ensure your JWT secret is properly configured in Supabase
   - If you change it, update your environment variables accordingly

3. **Test Authentication Flows**
   - Test registration: Regular email, Google OAuth, GitHub OAuth
   - Test login: Email/password, Magic link, Social providers
   - Test profile access and update

## Troubleshooting

### Common Issues

1. **Profile Creation Fails**
   - Check the browser console for detailed error messages
   - Verify the RPC function exists in Supabase
   - Confirm RLS policies are correctly set up

2. **OAuth Login Problems**
   - Verify OAuth provider settings in Supabase
   - Check redirect URLs
   - Inspect browser network tab for CORS issues

3. **Session State Inconsistencies**
   - Make sure auth state changes are properly handled
   - Check for race conditions in profile creation
   - Verify callback handling

### Debugging

Enable detailed logging by setting the `DEBUG_AUTH` localStorage flag:

```javascript
// Enable detailed auth logging
localStorage.setItem('DEBUG_AUTH', 'true');

// Disable auth logging
localStorage.removeItem('DEBUG_AUTH');
```

## Future Enhancements

1. **Multi-Factor Authentication**
   - Add support for TOTP and other MFA methods
   - Implement recovery codes

2. **Enhanced Session Management**
   - Add session timeout controls
   - Implement "remember me" functionality
   - Add devices management

3. **Identity Verification**
   - Implement ID verification workflows
   - Add account recovery options

## Contributing

When working on the authentication system:

1. Maintain the modular architecture
2. Follow the error handling patterns
3. Add detailed logging for new functionality
4. Write tests for critical paths
5. Update this documentation for significant changes

## Security Considerations

1. Never store sensitive credentials in plain text
2. Always use secure storage for tokens
3. Implement proper CSRF protection
4. Follow OAuth best practices for token handling
5. Use prepared statements for database queries

## Further Documentation

- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Authentication Details](https://supabase.com/docs/guides/auth/auth-jwt)
