import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Joi from "joi";
import { type } from "os";

const schema = Joi.object({
  amount_paid: Joi.number().required(),
  balance: Joi.number().required(),
  commission: Joi.number().required(),
  patient_id: Joi.string().required(),
  doctor_id: Joi.string().required(),
  
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
        const { amount_paid, balance, commission, patient_id, doctor_id } =
          req.body;

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
            amount_paid,
            balance,
            commission,
            patient_id,
            doctor_id,
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
