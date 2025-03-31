# Hugging Face Integration - Tiered Model Selection Specification

## Overview

This document outlines the implementation details for the enhanced Hugging Face integration with tiered model selection in the MCP Configuration Tool. The goal is to create a clear, intuitive interface that reflects subscription tiers while guiding users toward upgrading when appropriate.

## User Scenarios

### Non-Subscriber Experience

When a user without a subscription tries to access Hugging Face models:

1. The toggle is replaced with a "Subscribe to Enable" button
2. User sees a preview of all available models organized by tier
3. Clicking the button presents subscription options with clear pricing
4. After subscribing, user is taken back to the configuration with their new tier active

### Basic Tier Experience

For users with a Basic subscription ($2/month):

1. The toggle is functional and can be turned on/off
2. User sees all 10 models, but can only select up to 3
3. When hitting the 3-model limit, user sees an upgrade prompt
4. Selected models are highlighted and included in the configuration

### Complete Tier Experience

For users with a Complete subscription ($5/month):

1. The toggle is functional and can be turned on/off
2. User can select any or all of the 10 available models
3. Selected models are highlighted and included in the configuration
4. No upgrade prompts are shown (highest tier)

## Component Design

### `HuggingFaceModelSelector` Component

This component will manage the model selection experience based on the user's subscription tier.

```javascript
interface HuggingFaceModelSelectorProps {
  subscription: 'none' | 'basic' | 'complete';
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
  onSubscribe: (tier: 'basic' | 'complete') => void;
  onUpgrade: () => void;
}
```

#### State Variables

- `selectedModels`: Array of selected model IDs
- `reachedLimit`: Boolean indicating if user hit their tier limit
- `showUpgradePrompt`: Boolean controlling visibility of upgrade prompt

#### Key Functions

- `handleModelToggle(modelId)`: Toggle model selection, with tier limit enforcement
- `canSelectMoreModels()`: Check if user can select additional models
- `getAvailableModelCount()`: Return number of models user can select
- `renderSubscriptionPrompt()`: Show subscription options for non-subscribers
- `renderModelList()`: Display models with proper enabled/disabled state
- `renderUpgradePrompt()`: Show upgrade CTA when limit is reached

### `SubscriptionModal` Component

When non-subscribers click "Subscribe to Enable", this modal appears:

```javascript
interface SubscriptionModalProps {
  onSubscribe: (tier: 'basic' | 'complete') => void;
  onCancel: () => void;
}
```

The modal presents:
- Basic tier details and pricing ($2/month)
- Complete tier details and pricing ($5/month)
- Comparison of features and model counts
- Payment method collection (mock for now)

### `UpgradePrompt` Component

When Basic tier users try to exceed their limit:

```javascript
interface UpgradePromptProps {
  onUpgrade: () => void;
  onDismiss: () => void;
}
```

This component shows:
- Clear explanation of tier limitation (3/3 models)
- Benefits of upgrading to Complete tier
- "Upgrade Now" and "Maybe Later" buttons

## Visual Design

### Non-Subscriber View

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Hugging Face Models                                │
│  Connect specialized AI models to extend Claude's   │
│  capabilities.                                      │
│                                                     │
│  [Subscribe to Enable]                              │
│                                                     │
│  Available Models (Requires Subscription):          │
│                                                     │
│  Basic Tier ($2/month) - Select up to 3 models:     │
│  • Flux.1-dev-infer (Image Generation)              │
│  • Whisper-large-v3-turbo (Audio Transcription)     │
│  • Qwen2-72B-Instruct (Language Model)              │
│  • And 7 more models with Complete tier             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Basic Tier View

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Hugging Face Models                                │
│  Connect specialized AI models to extend Claude's   │
│  capabilities.                                      │
│                                                     │
│  Basic Tier: Select up to 3 models (0/3 selected)   │
│                                                     │
│  [Upgrade to Complete Tier]                         │
│                                                     │
│  ☐ Flux.1-dev-infer (Image Generation)              │
│  ☐ Whisper-large-v3-turbo (Audio Transcription)     │
│  ☐ Qwen2-72B-Instruct (Language Model)              │
│  ☐ Shuttle-3.1-aesthetic (Image Generation)         │
│  ☐ Llama3-70B-Instruct (Language Model)             │
│  ☐ MusicGen-Large (Audio Generation)                │
│  ☐ DeepSeek-Coder-33B (Code Generation)             │
│  ☐ SDXL-Turbo (Image Generation)                    │
│  ☐ VideoCrafter-2 (Video Generation)                │
│  ☐ Stable Cascade (Image Generation)                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

When a Basic tier user tries to select a 4th model:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  You've reached your Basic tier limit               │
│                                                     │
│  Your current plan allows selection of up to 3      │
│  models. Upgrade to the Complete tier to access     │
│  all 10 models.                                     │
│                                                     │
│  [Upgrade Now]    [Maybe Later]                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Complete Tier View

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Hugging Face Models                                │
│  Connect specialized AI models to extend Claude's   │
│  capabilities.                                      │
│                                                     │
│  Complete Tier: Select up to 10 models (0/10)       │
│                                                     │
│  ☐ Flux.1-dev-infer (Image Generation)              │
│  ☐ Whisper-large-v3-turbo (Audio Transcription)     │
│  ☐ Qwen2-72B-Instruct (Language Model)              │
│  ☐ Shuttle-3.1-aesthetic (Image Generation)         │
│  ☐ Llama3-70B-Instruct (Language Model)             │
│  ☐ MusicGen-Large (Audio Generation)                │
│  ☐ DeepSeek-Coder-33B (Code Generation)             │
│  ☐ SDXL-Turbo (Image Generation)                    │
│  ☐ VideoCrafter-2 (Video Generation)                │
│  ☐ Stable Cascade (Image Generation)                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Coming Soon Section

At the bottom of the Hugging Face configuration panel:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ✨ Coming Soon in Full Release ✨                   │
│                                                     │
│  • Unlimited Model Selection - Browse and search    │
│    thousands of Hugging Face models                 │
│                                                     │
│  • Personalized Model Recommendations based on      │
│    your usage patterns and preferences              │
│                                                     │
│  • New Model Alerts - Get notified when models     │
│    you use are updated or when similar models       │
│    are released                                     │
│                                                     │
│  • Model Performance Analytics - See how your       │
│    models are performing and optimize your setup    │
│                                                     │
│  [Sign Up for Updates]                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Implementation Steps

1. **Create Core Components**
   - Implement `HuggingFaceModelSelector` component
   - Build `SubscriptionModal` for non-subscribers
   - Create `UpgradePrompt` for Basic tier users

2. **Connect to Subscription Logic**
   - Integrate with auth context to get user's subscription tier
   - Implement mock subscription/upgrade functions
   - Add tier detection to control UI state

3. **Style and UX Refinements**
   - Create distinct visual states for selectable vs. non-selectable models
   - Add appropriate animations for transitions
   - Implement hover states and clear feedback

4. **Testing**
   - Test all three user scenarios (non-subscriber, Basic tier, Complete tier)
   - Verify selection limits are properly enforced
   - Ensure upgrade flows work correctly

5. **Future-Proofing**
   - Create extensible model list structure for future marketplace
   - Implement category grouping for better organization
   - Add filter infrastructure for future search functionality

## Technical Considerations

1. **Performance**
   - Optimize rendering for potentially large model lists
   - Use virtualization for future marketplace implementation
   - Implement efficient model filtering

2. **State Management**
   - Keep selected models in parent component state
   - Use context or props for subscription tier information
   - Handle tier change events to update UI accordingly

3. **API Connectivity**
   - Prepare for real HuggingFace API integration
   - Implement token validation logic
   - Create model availability checks

4. **Responsive Design**
   - Ensure mobile-friendly model selection interface
   - Create compact view for smaller screens
   - Maintain clear upgrade paths on all devices

This specification provides a comprehensive guide for implementing the tiered model selection experience across all subscription levels while encouraging upgrades through clear value demonstration.
