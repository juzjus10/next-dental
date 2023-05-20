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
import { useSession } from "next-auth/react";
import {  getAllAppointments } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [rows, setRows] = useState([
    {
      title: "Requests",
      icon: "user",
      value: 0,
      diff: 0,
      description: "This is a description",
    },
    {
      title: "Pending",
      icon: "pending",
      value: 0,
      diff: 0,
      description: "This is a description",
    },
    {
      title: "Completed",
      icon: "complete",
      value: 0,
      diff: 0,
      description: "This is a description",
    },
    {
      title: "Cancelled",
      icon: "cancel",
      value: 0,
      diff: 0,
      description: "This is a description",
    },
  ]);

  const {
    isError,
    error,
    data: appointments,
    isFetching,
  } = useQuery({
    queryKey: ["appointment"],
    queryFn: getAllAppointments,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!appointments) return;

    // find row with title "Requests" and update value
    const requestsRow = rows.find((row) => row.title === "Requests");
    if (!requestsRow) return;
    requestsRow.value = appointments.length;

    // find row with title "Pending" and update value
    const pendingRow = rows.find((row) => row.title === "Pending");
    if (!pendingRow) return;
    pendingRow.value = appointments.filter(
      (appointment: { status: string }) => appointment.status === "pending"
    ).length;

    // find row with title "Completed" and update value
    const completedRow = rows.find((row) => row.title === "Completed");
    if (!completedRow) return;
    completedRow.value = appointments.filter(
      (appointment: { status: string }) => appointment.status === "completed"
    ).length;

    // find row with title "Cancelled" and update value
    const cancelledRow = rows.find((row) => row.title === "Cancelled");
    if (!cancelledRow) return;
    cancelledRow.value = appointments.filter(
      (appointment: { status: string }) => appointment.status === "cancelled"
    ).length;
    

  }, [appointments]);

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
                <Badge size="lg" variant="outline">
                  Pending
                </Badge>
              </Group>

              <Group position="apart" px={4} mt={20}>
                <Text fz="md" fw={500} c="dimmed">
                  First Name:
                </Text>
                <Text fz="md" fw={600}>
                  John{" "}
                </Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Middle Name:
                </Text>
                <Text fz="md" fw={600}>
                  Middle
                </Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Last Name:
                </Text>
                <Text fz="md" fw={600}>
                  Last
                </Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Doctor:
                </Text>
                <Text fz="md" fw={600}>
                  Test Doctor
                </Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Purpose:
                </Text>
                <Text fz="md" fw={600}>
                  To get a new appointment
                </Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Appointment Date:
                </Text>
                <Text fz="md" fw={600}>
                  11/22/2021
                </Text>
              </Group>
              <Group position="apart" px={4}>
                <Text fz="md" fw={500} c="dimmed">
                  Apointment Created:
                </Text>
                <Text fz="md" fw={600}>
                  11/22/2021
                </Text>
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
