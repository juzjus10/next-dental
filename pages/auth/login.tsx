import { LoginForm } from "@/components/LoginForm";
import { Anchor, Container, Group, LoadingOverlay, Paper, PasswordInput, TextInput, Title, Text, Button } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";

export default function Login() {
  const [error, setError] = React.useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);

  // Create type for handleSubmit event
  type FormData = {
    handleSubmit: (e: Promise<void>) => void;
    error: string;
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVisible((v) => !v);
    const form = event.target as HTMLFormElement;

    const res = await signIn("credentials", {
      username: form.email.value,
      password: form.password.value,
      redirect: false,
    });

    // Check if res has a error property
    if (res?.error) {
        setError("Invalid username or password");
        setVisible(false);
      
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    console.log(status);
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <Container size={420} mt={40} my={40}>
    <Title
      align="center"
      sx={(theme) => ({
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
      })}
    >
      Login
    </Title>
    <form onSubmit={handleSubmit}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="E-mail" name="email" placeholder="email" type='email' required />
        <PasswordInput
          label="Password"
          name="password"
          error={error}
          placeholder="password"
          required
        />
        <Group position="apart" mt="md">
        <Text size="sm">Don&apos;t have an account?</Text>

          <Anchor size="sm" href='/auth/signup'>Sign Up</Anchor>
        </Group>
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={visible} overlayBlur={2} />
          <Button fullWidth mt="xl" type="submit">
            Login
          </Button>
        </div>
      </Paper>
    </form>
  </Container>
  );
}
