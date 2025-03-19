# MCP Configuration Tool - Installation Guide

## System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)
- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher
- **Claude Desktop**: Latest version with MCP support
- **Disk Space**: At least 200MB free space

## Installation Options

### Option 1: Web Application (Development Mode)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mcp-config-app.git
   cd mcp-config-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

### Option 2: Desktop Application

1. **Download the installer**
   - Windows: Download `mcp-config-app-setup.exe`
   - macOS: Download `mcp-config-app.dmg`
   - Linux: Download `mcp-config-app.AppImage`

2. **Run the installer**
   - Windows: Double-click the .exe file and follow the installation wizard
   - macOS: Open the .dmg file, drag the application to your Applications folder
   - Linux: Make the AppImage executable (`chmod +x mcp-config-app.AppImage`) and run it

3. **Launch the application**
   - The application should appear in your applications menu or desktop

## Configuration

### First-Time Setup

1. **Claude Desktop Configuration**
   - Ensure Claude Desktop is installed and configured
   - Locate your Claude Desktop configuration file (typically in your home directory)

2. **API Tokens (if needed)**
   - Gather any API tokens you'll need for specific MCP servers
   - Common tokens include:
     - Hugging Face API token
     - GitHub personal access token
     - Database connection strings

### Updating

To update the application to the latest version:

1. **Web Application**
   ```bash
   git pull
   npm install
   ```

2. **Desktop Application**
   - The application will check for updates automatically
   - Alternatively, download the latest installer from the website

## Troubleshooting

### Common Issues

**Application fails to start**
- Verify Node.js and npm versions
- Try clearing npm cache: `npm cache clean --force`
- Check for error messages in the console

**Cannot connect to Claude Desktop**
- Verify Claude Desktop is running
- Check the configuration file path
- Ensure you have the correct permissions

**MCP servers not loading**
- Check your internet connection
- Verify API tokens are correct
- Look for error messages in the application logs

### Getting Help

If you encounter issues not covered in this guide:

1. Check the full documentation in the `docs` folder
2. Visit our GitHub repository for known issues
3. Contact support at support@mcp-config-app.example.com

## Uninstallation

### Web Application
Simply delete the project folder

### Desktop Application
- Windows: Use "Add or Remove Programs" in Control Panel
- macOS: Drag the application from Applications to Trash
- Linux: Delete the AppImage file
