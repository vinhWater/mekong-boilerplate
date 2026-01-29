# Mekong Boilerplate

A modern full-stack boilerplate with authentication, built with NestJS and Next.js.

## 🚀 Features

### Backend (NestJS)

- ✅ Email Authentication (Magic Link)
- ✅ Google OAuth Authentication
- ✅ JWT Token Management (Access + Refresh tokens)
- ✅ Role-Based Access Control (Admin, Manager, Member)
- ✅ TypeORM with PostgreSQL
- ✅ Database Migrations
- ✅ Swagger API Documentation
- ✅ Rate Limiting
- ✅ Health Check Endpoint

### Frontend (Next.js)

- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS v4
- ✅ Internationalization (EN/VI)
- ✅ Dark Mode Support
- ✅ **Mock Data Service** (develop UI without backend)
- ✅ Complete UI Pages (Dashboard, Orders, Products, etc.)
- ✅ Radix UI Components
- ✅ Form Handling (React Hook Form + Zod)
- ✅ State Management (Zustand)

## 📦 Project Structure

```
mekong-boilerplate/
├── mekong-boilerplate-be-nestjs/    # Backend (NestJS)
│   ├── src/
│   │   ├── auth/                    # Authentication module
│   │   ├── mail/                    # Email service
│   │   ├── health/                  # Health check
│   │   ├── config/                  # Configuration
│   │   ├── common/                  # Shared utilities
│   │   ├── migrations/              # Database migrations
│   │   └── main.ts                  # Entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── mekong-boilerplate-fe-nextjs/    # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                     # Next.js pages
│   │   ├── components/              # React components
│   │   ├── lib/                     # Utilities & mock data
│   │   └── types/                   # TypeScript types
│   ├── messages/                    # i18n translations
│   ├── package.json
│   ├── .env.local.example
│   └── README.md
│
├── docker-compose.yml               # Docker Compose setup
└── README.md                        # This file
```

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository (if needed)**

2. **Configure environment variables**

```bash
# Backend
cd mekong-boilerplate-be-nestjs
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../mekong-boilerplate-fe-nextjs
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

3. **Start all services**

```bash
cd ..
docker-compose up -d
```

Services will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api
- PostgreSQL: localhost:5432

### Option 2: Manual Setup

#### Backend Setup

```bash
cd mekong-boilerplate-be-nestjs

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Create PostgreSQL user and database
# Option 1: Using existing postgres user (for development)
# You can use the default postgres user with password 'postgres'
# Just edit .env: DB_USERNAME=postgres, DB_PASSWORD=postgres

# Option 2: Create a new dedicated user (recommended for production)
# Switch to postgres user
sudo -i -u postgres

# Create new database user
createuser --interactive --pwprompt mekong_user
# Enter password when prompted (e.g., mekong_password)
# Answer 'n' to superuser, 'n' to create databases, 'n' to create roles

# Create database and grant privileges
createdb mekong_boilerplate -O mekong_user

# Exit postgres user
exit

# Then edit .env with:
# DB_USERNAME=mekong_user
# DB_PASSWORD=mekong_password (or whatever you set)
# DB_DATABASE=mekong_boilerplate

# Option 3: Quick setup for development (if Option 2 seems complex)
sudo -u postgres psql -c "CREATE USER mekong_user WITH PASSWORD 'mekong_password';"
sudo -u postgres psql -c "CREATE DATABASE mekong_boilerplate OWNER mekong_user;"

# Run migrations
npm run migration:run

# Start development server
npm run start:dev
```

Backend will be available at http://localhost:3001

#### Frontend Setup

```bash
cd mekong-boilerplate-fe-nextjs

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local

# Start development server
npm run dev
```

Frontend will be available at http://localhost:3000

## 🔐 Authentication

### Email Magic Link Flow

1. Navigate to http://localhost:3000/login
2. Enter your email address
3. Click "Send Magic Link"
4. Check your email for the magic link
5. Click the link to log in

### Google OAuth Flow

1. Navigate to http://localhost:3000/login
2. Click "Sign in with Google"
3. Authorize with your Google account
4. Automatically logged in and redirected to dashboard

## 🎨 Mock Data Mode (Frontend Only)

The frontend includes a **Mock Data Service** that allows you to develop and demo the UI without a running backend.

### Enable Mock Data

In `mekong-boilerplate-fe-nextjs/.env.local`:

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

This provides:

- Sample users, orders, products, stores, etc.
- Realistic UI demonstration
- No backend dependency for frontend development

### Disable Mock Data (Use Real API)

```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📚 Documentation

- **Backend**: See `mekong-boilerplate-be-nestjs/README.md`
- **Frontend**: See `mekong-boilerplate-fe-nextjs/README.md`

## 🛠 Development

### Backend

```bash
cd mekong-boilerplate-be-nestjs

npm run start:dev      # Start with watch mode
npm run lint           # Run linter
npm run test           # Run tests
npm run build          # Build for production
```

### Frontend

```bash
cd mekong-boilerplate-fe-nextjs

npm run dev            # Start dev server
npm run build          # Build for production
npm run lint           # Run linter
npm run type-check     # TypeScript checking
```

## 🗄 Database

### Migrations

```bash
cd mekong-boilerplate-be-nestjs

# Create new migration
npm run migration:create -- MigrationName

# Generate from entity changes
npm run migration:generate -- MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## 🌍 Internationalization

The frontend supports multiple languages:

- English (EN) - Default
- Vietnamese (VI)

Translation files: `mekong-boilerplate-fe-nextjs/messages/`

## 🎯 Use Cases

This boilerplate is perfect for:

- 🚀 **Rapid Prototyping**: Mock data lets you build UI fast
- 📦 **SaaS Applications**: Authentication and user management ready
- 🛒 **E-commerce Platforms**: Orders, products, stores included
- 📊 **Admin Dashboards**: Complete dashboard with charts and tables
- 🏢 **Business Applications**: Team management, billing, settings

## 🔧 Customization

### Adding New Features

1. **Backend**: Create new modules using NestJS CLI

```bash
cd mekong-boilerplate-be-nestjs
nest g module feature-name
nest g controller feature-name
nest g service feature-name
```

2. **Frontend**: Add new pages in `src/app/(client)/`

### Extending Mock Data

Edit `mekong-boilerplate-fe-nextjs/src/lib/mock-data.ts` to add more sample data.

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Reset database
docker-compose down -v
docker-compose up -d
```

## 📝 Environment Variables

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mekong_boilerplate

PORT=3001
NODE_ENV=development

JWT_SECRET=your-super-secret-key
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@mekong-boilerplate.com

FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_APP_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## 🔒 Security Best Practices

- ✅ Change all secrets in production
- ✅ Use strong JWT secrets
- ✅ Enable HTTPS in production
- ✅ Set `NODE_ENV=production` to disable Swagger UI
- ✅ Use environment variables for sensitive data
- ✅ Implement rate limiting (already configured)
- ✅ Validate all user inputs

## 🚀 Deployment

### Backend

1. Build: `npm run build`
2. Set environment variables
3. Run migrations: `npm run migration:run`
4. Start: `npm run start:prod`

### Frontend

1. Build: `npm run build`
2. Set environment variables
3. Start: `npm start`

Or deploy to Vercel/Netlify/etc.

## 🤝 Contributing

This is a boilerplate template. Feel free to:

- Fork and customize for your needs
- Extend with new features
- Share improvements

## 📜 License

MIT License - feel free to use this boilerplate for any project.

## 🙋 Support

For issues or questions:

- Check the READMEs in each project folder
- Review the code comments
- Consult NestJS and Next.js documentation

---

**Happy coding! 🎉**

Made with ❤️ using NestJS + Next.js
