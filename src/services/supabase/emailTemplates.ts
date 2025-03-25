/**
 * Get the custom email template content for verification emails
 */
export const getVerificationEmailTemplate = (): string => {
  try {
    // Use the improved template with high-contrast buttons and fallback text
    const template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your MCP Configuration Tool Account</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .content {
      padding: 30px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Email Verification</h1>
  </div>
  
  <div class="content">
    <p>Hello,</p>
    
    <p>Thank you for creating an account with the <strong>MCP Configuration Tool</strong>. We're excited to help you easily configure Claude with powerful external models!</p>
    
    <p>To complete your registration and start using our tool, please verify your email address:</p>
    
    <!-- Plain text link alternative - foolproof method -->
    <div style="text-align: center; margin: 25px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
      <p style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">Click the link below to verify your email:</p>
      <a href="{{ .ConfirmationURL }}" style="color: #4F46E5; font-weight: bold; font-size: 16px; text-decoration: underline; word-break: break-all;">{{ .ConfirmationURL }}</a>
    </div>
    
    <p>This link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.</p>
    
    <p>After verification, you'll be able to:</p>
    <ul>
      <li>Browse and connect to specialized models in just a few clicks</li>
      <li>Save your favorite configurations for quick access</li>
      <li>Customize Claude for your specific needs</li>
    </ul>
    
    <p>If you have any questions, please contact our support team.</p>
    
    <p>Best regards,<br>
    The MCP Configuration Tool Team</p>
  </div>
  
  <div class="footer">
    <p>&copy; 2025 MCP Configuration Tool. All rights reserved.</p>
    <p>
      <a href="#" style="color: #4F46E5;">Privacy Policy</a> |
      <a href="#" style="color: #4F46E5;">Terms of Service</a> |
      <a href="#" style="color: #4F46E5;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
    return template;
  } catch (error) {
    console.error('Error loading custom verification template:', error);
    return ''; // Return empty string to use default template
  }
};

/**
 * Get the custom email template content for password reset emails
 */
export const getPasswordResetEmailTemplate = (): string => {
  try {
    // Use the custom template with visible button text
    const template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your MCP Configuration Tool Password</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .content {
      padding: 30px 0;
    }
    .button-container {
      text-align: center;
      margin: 25px 0;
    }
    .reset-button {
      display: inline-block;
      background-color: #4F46E5;
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 4px;
    }
    .reset-button:hover {
      background-color: #4338ca;
    }
    .link-fallback {
      text-align: center;
      margin: 25px 0;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Password Reset Request</h1>
  </div>
  
  <div class="content">
    <p>Hello,</p>
    
    <p>We received a request to reset your password for your <strong>MCP Configuration Tool</strong> account. To create a new password, please click the button below:</p>
    
    <!-- Clear button with visible text -->
    <div class="button-container">
      <a href="{{ .ConfirmationURL }}" class="reset-button">Reset My Password</a>
    </div>
    
    <!-- Plain text link alternative - fallback method -->
    <div class="link-fallback">
      <p style="font-size: 14px; margin-bottom: 15px;">If the button above doesn't work, use this link instead:</p>
      <a href="{{ .ConfirmationURL }}" style="color: #4F46E5; font-weight: bold; font-size: 14px; text-decoration: underline; word-break: break-all;">{{ .ConfirmationURL }}</a>
    </div>
    
    <p>This link will expire in 24 hours. If you didn't request a password reset, you can safely ignore this email.</p>
    
    <p>Best regards,<br>
    The MCP Configuration Tool Team</p>
  </div>
  
  <div class="footer">
    <p>&copy; 2025 MCP Configuration Tool. All rights reserved.</p>
    <p>
      <a href="#" style="color: #4F46E5;">Privacy Policy</a> |
      <a href="#" style="color: #4F46E5;">Terms of Service</a>
    </p>
  </div>
</body>
</html>`;
    return template;
  } catch (error) {
    console.error('Error loading custom password reset template:', error);
    return ''; // Return empty string to use default template
  }
};
