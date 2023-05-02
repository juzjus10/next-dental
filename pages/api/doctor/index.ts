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
        const appointment = await prisma.doctor.findMany();

        return res.status(200).json(appointment);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    case "POST":
      try {
        const {  doctor_name, gender, dob, hire_date } = req.body;

        const id = uuidv4();

        const doctor = await prisma.doctor.create({
          data: {
            id,

            doctor_name,
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
