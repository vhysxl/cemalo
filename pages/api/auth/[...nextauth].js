import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { mongooseConnect } from '/lib/mongoose';
import User from '/models/User';
export default NextAuth({
    session: {
        strategy: 'jwt',
    },

    secret: process.env.secret,

    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                await mongooseConnect();

                const { email, password } = credentials;

                const user = await User.findOne({ email });

                if (!user) {
                    throw new Error('User tidak ditemukan');
                }

                if (password !== user.password) {
                    throw new Error('Password Salah');
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
    },

});