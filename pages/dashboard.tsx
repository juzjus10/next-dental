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
  Loader,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import ApplicationShell from "@/components/Layout";
import { StatsGrid } from "@/components/StatsGrid";
import { DatePicker } from "@mantine/dates";
import { requireAuth } from "common/requireAuth";
import { useSession } from "next-auth/react";
import { getAllAppointments } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isSameDay, parseISO } from "date-fns";
import { Icon24Hours, IconChecklist, IconDental } from "@tabler/icons-react";
import TimelineSchedule from "@/components/Dashboard/TimelineSchedule";
import { useRouter } from "next/router";

export default function Dashboard(props: any) {
  const router = useRouter();
  const { date_of_appointment } = router.query;

  const [date, setDate] = useState<Date | null>(
    date_of_appointment ? new Date(date_of_appointment[0]) : new Date()
  );

  const [completedAppointment, setCompletedAppointment] = useState<any>(0);

  const { data: appointments, isFetching } = useQuery({
    queryKey: ["appointment"],
    queryFn: getAllAppointments,
    refetchOnWindowFocus: false,
  });

  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    if (appointments) {
      const filteredAppointments = appointments.filter(
        (appointment: { date_of_appointment: string; date: Date }) =>
          appointment.date_of_appointment &&
          date &&
          isSameDay(parseISO(appointment.date_of_appointment), date)
      );
      setAppointmentCount(filteredAppointments.length);
    }

    // get the number of completed appointments and set it to completedAppointment
    if (appointments) {
      const filteredAppointments = appointments.filter(
        (appointment: { date_of_appointment: string; status: string }) =>
          date &&
          isSameDay(parseISO(appointment.date_of_appointment), date) &&
          appointment.status === "completed"
      );
      setCompletedAppointment(filteredAppointments.length);
    }
  }, [date, appointments]);

  return (
    <ApplicationShell>
      <Paper shadow="sm" p="md">
        <StatsGrid appointments={appointments} />

        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: "lg", cols: 3 },
            { maxWidth: "md", cols: 1 },
           
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          <Card withBorder>
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
          </Card>

          <Stack align="center">
            <Group position="center">
              <IconDental size={30}></IconDental>
              <Title fz={18} c="dimmed">
                Appointments Today
              </Title>
            </Group>

            {isFetching ? (
              <Loader />
            ) : (
              <>
                <Title fz={150}>{appointmentCount}</Title>
                <Text fz="sm" c="dimmed" mt={7}>
                  Total Appointments for { date && format(date, "MMMM do, yyyy")}
                </Text>
              </>
            )}
          </Stack>

          <Stack align="center">
            <Group position="center">
              <IconChecklist size={30}></IconChecklist>
              <Title fz={18} c="dimmed">
                Completed Appointment
              </Title>
            </Group>

            <Title fz={150}>{completedAppointment}</Title>
            <Text fz="sm" c="dimmed" mt={7}>
              Total Completed Appointments for { date && format(date, "MMMM do, yyyy")}
            </Text>
          </Stack>
        </SimpleGrid>

        <TimelineSchedule appointments={appointments} date={date} />
      </Paper>
    </ApplicationShell>
  );
}

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});
