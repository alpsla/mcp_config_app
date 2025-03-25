# Supabase Template Configuration Instructions

Follow these instructions to fix the two issues we identified:

## Issue 1: First and Last Names Not Being Added to Profiles

The current code in `AuthCallback.tsx` has been updated to properly retrieve and use any stored names from localStorage. This should resolve the issue with names not being added to profiles.

## Issue 2: Magic Links Opening in New Tab

### Step 1: Copy the Template

Copy the contents of the `same-tab-magic-link.html` file in the `/src/customTemplates/` directory.

### Step 2: Update Supabase Template

1. Open your Supabase project dashboard
2. Go to **Authentication > Templates**
3. Select the **Magic Link** template 
4. Paste the content into the template body
5. Make sure to save the changes

### Key Changes in the Template:

1. **Removed target="_blank"** - This is critical! The original template had this attribute which forces links to open in new tabs
2. **Simplified button structure** - The new button is more compatible with Gmail and other clients
3. **Improved layout** - Better spacing and color contrast for better readability

By making these changes in the Supabase dashboard, both issues should be resolved:
1. Names will be correctly associated with user profiles
2. Magic links will open in the same tab instead of creating new tabs

Remember to test the configuration after making these changes to ensure everything works as expected.