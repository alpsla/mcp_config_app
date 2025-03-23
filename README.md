# MCP Configuration Tool

A tool for configuring MCP servers with a modern two-panel interface.

## Features

- Two-panel layout for intuitive configuration
- Server-side authentication with tiered subscriptions
- Web Search, File System, and Hugging Face model integrations
- Desktop and web compatibility indicators
- Configuration export and import

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- Yarn or npm
- A backend API server for authentication and subscription management (optional for development)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Create a `.env.local` file based on the sample:

```bash
cp sample.env .env.local
```

4. Configure the environment variables:
   - Set `REACT_APP_API_BASE_URL` to your backend API URL
   - During development, you can set `REACT_APP_USE_MOCK_API=true` to use mock data

5. Start the development server:

```bash
yarn start
```

### Development Mode With Mock API

For development purposes, the application includes mock API responses that work without a backend server. To enable this mode:

1. Set `REACT_APP_USE_MOCK_API=true` in your `.env.local` file
2. The mock user will have a Starter tier subscription

### API Integration

This application is designed to work with a server-side API. The expected API endpoints are:

#### Authentication Endpoints:
- `POST /api/auth/signin` - Sign in with email and password
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/user` - Get current user
- `GET /api/auth/session` - Get session information

#### Subscription Endpoints:
- `POST /api/subscription/update` - Update user subscription
- `POST /api/subscription/payment` - Process payment

## Phased Implementation

The application follows a two-phase implementation approach:

### Phase 1: Beta Release

- Server-side authentication
- Two-panel configuration interface
- Limited Hugging Face model integration
- Tier-based access control
- Configuration testing and export

### Phase 2: Future Development

- Full marketplace experience
- Analytics and error management
- Community features and documentation
- Enterprise features (team management, role-based access)

## Project Structure

```
src/
├── auth/                 # Authentication components
├── components/
│   ├── common/           # Reusable components
│   ├── config/           # Configuration components
│   ├── dashboard/        # Dashboard components
│   └── subscription/     # Subscription components
├── hooks/                # Custom React hooks
├── services/             # API and service integrations
└── types.ts              # TypeScript type definitions
```

## License

This project is proprietary and confidential.
