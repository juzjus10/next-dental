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
} from "@mantine/core";
import ApplicationShell from "@/components/Layout";
import { StatsGrid } from "@/components/StatsGrid";
import { DatePicker } from "@mantine/dates";
import { requireAuth } from "common/requireAuth";
import { useSession } from "next-auth/react";
import { getAllAppointments } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameDay, parseISO } from "date-fns";
import { Icon24Hours, IconChecklist, IconDental } from "@tabler/icons-react";
import TimelineSchedule from "@/components/Dashboard/TimelineSchedule";

export default function IndexPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | null>(new Date());

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

  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    console.log("typeof date:", typeof date);

    console.log("appointments", appointments);
    if (appointments) {
      const filteredAppointments = appointments.filter(
        (appointment: { date_of_appointment: string; date: Date }) =>
          isSameDay(parseISO(appointment.date_of_appointment), date)
      );
      setAppointmentCount(filteredAppointments.length);
    }
  }, [date, appointments]);

  return (
    <ApplicationShell>
      <Paper shadow="sm" p="md">
        <StatsGrid appointments={appointments} />

        <Group grow>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",

              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <IconDental size={30}></IconDental>
              <Title fz={18} c="dimmed">
                Appointments Today
              </Title>
            </div>

            {isFetching ? (
              <Loader />
            ) : (
              <Title fz={80}>{appointmentCount}</Title>
            )}
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <IconChecklist size={40}></IconChecklist>
              <Title fz={18} c="dimmed">
                Completed Appointment
              </Title>
            </div>
            <Title fz={80}>{completedAppointment}</Title>
          </div>
        </Group>

      
          <TimelineSchedule appointments={appointments} date={date} />
       
      </Paper>

      {/* {appointments?.map(
        (appointment: { id: React.Key | null | undefined }) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            selectedDate={date}
          />
        )
      )} */}
    </ApplicationShell>
  );
}

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});
