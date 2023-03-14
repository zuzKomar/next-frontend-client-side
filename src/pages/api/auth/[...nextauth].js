import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshAccessToken(tokenObject) {
  //console.log('param', tokenObject)
  try {
    console.log(process.env.NEST_URL)
      // Get a new set of tokens with a refreshToken
      const tokenResponse = await fetch(`${process.env.NEST_URL}auth/refresh`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tokenObject.refreshToken
        }
      });

      const result = await tokenResponse.json();
      //console.log('token responseResult', result);

      return {
          ...tokenObject,
          accessToken: result.token,
          refreshToken: result.refreshToken
      }
  } catch (error) {
      return {
          ...tokenObject,
          error: "RefreshAccessTokenError",
      }
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')    
      id: 'credentials',  
      name: 'my-project',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      // The credentials is used to generate a suitable form on the sign in page.      
      // You can specify whatever fields you are expecting to be submitted.      
      // e.g. domain, username, password, 2FA token, etc.      
      // You can pass any HTML attribute to the <input> tag through the object.      
      async authorize(credentials, req) {
        const payload = {
          email: req.body.email,
          password: req.body.password,
        };

        const res = await fetch(`${process.env.NEST_URL}auth/login`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const user = await res.json();

        if (!res.ok) {
          throw new Error(user.message);
        }
        // If no error and we have user data, return it        
        if (res.ok && user) {
          //console.log('1. odpowiedz z logowania', user);
          const tokenPayload = JSON.parse(atob(user.token.split('.')[1]));
          const isExpited = Date.now() > tokenPayload.exp * 1000;
          //console.log(new Date(tokenPayload.exp * 1000))
          return user;
        }
        // Return null if user data could not be retrieved        
        return null;
      },
    }),
    // ...add more providers here  
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      //user is defined during login ONLY
      // console.log('jwt callback: ')
      // console.log('token', token);
      // console.log('user', user);
      // console.log('account', account)

      if(account && user){
        token.userId = user.id;
        token.user = user.firstName + ' ' + user.lastName;
        token.accessToken = user.token;
        token.accessTokenExpiry = token.exp;
        token.refreshToken = user.refreshToken;
      }
      //Math.round((1676926364 - 900000)-Date.now())
      //const shouldRefreshTime = Math.round((token.accessTokenExpiry - 900000) - Date.now());
      //const shouldRefreshTime = Date.now()-60000 >= (token.accessTokenExpiry * 1000)
      const tokenPayload = JSON.parse(atob(token.accessToken.split('.')[1]));
      //console.log('data w jwt callbacku', new Date(tokenPayload.exp * 1000));
      const shouldRefreshToken =  Date.now() > tokenPayload.exp * 1000;
      if(shouldRefreshToken){
        //console.log('call po nowy accessToken');
        token = await refreshAccessToken(token);
        //console.log('refreshAccessToken execution result: ', token);
        return token;
      }else {
        //console.log('accessToken aktualny');
        return Promise.resolve(token);
      }
    },
    async session({ session, token, user }) {
      //console.log('token in session callback', token);
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.error = token.error;
      session.user.id = token.userId;
      session.user.name = token.user;
      
      const tokenPayload = JSON.parse(atob(token.accessToken.split('.')[1]));
      session.expires = new Date(tokenPayload.exp * 1000);
      //console.log('session after eventual improvements', session);
      return session;
    }
  },
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"    
    brandColor: '', // Hex color code #33FF5D    
    logo: '/logo.png', // Absolute URL to image  
  },
  // Enable debug messages in the console if you are having problems  
  debug: process.env.NODE_ENV === 'development',
});