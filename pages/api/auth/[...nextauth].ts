import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/lib/prisma';


export default NextAuth({
    providers: [
        CredentialsProvider({
        name: 'Email and Password',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          const { email, password } = credentials as { email: string; password: string }
  
          // Check if the email and password are valid
          const user = await prisma.user.findUnique({
            where: { email },
          });
  
          if (!user || user.password !== password) {
            // Return null if authentication failed
            return null;
          }
  
          // Return the user object if authentication succeeded
          return { id: user.id, email: user.email };
        },
      }),
    ],
    callbacks: {
      async signIn(user) {
        // Create a new user in the database if they don't exist
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
  
        if (!existingUser) {
          await prisma.user.create({
            data: { email: user.email, password: null }, // Set password to null for now
          });
        }
  
        return true;
      },
    },
  });