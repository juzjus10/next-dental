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
