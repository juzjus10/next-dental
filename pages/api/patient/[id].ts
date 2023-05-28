import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  console.log(req.query.id);
  

  switch (method) {
    case "GET":
      try {
        const id = req.query.id as string;
        const patient = await prisma.patient.findUnique({
          where: { id },
            include: {
                Appointment: true,
                Records: true,
            },
        });

        if (!patient) {
          return res.status(404).json({ message: "Patient not found" });
        }

        return res.status(200).json(patient);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    case "PUT":
      try {
        const {
          firstname,
          lastname,
          middlename,
            address,
            
          age,
          sex,
          civil_status,
          dob,
          mobile_no,
          emergency_contact,
          emergency_mobile_no,
          medical_history,
        } = req.body;

        const id = req.query.id as string;

        const patient = await prisma.patient.update({
          where: { id },
          data: {
            firstname,
            lastname,
            middlename,
            address,
            age,
            sex,
            civil_status,
            dob,
            mobile_no,
            emergency_contact,
            emergency_mobile_no,
            medical_history,
          },
        });

        res.json(patient);

      }
      catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Updating Patient!", error});
      }
    break;
    case "DELETE":
      try {
        const { id } = req.query as { id: string };
        const patient = await prisma.patient.delete({
          where: { id },
        });
        res.json(patient);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Deleting Patient!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
