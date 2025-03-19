import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import MCPServerService from './services/mcpServerService';
import ConfigurationService from './services/configurationService';

const app = express();
const port = 3001;

// Initialize services
const serverService = new MCPServerService();
const configService = new ConfigurationService();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// API Routes

// Get all MCP servers
app.get('/api/servers', (req, res) => {
  const servers = serverService.getAllServers();
  res.json(servers);
});

// Get server by ID
app.get('/api/servers/:id', (req, res) => {
  const server = serverService.getServerById(req.params.id);
  
  if (!server) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  res.json(server);
});

// Search servers
app.post('/api/servers/search', (req, res) => {
  const filters = req.body;
  const results = serverService.searchServers(filters);
  res.json(results);
});

// Get all categories
app.get('/api/categories', (req, res) => {
  const categories = serverService.getCategories();
  res.json(categories);
});

// Get all configurations
app.get('/api/configurations', (req, res) => {
  const configurations = configService.getAllConfigurations();
  res.json(configurations);
});

// Get configuration by ID
app.get('/api/configurations/:id', (req, res) => {
  const config = configService.getConfigurationById(req.params.id);
  
  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }
  
  res.json(config);
});

// Create new configuration
app.post('/api/configurations', (req, res) => {
  const { name, description } = req.body;
  const newConfig = configService.createConfiguration(name, description);
  res.status(201).json(newConfig);
});

// Update configuration
app.put('/api/configurations/:id', (req, res) => {
  try {
    const updatedConfig = configService.updateConfiguration(req.body);
    res.json(updatedConfig);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Add server to configuration
app.post('/api/configurations/:id/servers', (req, res) => {
  try {
    const { serverId, args, tokenValue, enabled } = req.body;
    const updatedConfig = configService.addServerToConfiguration(
      req.params.id,
      { serverId, args, tokenValue, enabled }
    );
    res.json(updatedConfig);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Remove server from configuration
app.delete('/api/configurations/:id/servers/:serverId', (req, res) => {
  try {
    const updatedConfig = configService.removeServerFromConfiguration(
      req.params.id,
      req.params.serverId
    );
    res.json(updatedConfig);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Generate desktop config
app.get('/api/configurations/:id/desktop-config', (req, res) => {
  try {
    const desktopConfig = configService.generateDesktopConfig(req.params.id);
    res.json(desktopConfig);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Save desktop config
app.post('/api/configurations/:id/save', (req, res) => {
  try {
    const savedPath = configService.saveDesktopConfig(req.params.id);
    res.json({ path: savedPath });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
