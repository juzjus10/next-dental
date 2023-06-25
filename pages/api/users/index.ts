import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { hashSync } from "bcryptjs";
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
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    case "POST":
      try {
        const {
          firstname,
          lastname,
          middlename,
          user_level,
          email,
          username,
          password,
        } = req.body;

        // check if user already exists
        const userExists = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (userExists) {
          return res.status(400).json({ error: "Email already exists!" });
        }

        if (user_level === "doctor") {
          const user = await prisma.user.create({
            data: {
              id: uuidv4(),
              firstname,
              lastname,
              middlename,
              user_level,
              email,
              username,
              password: hashSync(password, 10),
              doctor: {
                create: {
                  id: uuidv4(),
                  firstname,
                  lastname,
                  middlename,
                  gender: "Male",
                  hire_date: new Date(),
                  dob: new Date(),
                },
              },
            },
          });
          return res.json(user);
        } else if ( user_level === "admin"){
          const user = await prisma.user.create({
            data: {
              id: uuidv4(),
              firstname,
              lastname,
              middlename,
              user_level,
              email,
              username,
              password: hashSync(password, 10),
             
            },
          });
          return res.json(user);
        } else {
          res.status(400).json({ error: "Invalid user level!" });
        }

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating User!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
