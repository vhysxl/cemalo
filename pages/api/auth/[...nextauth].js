export const maxDuration = 60;
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "/models/User";
import { connectDB } from "/lib/mongoose";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),



        CredentialsProvider({
            async authorize(credentials) {
                await connectDB();

                const { email, password } = credentials;

                const user = await User.findOne({ email })

                if (!user) {
                    throw new Error('User tidak ditemukan 😭');
                }

                if (password !== user.password || email !== user.email) {
                    throw new Error('Password dan email tidak sesuai 🤨');
                }

                return user;
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                try {
                    await connectDB();
                    const userExist = await User.findOne({ email: user.email });

                    if (!userExist) {
                        console.log("New user signing in, will create account after successful authentication");
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
                token.isNewUser = !(await User.findOne({ email: user.email }));
            }
            return token;
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;

            if (token.isNewUser) {
                try {
                    const response = await fetch('/api/google', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: session.user.name,
                            email: session.user.email,
                        })
                    });

                    if (!response.ok) {
                        console.error("Failed to create new user:", await response.text());
                    } else {
                        console.log("New user created successfully");
                    }
                } catch (error) {
                    console.error("Error creating new user:", error);
                }
            }

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