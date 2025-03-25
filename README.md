# MCP Configuration Tool

A tool for configuring MCP servers with a modern two-panel interface.

## Features

- Two-panel layout for intuitive configuration
- Server-side authentication with tiered subscriptions via Supabase
- Web Search, File System, and Hugging Face model integrations
- Desktop and web compatibility indicators
- Configuration export and import

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or pnpm package manager
- A Supabase account for authentication and database
- A Hugging Face account for API access (optional)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Create a `.env` file based on the example:

```bash
cp .env.example .env
```

4. Configure the environment variables:
   - Set `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` from your Supabase project
   - Set `REACT_APP_HUGGINGFACE_API_KEY` with your Hugging Face API key
   - During development, you can set `REACT_APP_USE_MOCK_API=true` to use mock data

5. Start the development server:

```bash
npm start
# or
pnpm dev
```

### Supabase Configuration

This application uses Supabase for authentication, user management, and database storage. To set up your Supabase project:

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Get your project URL and anon/public key from the API settings
3. Enable the authentication providers you want to use (Email, Google, GitHub, etc.)
4. Set up the following database tables:

#### Profiles Table
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  subscription_tier text default 'free',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security
alter table public.profiles enable row level security;

-- Create policy to allow users to read their own profile
create policy "Users can read own profile" 
  on profiles for select 
  using (auth.uid() = id);

-- Create policy to allow users to update their own profile
create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Set up trigger to create a profile when a new user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### Configurations Table
```sql
create table public.configurations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  description text,
  servers jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security
alter table public.configurations enable row level security;

-- Create policy to allow users to read their own configurations
create policy "Users can read own configurations" 
  on configurations for select 
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own configurations
create policy "Users can insert own configurations" 
  on configurations for insert 
  with check (auth.uid() = user_id);

-- Create policy to allow users to update their own configurations
create policy "Users can update own configurations" 
  on configurations for update 
  using (auth.uid() = user_id);

-- Create policy to allow users to delete their own configurations
create policy "Users can delete own configurations" 
  on configurations for delete 
  using (auth.uid() = user_id);
```

### Development Mode With Mock API

For development purposes, the application includes mock API responses that work without a backend server. To enable this mode:

1. Set `REACT_APP_USE_MOCK_API=true` in your `.env` file
2. The mock user will have a Starter tier subscription

## Building for Production

To create a production build:

```bash
npm run build
# or
pnpm build
```

The build files will be in the `build` directory. You can serve these with any static file server:

```bash
npx serve -s build
```

## Project Structure

```
src/
├── auth/                 # Authentication components
│   ├── AuthContext.tsx   # Auth state management
│   └── AuthContainer.tsx # Login/signup forms
├── components/
│   ├── common/           # Reusable components
│   ├── config/           # Configuration components
│   ├── dashboard/        # Dashboard components
│   └── subscription/     # Subscription components
├── hooks/                # Custom React hooks
├── services/
│   ├── supabase/         # Supabase integration
│   │   ├── supabaseClient.ts
│   │   ├── authService.ts
│   │   └── databaseService.ts
│   └── mcpServerService.ts # MCP Server management
└── types.ts              # TypeScript type definitions
```

## License

This project is proprietary and confidential.
