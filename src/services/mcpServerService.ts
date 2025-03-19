import { MCPServer, SearchFilters } from '../types';

// Sample data - in a real app, this would come from an API or database
const sampleServers: MCPServer[] = [
  {
    id: "hf-models",
    name: "Hugging Face Models",
    description: "Access to Hugging Face models via API",
    categories: ["AI Models", "Text Generation", "Image Generation"],
    rating: 4.8,
    downloads: 12500,
    version: "1.2.0",
    author: "HF Team",
    requiresToken: true,
    tokenName: "HF_TOKEN",
    tokenDescription: "Get your token from huggingface.co/settings/tokens",
    defaultArgs: ["--work-dir=/tmp", "--HF_TOKEN={token}"]
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web and retrieve information",
    categories: ["Web", "Search", "Information Retrieval"],
    rating: 4.5,
    downloads: 9800,
    version: "2.1.0",
    author: "Search Team",
    requiresToken: false,
    defaultArgs: ["--results=5", "--safe-search=true"]
  },
  {
    id: "file-system",
    name: "File System Access",
    description: "Access and manipulate files on your computer",
    categories: ["Files", "System", "Storage"],
    rating: 4.2,
    downloads: 7500,
    version: "1.0.5",
    author: "FS Team",
    requiresToken: false,
    defaultArgs: ["--root-dir=/Users", "--read-only=false"]
  }
];

class MCPServerService {
  private servers: MCPServer[] = sampleServers;

  constructor() {
    // In a real app, we would load data from an API or database
  }

  getAllServers(): MCPServer[] {
    return this.servers;
  }

  getServerById(id: string): MCPServer | undefined {
    return this.servers.find(server => server.id === id);
  }

  getCategories(): string[] {
    const categoriesSet = new Set<string>();
    this.servers.forEach(server => {
      server.categories.forEach(category => categoriesSet.add(category));
    });
    return Array.from(categoriesSet).sort();
  }

  searchServers(filters: SearchFilters): MCPServer[] {
    let results = [...this.servers];

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(server => 
        server.name.toLowerCase().includes(query) || 
        server.description.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(server => 
        filters.categories!.some(category => server.categories.includes(category))
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

    return results;
  }
}

export default MCPServerService;
