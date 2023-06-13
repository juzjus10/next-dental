import { useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  TextInput,
  Button,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVisible(true);

    try {
      const response = await axios.post("/api/forgot-password", { email });
      setMessage(response.data.message);
     notifications.show({
        title: "Success",
        message: response.data.message,
      
     })
    } catch (error: any) {
      setMessage(error.response.data.message);
    }

    setVisible(false);
  }

  return (
    <Container size={420} mt={40} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Forgot Password
      </Title>
      <form onSubmit={handleSubmit}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div style={{ position: "relative" }}>
            <LoadingOverlay visible={visible} overlayBlur={2} />
            <Button type="submit" fullWidth mt="xl">
              Reset Password
            </Button>
          </div>
        </Paper>
      </form>
    </Container>
  );
}
