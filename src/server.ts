import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import MCPServerService from './services/mcpServerService';

const app = express();
const port = process.env.PORT || 3001;
const serverService = new MCPServerService();

// Middleware
app.use(bodyParser.json());
app.use(express.static('build'));

// API Routes
app.get('/api/servers', (req: Request, res: Response) => {
  const servers = serverService.getAllServers();
  res.json(servers);
});

app.get('/api/categories', (req: Request, res: Response) => {
  const categories = serverService.getCategories();
  res.json(categories);
});

app.get('/api/search', (req: Request, res: Response) => {
  const query = req.query.q as string || '';
  const categoryFilter = req.query.category as string || '';
  
  const filters = {
    query,
    categories: categoryFilter ? [categoryFilter] : []
  };
  
  const results = serverService.searchServers(filters);
  res.json(results);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
