# Security Setup Instructions

## Environment Configuration

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values in `.env.local`:**
   - Get `ENTRA_CLIENT_ID` from your Azure App Registration
   - Get `ENTRA_CLIENT_SECRET` from your Azure App Registration  
   - Set `ENTRA_TENANT_ID` to your tenant ID or "common" for multi-tenant
   - Generate secure random strings for `NEXTAUTH_SECRET` and `ENTRA_COOKIE_SECRET`

3. **Generate secure secrets:**
   ```bash
   # Generate random 32-character strings
   openssl rand -base64 32
   ```

## Important Security Notes

- **NEVER commit `.env.local` or any `.env.*` files**
- **Regenerate all secrets** if they were accidentally committed
- **Use different secrets** for development, staging, and production
- **Rotate secrets regularly** in production environments

## Azure App Registration Security

- Use **least privilege principle** for API permissions
- Configure **correct redirect URIs** only
- Enable **certificate-based authentication** for production
- Set up **Conditional Access policies** where appropriate