import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Joi from "joi";
import { type } from "os";

const schema = Joi.object({
  procedure: Joi.string().required(),
  doctor_notes: Joi.string().required(),
  date: Joi.date().required(),
  patientId: Joi.string().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const record = await prisma.records.findMany();

        return res.status(200).json(record);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    case "POST":
      try {
        const { procedure, doctor_notes, date, patientId } = req.body;

        // validate the request body against the schema
        const { error, value } = schema.validate(req.body, {
          abortEarly: false,
        });
        if (error) {
          return res.status(400).json({
            message: "Validation error",
            details: error.details.map((d) => d.message),
          });
        }

        const record = await prisma.records.create({
          data: {
            id: uuidv4(),
            procedure,
            doctor_notes,
            date,
            patient_id: patientId,
          },
        });

        res.status(200).json({ message: "Record created", record });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating Record!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
