# MCP Configuration Tool - Developer Guide

## Project Overview

The MCP Configuration Tool is a cross-platform application designed to help users discover, configure, and manage Model Context Protocol (MCP) servers for Claude Sonnet desktop. This guide provides technical information for developers who want to understand, modify, or extend the application.

## Technology Stack

- **Frontend**: React with TypeScript
- **State Management**: React Hooks and Context API
- **Styling**: CSS with responsive design
- **Build Tools**: React Scripts (Create React App)
- **Testing**: Jest and React Testing Library

## Project Structure

```
mcp-config-app/
├── data/                  # Data files
│   └── mcp-servers.json   # Sample MCP server database
├── docs/                  # Documentation
├── src/                   # Source code
│   ├── components/        # React components
│   ├── services/          # Business logic services
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   ├── index.tsx          # Application entry point
│   └── types.ts           # TypeScript type definitions
├── package.json           # Project dependencies and scripts
└── README.md              # Project overview
```

## Core Modules

### Data Types (`types.ts`)

The application uses TypeScript interfaces to define its data structures:

- `MCPServer`: Represents an MCP server with its properties
- `MCPConfiguration`: Represents a user-created configuration
- `MCPServerConfig`: Represents a server within a configuration
- `SearchFilters`: Defines search and filter parameters
- `MCPDesktopConfig`: Represents the Claude Desktop configuration format

### Server Service (`mcpServerService.ts`)

Handles operations related to MCP servers:

- Loading server data from JSON
- Searching and filtering servers
- Retrieving server details
- Extracting categories

### Configuration Service (`configurationService.ts`)

Manages user configurations:

- Creating, updating, and deleting configurations
- Adding and removing servers from configurations
- Generating Claude Desktop configuration files
- Saving configurations to disk

## Component Architecture

### Main Components

- `App.tsx`: Main application component that manages routing and state
- `SearchFilters.tsx`: Implements the filtering UI at the top of the search page
- `ServerList.tsx`: Displays search results as cards
- `ConfigurationList.tsx`: Shows saved configurations
- `ConfigurationWizard.tsx`: Implements the step-by-step configuration process

### Component Relationships

- `App` contains and coordinates all other components
- `SearchFilters` communicates with `App` via callback functions
- `ServerList` displays data from `App` and triggers actions via callbacks
- `ConfigurationWizard` handles the creation and editing of configurations

## State Management

The application uses React's built-in state management with hooks:

- `useState` for component-level state
- `useEffect` for side effects like data loading
- Props for passing data and callbacks between components

## Adding New Features

### Adding a New MCP Server Type

1. Update the `mcp-servers.json` file with the new server details
2. Ensure it follows the `MCPServer` interface structure
3. Add any new categories to the server's categories array

### Adding a New Filter Type

1. Update the `SearchFilters` interface in `types.ts`
2. Modify the `SearchFilters` component to include the new filter UI
3. Update the `searchServers` method in `mcpServerService.ts` to handle the new filter

### Adding a New Wizard Step

1. Increment the step count in `ConfigurationWizard.tsx`
2. Add a new render function for the step (e.g., `renderStep5`)
3. Update the progress indicator to include the new step
4. Implement the step's UI and logic

## Testing

### Unit Testing

Unit tests focus on testing individual functions and components in isolation:

```javascript
// Example test for mcpServerService
describe('MCPServerService', () => {
  it('should filter servers by search query', () => {
    const service = new MCPServerService();
    const results = service.searchServers({ query: 'hugging face' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toContain('Hugging Face');
  });
});
```

### Component Testing

Component tests verify that UI components render and behave correctly:

```javascript
// Example test for SearchFilters component
describe('SearchFilters', () => {
  it('should call onFilterChange when filters are updated', () => {
    const mockOnFilterChange = jest.fn();
    render(<SearchFilters categories={['AI Models']} onFilterChange={mockOnFilterChange} />);
    
    fireEvent.change(screen.getByLabelText('Search:'), { target: { value: 'test' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      query: 'test'
    }));
  });
});
```

## Build and Deployment

### Development Build

```bash
npm start
```

This starts the development server with hot reloading.

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` directory.

### Desktop Application Build

```bash
npm run build-desktop
```

This creates desktop application installers in the `dist` directory.

## Performance Considerations

- The application loads all server data at startup, which is efficient for small datasets but may need pagination for larger datasets
- Search operations are performed client-side for immediate feedback
- Configuration files are stored locally to avoid network latency

## Security Considerations

- API tokens are stored in the configuration but never transmitted to external services
- The application does not collect or transmit user data
- Desktop configuration files are saved locally with standard file permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
