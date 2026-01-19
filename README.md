# Angular 14 JWT Authentication with Refresh Token Rotation

An Angular 14 application demonstrating JWT authentication with automatic refresh token rotation.

## Features

- **JWT Authentication**: Login and register with JWT access tokens
- **Refresh Token Rotation**: Automatic token refresh with rotation for enhanced security
- **HTTP Interceptor**: Automatically attaches tokens and handles 401 errors
- **Route Guards**: Protected routes with `AuthGuard` and guest-only routes with `GuestGuard`
- **Token Expiry Handling**: Proactive token refresh before expiration

## Project Structure

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts         # Protects authenticated routes
│   │   └── guest.guard.ts        # Protects guest-only routes
│   ├── interceptors/
│   │   └── auth.interceptor.ts   # Handles token injection & refresh
│   ├── models/
│   │   └── auth.model.ts         # TypeScript interfaces
│   └── services/
│       ├── auth.service.ts       # Authentication logic
│       └── token.service.ts      # Token storage & validation
├── features/
│   ├── auth/
│   │   ├── login/                # Login component
│   │   └── register/             # Register component
│   └── dashboard/                # Protected dashboard
└── app.module.ts
```

## How Refresh Token Rotation Works

1. On login, the server returns both an `accessToken` (short-lived) and `refreshToken` (long-lived)
2. The `AuthInterceptor` attaches the access token to every request
3. When a request fails with 401, the interceptor:
   - Pauses all pending requests
   - Calls `/auth/refresh` with the current refresh token
   - Server validates and returns NEW tokens (rotation)
   - Retries the original request with the new access token
4. If refresh fails, user is logged out

## Setup

```bash
npm install
npm start
```

The app runs at `http://localhost:4200`

## API Endpoints Expected

Configure your backend to provide:

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/api/auth/login` | POST | `{ email, password }` | `{ user, accessToken, refreshToken }` |
| `/api/auth/register` | POST | `{ name, email, password }` | `{ user, accessToken, refreshToken }` |
| `/api/auth/refresh` | POST | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| `/api/auth/logout` | POST | `{ refreshToken }` | `{}` |
| `/api/protected` | GET | - | `{ message }` |

## Environment Configuration

Edit `src/environments/environment.ts` to set your API URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```
