# Microsoft Entra ID Setup Guide

This guide walks you through setting up Microsoft Entra ID (formerly Azure AD) for use with the `@entraid/nextjs-auth` library.

## 📋 Prerequisites

- Azure subscription or Microsoft 365 tenant
- Administrative access to Azure Portal
- Basic understanding of OAuth 2.0 and OpenID Connect

## 🏗️ Step 1: Access Azure Portal

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Sign in with your administrative account
3. Search for "Azure Active Directory" or "Microsoft Entra ID"
4. Click on your directory

## 🎯 Step 2: Register Your Application

### 2.1 Create New App Registration

1. In the left sidebar, click **App registrations**
2. Click **New registration**
3. Fill in the following details:

   **Name**: `Your App Name` (e.g., "My Next.js App")
   
   **Supported account types**: Choose based on your needs:
   - **Single tenant**: Only users in your organization
   - **Multi-tenant**: Users in any organization
   - **Personal accounts**: Include consumer Microsoft accounts

   **Redirect URI**: 
   - Type: `Web`
   - Value: `http://localhost:3000/api/auth/callback` (for development)

4. Click **Register**

### 2.2 Note Important Values

After registration, note these values from the **Overview** page:
- **Application (client) ID**
- **Directory (tenant) ID**

## 🔑 Step 3: Create Client Secret

1. In your app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Add a description (e.g., "NextJS App Secret")
4. Choose an expiration period
5. Click **Add**
6. **Important**: Copy the secret value immediately - you won't see it again!

## 🔐 Step 4: Configure Authentication

### 4.1 Redirect URIs

1. Go to **Authentication** in your app registration
2. Add redirect URIs for all environments:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://your-domain.com/api/auth/callback`

### 4.2 Implicit Grant Settings

1. In the **Implicit grant and hybrid flows** section:
2. Check **ID tokens (used for implicit and hybrid flows)**
3. Click **Save**

### 4.3 Advanced Settings (Optional)

For enhanced security:
- Enable **Treat application as a public client**: `No`
- **Allow public client flows**: `No` (unless needed for mobile apps)

## 🔓 Step 5: API Permissions

### 5.1 Add Required Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Choose **Microsoft Graph**
4. Select **Delegated permissions**
5. Add these permissions:
   - `openid` (Sign users in)
   - `profile` (View users' basic profile)
   - `email` (View users' email address)
   - `User.Read` (Read user profile)

### 5.2 Grant Admin Consent

1. Click **Grant admin consent for [Your Org]**
2. Click **Yes** to confirm
3. Ensure all permissions show green checkmarks

## 👥 Step 6: App Roles (Optional)

For role-based access control:

### 6.1 Create App Roles

1. Go to **App roles**
2. Click **Create app role**
3. Fill in details for each role:

   **Example Admin Role:**
   - **Display name**: `Admin`
   - **Allowed member types**: `Users/Groups`
   - **Value**: `Admin`
   - **Description**: `Application administrators`
   - **Do you want to enable this app role?**: `Yes`

4. Repeat for other roles (Manager, User, etc.)

### 6.2 Assign Users to Roles

1. Go to Azure AD > **Enterprise applications**
2. Find your app and click on it
3. Go to **Users and groups**
4. Click **Add user/group**
5. Select users and assign roles

## 🌐 Step 7: Multi-tenant Configuration (Optional)

If you need multi-tenant support:

### 7.1 Update App Registration

1. Go to **Authentication**
2. Update **Supported account types** to multi-tenant
3. Update redirect URIs to use common endpoint

### 7.2 Publisher Domain (Required for Multi-tenant)

1. Go to **Branding & properties**
2. Set **Publisher domain** to a verified domain you own
3. This is required for multi-tenant apps

## 🚀 Step 8: Environment Configuration

Create your `.env.local` file with the values you collected:

```bash
# Required values from your app registration
ENTRA_CLIENT_ID=12345678-1234-1234-1234-123456789012
ENTRA_CLIENT_SECRET=your_secret_value_here
ENTRA_TENANT_ID=87654321-4321-4321-4321-210987654321

# Application URLs
NEXTAUTH_URL=http://localhost:3000
ENTRA_REDIRECT_URI=http://localhost:3000/api/auth/callback
ENTRA_POST_LOGOUT_REDIRECT_URI=http://localhost:3000

# Generate a secure random string (32+ characters)
ENTRA_COOKIE_SECRET=your_secure_random_32plus_character_string_here

# Optional: Custom scopes (comma-separated)
ENTRA_SCOPES=openid,profile,email,User.Read

# Optional: Multi-tenant settings
ENTRA_IS_MULTI_TENANT=false
# ENTRA_ALLOWED_TENANTS=tenant1-id,tenant2-id
```

## 🛡️ Step 9: Security Best Practices

### 9.1 Certificate Authentication (Recommended for Production)

Instead of client secrets, use certificates:

1. Go to **Certificates & secrets**
2. Click **Upload certificate**
3. Upload your public key (.cer, .pem, or .crt)
4. Update your application to use certificate authentication

### 9.2 Conditional Access (Optional)

Set up conditional access policies:

1. Go to Azure AD > **Security** > **Conditional Access**
2. Create policies to require MFA, trusted locations, etc.
3. Apply policies to your application

### 9.3 Application Permissions Audit

Regularly review:
- API permissions granted
- Admin consent requirements
- User assignments and roles
- Access logs and sign-in reports

## 🧪 Step 10: Testing Your Setup

### 10.1 Test Authentication Flow

1. Start your Next.js development server
2. Navigate to `http://localhost:3000`
3. Click sign-in and complete the OAuth flow
4. Verify user information is displayed correctly

### 10.2 Common Issues and Solutions

**"Invalid redirect URI"**
- Ensure URIs match exactly (including trailing slashes)
- Check protocol (http vs https)

**"AADSTS50011: The reply URL specified in the request does not match"**
- Add the exact redirect URI to your app registration
- Ensure no typos in the URL

**"AADSTS700016: Application not found"**
- Check your client ID is correct
- Ensure the app registration exists in the correct tenant

**"Invalid client secret"**
- Generate a new client secret
- Ensure no extra spaces or characters in environment variables

## 📊 Step 11: Monitoring and Maintenance

### 11.1 Sign-in Logs

Monitor authentication:
1. Go to Azure AD > **Monitoring** > **Sign-in logs**
2. Filter by your application
3. Review successful and failed sign-ins

### 11.2 App Registration Maintenance

Regular tasks:
- Rotate client secrets before expiration
- Review and update API permissions
- Update redirect URIs for new environments
- Monitor usage and audit logs

### 11.3 User Management

- Regularly review user assignments
- Update roles as organizational structure changes
- Remove access for departed users
- Monitor privileged role assignments

## 🚨 Troubleshooting Common Scenarios

### Multi-tenant Issues
- Verify publisher domain is set
- Check tenant restrictions
- Ensure proper consent flow

### Role Assignment Problems
- Verify app roles are created correctly
- Check user-to-role assignments in Enterprise Applications
- Ensure role claims are included in tokens

### Token Issues
- Verify token lifetime settings
- Check conditional access policies
- Ensure proper scopes are requested

## 📞 Getting Help

- **Azure Documentation**: [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- **Community Support**: [Microsoft Q&A](https://docs.microsoft.com/en-us/answers/topics/azure-active-directory.html)
- **Library Issues**: [GitHub Issues](https://github.com/your-org/nextjs-entraid-auth/issues)

## ✅ Checklist

Before going to production:

- [ ] App registration is configured correctly
- [ ] All redirect URIs are added for production domains
- [ ] Client secret is stored securely
- [ ] API permissions are granted and consented
- [ ] App roles are created and assigned (if needed)
- [ ] Multi-tenant settings are configured (if applicable)
- [ ] Security policies are in place
- [ ] Monitoring is set up
- [ ] Documentation is updated for your team

## 🎉 Next Steps

With your Entra ID setup complete, you can now:

1. Install and configure the `@entraid/nextjs-auth` library
2. Implement authentication in your Next.js application
3. Test the complete authentication flow
4. Deploy to production with confidence

Happy coding! 🚀