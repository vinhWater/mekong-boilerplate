# Mekong Boilerplate - Backend (NestJS)

A modern NestJS backend boilerplate with authentication built in.

## Features

- ✅ **Email Authentication** (Magic Link)
- ✅ **Google OAuth Authentication**
- ✅ **JWT Token Management** (Access + Refresh tokens)
- ✅ **Role-Based Access Control** (Admin, Manager, Member)
- ✅ **TypeORM with PostgreSQL**
- ✅ **Database Migrations**
- ✅ **Swagger API Documentation**
- ✅ **Rate Limiting**
- ✅ **Health Check Endpoint**

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport JWT
- **Email**: Nodemailer
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required environment variables:**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mekong_boilerplate

# Application
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Email/SMTP (for magic link authentication)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@mekong-boilerplate.com

# CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE mekong_boilerplate;
```

Run migrations:

```bash
npm run migration:run
```

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## API Documentation

When running in development mode, Swagger documentation is available at:

```
http://localhost:3001/api
```

## Authentication Flow

### Email Magic Link Authentication

1. **Request Magic Link**: `POST /auth/request-magic-link`

   ```json
   {
     "email": "user@example.com",
     "redirectUrl": "http://localhost:3000/api/auth/callback/email-login"
   }
   ```

2. User receives email with magic link
3. **Verify Magic Link**: `POST /auth/verify-magic-link`
   ```json
   {
     "email": "user@example.com",
     "token": "magic-link-token-from-email"
   }
   ```
4. Returns JWT access and refresh tokens

### Google OAuth Authentication

**OAuth Login**: `POST /auth/oauth-login`

```json
{
  "provider": "google",
  "providerId": "google-user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://..."
}
```

### Token Refresh

**Refresh Token**: `POST /auth/refresh`

```json
{
  "refreshToken": "your-refresh-token"
}
```

### Protected Routes

Include the JWT token in the Authorization header:

```
Authorization: Bearer <access-token>
```

**Get User Profile**: `GET /auth/profile`

## Database Migrations

```bash
# Create a new migration
npm run migration:create -- MigrationName

# Generate migration from entity changes
npm run migration:generate -- MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Scripts

```bash
# Development
npm run start:dev          # Start with watch mode
npm run start:debug        # Start in debug  mode

# Production
npm run build              # Build the project
npm run start:prod         # Start production server

# Testing
npm test                   # Run tests
npm run test:watch         # Watch mode
npm run test:cov           # With coverage

# Linting
npm run lint               # Run linter
npm run format             # Format code with Prettier
```

## Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── controllers/       # Auth controllers
│   ├── decorators/        # Custom decorators (@CurrentUser, @Public, etc.)
│   ├── dto/               # Data transfer objects
│   ├── entities/          # User, OAuthAccount, MagicLinkToken, RefreshToken
│   ├── enums/             # UserRole enum
│   ├── guards/            # JWT guard, Role guard
│   ├── strategies/        # Passport strategies
│   └── services/          # Auth business logic
├── mail/                  # Email service
├── health/                # Health check endpoint
├── config/                # Configuration files
├── common/                # Shared utilities
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Interceptors
│   └── pipes/             # Custom pipes
├── migrations/            # Database migrations
├── app.module.ts          # Root module
└── main.ts                # Application entry point
```

## Health Check

Check application health:

```bash
curl http://localhost:3001/health
```

## Security Best Practices

- Change `JWT_SECRET` in production
- Use strong SMTP credentials
- Enable HTTPS in production
- Set `NODE_ENV=production` to disable Swagger UI
- Use environment variables for sensitive data
- Implement rate limiting (already configured)

## Extending the Boilerplate

### Adding New Modules

```bash
nest g module feature-name
nest g controller feature-name
nest g service feature-name
```

### Adding New Entities

1. Create entity file in your module
2. Generate migration: `npm run migration:generate -- AddFeatureName`
3. Run migration: `npm run migration:run`

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE mekong_boilerplate;`

### Email Not Sending

- Check SMTP configuration in `.env`
- For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833)
- Verify `EMAIL_FROM` is correct

### CORS Errors

- Ensure `FRONTEND_URL` matches your frontend URL
- Check CORS configuration in `main.ts`

## License

MIT
