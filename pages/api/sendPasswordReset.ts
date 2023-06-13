import axios from "axios";

const sendInBlueKey = process.env.SIB_API_KEY;

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const htmlContent = `
    <p>You have requested to reset your password. Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
  `;

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
            email: email,
          },
        ],
        subject: "Password Reset Request",
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

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}