import {
  Anchor,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Text,
  Button,
  Checkbox,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";

import { useMantineTheme } from "@mantine/core";

export default function SignUp() {
  const [error, setError] = React.useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);
  const theme = useMantineTheme();

  // Create type for handleSubmit event
  type FormData = {
    handleSubmit: (e: Promise<void>) => void;
    error: string;
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVisible(true);
    const form = event.target as HTMLFormElement;

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
        username: form.username.value,
        firstname: form.firstname.value,
        middlename: form.middlename.value,
        lastname: form.lastname.value,
        user_level: "doctor",
      }),
    }).then((res) => res.json());

    // Check if res has an error property
    if (res?.error) {
      setError(res.error);
      setVisible(false);
    } else {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);


  return (
    <div
    style={{
        height: "100vh",
        background: theme.fn.gradient(),
      }}
    >
      <Container size={420} p={20}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Doctor Sign Up
        </Title>
        <form onSubmit={handleSignUp}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="Username"
              name="username"
              placeholder="Username"
              type="text"
              required
              mt="md"
            />
            <TextInput
              label="E-mail"
              name="email"
              placeholder="domain@host.com"
              type="email"
              error={error}
              required
              mt="md"
            />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="password"
              required
              mt="md"
            />
            <TextInput
              label="First Name"
              name="firstname"
              placeholder="Juan "
              required
              mt="md"
            />
            <TextInput
              label="Middle Name"
              name="middlename"
              placeholder="Dela"
              required
              mt="md"
            />
            <TextInput
              label="Last Name"
              name="lastname"
              placeholder="Cruz"
              required
              mt="md"
            />

            <Group position="apart" mt="md">
              <Text size="sm">Already have an account?</Text>

              <Anchor size="sm" href="/auth/login">
                Login
              </Anchor>
            </Group>
            <div style={{ position: "relative" }}>
              <LoadingOverlay visible={visible} overlayBlur={2} />
              <Button fullWidth mt="xl" type="submit">
                Sign Up
              </Button>
            </div>
          </Paper>
        </form>
      </Container>
    </div>
  );
}
