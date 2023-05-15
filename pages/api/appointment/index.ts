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
        const appointments = await prisma.appointment.findMany({
          orderBy: { date_of_appointment: "asc" },
          include: { Patient: true, Doctor: true },
        });
        return res.status(200).json(appointments);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    case "POST":
      try {
        // const { status, appointment_time, date_of_appointment } = req.body;

        const id = uuidv4();

       // console.log(req.body);

        const existingAppointment = await prisma.appointment.findFirst({
          where: {
            AND: 
              {
                date_of_appointment: {
                  equals: new Date(date_of_appointment),
                },
                appointment_time: {
                  equals: appointment_time,
                },
              },
              
            
          },
        });

       // console.log(existingAppointment);

        if (!existingAppointment) {
          // create appointment
          // const appointment = await prisma.appointment.create({
          //   data: {
          //     id,
          //     status,
          //     appointment_time,
          //     date_of_appointment,
          //   },
          // });

          return res
            .status(200)
            .json({ message: "Appointment available!" });
        }
        return res.status(409).json({
          message: "Appointment already exists for the given date and time.",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating Appointment!" });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
