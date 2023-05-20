import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const sendInBlueKey = process.env.NEXT_PUBLIC_SEND_IN_BLUE_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {  
  const {recipient, recipientEmail, htmlContent, subject} = req.body;
  const { method } = req;

  if (method !== "POST") {
    try {
      const response = await axios.post(
        "https://api.sendinblue.com/v3/smtp/email",
        {
          sender: {
            name: "M.C. Dental Clinic",
            email: "email@mcdental.com",
          },
          to: [
            {
              email: recipientEmail,
              name: recipient,
            },
          ],
          subject: subject,
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

      console.log("Email sent successfully:", response.data);

      res.status(200).end();
    } catch (error) {
      console.error("Error sending email:", error);

      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.status(405).json({ error: "Only POST requests allowed" });
  }
}
