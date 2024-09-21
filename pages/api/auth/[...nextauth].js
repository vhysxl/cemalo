import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "/models/User";
import { connectDB } from "/lib/mongoose";

let dbConnected = false;

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                try {
                    if (!dbConnected) {
                        await connectDB();
                        dbConnected = true;
                    }
                    const userExist = await User.findOne({ email: user.email });
                    if (!userExist) {
                        // Create user here instead of in session callback
                        await User.create({
                            name: user.name,
                            email: user.email,
                        });
                        console.log("New user created successfully");
                    }
                    return true;
                } catch (error) {
                    console.error("Sign-in error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
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