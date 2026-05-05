import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginOrRegister = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        if (!isLoggedIn) return false;
        if (auth?.user?.role !== 'ADMIN') {
           return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }
      
      if (isOnLoginOrRegister) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
        return true;
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
