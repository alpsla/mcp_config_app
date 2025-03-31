import { User, LoginCredentials, RegisterCredentials, SubscriptionTier } from '../../types';

// API endpoints
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/signin`,
  REGISTER: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/signout`,
  GET_USER: `${API_BASE_URL}/auth/user`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  UPDATE_SUBSCRIPTION: `${API_BASE_URL}/subscription/update`,
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

// Helper function for API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    // During development/testing, return mock data
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API === 'true') {
      console.log(`Mock API call to ${url}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (url.includes('signin') || url.includes('login')) {
        return mockUser;
      }
      if (url.includes('signup') || url.includes('register')) {
        return mockUser;
      }
      if (url.includes('user')) {
        return mockUser;
      }
      if (url.includes('profile')) {
        return mockUser;
      }
      if (url.includes('subscription')) {
        return mockUser;
      }
      return null;
    }

    // Default headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Include auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    // For logout endpoints, return null
    if (url.includes('logout') || url.includes('signout')) {
      return null;
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API request error (${url}):`, error.message);
    
    // If in development mode, still return mock data on error
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API === 'true') {
      if (url.includes('signin') || url.includes('login')) {
        return mockUser;
      }
      if (url.includes('signup') || url.includes('register')) {
        return mockUser;
      }
      if (url.includes('user')) {
        return mockUser;
      }
      if (url.includes('profile')) {
        return mockUser;
      }
      if (url.includes('subscription')) {
        return mockUser;
      }
    }
    
    throw error;
  }
};

// Auth service methods
const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const user = await apiRequest(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      // Store token if returned from API
      if (user && user.token) {
        localStorage.setItem('auth_token', user.token);
      }
      
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    try {
      const user = await apiRequest(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      // Store token if returned from API
      if (user && user.token) {
        localStorage.setItem('auth_token', user.token);
      }
      
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest(AUTH_ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
      
      // Remove token from localStorage
      localStorage.removeItem('auth_token');
    } catch (error: any) {
      console.error('Logout error:', error.message);
      // Still remove token even if server-side logout fails
      localStorage.removeItem('auth_token');
      throw new Error(error.message);
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const user = await apiRequest(AUTH_ENDPOINTS.GET_USER);
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const user = await apiRequest(AUTH_ENDPOINTS.UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  },

  updateSubscriptionTier: async (userId: string, tier: SubscriptionTier): Promise<User> => {
    try {
      const user = await apiRequest(AUTH_ENDPOINTS.UPDATE_SUBSCRIPTION, {
        method: 'POST',
        body: JSON.stringify({ userId, tier }),
      });
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Subscription update failed');
    }
  }
};

export default authService;
