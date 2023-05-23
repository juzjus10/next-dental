import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Text,
  Card,
  Paper,
  Grid,
  Divider,
  List,
  Badge,
  Group,
  Modal,
  Container,
  Title,
  ActionIcon,
} from "@mantine/core";
import ApplicationShell from "@/components/Layout";
import { StatsGrid } from "@/components/StatsGrid";
import { DatePicker } from "@mantine/dates";
import { requireAuth } from "common/requireAuth";
import { useSession } from "next-auth/react";
import { getAllAppointments } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import { useDisclosure } from "@mantine/hooks";
import { Icon24Hours, IconChecklist, IconDental } from "@tabler/icons-react";
import TimelineSchedule from "@/components/Dashboard/TimelineSchedule";

const AppointmentCard = ({
  appointment,
  selectedDate,
}: {
  appointment: any;
  selectedDate: Date | null;
}) => {
  const [status, setStatus] = useState("Pending");

  const appointmentDate = new Date(appointment.date_of_appointment);

  if (selectedDate && !isSameDay(selectedDate, appointmentDate)) {
    return null;
  }

  return (
    <Card>
      <Grid p="lg">
        <Grid.Col>
          <Card>
            <Text size={20} weight={700} align="center">
              Status
            </Text>
            <Badge size="lg" variant="outline">
              {status}
            </Badge>

            <Divider my={10} size={2} />

            <Group>
              <Text fz="md" fw={500} c="dimmed">
                First Name:
              </Text>
              <Text fz="md" fw={600}>
                {appointment.Patient.firstname}
              </Text>
            </Group>

            <Group>
              <Text fz="md" fw={500} c="dimmed">
                Middle Name:
              </Text>
              <Text fz="md" fw={600}>
                {appointment.Patient.middlename || "n/a"}
              </Text>
            </Group>

            <Group>
              <Text fz="md" fw={500} c="dimmed">
                Last Name:
              </Text>
              <Text fz="md" fw={600}>
                {appointment.Patient.lastname}
              </Text>
            </Group>

            <Group>
              <Text fz="md" fw={500} c="dimmed">
                Doctor:
              </Text>
              <Text fz="md" fw={600}>
                {appointment.Doctor || "Unassigned"}
              </Text>
            </Group>

            <Group>
              <Text fz="md" fw={500} c="dimmed">
                Purpose:
              </Text>
              <Text fz="md" fw={600}>
                {appointment.purpose || "n/a"}
              </Text>
            </Group>

            <Group>
              <Text fz="md" fw={500} c="dimmed">
                Appointment Date:
              </Text>
              <Text fz="md" fw={600}>
                {new Date(appointment.date_of_appointment).toLocaleDateString()}
              </Text>
            </Group>

            <Group>
              <Text fz="md" fw={500} c="dimmed">
                Appointment Time:
              </Text>
              <Text fz="md" fw={600}>
                {appointment.appointment_time}
              </Text>
            </Group>

            <Group>
              <Text fz="md" fw={500} c="dimmed">
                Appointment Created:
              </Text>
              <Text fz="md" fw={600}>
                {new Date(appointment.created_at).toLocaleDateString()}
              </Text>
            </Group>

            <Divider my={10} size={2} />

            <Grid>
              <Grid.Col span={6}>
                <Button
                  color="green"
                  variant="light"
                  size="sm"
                  onClick={() => setStatus("Assigned")}
                >
                  Assign
                </Button>
              </Grid.Col>
              <Grid.Col span={6}>
                <Button
                  color="blue"
                  variant="light"
                  size="sm"
                  onClick={() => setStatus("Proceeded")}
                >
                  Proceed
                </Button>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default function IndexPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [completedAppointment, setCompletedAppointment] = useState<any>(0);

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

  const appointmentCount = useMemo(() => {
    if (!date) {
      return 0;
    }
    return appointments.filter(
      (appointment: { date_of_appointment: Date; date: Date }) =>
        isSameDay(appointment.date_of_appointment, date)
    ).length;
  }, [appointments, date]);

  useEffect(() => {
    console.log("date", date);

    appointments?.forEach((element) => {
      element.date_of_appointment = new Date(element.date_of_appointment);
      console.log("element", element.date_of_appointment);
    });
  }, [date]);

  return (
    <ApplicationShell>
      <Paper shadow="sm" p="md">
        <StatsGrid appointments={appointments} />

        <Card>
          <Group grow>
            <DatePicker
              value={date}
              onChange={setDate}
              styles={{
                calendar: {
                  width: "100%",
                },
                yearLevelGroup: {
                  width: "100%",
                },
                yearLevel: {
                  width: "100%",
                },
                calendarHeader: {
                  width: "100%",
                  maxWidth: "100%",
                },
                monthsList: {
                  width: "100%",
                },
                month: {
                  width: "100%",
                },
                pickerControl: {
                  margin: "0 auto",
                },
                decadeLevelGroup: {
                  width: "100%",
                },
                decadeLevel: {
                  width: "100%",
                },
                yearsList: {
                  width: "100%",
                },
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",

                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <IconDental size={30}></IconDental>
                <Title fz={18} c="dimmed">
                  Appointments Today
                </Title>
              </div>

              <Title fz={80}>{appointmentCount}</Title>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <IconChecklist size={40}></IconChecklist>
                <Title fz={18} c="dimmed">
                  Completed Appointment
                </Title>
              </div>
              <Title fz={80}>{completedAppointment}</Title>
            </div>
          </Group>
        </Card>
      </Paper>

      <Modal opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>

      {/* {appointments?.map(
        (appointment: { id: React.Key | null | undefined }) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            selectedDate={date}
          />
        )
      )} */}
      <TimelineSchedule
        appointments={appointments}
  
        />
    </ApplicationShell>
  );
}

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});
