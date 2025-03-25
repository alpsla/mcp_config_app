/**
 * Email validation utility
 * Provides robust email validation with helpful error messages
 */

/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns Object containing validation result and error message if invalid
 */
export const validateEmail = (email: string): { valid: boolean; message: string } => {
  // Trim whitespace
  const trimmedEmail = email.trim();
  
  // Check if email is empty
  if (!trimmedEmail) {
    return { 
      valid: false, 
      message: "Email address is required" 
    };
  }
  
  // Check for @ symbol
  if (!trimmedEmail.includes('@')) {
    return { 
      valid: false, 
      message: "Email address must contain an @ symbol" 
    };
  }
  
  // Split the email into local and domain parts
  const [localPart, domainPart] = trimmedEmail.split('@');
  
  // Check local part
  if (!localPart) {
    return { 
      valid: false, 
      message: "Email address must have content before the @ symbol" 
    };
  }
  
  // Check domain part
  if (!domainPart) {
    return { 
      valid: false, 
      message: "Email address must have a domain after the @ symbol" 
    };
  }
  
  // Check if domain has at least one dot
  if (!domainPart.includes('.')) {
    return { 
      valid: false, 
      message: "Email domain must contain at least one period (e.g., example.com)" 
    };
  }
  
  // Check for spaces in email
  if (trimmedEmail.includes(' ')) {
    return { 
      valid: false, 
      message: "Email address cannot contain spaces" 
    };
  }
  
  // Comprehensive regex check for standard email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { 
      valid: false, 
      message: "Please enter a valid email address (e.g., name@example.com)" 
    };
  }
  
  // Check for common typos in domain
  if (domainPart.endsWith('.con')) {
    return { 
      valid: false, 
      message: "Did you mean '.com' instead of '.con'?" 
    };
  }
  
  // Check for possibly invalid TLDs (very short or long)
  const tld = domainPart.split('.').pop() || '';
  if (tld.length < 2 || tld.length > 10) {
    return { 
      valid: false, 
      message: "Email domain has an unusual top-level domain (TLD)" 
    };
  }
  
  // Email appears valid
  return { valid: true, message: "" };
};

/**
 * Validates a password
 * @param password The password to validate
 * @returns Object containing validation result and error message if invalid
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (!password) {
    return { 
      valid: false, 
      message: "Password is required" 
    };
  }
  
  if (password.length < 8) {
    return { 
      valid: false, 
      message: "Password must be at least 8 characters long" 
    };
  }
  
  return { valid: true, message: "" };
};

/**
 * Validates that two passwords match
 * @param password Original password
 * @param confirmPassword Password confirmation to check against original
 * @returns Object containing validation result and error message if invalid
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): { valid: boolean; message: string } => {
  if (password !== confirmPassword) {
    return { 
      valid: false, 
      message: "Passwords do not match" 
    };
  }
  
  return { valid: true, message: "" };
};
