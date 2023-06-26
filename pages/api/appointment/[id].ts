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
        const appointment = await prisma.appointment.findUnique({
          where: { id },
          include: {
            Doctor: true,
            Patient: true,
            Service: true,
          },
        });

        if (!appointment) {
          return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json(appointment);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    case "PUT":
      try {
        const {
          status,
          appointment_time,
          date_of_appointment,
          doctor_id,
          patient_id,

          record_id,
          doctor_commission,
          amount_paid,
          balance,
        } = req.body;
        console.log("doctor_id", doctor_id);
        const id = req.query.id as string;

        const appointment = await prisma.appointment.update({
          where: { id },
          data: {
            status,
            appointment_time,
            date_of_appointment,
            patient_id,
            doctor_id,
          },
        });

        if( record_id) {
          const record = await prisma.records.update({
            where: { id: record_id },
            data: {
              doctor_commission: parseFloat(doctor_commission),
              amount_paid: parseFloat(amount_paid),
              balance,
            },
          });

          console.log("record", record);
        }
        

        res.json({ appointment });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Updating appointment!", error });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.query as { id: string };
        const appointment = await prisma.appointment.delete({
          where: { id },
        });
        res.json(appointment);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Deleting appointment!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
