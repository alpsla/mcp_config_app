// Subscription related types - must be defined before User
export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  STANDARD = 'STANDARD',
  COMPLETE = 'COMPLETE'
}

// User related types
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  subscriptionTier: SubscriptionTier;
}

export type SupabaseUser = {
  id: string;
  email?: string;
  created_at?: string;
  [key: string]: any;
};

// Helper function to convert Supabase user to your app's User type
export function convertSupabaseUser(supabaseUser: SupabaseUser): User {
  const metadata = supabaseUser.user_metadata || {};
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    firstName: metadata.first_name || metadata.given_name,
    lastName: metadata.last_name || metadata.family_name,
    createdAt: supabaseUser.created_at ? new Date(supabaseUser.created_at) : new Date(),
    subscriptionTier: SubscriptionTier.FREE,
  };
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: number;
  description?: string; // Make description optional
  features: string[];
  modelCount: number;
  modelLimit?: number;
}

// Authentication related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Configuration related types
export interface ConfigState {
  webSearch: WebSearchConfig;
  fileSystem: FileSystemConfig;
  huggingFace: HuggingFaceConfig;
}

// MCP Configuration types
export interface MCPConfiguration {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  servers: MCPServer[];
  isActive?: boolean;
}

export interface MCPServer {
  id: string;
  name: string;
  description?: string;
  type: string;
  enabled: boolean;
  categories?: string[];
  config?: any;
  serverId?: string;
  
  // Additional fields used in the app
  url?: string;
  rating?: number;
  downloads?: number;
  version?: string;
  author?: string;
  requiresToken?: boolean;
  tokenName?: string;
  tokenDescription?: string;
  tokenUrl?: string;
  defaultArgs?: string[];
}

export interface MCPServerConfig {
  id: string;
  enabled: boolean;
  serverId?: string;
  args?: string[];
  tokenValue?: string;
  [key: string]: any;
}

export interface MCPDesktopConfig {
  mcpServers?: {
    [key: string]: {
      command: string;
      args: string[];
      [key: string]: any;
    }
  };
  configId: string;
  servers: Array<{
    id: string;
    enabled: boolean;
    args?: string[];
    tokenValue?: string;
    [key: string]: any;
  }>;
  format: 'json' | 'yaml';
  outputPath?: string;
  autoStart?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

// Server specific configuration types
export interface WebSearchConfig {
  id: string;
  enabled: boolean;
  maxResults?: number;
  safeSearch?: boolean;
  resultCount?: number; // Added this field as it's used in WebSearchConfig component
}

export interface FileSystemConfig {
  id: string;
  enabled: boolean;
  directories: string[];
  useRootPermissions?: boolean; // Added this field as it's used in the code
}

export interface HuggingFaceModel {
  id: string;
  name: string;
  enabled: boolean;
  tier: SubscriptionTier;
}

export interface HuggingFaceConfig {
  id: string;
  enabled: boolean;
  apiKey?: string;
  token?: string; // Added this field as it's used in the HuggingFaceConfig component
  models: HuggingFaceModel[];
}

// Search related types
export interface SearchFilters {
  query?: string;
  categories?: string[];
  minRating?: number; // Added this field as it's used in the code
  requiresToken?: boolean; // Added this field as it's used in the code
}