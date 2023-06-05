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
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: Record<"email" | "username" | "password", string> | undefined) => {
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
    
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.email = user.email;
        token.user_level = user.user_level;
      }
      return token;
    },
    async session({session, token}) {
      if (token) {
        session.user= token;
      }
      return session;
      
    },
  },
  jwt: {
    secret: "testables",
  },
  debug: true,
};
