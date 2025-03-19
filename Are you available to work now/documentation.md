# MCP Configuration Tool Documentation

## Overview

The MCP Configuration Tool is an application designed to simplify the process of setting up and configuring Model Context Protocol (MCP) servers for Claude Sonnet desktop. It provides an intuitive interface for non-technical users to discover, configure, and manage MCP servers based on their functionality and ratings.

## Table of Contents

1. [Architecture](#architecture)
2. [Installation](#installation)
3. [Usage Guide](#usage-guide)
4. [Code Structure](#code-structure)
5. [Testing](#testing)
6. [Future Enhancements](#future-enhancements)

## Architecture

The application follows a cross-platform architecture that supports both web and desktop interfaces:

### Core Components

- **Data Layer**: TypeScript interfaces defining the structure of MCP servers, configurations, and search filters
- **Service Layer**: Services for searching/filtering MCP servers and managing configurations
- **UI Layer**: React components implementing the user interface

### Key Features

- Search and filter MCP servers by name, category, rating, and token requirements
- Create, edit, and manage configurations through a wizard-style interface
- Generate and save configuration files for Claude Desktop
- Cross-platform support for both web and desktop environments

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Web Application Setup

1. Clone the repository:
```
git clone https://github.com/your-repo/mcp-config-app.git
cd mcp-config-app
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Desktop Application Setup

1. Follow steps 1-2 from the Web Application Setup

2. Build the desktop application:
```
npm run build-desktop
```

3. The built application will be available in the `dist` directory

## Usage Guide

### Searching for MCP Servers

1. On the "Search MCP Servers" tab, use the filters at the top to narrow down your search:
   - Enter keywords in the search box
   - Select categories from the category list
   - Adjust the minimum rating slider
   - Filter by token requirement if needed

2. The matching servers will appear in the results section below the filters

3. To add a server to a configuration, select a configuration from the dropdown in the server card, or create a new configuration

### Managing Configurations

1. Navigate to the "My Configurations" tab to view your saved configurations

2. Click on a configuration to select it

3. Use the "Edit Configuration" button to modify the selected configuration

4. Use the "Save to Claude Desktop" button to generate and save the configuration file for Claude Desktop

### Creating a New Configuration

1. Click the "Create New Configuration" button on the "My Configurations" tab, or select "Create New Configuration" from a server card dropdown

2. Follow the wizard steps:
   - Step 1: Enter basic information (name and description)
   - Step 2: Select MCP servers to include
   - Step 3: Configure each server (enable/disable, enter tokens if required)
   - Step 4: Review and save the configuration

## Code Structure

```
mcp-config-app/
├── data/
│   └── mcp-servers.json       # Sample database of MCP servers
├── src/
│   ├── components/            # React UI components
│   │   ├── ConfigurationList.tsx
│   │   ├── ConfigurationWizard.tsx
│   │   ├── SearchFilters.tsx
│   │   └── ServerList.tsx
│   ├── services/              # Core functionality
│   │   ├── configurationService.ts
│   │   └── mcpServerService.ts
│   ├── App.css                # Application styles
│   ├── App.tsx                # Main application component
│   ├── index.tsx              # Application entry point
│   └── types.ts               # TypeScript type definitions
├── package.json               # Project dependencies and scripts
└── README.md                  # Project overview
```

### Key Files

- **types.ts**: Defines the data structures used throughout the application
- **mcpServerService.ts**: Handles searching and filtering MCP servers
- **configurationService.ts**: Manages user configurations and generates Claude Desktop config files
- **App.tsx**: Main application component that integrates all UI components

## Testing

### Automated Testing

The application includes Jest tests for core functionality:

1. Install test dependencies:
```
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

2. Run tests:
```
npm test
```

### Manual Testing

For manual testing, follow these steps:

1. Start the application using `npm start`

2. Test the search functionality:
   - Enter different search terms
   - Apply various filters
   - Verify that results update correctly

3. Test configuration management:
   - Create a new configuration
   - Add servers to the configuration
   - Edit server settings (enable/disable, tokens)
   - Save the configuration
   - Verify the configuration appears in the list

4. Test generating Claude Desktop config:
   - Select a configuration
   - Click "Save to Claude Desktop"
   - Verify the generated file has the correct format

## Future Enhancements

Potential future improvements for the application:

1. **Online Repository**: Create a central repository of MCP servers that users can contribute to
2. **Automatic Updates**: Add functionality to check for and download updates to MCP servers
3. **Configuration Sharing**: Allow users to share configurations with others
4. **Integration Testing**: Add end-to-end tests for the complete application flow
5. **Performance Optimization**: Improve search performance for large numbers of servers
