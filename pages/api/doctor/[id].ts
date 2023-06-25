import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";


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
        const doctor = await prisma.doctor.findUnique({
          where: { id },
          include: {
            Appointment: true,
            Records: true,
          },
        });

        if (!doctor) {
          return res.status(404).json({ message: "Doctor not found" });
        }

        return res.status(200).json(doctor);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    case "PUT":
      try {
        const { firstname, middlename, lastname, gender, dob, hire_date } =
          req.body;

        const id = req.query.id as string;

        const doctor = await prisma.doctor.update({
          where: { id },
          data: {
            firstname,
            middlename,
            lastname,
            gender,
            dob,
            hire_date,
          },
        });

        res.json(doctor);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Updating Doctor!", error });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.query as { id: string };

        await prisma.recordItem.deleteMany({
          where: { record: { doctor_id: id } },
        });

        
        // Delete related records first
        await prisma.records.deleteMany({
          where: { doctor_id: id },
        });
        // also delete the record items related to the record
      
        // Then delete the doctor
        const doctor = await prisma.doctor.delete({
          where: { id },
        });
        res.json(doctor);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Deleting Doctor!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
