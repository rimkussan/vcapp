# Important: Microsoft Entra ID Redirect URI for NextAuth.js

When using NextAuth.js, the redirect URI in your Microsoft Entra ID app registration must be:

```
http://localhost:3000/api/auth/callback/microsoft-entra-id
```

This is different from the custom implementation which used:
- Old: `http://localhost:3000/api/auth/callback/azure-ad`
- New: `http://localhost:3000/api/auth/callback/microsoft-entra-id`

## Update Your App Registration

1. Go to Azure Portal → Microsoft Entra ID → App registrations
2. Select your application
3. Go to "Authentication"
4. Update or add the redirect URI:
   - `http://localhost:3000/api/auth/callback/microsoft-entra-id`
5. Save the changes

The provider ID in NextAuth.js for Microsoft Entra ID is `microsoft-entra-id`, which determines the callback URL.