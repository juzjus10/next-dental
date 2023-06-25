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
          include: { Patient: true, Doctor: true, Service: true },
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
        const { patient, appointment, service, doctor } = req.body;

        const {appointment_time, date_of_appointment} = appointment;


        console.log("Appointement Req Body:", req.body);
        const emailHtml = render(
          AppointmentEmail({ appointment_time, date_of_appointment })
        );

        console.log("patient", patient);

        if (!patient.id) {
          console.log("Patient has no ID, creating new patient");

          patient.id = uuid();
          const newPatient = await prisma.patient.create({
            data: {
              ...patient,
            },
          });
          console.log("Created new patient!", newPatient);
        }

        // check if date is available
        const appointment_available = await prisma.appointment.findFirst({
          where: {
            date_of_appointment: {
              equals: appointment.date_of_appointment,
            },
            appointment_time: {
              equals: appointment.appointment_time,
            },
            doctor_id: {
              equals: doctor.id,
            },
          },
          
        });

        if (appointment_available) {
          console.log("Appointment is already taken!", appointment_available);

          return res.status(400).json({
            message: "Appointment is already taken!",
          });
        }

        appointment.id = uuid();
        const res_appointment = await prisma.appointment.create({
          data: {
            ...appointment,
            Patient: {
              connect: { id: patient.id },
            },
            Service: {
              connect: { id: service.id },
            },
            Doctor: {
              connect: { id: doctor.id },
            },
          },
        });

        console.log("Created new appointment!", res_appointment);

      

        const emailResponse = await sendEmail(patient, emailHtml);
        console.log(emailResponse.response);
        return res.status(200).json({ appointment, emailResponse });
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
