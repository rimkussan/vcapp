# Microsoft Entra ID Authentication for Next.js

A secure, enterprise-ready authentication library for Next.js applications using Microsoft Entra ID (formerly Azure AD). Fast-track your SSO implementation with OAuth 2.0 and OpenID Connect.

## 🚀 Features

- **🔐 Enterprise-grade Security**: OAuth 2.0 + OpenID Connect with PKCE
- **🍪 Secure Session Management**: HttpOnly cookies with JWT
- **🛡️ CSRF Protection**: Built-in protection against cross-site request forgery
- **👥 Multi-tenant Support**: Configure for single or multi-tenant scenarios
- **🎭 Role-based Access Control**: Fine-grained permissions with claims mapping
- **⚡ Serverless Ready**: Compatible with Vercel, Azure Functions, and more
- **📱 App Router + Pages Router**: Full Next.js 13+ support
- **🔧 TypeScript First**: Complete type safety out of the box

## 📦 Installation

```bash
npm install @entraid/nextjs-auth
# or
yarn add @entraid/nextjs-auth
# or
pnpm add @entraid/nextjs-auth
```

## 📚 Complete Documentation

For comprehensive setup instructions, configuration examples, and deployment guidance:

- **[📖 Implementation Guide](../IMPLEMENTATION-GUIDE.md)** - Complete step-by-step tutorial
- **[⚙️ Configuration Examples](../CONFIGURATION-EXAMPLES.md)** - All scenarios with code examples
- **[✅ Deployment Checklist](../DEPLOYMENT-CHECKLIST.md)** - Production-ready checklist
- **[🎯 Working Example](example/)** - Live demo with source code

## 🏃‍♂️ Quick Start

### 1. Environment Variables

Create a `.env.local` file:

```bash
# Microsoft Entra ID Configuration
ENTRA_CLIENT_ID=your_client_id_here
ENTRA_CLIENT_SECRET=your_client_secret_here
ENTRA_TENANT_ID=your_tenant_id_here

# Application URLs
NEXTAUTH_URL=http://localhost:3000
ENTRA_REDIRECT_URI=http://localhost:3000/api/auth/callback
ENTRA_POST_LOGOUT_REDIRECT_URI=http://localhost:3000

# Session Configuration (minimum 32 characters)
ENTRA_COOKIE_SECRET=your_32_character_cookie_secret_here_minimum_32_chars
```

### 2. Create Auth Configuration

Create `src/lib/auth.ts`:

```typescript
import { createEntraIdAuth, EntraIdConfig } from '@entraid/nextjs-auth';

const config: EntraIdConfig = {
  clientId: process.env.ENTRA_CLIENT_ID!,
  clientSecret: process.env.ENTRA_CLIENT_SECRET!,
  tenantId: process.env.ENTRA_TENANT_ID!,
  redirectUri: process.env.ENTRA_REDIRECT_URI!,
  postLogoutRedirectUri: process.env.ENTRA_POST_LOGOUT_REDIRECT_URI,
  cookieSecret: process.env.ENTRA_COOKIE_SECRET!,
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

export const auth = createEntraIdAuth({ config });
```

### 3. Create API Route Handler

Create `src/app/api/auth/[...auth]/route.ts`:

```typescript
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return auth.handleAuth(request);
}

export async function POST(request: NextRequest) {
  return auth.handleAuth(request);
}
```

### 4. Add Middleware (Optional)

Create `src/middleware.ts` for route protection:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAuthMiddleware } from '@entraid/nextjs-auth';

const config = {
  clientId: process.env.ENTRA_CLIENT_ID!,
  clientSecret: process.env.ENTRA_CLIENT_SECRET!,
  tenantId: process.env.ENTRA_TENANT_ID!,
  redirectUri: process.env.ENTRA_REDIRECT_URI!,
  cookieSecret: process.env.ENTRA_COOKIE_SECRET!,
};

const authMiddleware = createAuthMiddleware({
  config,
  requireAuth: false, // Global setting
});

export async function middleware(request: NextRequest) {
  // Protect specific routes
  if (request.nextUrl.pathname.startsWith('/protected')) {
    const protectedMiddleware = createAuthMiddleware({
      config,
      requireAuth: true,
      onUnauthorized: (request) => {
        return NextResponse.redirect(new URL('/login', request.url));
      },
    });
    return protectedMiddleware(request);
  }

  // Admin-only routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminMiddleware = createAuthMiddleware({
      config,
      requireAuth: true,
      requiredRoles: ['Admin'],
      onForbidden: (request) => {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      },
    });
    return adminMiddleware(request);
  }

  return authMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
```

### 5. Use in Components

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function AuthButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  if (user) {
    return (
      <div>
        <span>Welcome, {user.name}!</span>
        <a href="/api/auth/signout">Sign Out</a>
      </div>
    );
  }

  return <a href="/api/auth/signin">Sign In</a>;
}
```

## 🔧 Configuration Options

### Basic Configuration

```typescript
interface EntraIdConfig {
  clientId: string;              // Required: Your app's client ID
  clientSecret: string;          // Required: Your app's client secret
  tenantId: string;              // Required: Your tenant ID
  redirectUri: string;           // Required: OAuth callback URL
  cookieSecret: string;          // Required: 32+ character secret
  
  // Optional settings
  postLogoutRedirectUri?: string;
  scopes?: string[];
  cookieName?: string;
  cookieMaxAge?: number;
  isMultiTenant?: boolean;
  allowedTenants?: string[];
}
```

### Multi-tenant Configuration

```typescript
const config: EntraIdConfig = {
  // ... other config
  isMultiTenant: true,
  allowedTenants: ['tenant-1-id', 'tenant-2-id'], // Optional allowlist
};
```

### Custom Claims Mapping

```typescript
import { ClaimsMapper, defaultClaimMappings } from '@entraid/nextjs-auth';

const customMapper = new ClaimsMapper([
  ...defaultClaimMappings,
  {
    source: 'extension_department',
    target: 'department'
  },
  {
    source: 'jobTitle',
    target: 'title',
    transform: (value) => value.toUpperCase()
  }
]);

export const auth = createEntraIdAuth({ 
  config, 
  claimsMapper: customMapper 
});
```

## 📚 API Reference

### Session Helpers

```typescript
import { auth } from '@/lib/auth';

// Get current user
const user = await auth.auth.getUser(request);

// Get access token
const token = await auth.auth.getAccessToken(request);

// Check authentication status
const isAuthenticated = await auth.auth.isAuthenticated(request);

// Check roles
const hasRole = await auth.auth.hasRole('Admin', request);
const hasAnyRole = await auth.auth.hasAnyRole(['Admin', 'Manager'], request);
```

### Route Protection

```typescript
import { withAuth } from '@entraid/nextjs-auth';

export const GET = withAuth(
  async (request) => {
    // Protected route logic
    return NextResponse.json({ message: 'Protected data' });
  },
  config,
  {
    requireAuth: true,
    requiredRoles: ['Admin'],
    requiredClaims: { department: 'IT' }
  }
);
```

## 🏗️ Entra ID App Registration Setup

### 1. Register Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**

### 2. Basic Settings

- **Name**: Your application name
- **Supported account types**: Choose based on your needs
- **Redirect URI**: `http://localhost:3000/api/auth/callback` (for development)

### 3. Authentication

- Add redirect URIs for all environments
- Enable **ID tokens** under **Implicit grant and hybrid flows**

### 4. API Permissions

Add these permissions:
- `openid` (OpenID Connect sign-in)
- `profile` (View users' basic profile)
- `email` (View users' email address)
- `User.Read` (Read user profile)

### 5. Certificates & Secrets

- Create a new **Client secret**
- Copy the value immediately (it won't be shown again)

### 6. App Roles (Optional)

For role-based access control:
1. Go to **App roles**
2. Create roles like "Admin", "Manager", "User"
3. Assign users to roles in **Enterprise applications**

## 🚀 Deployment

### Vercel

1. Set environment variables in Vercel dashboard
2. Update redirect URIs in Entra ID app registration
3. Deploy normally - the library is serverless-ready

### Environment Variables for Production

```bash
ENTRA_CLIENT_ID=your_production_client_id
ENTRA_CLIENT_SECRET=your_production_client_secret
ENTRA_TENANT_ID=your_tenant_id
NEXTAUTH_URL=https://your-domain.com
ENTRA_REDIRECT_URI=https://your-domain.com/api/auth/callback
ENTRA_POST_LOGOUT_REDIRECT_URI=https://your-domain.com
ENTRA_COOKIE_SECRET=your_secure_random_string_32plus_chars
```

## 🔒 Security Best Practices

- ✅ Always use HTTPS in production
- ✅ Keep client secrets secure and rotate regularly
- ✅ Use strong cookie secrets (32+ random characters)
- ✅ Enable CSRF protection (enabled by default)
- ✅ Validate tokens and sessions server-side
- ✅ Implement proper error handling
- ✅ Use role-based access control
- ✅ Regular security audits

## 📖 Examples

Check the `/example` directory for a complete Next.js application demonstrating:
- Basic authentication flow
- Protected routes
- Role-based access control
- Multi-tenant configuration
- Custom claims mapping

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- 📚 [Documentation](https://github.com/your-org/nextjs-entraid-auth/docs)
- 🐛 [Issues](https://github.com/your-org/nextjs-entraid-auth/issues)
- 💬 [Discussions](https://github.com/your-org/nextjs-entraid-auth/discussions)

---

Built with ❤️ for enterprise authentication needs.