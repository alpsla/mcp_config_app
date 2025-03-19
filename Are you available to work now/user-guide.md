# MCP Configuration Tool - User Guide

## Introduction

The MCP Configuration Tool is designed to simplify the process of setting up and configuring Model Context Protocol (MCP) servers for Claude Sonnet desktop. This guide will walk you through how to use the application to discover, configure, and manage MCP servers.

## Getting Started

After installing the application, you'll see two main tabs:
- **Search MCP Servers**: For finding and exploring available MCP servers
- **My Configurations**: For managing your saved configurations

## Searching for MCP Servers

### Using Filters

At the top of the Search tab, you'll find several filtering options:

1. **Search Box**: Enter keywords to search by name or description
2. **Categories**: Select one or more categories to filter servers by functionality
3. **Minimum Rating**: Adjust the slider to set a minimum rating threshold
4. **Token Requirement**: Filter servers based on whether they require an API token

The search results will update automatically as you adjust these filters.

### Viewing Server Details

Each server card in the results section displays:
- Server name and rating
- Description of functionality
- Categories
- Download count and version information
- Token requirements (if applicable)

### Adding Servers to Configurations

To add a server to a configuration:
1. Find the server you want to add in the search results
2. Use the dropdown menu at the bottom of the server card
3. Select an existing configuration or choose "Create New Configuration"

## Managing Configurations

### Viewing Your Configurations

In the "My Configurations" tab, you'll see:
- A list of your saved configurations on the left
- Details of the selected configuration on the right

### Creating a New Configuration

To create a new configuration:
1. Click the "Create New Configuration" button
2. Follow the wizard steps:

   **Step 1: Basic Information**
   - Enter a name for your configuration
   - Optionally add a description

   **Step 2: Select MCP Servers**
   - Browse available servers and click "Add" to include them
   - Review your selected servers

   **Step 3: Configure Servers**
   - Enable or disable each server using the toggle switch
   - Enter any required API tokens
   - Review token descriptions for guidance

   **Step 4: Review & Save**
   - Review your configuration details
   - Click "Save Configuration" to finalize

### Editing a Configuration

To edit an existing configuration:
1. Select the configuration from the list
2. Click the "Edit Configuration" button
3. Follow the same wizard steps as when creating a new configuration

### Saving to Claude Desktop

To use your configuration with Claude Sonnet desktop:
1. Select the configuration you want to use
2. Click the "Save to Claude Desktop" button
3. The configuration will be saved as a JSON file in the default location for Claude Desktop

## Tips for Non-Technical Users

- **Start with popular servers**: Sort by rating or downloads to find widely-used servers
- **Check token requirements**: Some servers require API tokens - make sure you have these before adding the server
- **Use descriptive names**: Give your configurations clear names that describe their purpose
- **Enable only what you need**: Disable servers you don't currently need to keep your configuration clean

## Troubleshooting

**Configuration not appearing in Claude Desktop**
- Make sure you've saved the configuration file to the correct location
- Check that the file format is correct (should be a .json file)
- Restart Claude Desktop after saving the configuration

**Server not working properly**
- Verify that any required API tokens are entered correctly
- Check that the server is enabled in your configuration
- Consult the server documentation for specific requirements

## Getting Help

If you encounter any issues or have questions about using the MCP Configuration Tool, please refer to the full documentation or contact support.
