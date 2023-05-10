import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { appointment_time, date_of_appointment, status } = req.body;

  switch (method) {
    case "GET":
      try {
        const existingAppointment = await prisma.appointment.findFirst({
          where: {
            date_of_appointment: {
              equals: new Date(date_of_appointment),
            },
            appointment_time: {
              equals: appointment_time,
            },
          },
        });
        if (existingAppointment) {
          return res
            .status(409)
            .json({
              message:
                "Appointment already exists for the given date and time.",
            });
        }

        const id = uuidv4();
        // Create a new appointment
        const appointment = await prisma.appointment.create({
          data: {
            id,
            date_of_appointment: new Date(date_of_appointment),
            appointment_time,
            status,
          },
        });
        return res.status(201).json(appointment);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    case "POST":
      try {
        const {
          status,
          appointment_time,
          date_of_appointment,
          doctor_id,
          patient_id,
        } = req.body;

        const id = uuidv4();

        const user = await prisma.appointment.create({
          data: {
            id,
            status,
            appointment_time,
            date_of_appointment,
            patient_id,
            doctor_id,
          },
        });

        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating User!" });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
