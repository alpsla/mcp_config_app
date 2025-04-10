# Testing the Secure Token Implementation

This guide provides instructions for safely testing the new secure token implementation without risking your existing configuration.

## Prerequisites

- Node.js 14+ installed
- Access to your MCP Configuration App codebase
- Your existing Claude Desktop configuration (if any)

## Testing Process Overview

The testing process involves:

1. Backing up your current configuration
2. Testing the UI improvements for token validation
3. Testing the secure token storage
4. Testing the configuration migration
5. Testing the wrapper script generation
6. Restoring your original configuration if needed

## Step 1: Back Up Your Current Configuration

Before starting, manually back up your configuration:

```bash
# For macOS/Linux
cp ~/.claude-desktop/claude_desktop_config.json ~/.claude-desktop/claude_desktop_config.json.manual-backup

# For Windows
copy %USERPROFILE%\.claude-desktop\claude_desktop_config.json %USERPROFILE%\.claude-desktop\claude_desktop_config.json.manual-backup
```

## Step 2: Test the UI Improvements

1. Start the MCP Configuration App
2. Navigate to the Subscription Flow Parameters page
3. Test the Hugging Face API token input field:
   - Try entering an invalid token (without "hf_" prefix)
   - Observe validation feedback
   - Enter a valid token format (starts with "hf_")
   - Click "Save Token Securely" button
   - Observe the confirmation message

## Step 3: Test the Migration Tool

The migration tool lets you safely transfer tokens from your existing config to secure storage:

```bash
# Navigate to the project root
cd /path/to/mcp-config-app

# Run the migration script
node scripts/migrate-config.js
```

The script will:
1. Detect tokens in your existing configuration
2. Show you which tokens it found
3. Ask for confirmation before proceeding
4. Back up your configuration automatically
5. Migrate tokens to secure storage
6. Update your configuration to remove hardcoded tokens

## Step 4: Test the Wrapper Script

After migration, a wrapper script should be generated. Verify it works:

```bash
# For macOS/Linux
cat ~/hf_wrapper.sh
chmod +x ~/hf_wrapper.sh
~/hf_wrapper.sh --version  # Should show MCP server version

# For Windows
type %USERPROFILE%\hf_wrapper.ps1
powershell -File %USERPROFILE%\hf_wrapper.ps1 --version
```

## Step 5: Check Your Configuration

Examine your Claude Desktop configuration to ensure it's been updated:

```bash
# For macOS/Linux
cat ~/.claude-desktop/claude_desktop_config.json

# For Windows
type %USERPROFILE%\.claude-desktop\claude_desktop_config.json
```

The configuration should now reference the wrapper script instead of containing the token directly.

## Step 6: Restore Your Original Configuration (If Needed)

If you encounter issues, you can restore your original configuration:

```bash
# Using the restore script
node scripts/restore-config.js

# Or manually
cp ~/.claude-desktop/claude_desktop_config.json.manual-backup ~/.claude-desktop/claude_desktop_config.json
```

## Troubleshooting

### Token Validation Issues

If token validation doesn't work in the UI:
- Check browser console for errors
- Verify that token-input-validation.js is loaded
- Try refreshing the page

### Secure Storage Issues

If secure storage fails:
- On macOS: Check Keychain Access
- On Windows: Check Windows Credential Manager
- On Linux: Verify libsecret or ~/.config/huggingface directory

### Wrapper Script Issues

If the wrapper script doesn't work:
- Check script permissions (should be executable)
- Verify script content for correct paths
- Try running with `--debug` flag for more information

## Reporting Issues

When reporting issues, please include:
1. Your operating system
2. Steps to reproduce the issue
3. Error messages (if any)
4. Logs from console/terminal

## Next Steps After Testing

Once testing is complete and everything works as expected:
1. Commit the changes to the repository
2. Update documentation
3. Deploy the updates to users
