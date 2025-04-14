# Supabase Integration Guide for Subscription Flow

This document outlines how to integrate the subscription flow with Supabase for database persistence.

## Database Schema

### User Profiles Table
```sql
create table user_profiles (
  id uuid references auth.users primary key,
  first_name text,
  last_name text,
  display_name text,
  company text,
  role text,
  interests text[],
  primary_use_case text,
  experience_level text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Subscription Profiles Table
```sql
create table subscription_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  tier text not null check (tier in ('none', 'basic', 'complete')),
  parameters jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Parameters Schema
The `parameters` field in the subscription_profiles table should contain a JSON object with the following structure:

```json
{
  "temperature": number,
  "max_length": number,
  "top_p": number,
  "top_k": number,
  "hf_token_provided": boolean  // Only stores a flag, not the actual token
}
```

**Note**: For security reasons, we do not store the actual Hugging Face token in the database. Instead, we store a flag indicating whether a token has been provided, and the token itself is stored securely on the user's local device using platform-specific secure storage mechanisms.

## API Functions to Implement

### 1. Save User Profile

```typescript
// In EnhancedConfigurationManager.ts
async createOrUpdateUserProfile(
  userId: string, 
  profileData: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    company?: string;
    role?: string;
    interests?: string[];
    primary_use_case?: string;
    experience_level?: string;
  }
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await this.supabaseClient
      .from('user_profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      });
      
    return { data, error };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return { data: null, error };
  }
}
```

### 2. Save Subscription Profile with Parameters

```typescript
// In EnhancedConfigurationManager.ts
async createOrUpdateSubscriptionProfile(
  userId: string,
  tier: SubscriptionTierSimple,
  parameters: {
    temperature?: number;
    max_length?: number;
    top_p?: number;
    top_k?: number;
    hf_token_provided?: boolean; // Just a flag, not the actual token
  }
): Promise<{ data: any; error: any }> {
  try {
    // First check if a profile exists
    const { data: existingProfile } = await this.supabaseClient
      .from('subscription_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    // If exists, update; otherwise, insert
    const { data, error } = await this.supabaseClient
      .from('subscription_profiles')
      .upsert({
        id: existingProfile?.id,
        user_id: userId,
        tier,
        parameters,
        updated_at: new Date().toISOString()
      });
      
    return { data, error };
  } catch (error) {
    console.error('Error saving subscription profile:', error);
    return { data: null, error };
  }
}
```

### 3. Load User Parameters

```typescript
// In EnhancedConfigurationManager.ts
async getUserParameters(userId: string): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await this.supabaseClient
      .from('subscription_profiles')
      .select('parameters')
      .eq('user_id', userId)
      .single();
      
    return { data: data?.parameters || null, error };
  } catch (error) {
    console.error('Error loading user parameters:', error);
    return { data: null, error };
  }
}
```

### 4. Validate Hugging Face Token

Create a Supabase Edge Function to validate the Hugging Face token:

```typescript
// supabase/functions/validate-hf-token/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface RequestBody {
  token: string;
}

serve(async (req) => {
  try {
    const { token } = await req.json() as RequestBody;
    
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: 'Test' })
    });
    
    return new Response(
      JSON.stringify({ valid: response.ok }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
})
```

## Implementation Steps

1. **Set Up Supabase Tables**:
   - Create the tables defined above in your Supabase project

2. **Create RLS Policies**:
   - Set up Row Level Security to ensure users can only access their own data
   ```sql
   CREATE POLICY "Users can only read their own profiles"
   ON user_profiles FOR SELECT
   USING (auth.uid() = id);
   
   CREATE POLICY "Users can only update their own profiles"
   ON user_profiles FOR UPDATE
   USING (auth.uid() = id);
   
   CREATE POLICY "Users can only read their own subscription profiles"
   ON subscription_profiles FOR SELECT
   USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can only update their own subscription profiles"
   ON subscription_profiles FOR UPDATE
   USING (auth.uid() = user_id);
   ```

3. **Implement Data Access Layer**:
   - Add the functions to your EnhancedConfigurationManager class
   - Create helper functions for validation and error handling

4. **Connect SubscriptionFlow to Supabase**:
   - Initialize Supabase client in your main application
   - Pass the client to the EnhancedConfigurationManager
   - Update the SubscriptionFlow component to use the manager

5. **Implement Form Validation**:
   - Add client-side validation for all form fields
   - Connect the server-side validation for the Hugging Face token

6. **Add Loading and Error States**:
   - Show loading indicators during API calls
   - Display appropriate error messages on failures

## Parameter Management

The simplified parameter approach works as follows:

1. **Initial Load**:
   - When the Parameters page loads, try to fetch the user's existing parameters
   - If none exist, use the recommended defaults based on their subscription tier

2. **User Interaction**:
   - Users see recommended values pre-filled, but can modify them
   - Users can reset to defaults using the "Reset to Recommended Values" button

3. **Saving**:
   - When the user clicks "Next", save their current parameter values
   - These values become their default settings for future sessions

4. **Validation**:
   - Validate format of Hugging Face token if provided
   - API validation of the token should happen on the server side

## API Integration Example

Here's how to integrate the Supabase calls in the ParametersStep component:

```typescript
// In ParametersStep.tsx
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/supabase-js';

// Later in the component...
const supabaseClient = useSupabaseClient();
const configManager = useConfigManager(); // Your singleton service

// Load existing parameters on component mount
useEffect(() => {
  const loadParameters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await configManager.getUserParameters(userId);
      
      if (data && !error) {
        // Use the saved parameters
        setTemperature(data.temperature || tierDefaults.temperature);
        setMaxLength(data.max_length || tierDefaults.maxLength);
        setTopP(data.top_p || tierDefaults.topP);
        setTopK(data.top_k || tierDefaults.topK);
        
        // If the user had previously saved a token, try to retrieve it from secure storage
        if (data.hf_token_provided) {
          try {
            const savedToken = await secureTokenStorage.retrieveToken();
            if (savedToken) {
              setHfToken(savedToken);
            }
          } catch (tokenError) {
            console.error('Error retrieving saved token:', tokenError);
          }
        }
      } else {
        // Use defaults
        handleResetToDefaults();
      }
    } catch (error) {
      console.error('Error loading parameters:', error);
      // Fall back to defaults
      handleResetToDefaults();
    } finally {
      setIsLoading(false);
    }
  };
  
  loadParameters();
}, [userId]);

// When Next is clicked
const handleNext = async () => {
  setIsValidating(true);
  
  try {
    // Validate Hugging Face token if provided
    if (hfToken) {
      if (!validateHfTokenFormat(hfToken)) {
        return;
      }
      
      // Store token securely in local device storage
      const tokenSaved = await secureTokenStorage.storeToken(hfToken);
      if (!tokenSaved) {
        setValidationError('Failed to securely store token. Please try again.');
        setIsValidating(false);
        return;
      }
      
      // Call the token validation endpoint
      const { data, error } = await supabaseClient.functions.invoke('validate-hf-token', {
        body: { token: hfToken }
      });
      
      if (error || !data.valid) {
        setHfTokenError('Invalid Hugging Face token. Please check and try again.');
        setIsValidating(false);
        return;
      }
    }
    
    // Proceed to next step with current parameters, but don't pass the actual token
    onNext({
      temperature,
      maxLength,
      topP,
      topK,
      hfTokenProvided: !!hfToken // Just pass a flag indicating if a token was provided
    });
  } catch (error) {
    setValidationError('An error occurred while validating your settings. Please try again.');
  } finally {
    setIsValidating(false);
  }
};
```

## Future Improvements

1. **Parameter Presets (Post-Signup)**:
   - Create a dedicated configuration page where users can save and manage parameter presets
   - Allow users to name and switch between different parameter configurations
   - Keep the subscription flow focused on initial setup only

2. **Usage Analytics**:
   - Track which parameters lead to better user outcomes
   - Use this data to improve the recommended defaults
   - Provide insights to users about their usage patterns

3. **Advanced Validation**:
   - Add more sophisticated validation for parameter combinations
   - Provide real-time feedback on how parameter changes might affect results
   - Allow preview of different parameter settings