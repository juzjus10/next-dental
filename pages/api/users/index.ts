import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const users = await prisma.user.findMany();

        return res.status(200).json(users);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    case "POST":
      try {
        const {
          firstname,
          lastname,
          middlename,
          user_level,
          email,
          doctor,
          patient,
          username,
          password,
        } = req.body;

        const id = uuidv4();

        const user = await prisma.user.create({
          data: {
            id,
            firstname,
            password: await hash(password, 10),
            username,
            lastname,
            middlename,
            user_level,
            email,
          },
        });

        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating User!" });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
