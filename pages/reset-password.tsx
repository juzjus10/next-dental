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
import { useRouter } from "next/router";


export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);


  
    //get the token from the url
    const router = useRouter();
     const { token } = router.query;


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVisible(true);

    try {
      const response = await axios.post("/api/reset-password", {
        password,
        confirmPassword,
        token,
      });
      setMessage(response.data.message);
      notifications.show({
        title: "Success",
        message: response.data.message,
      });

      //redirect to login page
        setTimeout(() => {
            window.location.href = "/auth/login";
        }, 2000);
        
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
        Reset Password
      </Title>
      <form onSubmit={handleSubmit}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <div style={{ position: "relative" }}>
            <LoadingOverlay visible={visible} overlayBlur={2} />
            <Button type="submit" fullWidth mt="xl">
              Reset Password
            </Button>
          </div>
          {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
        </Paper>
      </form>
    </Container>
  );
}