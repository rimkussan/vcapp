import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

const config = {
  providers: [
    MicrosoftEntraID({
      clientId: process.env.ENTRA_CLIENT_ID!,
      clientSecret: process.env.ENTRA_CLIENT_SECRET!,
      tenantId: process.env.ENTRA_TENANT_ID!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Extract role information from the profile/token
      if (account && profile) {
        token.roles = profile.roles || [];
        token.groups = profile.groups || [];
        token.jobTitle = profile.jobTitle || null;
        token.department = profile.department || null;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role information to the session
      if (token && session?.user) {
        (session.user as any).roles = token.roles || [];
        (session.user as any).groups = token.groups || [];
        (session.user as any).jobTitle = token.jobTitle || null;
        (session.user as any).department = token.department || null;
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