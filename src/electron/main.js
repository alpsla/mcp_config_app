/**
 * Electron main process
 * Handles secure token storage and IPC communication
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const url = require('url');
const SecureTokenManager = require('./secureTokenManager');
const isDev = process.env.NODE_ENV === 'development';

// Keep a reference to the main window to prevent garbage collection
let mainWindow;
let secureTokenManager;

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // Security: Disable Node.js integration in renderer
      contextIsolation: true, // Security: Enable context isolation
      preload: path.join(__dirname, 'preload.js'), // Use preload script for secure IPC
      worldSafeExecuteJavaScript: true, // Security: Safer JavaScript execution
      spellcheck: true // Enable spellcheck
    },
    // Add other window options as needed
    backgroundColor: '#ffffff',
    show: false, // Hide window initially for better loading experience
    icon: path.join(__dirname, '../public/logo192.png')
  });

  // Initialize the secure token manager
  secureTokenManager = new SecureTokenManager(mainWindow);

  // Set the window to load from local development server or production build
  const startUrl = isDev
    ? 'http://localhost:3000' // Development server
    : url.format({ // Production build
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools automatically in development mode
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Setup IPC handlers
  setupIPCHandlers();
}

/**
 * Setup IPC handlers for communication with the renderer process
 */
function setupIPCHandlers() {
  // OS information
  ipcMain.handle('getPlatform', () => os.platform());

  // App information
  ipcMain.handle('getAppVersion', () => app.getVersion());

  // Secure Token Manager already sets up its own IPC handlers in its constructor
  // For secure token operations
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, recreate window when dock icon is clicked and no windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security best practices:
// 1. Disable navigation to untrusted URLs
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Only allow navigation to our own origin or in development
    if (!isDev && parsedUrl.origin !== 'file://') {
      event.preventDefault();
      console.warn('Prevented navigation to:', navigationUrl);
    }
  });

  // 2. Disable creation of new windows
  contents.setWindowOpenHandler(({ url }) => {
    // Allow opening URLs in the external browser
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
});
