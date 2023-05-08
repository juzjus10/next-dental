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
        const patient = await prisma.settings.findUnique({
          where: { id },
        });

        if (!patient) {
          return res.status(404).json({ message: "Settings not found" });
        }

        return res.status(200).json(patient);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    case "PUT":
      try {
        const {
          opening_time,
          closing_time,
          clinic_name,
          clinic_address,
          clinic_contact,
        } = req.body;

        const id = req.query.id as string;

        const settings = await prisma.settings.update({
          where: { id },
          data: {
            opening_time,
            closing_time,
            clinic_name,
            clinic_address,
            clinic_contact,
          },
        });

        res.json(settings);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Updating Settings!", error });
      }
      break;
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
