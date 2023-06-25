import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  console.log(req.query.id);
  

  // get id from url 
  
  switch (method) {
    case "GET":
      try {
        const id = req.query.id as string;
        const user = await prisma.user.findUnique({
          where: { id },
          include: { 
            doctor: true,
            
          }
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
      }
    case "PUT":
      try {
        const {
          id,
          username,
          password,
          firstname,
          lastname,
          middlename,
          user_level,
          email,
        } = req.body;
        const user = await prisma.user.update({
          where: { id },
          data: {
            username,
            password,
            firstname,
            lastname,
            middlename,
            user_level,
            email,
          },
        });
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Updating User!", error });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.query;
        const user = await prisma.user.delete({
            where: { id: String(id) },
            
        });



        res.json({user});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Deleting User!", error });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
