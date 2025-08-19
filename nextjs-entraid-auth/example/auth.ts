import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

export const authConfig: NextAuthConfig = {
  providers: [
    MicrosoftEntraID({
      clientId: process.env.ENTRA_CLIENT_ID!,
      clientSecret: process.env.ENTRA_CLIENT_SECRET!,
      tenantId: process.env.ENTRA_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and user profile to the token
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      if (profile) {
        token.email = profile.email
        token.name = profile.name
        token.picture = profile.picture
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user = {
          ...session.user,
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string,
        }
        // Add access token to session if needed for API calls
        (session as any).accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)