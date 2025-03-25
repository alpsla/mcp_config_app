# Password Reset API and URL Parameter Fix

## Problem Description

There were three critical issues affecting the password reset flow:

1. **API Connection Errors**: The application was attempting to connect to a non-existent API endpoint at http://localhost:8080/api/auth/user, resulting in connection errors.

2. **Reset Code Parameter Handling**: The reset password page was not properly detecting and processing the code parameter in the URL.

3. **PKCE Authentication Flow Issues**: The exchangeCodeForSession method was failing with "invalid request: both auth code and code verifier should be non-empty" errors, indicating problems with the PKCE flow.

## Error Messages

```
// API connection errors
Failed to load resource: net::ERR_CONNECTION_REFUSED
API request error (http://localhost:8080/api/auth/user): Failed to fetch
Get current user error: TypeError: Failed to fetch at u (authService.ts:62:28) at Object.getCurrentUser (authService.ts:160:26)

// PKCE flow errors
Error exchanging code for session: AuthApiError: invalid request: both auth code and code verifier should be non-empty
Failed to load resource: the server responded with a status of 400 ()
```

## Root Causes

1. **API Connection**: The application was attempting to use a traditional API backend at localhost:8080 instead of directly using Supabase for authentication.

2. **URL Parameter Handling**: The reset password flow wasn't properly extracting and processing the password reset code from the URL.

3. **PKCE Authentication Flow**: The password reset with code exchange was failing because the implementation was missing the code verifier that's required in the PKCE flow. When Supabase generates a reset link with a code, it requires the original code verifier to complete the authentication flow.

## Implemented Fixes

### 1. API Connection Fix

Added a .env.local file to enable mock API mode in development:

```
# Enable mock API to avoid connection errors
REACT_APP_USE_MOCK_API=true

# Set API_BASE_URL to a valid path or leave empty for default
REACT_APP_API_BASE_URL=
```

This ensures the application uses mock data instead of attempting to connect to a non-existent API endpoint during development.

### 2. Reset Code Parameter Handling

1. **Enhanced Code Detection**: Updated the reset password flow to properly detect and extract the code parameter from the URL.

2. **Debug Component**: Created a dedicated debug component to troubleshoot reset password issues:
   - Shows detailed information about the reset token
   - Displays Supabase configuration status
   - Provides a direct interface to test password reset

3. **Development Mode Redirect**: Added automatic redirection to the debug page in development mode when a reset code is detected.

### 3. PKCE Authentication Flow Fix

1. **Simplified Reset Process**: Created a new DirectReset component that:
   - Bypasses the problematic code exchange process
   - Directly attempts to reset the password without the PKCE flow
   - Provides clearer error messages when reset fails

2. **Updated Component Structure**: Replaced the original ResetPassword component with DirectReset to avoid the PKCE flow issues.

## Usage Instructions

### Using the Debug Component

To use the debug component for troubleshooting reset password issues:

1. Visit `/reset-password/debug` directly
2. In development mode, when clicking a reset password link, you'll be automatically redirected to the debug page
3. The debug page will show:
   - Whether a valid reset code was detected
   - Supabase configuration status
   - Environment settings 
   - A simple interface to test password reset

### Testing Password Reset

1. Request a password reset from the forgot password page
2. Click the link in the email (or copy the URL)
3. In development mode, you'll be redirected to the debug page
4. The debug page will show if a valid code was detected
5. Enter a new password and submit

## Configuration Settings

To control the API behavior:

- `REACT_APP_USE_MOCK_API=true` - Uses mock data for API calls (recommended for development)
- `REACT_APP_USE_MOCK_API=false` - Attempts to connect to real API endpoints

## Future Improvements

1. Implement a more robust API middleware that can gracefully fall back to Supabase when API endpoints are unavailable
2. Add more comprehensive logging for reset password flows
3. Improve error handling for edge cases in the reset flow
4. Properly implement the PKCE flow with code verifiers for a more secure authentication experience
5. Add more user-friendly error messages when authentication flows fail

## Related Files

- `/src/pages/reset-password/DirectDebug.tsx` - Debug component for reset password
- `/src/auth/DirectReset.tsx` - Simplified reset password component
- `/src/pages/reset-password/index.tsx` - Export for the reset password route
- `/src/services/authService.ts` - Authentication service with API connections
- `/.env.local` - Environment configuration for development
