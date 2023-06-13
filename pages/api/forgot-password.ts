import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { sendPasswordResetEmail } from "./sendPasswordReset";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { email } = req.body;

        // Check if user with email exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }

        // Generate password reset token
        const token = randomBytes(32).toString("hex");

        
        const tokenExpiration = new Date(Date.now() + 3600000); // Token expires in 1 hour
        await prisma.user.update({
          where: { email },
          data: {
            passwordResetToken: token,
            passwordResetTokenExpiration: tokenExpiration,
          },
        });

        // Send password reset email
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
        await sendPasswordResetEmail(email, resetUrl);

        return res.status(200).json({ message: "Password reset email sent" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}