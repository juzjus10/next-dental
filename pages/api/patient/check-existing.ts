import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const {
          firstname,
          lastname,

          dob,
        } = req.body;

        // check if patient already exists
        const existingPatient = await prisma.patient.findFirst({
          where: {
            AND: [
              { firstname: { equals: firstname } },
              { lastname: { equals: lastname } },
              { dob: { equals: dob } },
            ],
          },
        });

        if (existingPatient) {
          //return the existing patient
          return res.status(200).json({
            message: "You already have a record in the database",
            patient: {
              id: existingPatient.id,
              email: existingPatient.email,
            },
          });
        }

        return res.status(200).json({ message: "Patient does not exist" });

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating Patient!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
