/**
 * Get email template for magic link login
 */
export function getMagicLinkEmailTemplate() {
  // Return null if no custom template is needed
  // Or return template object for Supabase email
  return null;
  
  // Example template for reference:
  /*
  return {
    subject: 'Your login link for MCP Configuration Tool',
    body: `<h2>Login to MCP Configuration Tool</h2>
           <p>Click the link below to log in to your account:</p>
           <p><a href="{{ .SiteURL }}/auth/confirm?token={{ .Token }}&type=magiclink&redirect_to={{ .RedirectTo }}">
           Log in to your account
           </a></p>
           <p>This link expires in 24 hours.</p>`
  };
  */
}

/**
 * Get email template for password reset
 */
export function getPasswordResetEmailTemplate() {
  // Return null if no custom template is needed
  // Or return template object for Supabase email
  return null;
  
  // Example template for reference:
  /*
  return {
    subject: 'Reset your password for MCP Configuration Tool',
    body: `<h2>Reset your password</h2>
           <p>Click the link below to reset your password:</p>
           <p><a href="{{ .SiteURL }}/auth/confirm?token={{ .Token }}&type=recovery&redirect_to={{ .RedirectTo }}">
           Reset password
           </a></p>
           <p>This link expires in 24 hours.</p>`
  };
  */
}

/**
 * Get email template for email verification
 */
export function getVerificationEmailTemplate() {
  // Return null if no custom template is needed
  // Or return template object for Supabase email
  return null;
  
  // Example template for reference:
  /*
  return {
    subject: 'Confirm your email for MCP Configuration Tool',
    body: `<h2>Confirm your email</h2>
           <p>Click the link below to confirm your email:</p>
           <p><a href="{{ .SiteURL }}/auth/confirm?token={{ .Token }}&type=signup&redirect_to={{ .RedirectTo }}">
           Confirm email address
           </a></p>
           <p>This link expires in 24 hours.</p>`
  };
  */
}
