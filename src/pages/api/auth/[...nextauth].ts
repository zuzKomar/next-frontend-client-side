import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

async function refreshAccessToken(tokenObject: JWT) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await fetch(`${process.env.NEST_URL}/auth/refresh`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        mode: 'cors',
        credentials: 'include',
        Authorization: 'Bearer ' + tokenObject.refreshToken,
      },
    });

    const result = await tokenResponse.json();

    return {
      ...tokenObject,
      token: result.token,
      refreshToken: result.refreshToken,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials.email || !credentials.password) return null;
        const { email, password } = credentials;
        const res = await fetch(`${process.env.NEST_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          mode: 'cors',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401) {
          //Unauthorized
          return null;
        }

        const userText = await res.text();
        const user = JSON.parse(userText);
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: user.token,
          refreshToken: user.refreshToken,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      const userTmp: any = {
        ...user,
      };

      if (account) {
        token.user = userTmp;
        const tokenPayload = JSON.parse(
          Buffer.from(userTmp.token.split('.')[1], 'base64').toString(),
        );
        token.accessToken = userTmp.token;
        token.accessTokenExpiry = tokenPayload.exp;
        token.refreshToken = userTmp.refreshToken;
      }

      const shouldRefreshToken = Date.now() > parseInt(<string>token.accessTokenExpiry) * 1000;

      if (shouldRefreshToken) {
        token = await refreshAccessToken(token);
        return token;
      } else {
        return Promise.resolve(token);
      }
    },
    async session({ session, token }) {
      session.user = token.user;
      session.error = token.error;
      session.expires = token.expires;

      const tokenPayload = JSON.parse(atob(token.user.token.split('.')[1]));
      session.expires = new Date(tokenPayload.exp * 1000);
      console.log(session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export default NextAuth(authOptions);

export { handler as GET, handler as POST, handler as PATCH };
