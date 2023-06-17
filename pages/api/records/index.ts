import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Joi from "joi";
import { type } from "os";

const schema = Joi.object({
  procedure: Joi.string().required(),
  date: Joi.date().required(),
  doctor_notes: Joi.string().optional(),
  patientId: Joi.string().required(),
  service_rendered: Joi.string().optional(),
  cost: Joi.number().optional(),
  items: Joi.array().items(Joi.object()),
  doctorId: Joi.string().required(),
  total_amount: Joi.number().optional(),
  amount_paid: Joi.number().required(),
  balance: Joi.number().optional(),
  doctor_commission: Joi.number().required(),
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
        const {
          procedure,
          doctor_notes,
          date,
          patientId,
          cost,
          items,
          doctorId,
          total_amount,
          balance,
          amount_paid,
          doctor_commission,
          
        } = req.body;

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
            procedure,
            date,
            doctor_notes,
            patient_id: patientId,
            doctor_id: doctorId,
            total_amount: total_amount,
            amount_paid: amount_paid ,
            balance: balance ,
            doctor_commission: doctor_commission ,
            items: {
              //create items with new id 
              create: items.map((item: { service_rendered: any; cost: any; }) => ({
                id: uuidv4(),
                service_rendered: item.service_rendered,
                cost: item.cost,
              })),
              
            },
           
          
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
