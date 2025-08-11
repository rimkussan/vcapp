# Entra ID Next.js Authentication Example

This example demonstrates how to implement Microsoft Entra ID authentication in a Next.js application using the `@entraid/nextjs-auth` library.

## Features Demonstrated

- 🔐 **OAuth 2.0 + OpenID Connect** authentication flow
- 🍪 **Secure session management** with HttpOnly cookies
- 🛡️ **CSRF protection** for form submissions
- 👥 **Role-based access control** with middleware
- 🔒 **Protected routes** requiring authentication
- 👑 **Admin-only pages** with role requirements
- 📱 **Responsive UI** with Tailwind CSS

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. A Microsoft Entra ID (Azure AD) tenant
3. An app registration in your Entra ID tenant

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your values:
   ```bash
   ENTRA_CLIENT_ID=your_client_id_here
   ENTRA_CLIENT_SECRET=your_client_secret_here
   ENTRA_TENANT_ID=your_tenant_id_here
   NEXTAUTH_URL=http://localhost:3000
   ENTRA_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ENTRA_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
   ENTRA_COOKIE_SECRET=your_32_character_secret_here_minimum_length
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...auth]/route.ts    # Auth API endpoints
│   ├── admin/page.tsx                 # Admin-only page
│   ├── protected/page.tsx             # Authentication required
│   ├── login/page.tsx                 # Custom login page
│   ├── unauthorized/page.tsx          # Access denied page
│   └── page.tsx                       # Home page
├── components/
│   └── AuthButton.tsx                 # Authentication UI component
├── lib/
│   └── auth.ts                        # Auth configuration
└── middleware.ts                      # Route protection middleware
```

## Entra ID App Registration

### Required Configuration

1. **Redirect URIs:**
   - `http://localhost:3000/api/auth/callback` (development)
   - `https://your-domain.com/api/auth/callback` (production)

2. **API Permissions:**
   - `openid`
   - `profile`
   - `email`
   - `User.Read`

3. **Authentication:**
   - Enable "ID tokens" under implicit grant and hybrid flows

### Optional: Role-based Access Control

To test the admin functionality:

1. **Create App Roles:**
   - Go to your app registration
   - Navigate to "App roles"
   - Create a role named "Admin"

2. **Assign Users:**
   - Go to "Enterprise applications"
   - Find your app and go to "Users and groups"
   - Assign users to the "Admin" role

## Testing the Application

### Authentication Flow

1. Visit the home page
2. Click "Sign In" to authenticate with Microsoft
3. Complete the OAuth flow
4. You'll be redirected back to the application

### Protected Routes

- **`/protected`** - Requires authentication
- **`/admin`** - Requires authentication + "Admin" role

### API Endpoints

- **`/api/auth/signin`** - Initiate sign-in
- **`/api/auth/callback`** - OAuth callback
- **`/api/auth/signout`** - Sign out
- **`/api/auth/me`** - Get current user info
- **`/api/auth/refresh`** - Refresh tokens

## Customization

### Adding Custom Claims

Modify `src/lib/auth.ts`:

```typescript
import { ClaimsMapper, defaultClaimMappings } from '@entraid/nextjs-auth';

const customMapper = new ClaimsMapper([
  ...defaultClaimMappings,
  {
    source: 'department',
    target: 'userDepartment'
  }
]);

export const auth = createEntraIdAuth({ 
  config, 
  claimsMapper: customMapper 
});
```

### Route-Specific Protection

Update `middleware.ts` to add more protected routes:

```typescript
if (request.nextUrl.pathname.startsWith('/manager')) {
  const managerMiddleware = createAuthMiddleware({
    config,
    requireAuth: true,
    requiredRoles: ['Manager', 'Admin'],
  });
  return managerMiddleware(request);
}
```

## Deployment

### Environment Variables

Set these in your deployment platform:

```bash
ENTRA_CLIENT_ID=your_production_client_id
ENTRA_CLIENT_SECRET=your_production_client_secret
ENTRA_TENANT_ID=your_tenant_id
NEXTAUTH_URL=https://your-domain.com
ENTRA_REDIRECT_URI=https://your-domain.com/api/auth/callback
ENTRA_POST_LOGOUT_REDIRECT_URI=https://your-domain.com
ENTRA_COOKIE_SECRET=your_secure_random_string_32plus_chars
```

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in the Vercel dashboard
3. Update redirect URIs in your Entra ID app registration
4. Deploy!

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure redirect URI exactly matches what's configured in Entra ID
   - Check for trailing slashes and correct protocol (http vs https)

2. **"CSRF token mismatch"**
   - Ensure `ENTRA_COOKIE_SECRET` is set and at least 32 characters
   - Clear browser cookies and try again

3. **"Insufficient permissions"**
   - Check that required API permissions are granted in Entra ID
   - Ensure admin consent is provided if required

4. **Session not persisting**
   - Verify `NEXTAUTH_URL` matches your domain exactly
   - Check that cookies are being set (use browser dev tools)

### Debug Mode

Add this to your `.env.local` for detailed logging:

```bash
NODE_ENV=development
```

## Next Steps

- Implement user profile management
- Add more granular permissions
- Set up automated testing
- Configure monitoring and analytics
- Add multi-tenant support

## Support

- 📚 [Main Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/your-org/nextjs-entraid-auth/issues)
- 💬 [Discussions](https://github.com/your-org/nextjs-entraid-auth/discussions)