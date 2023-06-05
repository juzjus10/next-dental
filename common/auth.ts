import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compareSync } from "bcryptjs";
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
          throw new Error("Credentials not provided");
        }

      
        console.log(credentials);
        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });


        if (!user) {
          throw new Error("Invalid email or password");
        }
      
        const isPasswordValid = compareSync(credentials.password, user.password);
      
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
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
