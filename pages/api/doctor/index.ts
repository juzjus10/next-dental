import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const doctor = await prisma.doctor.findMany({
          include: {
            Records: true,
          },
        });

        return res.status(200).json(doctor);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    case "POST":
      try {
        const { firstname, lastname, middlename, gender, dob, hire_date } =
          req.body;

        const id = uuidv4();

        const doctor = await prisma.doctor.create({
          data: {
            id,
            firstname,
            lastname,
            middlename,
            gender,
            dob,
            hire_date,
          },
        });

        res.json(doctor);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating Doctor!" });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
