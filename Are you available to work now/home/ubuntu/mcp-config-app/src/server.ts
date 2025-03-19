import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import MCPServerService from './services/mcpServerService';
import ConfigurationService from './services/configurationService';

// Initialize services
const serverService = new MCPServerService();
const configService = new ConfigurationService();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
  const configs = configService.getAllConfigurations();
  res.json(configs);
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
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newConfig = configService.createConfiguration(name, description || '');
  res.status(201).json(newConfig);
});

// Update configuration
app.put('/api/configurations/:id', (req, res) => {
  try {
    const config = req.body;
    if (config.id !== req.params.id) {
      return res.status(400).json({ error: 'ID mismatch' });
    }
    const updatedConfig = configService.updateConfiguration(config);
    res.json(updatedConfig);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete configuration
app.delete('/api/configurations/:id', (req, res) => {
  const success = configService.deleteConfiguration(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Configuration not found' });
  }
  res.status(204).send();
});

// Add server to configuration
app.post('/api/configurations/:id/servers', (req, res) => {
  try {
    const { serverId, args, tokenValue, enabled } = req.body;
    if (!serverId) {
      return res.status(400).json({ error: 'Server ID is required' });
    }
    const serverConfig = { serverId, args, tokenValue, enabled: enabled !== false };
    const updatedConfig = configService.addServerToConfiguration(req.params.id, serverConfig);
    res.json(updatedConfig);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Remove server from configuration
app.delete('/api/configurations/:configId/servers/:serverId', (req, res) => {
  try {
    const updatedConfig = configService.removeServerFromConfiguration(
      req.params.configId,
      req.params.serverId
    );
    res.json(updatedConfig);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Generate desktop config
app.get('/api/configurations/:id/desktop-config', (req, res) => {
  try {
    const desktopConfig = configService.generateDesktopConfig(req.params.id);
    res.json(desktopConfig);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Save desktop config
app.post('/api/configurations/:id/save-desktop-config', (req, res) => {
  try {
    const { targetPath } = req.body;
    const savedPath = configService.saveDesktopConfig(req.params.id, targetPath);
    res.json({ path: savedPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
