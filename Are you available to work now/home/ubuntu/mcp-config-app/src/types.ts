// Define types for MCP servers and configurations

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  command: string;
  defaultArgs: string[];
  categories: string[];
  rating: number;
  downloads: number;
  requiresToken: boolean;
  tokenName?: string;
  tokenDescription?: string;
  dockerImage?: string;
  repository?: string;
  author?: string;
  version?: string;
  lastUpdated?: string;
}

export interface MCPConfiguration {
  id: string;
  name: string;
  description: string;
  servers: MCPServerConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface MCPServerConfig {
  serverId: string;
  args: string[];
  tokenValue?: string;
  enabled: boolean;
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  minRating?: number;
  requiresToken?: boolean;
}

export interface MCPDesktopConfig {
  mcpServers: {
    [key: string]: {
      command: string;
      args: string[];
    };
  };
}
