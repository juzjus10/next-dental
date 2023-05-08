import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const patient = await prisma.patient.findMany();

        return res.status(200).json(patient);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
      }
    case "POST":
      try {
        const {
          firstname,
          lastname,
          middlename,
          address,
          age,
          sex,
          civil_status,
          dob,
          mobile_no,
          emergency_contact,
          emergency_mobile_no,
          medical_history,
        } = req.body;

        const id = uuidv4();

        // log type of dob
        console.log(typeof dob);
        console.log(req.body.dob);
        const patient = await prisma.patient.create({
          data: {
            id,
            firstname,
            lastname,
            middlename,
            address,
            age,
            sex,
            civil_status,
            dob: moment(dob).toDate(),
            mobile_no,
            emergency_contact,
            emergency_mobile_no,
            medical_history,
          },
        });

        res.json(patient);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating Patient!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
