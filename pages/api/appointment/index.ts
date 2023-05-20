import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { render } from "@react-email/render";
import { AppointmentEmail } from "@/components/EmailTemplate/AppointmentEmail";

const sendInBlueKey = process.env.SIB_API_KEY;

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
      } catch (error: any) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }
    case "POST":
      try {
        const { patient, appointment: newAppointment } = req.body;

        const { appointment_time, date_of_appointment } = newAppointment;
       const emailHtml = render(
            AppointmentEmail({ appointment_time, date_of_appointment })
          );

        console.log(patient);

        if (patient.id) {
          console.log("Patient has an ID, connecting to existing patient");

          newAppointment.id = uuid();
          const appointment = await prisma.appointment.create({
            data: {
              ...newAppointment,
              Patient: {
                connect: { id: patient.id },
              },
            },
          });

         
          const emailResponse = await sendEmail(patient, emailHtml);
          console.log(emailResponse.response);
          return res.status(200).json({ appointment, emailResponse });
        } else {
          console.log("Patient has no ID, creating new patient");

          patient.id = uuid();
          const newPatient = await prisma.patient.create({
            data: {
              ...patient,
            },
          });

          newAppointment.id = uuid();
          const appointment = await prisma.appointment.create({
            data: {
              ...newAppointment,
              Patient: {
                connect: { id: newPatient.id },
              },
            },
          });
         
          const emailResponse = await sendEmail(newPatient, emailHtml);

          console.log(emailResponse.response);

          return res.status(200).json({ appointment, emailResponse });
        }
      } catch (error: any) {
        console.error(error);
        return res.status(500).json({
          message: "Error Creating Appointment!",
          error: error.message,
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function sendEmail(newPatient: any, htmlContent: any) {
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        name: "M.C. Dental Clinic",
        email: "email@mcdental.com",
      },
      to: [
        {
          email: newPatient.email,
          name: `${newPatient.firstname} ${newPatient.middlename} ${newPatient.lastname}`,
        },
      ],
      subject: `Appointment Confirmation`,
      htmlContent: htmlContent,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": sendInBlueKey,
      },
    }
  );

  return response.data;
}
