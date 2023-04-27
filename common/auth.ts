import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
        credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: Record<string, string>) => {
        if (!credentials) {
          return null;
        }
        let user = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });
        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }
        console.log(user);
        
        return user;
      },
      
    }),
  ],
  callbacks: {
    jwt : async (token, user) => {
      console.log('JWT Callback ', user, token);
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async (session, user) => {
      console.log('Session Callback ', user, session);
      session.id = user.id;
      return session;
    },
  },
  debug: true,
};


