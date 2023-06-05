import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    LoadingOverlay,
  } from '@mantine/core';
  import { useForm } from '@mantine/form';
  import Link from 'next/link';
  
  
  type FormData = {
    handleSubmit: () => void;
    error: string;
    visible: boolean;
  };
  export function LoginForm({ handleSubmit, error, visible }: FormData) {
    const form = useForm({
      //schema: joiResolver(schema),
      initialValues: {
        email: '',
        password: '',
      },
    });
  
    return (
      <>
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
  
                <Anchor size="sm" href='/sign-up'>Sign Up</Anchor>
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
      </>
    );
  }