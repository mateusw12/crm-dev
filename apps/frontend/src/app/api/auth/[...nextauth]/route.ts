import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { SignJWT } from 'jose';

const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days
const TOKEN_REFRESH_THRESHOLD_MS = 24 * 60 * 60 * 1000; // refresh when < 1 day left

async function createAccessToken(payload: {
  sub?: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
}) {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
  return new SignJWT({
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY_SECONDS}s`)
    .sign(secret);
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account }) {
      // ── First login: create the backend JWT and record its expiry ──
      if (account) {
        const accessToken = await createAccessToken(token);

        // Sync user with backend on first login
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
          await fetch(`${apiUrl}/auth/signin`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch {
          console.error('Failed to sync user with backend on sign-in');
        }

        return {
          ...token,
          accessToken,
          accessTokenExpires: Date.now() + TOKEN_EXPIRY_SECONDS * 1000,
          error: undefined,
        };
      }

      const expiresAt = token.accessTokenExpires as number | undefined;

      // ── Token has already expired ──
      if (expiresAt && Date.now() > expiresAt) {
        return { ...token, error: 'TokenExpired' as const };
      }

      // ── Token is still valid with plenty of time left ──
      if (expiresAt && Date.now() < expiresAt - TOKEN_REFRESH_THRESHOLD_MS) {
        return token;
      }

      // ── Token is expiring soon: silently refresh it ──
      try {
        const accessToken = await createAccessToken(token);
        return {
          ...token,
          accessToken,
          accessTokenExpires: Date.now() + TOKEN_EXPIRY_SECONDS * 1000,
          error: undefined,
        };
      } catch {
        return { ...token, error: 'TokenExpired' as const };
      }
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).error = token.error;
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
