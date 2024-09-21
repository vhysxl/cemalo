import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                console.log("Google sign-in successful for:", user.email);
                return true;
            }
            return false; // Deny sign-ins for other providers
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.userEmail = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.email = token.userEmail;
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);