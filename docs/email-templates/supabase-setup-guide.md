# Customizing Email Templates in Supabase

This guide will help you implement custom email templates for your MCP Configuration Tool in Supabase. These templates provide a professional, branded experience for your users during the authentication process.

## Prerequisites

- Access to your Supabase project dashboard
- Your company logo (recommended size: 150px width)
- URLs for your Privacy Policy, Terms of Service, and Unsubscribe pages

## Setting Up Custom Email Templates

1. **Log in to Supabase Dashboard**
   - Go to [https://app.supabase.io/](https://app.supabase.io/)
   - Sign in with your account
   - Select your project

2. **Navigate to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Select "Email Templates" from the sub-menu

3. **Update "From" Email Name**
   - Change "Supabase Auth" to "MCP Configuration Tool"
   - This will make emails appear from "MCP Configuration Tool <noreply@mail.app.supabase.io>"

4. **Customize Each Email Template**
   - In the Supabase dashboard, you'll find three template types:
     - Confirmation Email
     - Magic Link Email
     - Reset Password Email
   
   - For each template:
     1. Click "Edit"
     2. Replace the subject line with the appropriate one from our templates
     3. Copy and paste the HTML from our template files
     4. Replace `[Your Logo URL]` with the URL to your logo image
     5. Replace `[Your Privacy Policy URL]`, `[Your Terms of Service URL]`, and `[Your Unsubscribe URL]` with your actual URLs
     6. **IMPORTANT**: Make sure to keep the `{{ .ConfirmationURL }}` placeholder exactly as is - this is what Supabase uses to insert the verification link

5. **Save Your Changes**
   - Click "Save" for each template
   - Test the templates by triggering verification emails, magic links, or password resets

## Template Files

We've created three custom HTML email templates for your use:

1. **Verification Email** (`verification-email.html`)
   - Used when new users sign up and need to verify their email address
   - Subject line: "Verify Your MCP Configuration Tool Account"

2. **Magic Link Email** (`magic-link-email.html`)
   - Used for passwordless login
   - Subject line: "Log In to MCP Configuration Tool"

3. **Reset Password Email** (`reset-password-email.html`)
   - Used when users request a password reset
   - Subject line: "Reset Your MCP Configuration Tool Password"

## Design Notes

These templates include:

- Responsive design that works well on desktop and mobile
- Professional, clean styling with your brand colors
- Clear call-to-action buttons
- Brief explanation of your service
- Legal links in the footer

## Testing Your Templates

After implementing these templates, it's recommended to:

1. Create a test account with a real email address
2. Trigger each email type (verification, magic link, password reset)
3. Check that the emails display correctly in various email clients
4. Verify that all links work as expected

## Troubleshooting

- If the emails aren't sending, check your Supabase project's email settings
- If the styling looks broken, ensure all HTML and CSS is properly formatted
- If the links don't work, verify that the `{{ .ConfirmationURL }}` placeholder is intact
