import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import { getRolesForUser, isPersonalAccount } from "./src/config/role-mappings"

const config = {
  providers: [
    MicrosoftEntraID({
      clientId: process.env.ENTRA_CLIENT_ID!,
      clientSecret: process.env.ENTRA_CLIENT_SECRET!,
      tenantId: process.env.ENTRA_TENANT_ID!,
      authorization: {
        params: {
          scope: 'openid profile email User.Read',
        },
      },
      // Request additional profile information
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          roles: profile.roles || [],
          jobTitle: profile.jobTitle,
          department: profile.department,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Extract role information from the profile/token
      if (account && profile) {
        let claims: any = null;
        
        // Decode the ID token to extract roles
        if (account.id_token) {
          try {
            // Parse the JWT token (middle part contains claims)
            const idTokenParts = account.id_token.split('.');
            if (idTokenParts.length === 3) {
              claims = JSON.parse(Buffer.from(idTokenParts[1], 'base64').toString());
              console.log('ID Token Claims:', claims);
              
              // Roles can be in 'roles' or 'role' claim
              token.roles = claims.roles || (claims.role ? [claims.role] : []);
              
              // Also check for other role-related claims
              if (!token.roles.length && claims.wids) {
                // wids contains well-known app role IDs
                token.roles = claims.wids;
              }
            }
          } catch (error) {
            console.error('Error parsing ID token:', error);
          }
        }
        
        // Fallback to profile data
        token.roles = token.roles || (profile as any).roles || [];
        token.groups = (profile as any).groups || [];
        token.jobTitle = (profile as any).jobTitle || null;
        token.department = (profile as any).department || null;
        
        // If no roles found (common with personal accounts), use email-based mapping
        if ((!token.roles || token.roles.length === 0) && profile.email) {
          token.roles = getRolesForUser(profile.email);
          console.log('Using role mapping for:', profile.email, 'Roles:', token.roles);
        }
        
        // Store email and tenant info for later use
        token.email = profile.email;
        token.tenantId = claims?.tid || null;
        
        // Simple detection: if no roles are present in the token after all attempts,
        // it's likely a personal account where app roles aren't supported
        token.isPersonalAccount = !token.roles || token.roles.length === 0;
        
        // For debugging
        console.log('Final token roles:', token.roles);
        console.log('Tenant ID:', token.tenantId);
        console.log('Is personal account:', token.isPersonalAccount);
      }
      return token;
    },
    async session({ session, token }) {
      // Add role information to the session
      if (token && session?.user) {
        // If roles are still empty, try mapping again with email
        let roles = token.roles || [];
        if (roles.length === 0 && (token.email || session.user.email)) {
          roles = getRolesForUser(token.email as string || session.user.email);
        }
        
        (session.user as any).roles = roles;
        (session.user as any).groups = token.groups || [];
        (session.user as any).jobTitle = token.jobTitle || null;
        (session.user as any).department = token.department || null;
        (session.user as any).isPersonalAccount = token.isPersonalAccount;
        
        // Debug logging for session
        console.log('Session callback - token.isPersonalAccount:', token.isPersonalAccount);
        console.log('Session callback - session.user.isPersonalAccount:', (session.user as any).isPersonalAccount);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If redirecting from auth/signin, go to home page
      if (url === `${baseUrl}/auth/signin` || url.includes('/auth/signin')) {
        return baseUrl;
      }
      // Allow same-origin URLs
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default redirect to home page after successful sign in
      return baseUrl;
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)