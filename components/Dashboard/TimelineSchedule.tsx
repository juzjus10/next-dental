import {
  Timeline,
  Text,
  Title,
  Group,
  Modal,
  Button,
  Badge,
  Card,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconUser,
  IconStethoscope,
  IconCalendarEvent,
  IconClockHour3,
} from "@tabler/icons-react";
import { format, isSameDay, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useMantineTheme } from "@mantine/core";
import Appointment from "pages/appointment";
import AppointmentModal from "@/components/Dashboard/AppointmentModal";

const TimeLineItem = ({ appointment }: any) => {
  const appointmentDate = new Date(appointment.date_of_appointment);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  return (
    <>
      <Card withBorder>
        <Group grow>
          <div
            style={{
              borderRightStyle: "solid",
              borderRightWidth: "1.5px",
              borderRightColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2],
            }}
          >
            <Badge>
              {appointment.status === "pending" ? (
                <Text size="sm" p={5}>
                  Pending
                </Text>
              ) : appointment.status === "completed" ? (
                <Text color="green">Completed</Text>
              ) : (
                <Text color="yellow" />
              )}
            </Badge>

            <Group mt={5}>
              <IconCalendarEvent />
              <Text size="sm" miw={100}>
                {appointmentDate.toLocaleDateString()}
              </Text>
              <IconClockHour3 />
              <Text size="sm" miw={100}>
                {appointment.appointment_time}
              </Text>
            </Group>
            <Group>
              <IconUser></IconUser>
              <Text mt={4} miw={100}>
                {appointment.Patient?.firstname} {appointment.Patient?.lastname}{" "}
              </Text>
              <IconStethoscope> </IconStethoscope>
              <Text variant="link" component="span" inherit>
                {appointment.Doctor?.firstname && appointment.Doctor?.lastname
                  ? `${appointment.Doctor.firstname} ${appointment.Doctor.lastname}`
                  : "Unassigned"}
              </Text>

              <Modal opened={opened} onClose={close} >
                <AppointmentModal appointment={appointment} close={close}/>
              </Modal>
            </Group>
          </div>
          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button m={5} radius="sm" variant="light" onClick={open}>
              View Details
            </Button>
            <Button m={5} radius="sm" variant="light" color="green">
              Complete
            </Button>
            <Button m={5} radius="sm" variant="light" color="red">
              Cancel
            </Button>
          </div>
        </Group>
      </Card>
    </>
  );
};
export default function TimelineSchedule(props: any) {
  const { appointments, date } = props;
  const [appointmentFiltered, setAppointmentFiltered] = useState([]);

  useEffect(() => {
    if (!date) {
      setAppointmentFiltered([]);
      return;
    }
    const filteredAppointments = appointments?.filter(
      (appointment: { date_of_appointment: string }) =>
        isSameDay(parseISO(appointment.date_of_appointment), date)
    ) ?? [];
    setAppointmentFiltered(filteredAppointments);
  }, [appointments, date]);

  
  

  return (
    <>
      <Title m={10} align="center">
        {date && format(date, "MMMM do, yyyy")}
      </Title>
      <Timeline m={10}>
        {appointmentFiltered.length > 0 ? (
          appointmentFiltered.map((appointment: any) => (
            <Timeline.Item
              title={`${appointment.appointment_time}`}
              key={appointment.id}
             
            >
              <TimeLineItem appointment={appointment} />
            </Timeline.Item>
          ))
        ) : (
          <Text weight={500} fz={15} color="dimmed">
            No appointments today
          </Text>
        )}
      </Timeline>
    </>
  );
}
