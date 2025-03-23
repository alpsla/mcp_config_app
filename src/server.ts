import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import MCPServerService from './services/mcpServerService';

const app = express();
const port = process.env.PORT || 3001;
const serverService = new MCPServerService();

// Middleware
app.use(bodyParser.json());
app.use((express as any).static('build'));

// API Routes
app.get('/api/servers', (req: Request, res: Response) => {
  const servers = serverService.getAllServers();
  (res as any).json(servers);
});

app.get('/api/categories', (req: Request, res: Response) => {
  const categories = serverService.getCategories();
  (res as any).json(categories);
});

app.get('/api/search', (req: Request, res: Response) => {
  const query = (req.query as any).q as string || '';
  const categoryFilter = (req.query as any).category as string || '';
  
  const filters = {
    query,
    categories: categoryFilter ? [categoryFilter] : []
  };
  
  const results = serverService.searchServers(filters);
  (res as any).json(results);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
