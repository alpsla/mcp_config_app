/**
 * Mock API Server
 * 
 * This is a simple Express server that mimics the backend API
 * for development and testing purposes.
 * 
 * Run with:
 * node mock-api-server.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock database
const users = [
  {
    id: 'user-1',
    email: 'user@example.com',
    password: 'password123',
    createdAt: new Date(),
    subscriptionTier: 'starter'
  }
];

const sessions = {};

// Authentication endpoints
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const sessionId = Math.random().toString(36).substring(2);
  const accessToken = `mock-token-${sessionId}`;
  
  sessions[sessionId] = {
    userId: user.id,
    createdAt: new Date(),
    accessToken
  };
  
  // Don't send the password to the client
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    session: {
      access_token: accessToken,
      expires_at: new Date().getTime() + 3600000
    }
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;
  
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = {
    id: `user-${users.length + 1}`,
    email,
    password,
    createdAt: new Date(),
    subscriptionTier: 'free'
  };
  
  users.push(newUser);
  
  const sessionId = Math.random().toString(36).substring(2);
  const accessToken = `mock-token-${sessionId}`;
  
  sessions[sessionId] = {
    userId: newUser.id,
    createdAt: new Date(),
    accessToken
  };
  
  // Don't send the password to the client
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.json({
    user: userWithoutPassword,
    session: {
      access_token: accessToken,
      expires_at: new Date().getTime() + 3600000
    }
  });
});

app.post('/api/auth/signout', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    // Find and remove the session
    Object.keys(sessions).forEach(key => {
      if (sessions[key].accessToken === token) {
        delete sessions[key];
      }
    });
  }
  
  res.json({ success: true });
});

app.get('/api/auth/user', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  let userId = null;
  
  // Find session by token
  Object.values(sessions).forEach(session => {
    if (session.accessToken === token) {
      userId = session.userId;
    }
  });
  
  if (!userId) {
    return res.status(401).json({ message: 'Invalid session' });
  }
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Don't send the password to the client
  const { password: _, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
});

app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  let sessionFound = false;
  
  // Find session by token
  Object.values(sessions).forEach(session => {
    if (session.accessToken === token) {
      sessionFound = true;
    }
  });
  
  if (!sessionFound) {
    return res.status(401).json({ message: 'Invalid session' });
  }
  
  res.json({
    access_token: token,
    expires_at: new Date().getTime() + 3600000
  });
});

// Subscription endpoints
app.post('/api/subscription/update', (req, res) => {
  const { userId, tier } = req.body;
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  user.subscriptionTier = tier;
  
  res.json({ success: true });
});

app.post('/api/subscription/payment', (req, res) => {
  const { userId, planId } = req.body;
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Map planId to tier
  const tierMap = {
    'free': 'free',
    'starter': 'starter',
    'standard': 'standard',
    'complete': 'complete'
  };
  
  user.subscriptionTier = tierMap[planId] || 'free';
  
  res.json({ success: true });
});

// Start the server
app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  POST /api/auth/signin');
  console.log('  POST /api/auth/signup');
  console.log('  POST /api/auth/signout');
  console.log('  GET /api/auth/user');
  console.log('  GET /api/auth/session');
  console.log('  POST /api/subscription/update');
  console.log('  POST /api/subscription/payment');
  console.log('\nDefault user:');
  console.log('  Email: user@example.com');
  console.log('  Password: password123');
});
