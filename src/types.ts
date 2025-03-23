// Core MCP Types
export interface MCPServer {
  id: string;
  name: string;
  url: string;
  type: string;
  enabled: boolean;
  description?: string;
  defaultArgs?: any[];
  requiresToken?: boolean;
  tokenName?: string;
  tokenDescription?: string;
  tokenUrl?: string;
  rating?: number;
  categories?: string[];
  downloads?: number;
  version?: string;
  author?: string;
}

export interface MCPConfiguration {
  id: string;
  name: string;
  description?: string;
  servers: MCPServer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MCPServerConfig {
  serverId?: string;
  id?: string;
  enabled: boolean;
  args?: any[];
  tokenValue?: string;
  [key: string]: any;
}

export interface MCPDesktopConfig {
  configId: string;
  servers: {
    id: string;
    enabled: boolean;
    tokenValue?: string;
    args?: string[];
    [key: string]: any;
  }[];
  format: 'json' | 'yaml';
  outputPath?: string;
  autoStart?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  subscriptionTier: SubscriptionTier;
}

export type AuthState = {
  user: User | null;
  loading: boolean;
  error?: string | null;
  session?: any | null;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

// Subscription Types
export enum SubscriptionTier {
  FREE = 'free',
  STARTER = 'starter',
  STANDARD = 'standard',
  COMPLETE = 'complete'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  modelCount: number;
  features: string[];
}

// Configuration Types
export interface WebSearchConfig extends MCPServerConfig {
  resultCount: number;
  safeSearch: boolean;
}

export interface FileSystemConfig extends MCPServerConfig {
  directories: string[];
  useRootPermissions: boolean;
}

export interface HuggingFaceModel {
  id: string;
  name: string;
  enabled: boolean;
  tier: SubscriptionTier;
}

export interface HuggingFaceConfig extends MCPServerConfig {
  token: string;
  models: HuggingFaceModel[];
}

export interface ConfigState {
  webSearch: WebSearchConfig;
  fileSystem: FileSystemConfig;
  huggingFace: HuggingFaceConfig;
}

// Search Types
export interface SearchFilters {
  categories?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'relevance' | 'date' | 'popularity';
  limit?: number;
  offset?: number;
  query?: string;
  tags?: string[];
  minRating?: number;
  requiresToken?: boolean;
  [key: string]: any;
}
