# Secure Hugging Face Token Usage Guide

This guide explains how to securely store and use your Hugging Face API token with the MCP Configuration App and Claude Desktop.

## Overview

The MCP Configuration App now provides a secure way to store your Hugging Face API token and use it with Claude Desktop. This means:

- You only need to enter your token once
- Your token is stored securely on your device
- The token is never exposed in configuration files or command-line arguments
- Claude Desktop automatically retrieves the token when needed

## Step 1: Obtaining a Hugging Face API Token

If you don't already have a Hugging Face API token:

1. Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Sign in to your Hugging Face account (or create a new one)
3. Click "New token"
4. Enter a name (e.g., "Claude Desktop")
5. Select "Read" for the role
6. Click "Generate token"
7. Copy the generated token (it should start with `hf_`)

## Step 2: Entering and Saving Your Token Securely

1. Open the MCP Configuration App
2. Navigate to the Subscription Flow Parameters page
3. Find the "Hugging Face API Token" section
4. Enter your token in the text field
5. The field will validate your token format automatically
6. Click the "Save Token Securely" button
7. You'll see a confirmation message when the token is saved

## Step 3: Using Your Token with Claude Desktop

After saving your token, Claude Desktop will automatically use it:

1. Open Claude Desktop
2. The app will use your securely stored token
3. No additional configuration is needed

## What's Happening Behind the Scenes

When you save your token:

1. **Secure Storage**:
   - On macOS: Your token is stored in the Keychain
   - On Windows: Your token is stored using Windows Credential Manager
   - On Linux: Your token is stored using libsecret or in an encrypted file

2. **Wrapper Script Generation**:
   - A small script is created that retrieves your token securely
   - The Claude Desktop configuration is updated to use this script
   - The script sets your token as an environment variable

3. **Token Validation**:
   - The format of your token is validated (must start with `hf_`)
   - The token is checked for proper length and character set

## Frequently Asked Questions

### Is my token transmitted anywhere?
No. Your token is stored only on your local device and is never transmitted to our servers.

### Where exactly is my token stored?
- **macOS**: In your login Keychain under "HuggingFaceToken"
- **Windows**: In either the Windows Credential Manager or an encrypted file in your user profile
- **Linux**: Using libsecret (if available) or in an encrypted file in ~/.config/huggingface/

### How do I update my token?
Simply enter a new token in the field and click "Save Token Securely" again. The old token will be replaced.

### How do I remove my token?
You can remove your token using your operating system's credential manager:
- **macOS**: Open Keychain Access and delete the "HuggingFaceToken" entry
- **Windows**: Open Credential Manager and delete the "HuggingFaceToken" entry
- **Linux**: Use `secret-tool delete service huggingface token api` or remove the file in ~/.config/huggingface/

### What if I want to use a different token temporarily?
You can set the `HF_TOKEN` environment variable before launching Claude Desktop to override the stored token.

## Troubleshooting

### The "Save Token Securely" button doesn't activate
Make sure your token starts with `hf_` and contains at least 20 alphanumeric characters.

### Claude Desktop can't find my token
1. Check that you've successfully saved your token
2. Restart Claude Desktop
3. Ensure you have the necessary permissions for your system's credential storage

### I get a validation error
1. Verify that your token starts with `hf_`
2. Ensure you've copied the entire token from Hugging Face
3. Try generating a new token on the Hugging Face website

## Security Information

- Your token is stored using your operating system's secure credential storage
- The token is never stored in plain text configuration files
- The wrapper script retrieves the token securely at runtime
- The token is never passed as a command-line argument

For advanced users or administrators who need more information about the implementation, please refer to the [Hugging Face Token Security Implementation](../huggingface-token-security-README.md) document.
