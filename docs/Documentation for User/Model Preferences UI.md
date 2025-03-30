# Model Preferences UI Design

This document outlines the proposed UI design for collecting and managing model preferences in the MCP Configuration Tool.

## Global Preferences Setup

The global preferences setup is designed to be presented to users:
1. During initial onboarding
2. When accessing preferences from the dashboard
3. When adding Hugging Face integration for the first time

### Initial Setup Screen

```
┌──────────────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════════════╗   │
│ ║ Model Preferences                               1 of 2 ▶    ║   │
│ ╚════════════════════════════════════════════════════════════╝   │
│                                                                  │
│  Let's set up your default preferences for AI models.            │
│  These settings will apply to all models unless customized.      │
│                                                                  │
│  🔍 Temperature                                                  │
│  Controls how random or focused model responses will be          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ 0.0                                             1.0 │        │
│  │ ○───────────●─────────────────────────────────○    │        │
│  │ More focused                         More creative  │        │
│  └─────────────────────────────────────────────────────┘        │
│  Current: 0.7                                                    │
│                                                                  │
│  ℹ️ Recommended:                                                 │
│    • 0.2-0.3 for factual, technical, or code tasks               │
│    • 0.6-0.8 for creative writing or idea generation             │
│                                                                  │
│  🔄 Max Output Length                                            │
│  Limits how much text the model will generate at once            │
│                                                                  │
│  ┌─────────────────────────────┐                                 │
│  │ Select a token limit        ▼ │                                 │
│  └─────────────────────────────┘                                 │
│                                                                  │
│  ℹ️ Guidelines:                                                  │
│    • 256 tokens ≈ 200 words (quick responses)                    │
│    • 1024 tokens ≈ 800 words (detailed responses)                │
│    • 4096 tokens ≈ 3000 words (long-form content)                │
│                                                                  │
│                                                                  │
│  ┌───────────────┐                ┌────────────────┐             │
│  │ Skip for now  │                │ Continue       │             │
│  └───────────────┘                └────────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════════════╗   │
│ ║ Model Preferences                               2 of 2 ▶    ║   │
│ ╚════════════════════════════════════════════════════════════╝   │
│                                                                  │
│  Let's finish setting up your model preferences.                 │
│                                                                  │
│  🎲 Top-p Sampling                                               │
│  Controls diversity of word choices in generated content         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ 0.0                                             1.0 │        │
│  │ ○───────────────────────────────────●──────────○    │        │
│  │ More focused                         More diverse   │        │
│  └─────────────────────────────────────────────────────┘        │
│  Current: 0.9                                                    │
│                                                                  │
│  ℹ️ Recommended default: 0.9                                     │
│                                                                  │
│  📄 Preferred Response Format                                    │
│  Choose default output structure for models that support it      │
│                                                                  │
│  ○ Text (Standard natural language)                              │
│  ○ JSON (Structured data format)                                 │
│  ○ Markdown (Formatted text with headings, lists, etc.)          │
│  ○ HTML (Web-ready content)                                      │
│                                                                  │
│  🔑 Hugging Face API Token (Optional)                            │
│  Required for accessing Hugging Face models                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │ Enter your Hugging Face API token                  │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
│  ℹ️ Don't have a token? <Learn how to get one>                   │
│                                                                  │
│  ┌───────────────┐                ┌────────────────┐             │
│  │ Back          │                │ Finish Setup   │             │
│  └───────────────┘                └────────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Accessing from Dashboard

These preferences would be accessible from the dashboard via a "Model Preferences" or "Settings" button. The UI would be similar to the setup screens but with current values pre-filled and a single "Save Changes" button.

## Model-Specific Override UI

When adding or editing a specific model, users would see their global preferences with options to override:

```
┌──────────────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════════════╗   │
│ ║ Configure Model: GPT-4o                                     ║   │
│ ╚════════════════════════════════════════════════════════════╝   │
│                                                                  │
│  Basic Settings                                                  │
│                                                                  │
│  🔍 Temperature                                                  │
│                                                                  │
│  ○ Use global setting (0.7)                                      │
│  ● Custom setting for this model:                                │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ 0.0                                             1.0 │        │
│  │ ○──●────────────────────────────────────────────○    │        │
│  │ More focused                         More creative  │        │
│  └─────────────────────────────────────────────────────┘        │
│  Current: 0.2                                                    │
│                                                                  │
│  🔄 Max Output Length                                            │
│                                                                  │
│  ● Use global setting (1024 tokens)                              │
│  ○ Custom setting for this model:                                │
│                                                                  │
│  ┌─────────────────────────────┐                                 │
│  │ Select a token limit        ▼ │                                 │
│  └─────────────────────────────┘                                 │
│                                                                  │
│  [+ Show Advanced Settings]                                      │
│                                                                  │
│  ┌───────────────┐                ┌────────────────┐             │
│  │ Cancel        │                │ Save Model     │             │
│  └───────────────┘                └────────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Required API Tokens UI

For models requiring API tokens that haven't been set globally:

```
┌──────────────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════════════╗   │
│ ║ API Token Required                                          ║   │
│ ╚════════════════════════════════════════════════════════════╝   │
│                                                                  │
│  To use DALL-E 3, you need to provide an API token               │
│                                                                  │
│  🔑 API Token                                                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │ Enter your API token                               │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
│  ℹ️ This token will be validated before saving                   │
│                                                                  │
│  🔒 Security Note:                                               │
│  Your API token is stored securely and only used to access       │
│  this specific model.                                            │
│                                                                  │
│  📋 How to get a token:                                          │
│    1. Log in to your account at huggingface.co                   │
│    2. Go to Settings > Access Tokens                             │
│    3. Create a new token with read access                        │
│                                                                  │
│  ┌───────────────┐                ┌────────────────┐             │
│  │ Cancel        │                │    Validate    │             │
│  └───────────────┘                └────────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Validation UI

When validating a token, the user would see:

```
┌──────────────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════════════╗   │
│ ║ Validating Token...                                         ║   │
│ ╚════════════════════════════════════════════════════════════╝   │
│                                                                  │
│  🔄 Checking token validity...                                   │
│  ✅ Token is valid                                               │
│  🔄 Verifying model access...                                    │
│  ✅ Model access confirmed                                       │
│                                                                  │
│  ✅ Token successfully validated!                                │
│                                                                  │
│  You now have access to:                                         │
│  • DALL-E 3                                                      │
│  • GPT-4o                                                        │
│  • 8 other models                                                │
│                                                                  │
│  ┌────────────────┐                                              │
│  │    Continue    │                                              │
│  └────────────────┘                                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Error UI

If token validation fails:

```
┌──────────────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════════════╗   │
│ ║ Token Validation Error                                      ║   │
│ ╚════════════════════════════════════════════════════════════╝   │
│                                                                  │
│  ❌ Unable to validate the provided token                        │
│                                                                  │
│  Error details:                                                  │
│  • The token appears to be invalid or expired                    │
│  • Unable to authenticate with Hugging Face API                  │
│                                                                  │
│  Troubleshooting steps:                                          │
│  1. Verify you've copied the entire token correctly              │
│  2. Check if the token has expired in your Hugging Face account  │
│  3. Ensure the token has appropriate read permissions            │
│  4. Try generating a new token                                   │
│                                                                  │
│  <How to get a valid token>                                      │
│                                                                  │
│  ┌───────────────┐                ┌────────────────┐             │
│  │    Cancel     │                │     Retry      │             │
│  └───────────────┘                └────────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Implementation Notes

1. **Progressive Disclosure**:
   - Start with basic settings that most users understand
   - Use "Advanced Settings" expandable section for power users
   - Provide contextual help for each parameter

2. **Visual Guidance**:
   - Use sliders with visual indicators for ranges
   - Provide clear examples of what different values mean
   - Show recommendations based on common use cases

3. **Default Values**:
   - Pre-populate with sensible defaults
   - Allow "Reset to Defaults" option

4. **Validation**:
   - Validate API tokens in real-time when possible
   - Show clear success/error states
   - Provide specific troubleshooting guidance for errors

5. **Mobile Responsiveness**:
   - Ensure all UI elements work well on smaller screens
   - Consider multi-step wizard approach for mobile
