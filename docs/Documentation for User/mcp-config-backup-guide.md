# MCP Configuration Backup Guide

This guide explains how the MCP Config backup system works to preserve your existing configuration while implementing the new secure token handling.

## Overview

The backup system ensures that your existing MCP configuration file (which may contain a hardcoded Hugging Face API token) is preserved before any changes are made. This allows you to:

1. Test the new secure token handling without risk to your current setup
2. Easily revert to your previous configuration if needed
3. Transition to secure token storage without losing your other settings

## How Backups Work

### Automatic Backup Process

When you save a Hugging Face API token using the "Save Token Securely" button:

1. The system automatically creates a backup of your current MCP config file
2. The backup is stored in `~/.mcp-config-backups/` with a timestamp
3. Your original config file is sanitized to remove any hardcoded tokens
4. A wrapper script is created that will securely access your token

### Backup Location

Backups are stored in a dedicated directory:
- macOS/Linux: `~/.mcp-config-backups/`
- Windows: `C:\Users\<YourUsername>\.mcp-config-backups\`

Each backup filename includes the original config filename and a timestamp, for example:
```
claude_desktop_config.json.2025-04-09T15-30-45-123Z.bak
```

## Restoring from Backup

If you need to revert to your previous configuration:

### Automatic Restoration

1. Open the MCP Configuration App
2. Go to Settings
3. Click on "Restore Previous Configuration"
4. Select the backup you want to restore from the list
5. Click "Restore"

### Manual Restoration

You can also manually restore a backup:

1. Navigate to the backup directory in your file explorer
2. Copy the desired backup file
3. Paste it to the Claude Desktop configuration location, replacing the current file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/claude-desktop/claude_desktop_config.json`

## Managing Backups

The system maintains a history of backups allowing you to:

- See when changes were made
- Compare different configurations
- Restore to specific points in time

### Cleaning Up Old Backups

To prevent accumulating too many backup files:

1. The system automatically keeps only the 10 most recent backups
2. You can manually delete old backups from the backup directory
3. You can use the "Clean Up Backups" option in the Settings page to remove all but the most recent backup

## Transitioning from Hardcoded Tokens

If your current configuration contains a hardcoded Hugging Face API token:

1. The backup system will automatically detect this
2. A complete backup will be created before any changes
3. Your configuration will be updated to use the new secure token approach
4. The hardcoded token will be removed from the configuration file

This ensures that sensitive information is never lost while moving to the more secure approach.

## Troubleshooting

### Backup Creation Failed

If a backup cannot be created:

1. Check that you have write permissions to the backup directory
2. Ensure you have sufficient disk space
3. Try creating a manual backup by copying the file yourself

### Restoration Failed

If restoration fails:

1. Make sure the backup file exists and is not corrupted
2. Check that you have write permissions to the Claude Desktop config directory
3. Try performing a manual restoration

### Cannot Find Backups

If you cannot locate your backups:

1. Check the backup directory path for your operating system
2. Look for hidden directories (files starting with a dot)
3. Use the search function in your file explorer with "*.bak" as the search term

## Security Notes

- Backups may contain sensitive information including API tokens
- Keep your backup directory secure
- Consider encrypting backups for additional security
- Delete old backups that are no longer needed

## Conclusion

The backup system provides a safety net as you transition to the new secure token handling system. By preserving your existing configuration, it allows you to test and adopt the new approach without risk of disruption to your workflow.
