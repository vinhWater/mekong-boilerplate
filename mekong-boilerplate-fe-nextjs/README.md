# Mekong Boilerplate - Frontend (Next.js)

A modern Next.js frontend boilerplate with authentication and mock data built in.

## Features

- ✅ **Email & Google OAuth Authentication**
- ✅ **Next.js 15 with App Router**
- ✅ **TypeScript**
- ✅ **Tailwind CSS v4**
- ✅ **Internationalization (EN/VI)**
- ✅ **Dark Mode Support**
- ✅ **Mock Data Service** (for development without backend)
- ✅ **Component Library** (Radix UI)
- ✅ **Form Handling** (React Hook Form + Zod)
- ✅ **State Management** (Zustand)
- ✅ **Full UI Pages** (Dashboard, Orders, Products, etc.)

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Internationalization**: next-intl
- **State Management**: Zustand

## Prerequisites

- Node.js 18+ and npm

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

**Environment variables:**

```env
NEXT_PUBLIC_APP_ENV=development

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Mock Data Mode (set to true to use mock data instead of real API)
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Mock Data Mode

By default, the application uses mock data to demonstrate the UI without a backend.

### Using Mock Data (Default)

Set in `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Connecting to Real Backend

1. Start the backend server (see `../mekong-boilerplate-be-nestjs/README.md`)
2. Update `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Pages Structure

```
/                          # Landing page
/login                     # Login page (Email + Google OAuth)
/client/dashboard          # Dashboard with stats and charts
/client/tiktok/orders      # Orders management
/client/tiktok/products    # Products management
/client/tiktok/stores      # Stores management
/client/profile            # User profile
/client/settings           # User settings
/client/team               # Team management
/client/billing            # Billing and transactions
/client/design             # Design files
/client/mockup             # Mockup generator
/client/prompts            # AI prompts library
/client/template           # Templates
/client/aidesign           # AI design tools
/client/auto-crawler       # Auto crawler
/client/search             # Search page
```

## Authentication Flow

1. Visit `/login`
2. Choose authentication method:
   - **Email Magic Link**: Enter email → Receive magic link → Click to login
   - **Google OAuth**: Click "Sign in with Google" → Authorize → Login
3. After login, redirect to `/client/dashboard`

## Internationalization

The app supports:

- **English (EN)** - Default
- **Vietnamese (VI)**

Language files: `messages/en.json` and `messages/vi.json`

Switch language using the language selector in the header.

## Scripts

```bash
# Development
npm run dev              # Start dev server with turbopack
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:ci          # CI mode with coverage

# Linting
npm run lint             # Run linter
npm run lint:fix         # Fix lint issues
npm run type-check       # TypeScript type checking
```

## Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth pages (login)
│   ├── (client)/            # Client pages (dashboard, orders, etc.)
│   ├── api/auth/            # NextAuth API routes
│   └── layout.tsx           # Root layout
├── components/              # Reusable components
│   ├── ui/                 # UI primitives (buttons, inputs, etc.)
│   ├── Header/             # Header component
│   ├── Footer/             # Footer component
│   └── ...                 # Feature components
├── lib/                     # Utilities and helpers
│   ├── mock-data.ts        # Mock data for development
│   └── ...                 # Other utilities
├── types/                   # TypeScript type definitions
├── i18n/                    # Internationalization config
└── middleware.ts            # Next.js middleware (auth, i18n)
messages/
├── en.json                  # English translations
└── vi.json                  # Vietnamese translations
```

## Extending the Boilerplate

### Adding New Pages

1. Create page in `src/app/(client)/[page-name]/page.tsx`
2. Use mock data from `src/lib/mock-data.ts` or create new mock data
3. Add translations to `messages/en.json` and `messages/vi.json`

### Adding New Components

```bash
# UI components go in src/components/ui/
# Feature components go in src/components/[feature-name]/
```

### Switching from Mock Data to Real API

1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
2. Ensure backend is running
3. Update API calls in components to use real endpoints

## Customization

### Updating Styles

Global styles: `src/app/globals.css`
Tailwind config: Uses Tailwind v4 with `@tailwindcss/postcss`

### Updating Branding

- Update `public/` for icons and images
- Update `messages/` for text content
- Update color scheme in `globals.css`

## Troubleshooting

### "Cannot find module" errors

```bash
npm install
```

### Authentication not working

- Check `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in `.env.local`
- Ensure backend is running when using real API
- For Google OAuth, verify credentials in Google Console

### Mock data not showing

- Verify `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local`
- Check browser console for errors
- Restart dev server

## License

MIT
