import { MCPServer, SearchFilters } from '../types';
import fs from 'fs';
import path from 'path';

class MCPServerService {
  private serversPath: string;
  private servers: MCPServer[] = [];

  constructor(dataPath: string = path.join(__dirname, '../../data/mcp-servers.json')) {
    this.serversPath = dataPath;
    this.loadServers();
  }

  private loadServers(): void {
    try {
      const data = fs.readFileSync(this.serversPath, 'utf8');
      this.servers = JSON.parse(data);
    } catch (error) {
      console.error('Error loading MCP servers:', error);
      this.servers = [];
    }
  }

  getAllServers(): MCPServer[] {
    return [...this.servers];
  }

  getServerById(id: string): MCPServer | undefined {
    return this.servers.find(server => server.id === id);
  }

  searchServers(filters: SearchFilters): MCPServer[] {
    let results = [...this.servers];

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(server => 
        server.name.toLowerCase().includes(query) || 
        server.description.toLowerCase().includes(query) ||
        server.categories.some(category => category.toLowerCase().includes(query))
      );
    }

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(server => 
        filters.categories!.some(category => 
          server.categories.includes(category)
        )
      );
    }

    // Filter by minimum rating
    if (filters.minRating !== undefined) {
      results = results.filter(server => server.rating >= filters.minRating!);
    }

    // Filter by token requirement
    if (filters.requiresToken !== undefined) {
      results = results.filter(server => server.requiresToken === filters.requiresToken);
    }

    // Sort by rating (highest first)
    results.sort((a, b) => b.rating - a.rating);

    return results;
  }

  getCategories(): string[] {
    const categoriesSet = new Set<string>();
    
    this.servers.forEach(server => {
      server.categories.forEach(category => {
        categoriesSet.add(category);
      });
    });
    
    return Array.from(categoriesSet).sort();
  }
}

export default MCPServerService;
