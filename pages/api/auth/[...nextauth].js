import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "/models/User";
import { mongooseConnect } from "/lib/mongoose";

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
                    console.log("Connecting to database...");
                    await mongooseConnect();
                    console.log("Database connected");

                    console.log("Checking if user exists...");
                    const userExist = await User.findOne({ email: user.email });
                    if (!userExist) {
                        console.log("User does not exist. Creating new user...");
                        await User.create({
                            name: user.name,
                            email: user.email,
                            avatar: user.image
                        });
                        console.log("New user created successfully");
                    } else {
                        console.log("User already exists");
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