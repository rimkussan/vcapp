# Microsoft Entra ID + Next.js Authentication

A comprehensive authentication solution for Next.js applications using Microsoft Entra ID (formerly Azure AD). This repository provides a complete implementation with role-based access control, multi-tenant support, and enterprise-grade security.

## Table of Contents

1. [🚀 Quick Start](#-quick-start)
2. [🎯 Features](#-features)
3. [📦 Installation & Setup](#-installation--setup)
4. [🔧 Azure App Registration](#-azure-app-registration)
5. [⚙️ Configuration Examples](#️-configuration-examples)
6. [🛠️ Implementation Guide](#️-implementation-guide)
7. [🔒 Security & Authentication](#-security--authentication)
8. [👥 Role-Based Access Control](#-role-based-access-control)
9. [🚀 Deployment](#-deployment)
10. [🧪 Testing](#-testing)
11. [🔍 Troubleshooting](#-troubleshooting)
12. [📚 API Reference](#-api-reference)

---

## 🚀 Quick Start

### Launch the Demo Application

#### For Linux/WSL:
```bash
cd ~/git/entraid
./launch-demo.sh
```

#### For Windows localhost Access:
1. **IMPORTANT**: Run `setup-windows-proxy.bat` as Administrator (one-time setup)
2. This enables Windows to access `http://localhost:3000`
3. **Required** for Microsoft Entra ID integration (redirect URI compliance)

### Access URLs
- **Local:** http://localhost:3000
- **Network:** http://10.255.255.254:3000

### Project Structure
```
entraid/
├── launch-demo.sh              # Complete launch script (use this!)
├── start-app.sh               # Simple startup script  
├── setup-windows-proxy.bat    # Windows localhost fix (run as admin)
├── test-localhost-connection.sh # Test Windows networking
├── fix-windows-access.sh      # Diagnostic tool
├── README.md                  # This comprehensive guide
├── CONFIGURATION-EXAMPLES.md  # Detailed configuration examples
├── IMPLEMENTATION-GUIDE.md    # Step-by-step implementation
├── DEPLOYMENT-CHECKLIST.md    # Production deployment guide
└── nextjs-entraid-auth/       # Main project
    ├── package/               # NPM package source
    ├── example/              # Demo application
    └── README.md             # Package documentation
```

---

## 🎯 Features

- **🔐 Enterprise-grade Security**: OAuth 2.0 + OpenID Connect with PKCE
- **🍪 Secure Session Management**: HttpOnly cookies with JWT
- **🛡️ CSRF Protection**: Built-in protection against cross-site request forgery
- **👥 Multi-tenant Support**: Configure for single or multi-tenant scenarios
- **🎭 Role-based Access Control**: Fine-grained permissions with claims mapping
- **⚡ Serverless Ready**: Compatible with Vercel, Azure Functions, and more
- **📱 App Router + Pages Router**: Full Next.js 13+ support
- **🔧 TypeScript First**: Complete type safety out of the box
- **🌐 Personal + Organizational Accounts**: Support both account types
- **🔄 Token Refresh**: Automatic token renewal
- **📊 Comprehensive Logging**: Authentication events and error tracking

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ installed
- Azure account with admin access
- Basic understanding of Next.js and TypeScript
- Domain name for production deployment (optional for development)

### Create Next.js Project

```bash
# Create new Next.js project
npx create-next-app@latest myapp-entraid --typescript --tailwind --eslint --app
cd myapp-entraid

# Install NextAuth.js and dependencies
npm install next-auth@beta
```

### Environment Configuration

Create **`.env.local`**:
```bash
# Microsoft Entra ID Configuration
ENTRA_CLIENT_ID=your-application-client-id-here
ENTRA_CLIENT_SECRET=your-client-secret-here
ENTRA_TENANT_ID=your-tenant-id-or-common

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-32-character-secret-here

# Optional: Custom issuer
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/YOUR-TENANT-ID/v2.0
```

**Generate NEXTAUTH_SECRET**:
```bash
# Generate a secure random secret
openssl rand -base64 32
```

---

## 🔧 Azure App Registration

### Step 1: Create App Registration

1. **Navigate to Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com)
   - Search for "App registrations"
   - Click "New registration"

2. **Configure Basic Settings**
   ```
   Name: MyApp-Development
   Supported account types: Choose based on your needs:
   - Single tenant: "Accounts in this organizational directory only"
   - Multi-tenant: "Accounts in any organizational directory"
   - Personal + Org: "Accounts in any organizational directory and personal Microsoft accounts"
   
   Redirect URI: Web - http://localhost:3000/api/auth/callback/microsoft-entra-id
   ```

   **⚠️ Important:** The redirect URI must be exactly `http://localhost:3000/api/auth/callback/microsoft-entra-id` when using NextAuth.js. This is different from custom implementations that might use `/azure-ad` - NextAuth.js uses the provider ID `microsoft-entra-id` which determines the callback URL path.

3. **Save the Registration**
   - Click "Register"
   - Copy the **Application (client) ID**
   - Copy the **Directory (tenant) ID**

### Step 2: Create Client Secret

1. **Navigate to Certificates & secrets**
   - Click "New client secret"
   - Description: "Development Secret"
   - Expires: Choose appropriate timeframe
   - Click "Add"

2. **Save the Secret Value**
   ```bash
   ⚠️  IMPORTANT: Copy the secret VALUE immediately
   You won't be able to see it again after leaving this page
   ```

### Step 3: Configure API Permissions

1. **Add Permissions**
   - Go to "API permissions"
   - Click "Add a permission"
   - Choose "Microsoft Graph"
   - Select "Delegated permissions"
   
2. **Required Permissions**
   ```
   ✅ openid
   ✅ profile  
   ✅ email
   ✅ User.Read
   ```

3. **Grant Admin Consent** (if required)
   - Click "Grant admin consent for [Your Organization]"

### Step 4: Configure App Roles (Optional but Recommended)

1. **Navigate to App roles**
   - Click "Create app role"

2. **Create Admin Role**
   ```json
   {
     "displayName": "Administrator",
     "description": "Full administrative access",
     "value": "Admin",
     "allowedMemberTypes": ["User"],
     "isEnabled": true
   }
   ```

3. **Create Additional Roles**
   ```json
   {
     "displayName": "User",
     "description": "Standard user access",
     "value": "User",
     "allowedMemberTypes": ["User"],
     "isEnabled": true
   }
   ```

### Step 5: Assign Users and Groups to App Roles

**⚠️ Critical Step:** After creating app roles, you must assign users or groups to these roles. Without this step, users won't have any roles in their tokens.

1. **Navigate to Enterprise Application**
   - Go to Azure Portal → **Enterprise applications**
   - Search for your application name (e.g., "MyApp-Development")
   - Click on your application

2. **Access Users and Groups**
   - In the left sidebar, click **"Users and groups"**
   - Click **"Add user/group"**

3. **Assign Individual Users**
   ```
   Step 1: Click "Users" → Select user(s) from your organization
   Step 2: Click "Select role" → Choose from your app roles:
           - Administrator
           - User
           - [Any other roles you created]
   Step 3: Click "Assign"
   ```

4. **Assign Groups (Recommended for Scale)**
   ```
   Step 1: Click "Groups" → Select security group(s)
   Step 2: Click "Select role" → Choose appropriate role for the group
   Step 3: Click "Assign"
   
   Examples:
   - "IT Admins" group → Administrator role
   - "All Employees" group → User role
   - "Managers" group → Manager role (if created)
   ```

5. **Verify Assignments**
   - Return to **"Users and groups"** section
   - You should see your assigned users/groups with their roles
   - **Important:** Changes may take a few minutes to propagate

### Step 6: Test Role Assignment

1. **Test with Assigned User**
   - Sign in to your application with an assigned user
   - Check that roles appear in the user session
   - Verify role-based features work correctly

2. **Test with Unassigned User**
   - Sign in with a user who hasn't been assigned any roles
   - Should see "No roles assigned" or appropriate unauthorized message
   - This confirms role-based access control is working

**📝 Important Notes:**
- **Personal Microsoft Accounts:** Don't support app roles (limitation by design)
- **Role Propagation:** May take 5-10 minutes after assignment
- **Token Claims:** Roles appear in the `roles` claim in the access token
- **Group Membership:** If using groups, ensure users are members of assigned groups

**🔍 Troubleshooting Role Assignment:**
```bash
# If roles aren't appearing in tokens:
1. Verify user/group is assigned to app role in Enterprise Application
2. Check if user is member of assigned group (if using group assignment)
3. Wait 5-10 minutes for changes to propagate
4. Clear browser cache and sign out/in again
5. Check token content in browser developer tools (JWT decode)
```

---

## ⚙️ Configuration Examples

### Basic Single-Tenant Configuration

**Environment Variables:**
```bash
# Single-tenant configuration for specific organization
ENTRA_CLIENT_ID=your-client-id-here
ENTRA_CLIENT_SECRET=your-client-secret-here
ENTRA_TENANT_ID=your-specific-tenant-id-here

# NextAuth.js configuration
NEXTAUTH_URL=https://myapp.com
NEXTAUTH_SECRET=your-secure-random-32-character-secret-here

# Optional: Specific issuer for your tenant
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/YOUR-TENANT-ID/v2.0
```

**NextAuth Configuration (`auth.ts`):**
```typescript
import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.ENTRA_CLIENT_ID!,
      clientSecret: process.env.ENTRA_CLIENT_SECRET!,
      tenantId: process.env.ENTRA_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email User.Read"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.roles = profile.roles || []
        token.jobTitle = profile.jobTitle
        token.department = profile.department
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).roles = token.roles
        (session.user as any).jobTitle = token.jobTitle
        (session.user as any).department = token.department
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
})
```

### Multi-Tenant Configuration

**Environment Variables:**
```bash
# Multi-tenant configuration
ENTRA_CLIENT_ID=your-client-id-here
ENTRA_CLIENT_SECRET=your-client-secret-here
ENTRA_TENANT_ID=common
ENTRA_IS_MULTI_TENANT=true

# NextAuth.js configuration
NEXTAUTH_URL=https://myapp.com
NEXTAUTH_SECRET=your-secure-random-32-character-secret-here

# Multi-tenant issuer
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/common/v2.0
```

**Advanced Multi-Tenant Auth Configuration:**
```typescript
import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

// Optional: Define allowed tenants for security
const ALLOWED_TENANTS = process.env.ALLOWED_TENANTS?.split(',') || []

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.ENTRA_CLIENT_ID!,
      clientSecret: process.env.ENTRA_CLIENT_SECRET!,
      tenantId: process.env.ENTRA_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
          prompt: "select_account" // Allow users to switch accounts
        }
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Optional: Validate allowed tenants
      if (ALLOWED_TENANTS.length > 0 && account?.tenant_id) {
        if (!ALLOWED_TENANTS.includes(account.tenant_id)) {
          console.log(`Tenant ${account.tenant_id} not in allowed list`)
          return false
        }
      }
      return true
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.tenantId = account.tenant_id
        token.roles = profile.roles || []
        token.jobTitle = profile.jobTitle
        token.department = profile.department
        token.isPersonalAccount = account.tenant_id === '9188040d-6c67-4c5b-b112-36a304b66dad'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).tenantId = token.tenantId
        (session.user as any).roles = token.roles
        (session.user as any).jobTitle = token.jobTitle
        (session.user as any).department = token.department
        (session.user as any).isPersonalAccount = token.isPersonalAccount
      }
      return session
    }
  }
})
```

### Personal + Organizational Accounts Configuration

**Environment Variables:**
```bash
# Personal + Organizational accounts
ENTRA_CLIENT_ID=your-client-id-here
ENTRA_CLIENT_SECRET=your-client-secret-here
ENTRA_TENANT_ID=common
ENTRA_SUPPORTS_PERSONAL_ACCOUNTS=true

# NextAuth.js configuration
NEXTAUTH_URL=https://myapp.com
NEXTAUTH_SECRET=your-secure-random-32-character-secret-here

# Common issuer for both account types
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/common/v2.0
```

---

## 🛠️ Implementation Guide

### Step 1: Create Authentication Configuration

Create **`auth.ts`** in project root:
```typescript
import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.ENTRA_CLIENT_ID!,
      clientSecret: process.env.ENTRA_CLIENT_SECRET!,
      tenantId: process.env.ENTRA_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email User.Read"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Add roles and additional claims to token
      if (account && profile) {
        token.roles = profile.roles || []
        token.jobTitle = profile.jobTitle
        token.department = profile.department
        token.isPersonalAccount = account.tenant_id === '9188040d-6c67-4c5b-b112-36a304b66dad'
      }
      return token
    },
    async session({ session, token }) {
      // Add token data to session
      if (session.user) {
        (session.user as any).roles = token.roles
        (session.user as any).jobTitle = token.jobTitle
        (session.user as any).department = token.department
        (session.user as any).isPersonalAccount = token.isPersonalAccount
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
})
```

### Step 2: Create API Routes

Create **`app/api/auth/[...nextauth]/route.ts`**:
```typescript
import { handlers } from "../../../../auth"

export const { GET, POST } = handlers
```

### Step 3: Authentication Helpers

Create **`lib/auth-helpers.ts`**:
```typescript
import { auth } from '../auth'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user as any
}

export async function userHasRoles(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!(user?.roles && user.roles.length > 0)
}

export async function userHasRole(requiredRole: string): Promise<boolean> {
  const user = await getCurrentUser()
  return !!(user?.roles && user.roles.includes(requiredRole))
}

export async function userHasAnyRole(requiredRoles: string[]): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user?.roles || user.roles.length === 0) return false
  return requiredRoles.some(role => user.roles.includes(role))
}

export async function isPersonalAccount(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.isPersonalAccount === true
}
```

### Step 4: Authentication Components

Create **`components/AuthButton.tsx`**:
```typescript
import { auth, signIn, signOut } from "../auth"

export default async function AuthButton() {
  const session = await auth()

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Signed in as {session.user.name || session.user.email}
        </span>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </form>
      </div>
    )
  }

  return (
    <form
      action={async () => {
        "use server"
        await signIn("microsoft-entra-id")
      }}
    >
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-semibold"
      >
        Sign In with Microsoft
      </button>
    </form>
  )
}
```

### Step 5: Create Middleware

Create **`middleware.ts`** in project root:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'

export async function middleware(request: NextRequest) {
  // Check authentication for protected routes
  if (
    request.nextUrl.pathname.startsWith('/protected') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    const session = await auth()
    
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/signin'
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

---

## 🔒 Security & Authentication

### Personal Account Detection Helper

```typescript
// lib/account-utils.ts
export function getAccountTypeMessage(isPersonal: boolean, hasRoles: boolean) {
  if (isPersonal) {
    return {
      type: 'info',
      title: 'Personal Account Detected',
      message: 'Personal Microsoft accounts don\'t support application roles. Some features may be limited.',
      suggestion: 'Use an organizational account for full functionality.'
    }
  }
  
  if (!hasRoles) {
    return {
      type: 'warning',
      title: 'No Roles Assigned',
      message: 'Your account doesn\'t have any roles assigned.',
      suggestion: 'Contact your administrator to request appropriate roles.'
    }
  }
  
  return null
}
```

### Session Management Configuration

```typescript
// auth.ts - Enhanced session configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, account, trigger }) {
      // Refresh token logic
      if (trigger === 'update' || (account && Date.now() < token.exp * 1000)) {
        return token
      }
      
      // Token has expired, attempt refresh
      if (token.refreshToken) {
        try {
          const response = await fetch(`https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.ENTRA_CLIENT_ID!,
              client_secret: process.env.ENTRA_CLIENT_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken,
            })
          })
          
          if (response.ok) {
            const newTokens = await response.json()
            token.accessToken = newTokens.access_token
            token.refreshToken = newTokens.refresh_token
            token.exp = Math.floor(Date.now() / 1000) + newTokens.expires_in
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          return null // Force re-authentication
        }
      }
      
      return token
    }
  }
})
```

---

## 👥 Role-Based Access Control

### App Roles Configuration

**App Roles Manifest Example:**
```json
{
  "appRoles": [
    {
      "allowedMemberTypes": ["User"],
      "description": "Administrator access to all features",
      "displayName": "Administrator",
      "id": "12345678-1234-1234-1234-123456789012",
      "isEnabled": true,
      "value": "Admin"
    },
    {
      "allowedMemberTypes": ["User"],
      "description": "Standard user access",
      "displayName": "User",
      "id": "87654321-4321-4321-4321-210987654321",
      "isEnabled": true,
      "value": "User"
    },
    {
      "allowedMemberTypes": ["User"],
      "description": "Read-only access to reports",
      "displayName": "Viewer",
      "id": "11111111-2222-3333-4444-555555555555",
      "isEnabled": true,
      "value": "Viewer"
    }
  ]
}
```

### Role-Based Route Protection

**Enhanced `middleware.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Check authentication for protected routes
  if (request.nextUrl.pathname.startsWith('/protected') ||
      request.nextUrl.pathname.startsWith('/admin')) {
    
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/signin'
      return NextResponse.redirect(url)
    }
  }
  
  // Admin routes require specific roles
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const user = session.user as any
    const hasAdminRole = user?.roles?.some((role: string) => 
      ['Admin', 'Administrator', 'Global Administrator'].includes(role)
    )
    
    if (!hasAdminRole) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

### Role-Based Components

**`components/RoleGuard.tsx`:**
```typescript
'use client'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = <div>Access Denied</div> 
}: RoleGuardProps) {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return fallback
  }
  
  const user = session.user as any
  const hasRole = user?.roles?.some((role: string) => 
    allowedRoles.includes(role)
  )
  
  if (!hasRole) {
    return fallback
  }
  
  return <>{children}</>
}
```

### Protected Page Examples

**Protected Page with Role Validation:**
```typescript
import Link from 'next/link'
import { getCurrentUser, isPersonalAccount, userHasRoles } from '@/lib/auth-helpers'

export default async function ProtectedPage() {
  const user = await getCurrentUser()
  const isPersonal = await isPersonalAccount()
  const hasRoles = await userHasRoles()

  // Show unauthorized for users without roles
  if (!hasRoles) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-red-600 mb-8">🚫 Unauthorized</h1>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-4">
              Access Denied
            </h2>
            <p className="text-red-700 mb-4">
              This page requires specific user roles to access detailed information.
            </p>
            <p className="text-red-600 text-sm">
              {isPersonal 
                ? "Personal Microsoft accounts don't support application roles. Please use an organizational account."
                : "You don't currently have any roles assigned. Contact your administrator for role assignments."
              }
            </p>
          </div>

          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  // Show detailed information for users with roles
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">🔒 Protected Page</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            This page is only accessible to authenticated users with roles.
          </h2>
          <p className="text-lg mb-4">
            You have access to view detailed information because you have assigned roles.
          </p>
        </div>

        {/* User Information Display */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-lg font-semibold text-center mb-4">User Information:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Name:</span>
                <span className="text-gray-800">{user?.name || 'Not available'}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="text-gray-800">{user?.email || 'Not available'}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Account Type:</span>
                <span className="text-gray-800">
                  {isPersonal ? 'Personal Microsoft Account' : 'Organizational Account'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {user?.jobTitle && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Job Title:</span>
                  <span className="text-gray-800">{user.jobTitle}</span>
                </div>
              )}
              
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Roles:</span>
                <span className="text-gray-800">
                  {user.roles?.join(', ') || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
```

---

## 🚀 Deployment

### Production Environment Configuration

**`.env.production`:**
```bash
# Production Microsoft Entra ID Configuration
ENTRA_CLIENT_ID=prod-client-id-here
ENTRA_CLIENT_SECRET=prod-client-secret-here
ENTRA_TENANT_ID=your-production-tenant-id
ENTRA_IS_MULTI_TENANT=false

# Production URLs
NEXTAUTH_URL=https://myapp.com
NEXTAUTH_SECRET=highly-secure-production-secret-minimum-32-chars

# Production-specific issuer
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/PROD-TENANT-ID/v2.0

# Optional: Enhanced security settings
ENTRA_TOKEN_ENDPOINT_AUTH_METHOD=client_secret_post
ENTRA_RESPONSE_MODE=form_post

# Logging and monitoring
LOG_LEVEL=error
ENABLE_AUTH_LOGGING=false
```

### Production Security Configuration

```typescript
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnProtected = nextUrl.pathname.startsWith('/protected')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      
      if (isOnProtected || isOnAdmin) {
        if (isLoggedIn) {
          // Additional role checks for admin routes
          if (isOnAdmin) {
            const user = auth.user as any
            const hasAdminRole = user?.roles?.some((role: string) => 
              ['Admin', 'Administrator', 'Global Administrator'].includes(role)
            )
            return hasAdminRole
          }
          return true
        }
        return false // Redirect unauthenticated users to login page
      }
      
      return true
    },
  },
  providers: [], // Providers added in auth.ts
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig
```

### Deployment Commands

```bash
# 1. Clone and install dependencies
git clone https://github.com/your-repo/nextjs-entraid-auth
cd nextjs-entraid-auth/example
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Azure app registration details

# 3. Run development server
npm run dev

# 4. Build for production
npm run build
npm start

# 5. Deploy to Vercel (example)
vercel --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

---

## 🧪 Testing

### Testing Checklist

**⚠️ Prerequisites for Role-Based Testing:**
Before testing role-based features, ensure you have:
1. **Created app roles** in Azure App Registration (Step 4)
2. **Assigned users to roles** in Enterprise Application (Step 5) - **This is critical!**
3. **Waited 5-10 minutes** for role assignments to propagate

```bash
✅ Homepage loads correctly
✅ Sign In with Microsoft button works
✅ Successful authentication redirects to homepage
✅ User information displays correctly
✅ User assigned to roles: Protected page shows user details
✅ User without role assignment: Protected page shows unauthorized
✅ User with admin role: Admin page shows admin dashboard
✅ User without admin role: Admin page shows unauthorized
✅ Sign out functionality works
✅ Error handling works correctly
```

### Cross-Browser Testing

```bash
✅ Chrome - Latest version
✅ Firefox - Latest version
✅ Safari - Latest version (if targeting Mac/iOS users)
✅ Edge - Latest version
✅ Mobile browsers - iOS Safari, Chrome Mobile
```

### Security Testing

```bash
# Security testing commands
npm audit
npm run test:security  # If you have security tests
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "AADSTS50011: The reply URL specified in the request does not match"

**Solution:**
```bash
# Check your redirect URIs in Azure App Registration
# They must exactly match your NEXTAUTH_URL + callback path

# Correct format:
https://myapp.com/api/auth/callback/microsoft-entra-id

# Common mistakes:
❌ http://myapp.com/api/auth/callback/microsoft-entra-id  # HTTP instead of HTTPS
❌ https://myapp.com/auth/callback/microsoft-entra-id    # Missing /api
❌ https://myapp.com/api/auth/callback/                  # Missing provider name
```

#### Issue 2: Roles Not Available in Token

**Enhanced Token Configuration:**
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.ENTRA_CLIENT_ID!,
      clientSecret: process.env.ENTRA_CLIENT_SECRET!,
      tenantId: process.env.ENTRA_TENANT_ID!,
      authorization: {
        params: {
          // Request roles in the token
          scope: "openid profile email User.Read",
          resource: process.env.ENTRA_CLIENT_ID, // Include app ID for roles
        }
      },
      // Explicitly request role claims
      profile: async (profile, tokens) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          roles: profile.roles || [],
          jobTitle: profile.jobTitle,
          department: profile.department,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        // Parse roles from access token if available
        if (account.access_token) {
          try {
            const payload = JSON.parse(
              Buffer.from(account.access_token.split('.')[1], 'base64').toString()
            )
            token.roles = payload.roles || []
          } catch (error) {
            console.log('Error parsing access token for roles:', error)
          }
        }
        
        if (profile) {
          token.roles = profile.roles || token.roles || []
          token.jobTitle = profile.jobTitle
          token.department = profile.department
        }
      }
      return token
    }
  }
})
```

#### Issue 3: Personal Accounts Can't Access Role-Based Features

This is expected behavior. Personal Microsoft accounts don't support application roles. Show appropriate messaging:

```typescript
export function getAccountTypeMessage(isPersonal: boolean, hasRoles: boolean) {
  if (isPersonal) {
    return {
      type: 'info',
      title: 'Personal Account Detected',
      message: 'Personal Microsoft accounts don\'t support application roles. Some features may be limited.',
      suggestion: 'Use an organizational account for full functionality.'
    }
  }
  
  if (!hasRoles) {
    return {
      type: 'warning',
      title: 'No Roles Assigned',
      message: 'Your account doesn\'t have any roles assigned.',
      suggestion: 'Contact your administrator to request appropriate roles.'
    }
  }
  
  return null
}
```

#### Issue 4: Port Conflicts

```bash
# The launch script automatically handles port cleanup
./launch-demo.sh

# Manual port cleanup if needed
lsof -ti:3000 | xargs kill -9
```

#### Issue 5: Windows Access Issues

```bash
# Run as Administrator (one-time setup)
setup-windows-proxy.bat

# Test connectivity
test-localhost-connection.sh
```

---

## 📚 API Reference

### Authentication Functions

#### `auth()`
Returns the current session or null if not authenticated.

```typescript
import { auth } from './auth'

const session = await auth()
if (session?.user) {
  console.log('User is authenticated:', session.user.email)
}
```

#### `signIn(provider, options?)`
Initiates the sign-in flow.

```typescript
import { signIn } from './auth'

// Basic sign-in
await signIn('microsoft-entra-id')

// Sign-in with redirect
await signIn('microsoft-entra-id', { redirectTo: '/dashboard' })
```

#### `signOut(options?)`
Signs out the current user.

```typescript
import { signOut } from './auth'

// Basic sign-out
await signOut()

// Sign-out with redirect
await signOut({ redirectTo: '/' })
```

### Helper Functions

#### `getCurrentUser()`
Returns the current authenticated user or null.

```typescript
import { getCurrentUser } from '@/lib/auth-helpers'

const user = await getCurrentUser()
if (user) {
  console.log('Current user:', user.name, user.roles)
}
```

#### `userHasRoles()`
Checks if the current user has any roles assigned.

```typescript
import { userHasRoles } from '@/lib/auth-helpers'

const hasRoles = await userHasRoles()
if (hasRoles) {
  // User has at least one role
}
```

#### `userHasRole(role: string)`
Checks if the current user has a specific role.

```typescript
import { userHasRole } from '@/lib/auth-helpers'

const isAdmin = await userHasRole('Admin')
if (isAdmin) {
  // User has Admin role
}
```

#### `userHasAnyRole(roles: string[])`
Checks if the current user has any of the specified roles.

```typescript
import { userHasAnyRole } from '@/lib/auth-helpers'

const hasAdminRole = await userHasAnyRole(['Admin', 'Administrator', 'Global Administrator'])
if (hasAdminRole) {
  // User has at least one admin role
}
```

#### `isPersonalAccount()`
Checks if the current user is using a personal Microsoft account.

```typescript
import { isPersonalAccount } from '@/lib/auth-helpers'

const isPersonal = await isPersonalAccount()
if (isPersonal) {
  // Show personal account limitations
}
```

### TypeScript Types

```typescript
interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  roles?: string[]
  jobTitle?: string
  department?: string
  tenantId?: string
  isPersonalAccount?: boolean
}

interface Session {
  user?: User
  expires: string
}
```

### Environment Variables Reference

```bash
# Required
ENTRA_CLIENT_ID=                    # Azure App Registration Client ID
ENTRA_CLIENT_SECRET=                # Azure App Registration Client Secret  
ENTRA_TENANT_ID=                    # Tenant ID or "common" for multi-tenant
NEXTAUTH_URL=                       # Your application URL
NEXTAUTH_SECRET=                    # Secure random string (32+ characters)

# Optional
AUTH_MICROSOFT_ENTRA_ID_ISSUER=     # Custom issuer URL
ENTRA_IS_MULTI_TENANT=              # "true" for multi-tenant support
ENTRA_SUPPORTS_PERSONAL_ACCOUNTS=   # "true" to support personal accounts
ALLOWED_TENANTS=                    # Comma-separated list of allowed tenant IDs

# Development
ENTRA_REDIRECT_URI=                 # Custom redirect URI (auto-generated if not set)
ENTRA_POST_LOGOUT_REDIRECT_URI=     # Post logout redirect (defaults to NEXTAUTH_URL)

# Security
ENTRA_TOKEN_ENDPOINT_AUTH_METHOD=   # Token endpoint authentication method
ENTRA_RESPONSE_MODE=                # Response mode (query, form_post, etc.)

# Logging
LOG_LEVEL=                          # Logging level (error, warn, info, debug)
ENABLE_AUTH_LOGGING=                # Enable authentication event logging
```

---

## 💡 What You Can Test

✅ **Demo Interface** - Complete UI with authentication buttons
✅ **Protected Routes** - Pages that require authentication  
✅ **Role-based Access** - Admin-only sections
✅ **Personal Account Detection** - Different messaging for personal vs organizational accounts
✅ **Responsive Design** - Mobile-friendly interface
✅ **Multi-tenant Support** - Support for multiple organizations
✅ **Token Management** - Automatic token refresh
✅ **Error Handling** - Comprehensive error pages and messaging

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and code of conduct.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this comprehensive guide
- **Microsoft Entra ID Documentation**: [Official Microsoft Docs](https://docs.microsoft.com/en-us/azure/active-directory/)
- **NextAuth.js Documentation**: [NextAuth.js Docs](https://next-auth.js.org)

---

*This comprehensive guide covers everything you need to implement Microsoft Entra ID authentication in your Next.js application. For questions or support, please check the troubleshooting section or create an issue in the repository.*