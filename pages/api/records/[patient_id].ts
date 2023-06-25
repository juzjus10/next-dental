import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const { patient_id } = req.query;
        const records = await prisma.records.findMany({
          where: {
            patient_id: patient_id as string,
          },
          include: {
            Patient: true,
            Doctor: true,
            items: true,
            Appointment: true,
          },
        });

        return res.status(200).json(records);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    case "DELETE":
      try {
        const { patient_id } = req.query;

        // Delete related record items first
        await prisma.recordItem.deleteMany({
          where: {
            record_id: patient_id as string,
          },
        });

        // Then delete the record
        const records = await prisma.records.delete({
          where: {
            id: patient_id as string,
          },
          include: {
            Appointment: true,
          }
        });

        return res.status(200).json(records);
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
