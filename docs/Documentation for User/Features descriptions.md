# MCP Configuration Tool - Dashboard

The Dashboard is your central hub for managing Claude MCP server configurations. This page provides an overview of the key features and how to use them effectively.

## Dashboard Overview

The MCP Configuration Tool Dashboard provides a streamlined interface to manage your Claude configurations. It displays your existing configurations, allows you to create new ones, and provides access to the latest available models.

### Your Configurations

This section displays all your existing configurations with key information and actions:

- **Configuration Name**: The name you've given to your configuration
- **Status Badge**: Shows whether the configuration is Valid (ready to use) or Invalid (needs attention)
- **Tier Badge**: Indicates which tier (Basic, Standard, or Complete) the configuration belongs to
- **Last Modified**: When the configuration was last changed
- **Last Used**: When the configuration was last utilized with Claude

#### Configuration Actions

Each configuration has several action buttons:

- **Test & Validate**: Runs a comprehensive check of your configuration to ensure it works with Claude
- **Edit**: Modify the configuration settings
- **Duplicate**: Create a copy of the configuration as a starting point for a new one
- **Export**: Generate a JSON file to use with Claude

#### Configuration Details

Click the expand arrow next to any configuration to view detailed information:

- **Enabled Services**: Shows which core services are activated in this configuration:
  - **Web Search**: Allows Claude to search the internet for information
  - **File System**: Enables Claude to access files on your computer
  - **Hugging Face Models**: Connects Claude to AI models from Hugging Face

- **Enabled Models**: Lists the specific AI models enabled in this configuration

#### Validation Reports

When you click "Test & Validate", the system performs comprehensive checks on your configuration:

1. **Web Search**: Verifies that web search capabilities are properly configured
2. **File System**: Ensures Claude can access the specified directories
3. **Hugging Face**: Validates your token and verifies model accessibility
4. **Claude Integration**: Confirms that the configuration format is compatible with Claude

If any issues are found, the "Troubleshoot Issues" button will appear, guiding you through the resolution process.

### New Models Section

This section showcases recently added models that you can incorporate into your configurations:

- **Model Name and Type**: Identifies what the model does (e.g., Image Generation, Text Generation)
- **Free/Paid Badge**: Indicates whether using the model incurs additional Hugging Face charges
- **Usage Statistics**: Shows how many users are utilizing this model
- **Rating**: Community rating for the model's performance
- **Version Information**: Current version and release date
- **Model Description**: Explains the model's capabilities and use cases

Models available to your current tier will have an "Add to Configuration" button, while those requiring a higher tier will display a tier requirement message.

### View Options

The dashboard offers two view modes to suit your preferences:

- **Default View**: Shows all your configurations and available models
- **Compact View**: Collapses configuration cards for a more concise overview

## Model Parameters and Settings

### Global Model Preferences

To streamline your experience, the MCP Configuration Tool collects common model parameters once and applies them across all your models. These parameters control how models generate content and behave:

- **Temperature (0.0-1.0)**: Controls randomness in outputs
  - Lower values (0.1-0.3): More focused, deterministic responses
  - Higher values (0.7-1.0): More creative, varied outputs
  - Default: 0.7 for creative tasks, 0.2 for factual/technical tasks

- **Max Output Length**: Limits the length of generated content
  - Shorter values: Faster generation, more concise outputs
  - Longer values: More detailed outputs, slower generation
  - Default: Based on typical use cases (256-1024 tokens)

- **Top-p Sampling (0.0-1.0)**: Controls word selection diversity
  - Lower values: More focused on likely words
  - Higher values: More diverse vocabulary
  - Default: 0.9 for general use

- **Response Format**: Your preferred output structure
  - Options: Text, JSON, Markdown, etc.
  - Default: Text

You can set these preferences once during initial setup and update them anytime in Settings. When adding individual models, you can use these global defaults or customize settings for specific models.

### Model-Specific Requirements

Some models may require additional configuration:

- **API Tokens**: Secure keys required to access certain model providers
  - Hugging Face API tokens can be obtained from your Hugging Face account
  - Tokens are stored securely and validated during configuration

- **Special Parameters**: Some models have unique settings
  - These will be prompted only when required
  - Clear explanations are provided for unfamiliar parameters

When you add a model to your configuration, the system automatically detects which parameters are required and only prompts you for information not covered by your global preferences.

## Getting Started

If you're new to the dashboard:

1. Browse your existing configurations in the "Your Configurations" section
2. Click "Test & Validate" on a configuration to ensure it's working properly
3. Explore new models in the "New Models" section
4. Use the "Edit" button to modify configurations as needed

For any configuration showing an "Invalid" status, click "Test & Validate" to get a detailed report, then use "Troubleshoot Issues" to resolve any problems.
