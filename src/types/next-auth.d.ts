import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      token: string;
      refreshToken: string;
    };
    error: string;
    expires: Date;
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      token: string;
      refreshToken: string;
    };
    error: string;
    expires: Date;
  }
}
