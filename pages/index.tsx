import {
  Button,
  Text,
  Card,
  Paper,
  Grid,
  Group,
  Divider,
  List,
  Badge,
} from "@mantine/core";
import ApplicationShell from "@/components/Layout";
import { ColorSwatch } from "@mantine/core";
import { StatsGrid } from "@/components/StatsGrid";
import { DatePicker } from "@mantine/dates";
import { requireAuth } from "common/requireAuth";
import { useSession, } from "next-auth/react";
export default function IndexPage() {
  const { data: session } = useSession();
  console.log(session);
  
  const rows = [
    {
      title: "Requests",
      icon: "user",
      value: "13,456",
      diff: 34,
      description: "This is a description",
    },
    {
      title: "Pending",
      icon: "pending",
      value: "4,145",
      diff: -13,
      description: "This is a description",
    },
    {
      title: "Completed",
      icon: "complete",
      value: "745",
      diff: 18,
      description: "This is a description",
    },
    {
      title: "Cancelled",
      icon: "cancel",
      value: "188",
      diff: -30,
      description: "This is a description",
    },
  ];
  return (
    <ApplicationShell>
      <Paper shadow="sm" p="md">
        <StatsGrid data={rows} />

        <Grid p="lg">
          <Grid.Col span={4}>
            <Card>
              <Group position="center">
                <DatePicker size="md" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={8}>
            <Card>
              <Group spacing="xs" position="apart" mx={5}>
                <Text size={20} weight={700} align="center">
                  Status
                </Text>
                <Badge size="lg" variant="outline">Pending</Badge>
              </Group>
            
              <Group position="apart" px={4} mt={20}>
                <Text fz="md" fw={500} c="dimmed">
                  First Name:
                </Text>
                <Text fz="md" fw={600}>John </Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Middle Name:
                </Text>
                <Text fz="md"  fw={600}>Middle</Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Last Name:
                </Text>
                <Text fz="md"  fw={600}>Last</Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Doctor:
                </Text>
                <Text fz="md"  fw={600}>Test Doctor</Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Purpose:
                </Text>
                <Text fz="md"  fw={600}>To get a new appointment</Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Appointment Date:
                </Text>
                <Text fz="md"  fw={600}>11/22/2021</Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed" >
                  Apointment Created:
                </Text>
                <Text fz="md"  fw={600}>11/22/2021</Text>
              </Group>
              <Divider my={10} size={2} />

              <Group position="apart" px={4} grow py={10}>
              <Button color="green" variant="light" size="sm">
                Assign
              </Button>
              <Button color="blue" variant="light" size="sm">
                Proceed
              </Button>
             
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      </Paper>
    </ApplicationShell>
  );
}


export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});