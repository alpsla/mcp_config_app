// User and subscription types
export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'BASIC',
  STANDARD = 'BASIC',
  COMPLETE = 'COMPLETE',
  BASIC = 'BASIC'
}

// Server specific configuration types
export interface WebSearchConfig {
  id: string;
  enabled: boolean;
  maxResults?: number;
  safeSearch?: boolean;
  resultCount?: number;
}

export interface FileSystemConfig {
  id: string;
  enabled: boolean;
  directories: string[];
  directory?: string; // For backward compatibility
  useRootPermissions?: boolean;
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
  token?: string;
  models: HuggingFaceModel[];
  modelId?: string; // For backward compatibility
  parameters?: any; // For backward compatibility
}

export interface ConfigState {
  webSearch: WebSearchConfig;
  fileSystem: FileSystemConfig;
  huggingFace: HuggingFaceConfig;
}

// Add additional types or override existing ones as needed
export interface MCPConfiguration {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  servers: Record<string, MCPServerConfig>;
  isActive?: boolean;
  // Additional fields for the configuration
  [key: string]: any;
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
  command?: string;
  [key: string]: any;
}