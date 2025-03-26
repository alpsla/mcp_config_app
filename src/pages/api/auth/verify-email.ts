// Use standard type definitions since Next.js types are not available
import type { Request, Response } from 'express';
import { authRecoveryService } from '../../../services/auth/recovery/authRecoveryService';

/**
 * API endpoint for fixing user email verification issues
 * This provides a safe, public-facing way to attempt verification fixes
 */
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Attempt to fix the user's authentication issues
    const result = await authRecoveryService.fixAuthenticationIssues(email);
    
    // If the fix was successful
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Authentication issues fixed. Please try logging in again.'
      });
    }
    
    // If the fix failed but it's because user doesn't exist
    if (result.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please check the email or sign up.'
      });
    }
    
    // For other failures
    return res.status(500).json({
      success: false,
      message: 'Unable to fix authentication issues. Please contact support.'
    });
  } catch (error: any) {
    console.error('Error in verify-email API:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}