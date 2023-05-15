import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Joi from "joi";
import { type } from "os";

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  dob: Joi.date().required(),
});

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
        return res
          .status(500)
          .json({ message: "Internal server error", error });
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

        const patient = await prisma.patient.create({
          data: {
            id: uuidv4(),
            firstname,
            lastname,
            middlename,
            address,
            age,
            sex,
            civil_status,
            dob: new Date(dob),
            mobile_no,
            emergency_contact,
            emergency_mobile_no,
            medical_history,
          },
        });

        res.status(200).json({ message: "Patient created", patient });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating Patient!", error });
      }
      break;
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
