export interface MCPServer {
    id: string;
    name: string;
    description: string;
    categories: string[];
    rating: number;
    downloads: number;
    version: string;
    author: string;
    requiresToken: boolean;
    tokenName?: string;
    tokenDescription?: string;
    tokenUrl?: string;
    defaultArgs: string[];
  }
  
  export interface MCPServerConfig {
    serverId: string;
    args: string[];
    tokenValue?: string;
    enabled: boolean;
  }
  
  export interface MCPConfiguration {
    id: string;
    name: string;
    description: string;
    servers: MCPServerConfig[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SearchFilters {
    query?: string;
    categories?: string[];
    minRating?: number;
    requiresToken?: boolean;
  }
  
  export interface MCPDesktopConfig {
    [key: string]: {
      command: string;
      args: string[];
    };
  }
  