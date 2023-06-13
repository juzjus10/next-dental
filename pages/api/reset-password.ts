import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { token, password } = req.body;
        // Find user with matching password reset token
        const user = await prisma.user.findFirst({
          where: { passwordResetToken: token },
        });
        if (!user) {
          return res.status(400).json({ message: "Invalid token" });
        }

        // Verify that password reset token has not expired
        const tokenExpiration = user.passwordResetTokenExpiration
          ? new Date(user.passwordResetTokenExpiration)
          : null;
        if (tokenExpiration && Date.now() > tokenExpiration.getTime()) {
          return res.status(400).json({ message: "Token has expired" });
        }

        // Hash new password and update user's password in database
        const hashedPassword = await hash(password, 12);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });

        // Clear password reset token and expiration in database
        await prisma.user.update({
          where: { id: user.id },
          data: {
            passwordResetToken: null,
            passwordResetTokenExpiration: null,
          },
        });

        return res.status(200).json({ message: "Password reset successful" });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
