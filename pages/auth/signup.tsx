import { Anchor, Container, Group, LoadingOverlay, Paper, PasswordInput, TextInput, Title, Text, Button } from "@mantine/core";
import { signUp } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";

export default function SignUp() {
  const [error, setError] = React.useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);

  // Create type for handleSubmit event
  type FormData = {
    handleSubmit: (e: Promise<void>) => void;
    error: string;
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVisible((v) => !v);
    const form = event.target as HTMLFormElement;
    

   

    // Check if res has a error property
    if (res?.error) {
      setError(res.error);
      setVisible(false);
    } else {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <Container size={420} mt={40} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Sign Up
      </Title>
      <form onSubmit={handleSignUp}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Username" name="username" placeholder="username" type='text' required />
          <TextInput label="E-mail" name="email" placeholder="email" type='email' required />
          <PasswordInput
            label="Password"
            name="password"
            error={error}
            placeholder="password"
            required
          />
          <Group position="apart" mt="md">
            <Text size='sm'>Already have an account?</Text>

            <Anchor size="sm" href='/auth/login'>Login</Anchor>
          </Group>
          <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} overlayBlur={2} />
            <Button fullWidth mt="xl" type="submit">
              Sign Up
            </Button>
          </div>
        </Paper>
      </form>
    </Container>
  );
}