import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

interface AppointmentWithDuration {
  appointment_time: Date;
  appointment_end_time: Date;
  Service: {
    duration: number;
  };
  range: string[];
}

const generateRange = (
  startTime: string,
  endTime: string,
  interval: number
) => {
  const start = moment(startTime, "h:mm A");
  const end = moment(endTime, "h:mm A");

  const result = [];
  let current = moment(start);

  while (current <= end) {
    result.push(current.format("h:mm A"));
    current.add(interval, "minutes");
  }

  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {

    const { doctor_id, date_of_appointment } = req.body;
    if (!doctor_id || !date_of_appointment) {
      return res
        .status(400)
        .json({ message: "Missing doctor_id or date_of_appointment" });
    }
    

    const now = new Date(date_of_appointment);

    const settings = await prisma.settings.findFirst();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    const { opening_time, closing_time } = settings;

    const appointments = await prisma.appointment.findMany({
      where: {
        date_of_appointment: {
          gte: new Date(now.setHours(0, 0, 0, 0)).toISOString(),
          lt: new Date(now.setHours(23, 59, 59, 999)).toISOString(),
        },
        doctor_id: doctor_id,
      },
      include: {
        Service: true,
      },
    });

    // get the duration of each appointment by adding the service duration to the appointment time
    const appointmentsWithDuration = appointments.map((appointment) => {
      if (!appointment.Service) {
        return appointment;
      }

      console.log("Appointment Today: ", appointment);

      //if appointment.status is "request" skip this appointment
      
       
      
      const { duration } = appointment.Service;
      const appointmentTime = moment(appointment.appointment_time, "HH:mm:ss");
      const appointmentEndTime = appointmentTime.add(duration, "minutes");
      return {
        ...appointment,
        range: generateRange(
          appointment.appointment_time,
          appointmentEndTime.format("h:mm A"),
          15
        ),
      };
    });

   // console.log("appointmentsWithDuration", appointmentsWithDuration);

    // generate time from opening time to closing time with 5 minute intervals
    const timeSlots = [];
    const openingTime = moment(opening_time, "h:mm A");
    const closingTime = moment(closing_time, "h:mm A");

    // console.log("openingTime", openingTime);
    // console.log("closingTime", closingTime);

    while (openingTime.isBefore(closingTime)) {
      timeSlots.push(openingTime.format("h:mm A"));
      openingTime.add(15, "minutes");
    }

    // remove the the times that are from appointment_time to appointment_end_time
    const availableTimeSlots = timeSlots.filter((timeSlot) => {

    
      const isAvailable = appointmentsWithDuration.every((appointment: any) => {
       //skip the appointment if status is "request"
         if(appointment.status == "request"){
              return true;
            }
        return !appointment.range.includes(timeSlot) ;
      });

      return isAvailable;
    });

    //console.log("availableTimeSlots", availableTimeSlots);

    return res.status(200).json(availableTimeSlots);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
