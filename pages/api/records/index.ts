import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Joi from "joi";
import { type } from "os";

const schema = Joi.object({
  date: Joi.date().required(),
  doctor_notes: Joi.string().optional(),
  patientId: Joi.string().required(),
  cost: Joi.number().optional(),
  items: Joi.array().items(Joi.object()),
  doctorId: Joi.string().required(),
  total_amount: Joi.number().optional(),
  amount_paid: Joi.number().required(),
  balance: Joi.number().optional(),
  doctor_commission: Joi.number().required(),
  appointment_id: Joi.string().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const record = await prisma.records.findMany({
          include: {
            items: true,
            Appointment: true,
          },
        });

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

          items,
          doctorId,
          total_amount,

          appointment_id,
        } = req.body;

        console.log("req.body", req.body);

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
            date,
            doctor_notes,
            patient_id: patientId,
            doctor_id: doctorId,
            total_amount: total_amount,
            amount_paid: 0,
            balance: 0,
            doctor_commission: 0,
            Appointment: {
              connect: {
                id: appointment_id,
              },
            },
            items: {
              //create items with new id
              create: items.map((item: any) => ({
                id: uuidv4(),
                name: item.name,
                cost: item.cost,
                date: date,
              })),
            },
          },
        });

        const appointment = await prisma.appointment.update({ 
          where: { id: appointment_id },
          data: {
            status: "payment"
          }
        })
        res.status(200).json({ message: "Record created and appointment updated!", record });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating Record!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
