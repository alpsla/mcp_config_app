import { User, SubscriptionTier } from '../types';

// API endpoints
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const AUTH_ENDPOINTS = {
  SIGN_IN: `${API_BASE_URL}/auth/signin`,
  SIGN_UP: `${API_BASE_URL}/auth/signup`,
  SIGN_OUT: `${API_BASE_URL}/auth/signout`,
  GET_USER: `${API_BASE_URL}/auth/user`,
  GET_SESSION: `${API_BASE_URL}/auth/session`,
};

// Mock data for development without backend
const mockUser: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  app_metadata: {},
  user_metadata: {
    firstName: 'Test',
    lastName: 'User',
    subscriptionTier: SubscriptionTier.STARTER
  },
  aud: 'authenticated',
  created_at: new Date().toISOString()
};

const mockSession = {
  access_token: 'mock-token',
  expires_at: new Date().getTime() + 3600000
};

// Helper function for API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    // During development/testing, return mock data
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API === 'true') {
      console.log(`Mock API call to ${url}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (url.includes('signin') || url.includes('signup')) {
        return { user: mockUser, session: mockSession };
      }
      if (url.includes('user')) {
        return mockUser;
      }
      if (url.includes('session')) {
        return mockSession;
      }
      return null;
    }

    // Get auth token if available
    const token = localStorage.getItem('auth_token');
    
    // Create a fresh headers object
    let headersObj: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // If options contains headers, add them
    if (options.headers) {
      try {
        // Convert the headers to a plain object
        const existingHeaders = options.headers as Record<string, string>;
        Object.keys(existingHeaders).forEach(key => {
          headersObj[key] = existingHeaders[key];
        });
      } catch (e) {
        console.warn('Could not process existing headers');
      }
    }
    
    // Add auth token if available
    if (token) {
      headersObj['Authorization'] = `Bearer ${token}`;
    }
    
    // Create options for fetch with our custom headers
    const fetchOptions = {
      ...options,
      // Bypass type checking by creating a fresh object
      headers: headersObj
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API request error (${url}):`, error.message);
    
    // If in development mode, still return mock data on error
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API === 'true') {
      if (url.includes('signin') || url.includes('signup')) {
        return { user: mockUser, session: mockSession };
      }
      if (url.includes('user')) {
        return mockUser;
      }
      if (url.includes('session')) {
        return mockSession;
      }
    }
    
    throw error;
  }
};

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    const data = await apiRequest(AUTH_ENDPOINTS.SIGN_IN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    if (data.session?.access_token) {
      localStorage.setItem('auth_token', data.session.access_token);
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Sign in failed');
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const data = await apiRequest(AUTH_ENDPOINTS.SIGN_UP, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    if (data.session?.access_token) {
      localStorage.setItem('auth_token', data.session.access_token);
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Sign up failed');
  }
};

export const signOut = async () => {
  try {
    await apiRequest(AUTH_ENDPOINTS.SIGN_OUT, {
      method: 'POST',
    });
    
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
  } catch (error: any) {
    console.error('Sign out error:', error.message);
    // Still remove token even if server-side logout fails
    localStorage.removeItem('auth_token');
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await apiRequest(AUTH_ENDPOINTS.GET_USER);
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    const session = await apiRequest(AUTH_ENDPOINTS.GET_SESSION);
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};
