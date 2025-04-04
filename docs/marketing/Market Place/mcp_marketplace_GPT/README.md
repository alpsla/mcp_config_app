# MCP Marketplace

This project provides a **marketplace** where users can browse, search, and configure MCP models from various sources (Hugging Face, MCP.so, Smithery.ai, Glama.ai).

## Features
- 🔍 **Search & Filter** MCP models by category, price, and popularity.
- 📡 **Fetch data from APIs** of different MCP sources.
- ⚡ **Configure & Download** selected models.
- 🔔 **Monitor Updates** for installed configurations.

## Installation

### Frontend (React)
1. Navigate to the `marketplace` directory:
   ```bash
   cd marketplace
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

### Backend (Node.js + Express)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install express axios
   ```
3. Start the server:
   ```bash
   node server.js
   ```

The backend runs on **port 3001**, and the React frontend runs on **port 3000**.

## Future Enhancements
- Add **authentication** for personalized recommendations.
- Include **model comparison** features.
- Extend support for **deployment automation**.
