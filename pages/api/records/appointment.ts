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
        const { appointment_id } = req.query;
        const records = await prisma.records.findFirst({
          where: {
            Appointment: {
                id: appointment_id as string,
            }
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
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
