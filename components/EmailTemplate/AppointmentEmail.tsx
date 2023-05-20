import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import headerLogoBlack from "public/header-logo.png";

interface AppointmentEmailProps {
  
  appointment_time?: string;
  date_of_appointment?: Date;
}

export const AppointmentEmail = ({
  appointment_time,
  date_of_appointment,
}: AppointmentEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Appointment Details</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          {/* <Img src={headerLogoBlack.src} width="50" height="50" alt="Slack" /> */}
          <Text style={heroText}>
          M.C. Dental Clinic
        </Text>
        </Section>
        <Heading style={h1}>Here's your appointment schedule</Heading>
        <Text style={heroText}>
          Thank you for creating an appointment with us. We are pleased to
          confirm your appointment scheduled for the following date and time:
        </Text>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>
            Date:{" "}
            {date_of_appointment
              ? new Date(date_of_appointment).toLocaleDateString()
              : ""}
          </Text>
          <Text style={confirmationCodeText}>Time: {appointment_time}</Text>
        </Section>

        <Text style={text}>
          Please remember to arrive at least 30 minutes before your scheduled
          appointment time to complete any necessary paperwork and ensure a
          smooth process.
        </Text>
        <Text style={text}>
          If you have any questions or need to make changes to your appointment,
          please contact us. We look forward to seeing you soon!
        </Text>
        <Section>
          <Text style={footerText}>
            ©2023 M.C. Dental Clinic <br />
            All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AppointmentEmail;

const footerText = {
  fontSize: "12px",
  color: "#b7b7b7",
  lineHeight: "15px",
  textAlign: "left" as const,
  marginBottom: "50px",
};

const footerLink = {
  color: "#b7b7b7",
  textDecoration: "underline",
};

const footerLogos = {
  marginBottom: "32px",
  paddingLeft: "8px",
  paddingRight: "8px",
  width: "100%",
};

const socialMediaIcon = {
  display: "inline",
  marginLeft: "32px",
};

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginRight: "50px",
  marginBottom: "30px",
  padding: "43px 23px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
