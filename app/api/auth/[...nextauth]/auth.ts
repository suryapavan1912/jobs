import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/utils/mongo';
import { User as UserModel } from '@/models/user';
import bcrypt from 'bcrypt';
import generateUniqueCustomId from '@/utils/customIdGenerator';

declare module 'next-auth' {
  interface Session {
    user: {
      userId: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }

  interface User {
    id: string;
    userId: string;
    name?: string | null;
    email?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        await connectToDatabase();
        const user = await UserModel.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password as string);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.userId,
          userId: user.userId,
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { name, email, image } = user;
        if (!email) return false;
        
        await connectToDatabase();
        try {
          let dbUser = await UserModel.findOne({ email });
          if (!dbUser) {
            dbUser = await UserModel.create({
              userId: "u" + generateUniqueCustomId(),
              name,
              email,
              googleId: user.id,
              profilePicture: image
            });
          } else if (!dbUser.googleId) {
            dbUser.googleId = user.id;
            if (!dbUser.userId) {
              dbUser.userId = "u" + generateUniqueCustomId();
            }
            await dbUser.save();
          }
          user.userId = dbUser.userId;
          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};