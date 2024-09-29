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

                const user = await User.findOne({ email });

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
            await connectDB();
            let dbUser;

            if (account?.provider === 'google') {
                dbUser = await User.findOne({ email: user.email });

                if (!dbUser) {
                    dbUser = await User.create({
                        name: user.name,
                        email: user.email,
                        avatar: user.image, 
                    });
                    console.log("New user created successfully");
                }
            } else {
                dbUser = await User.findOne({ email: user.email });
            }

            if (!dbUser) {
                console.error("Failed to find or create user in database");
                return false;
            }

            user._id = dbUser._id.toString();
            user.avatar = dbUser.avatar; 
            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                token._id = user._id;
                token.avatar = user.avatar; 
            }
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }
            return token;
        },

        async session({ session, token }) {
            if (token._id) {
                session.user._id = token._id;
            }
            session.user.accessToken = token.accessToken;

            
            if (token.avatar) {
                session.user.avatar = token.avatar;
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
