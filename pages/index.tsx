import { Button, Group } from "@mantine/core";
import  ApplicationShell from "@/components/Layout";

export default function IndexPage() {
  return (
    <ApplicationShell>
    <Group mt={50} position="center">
      <Button size="xl">Welcome to Mantine!</Button>
    </Group>
    </ApplicationShell>
  
  );
}
