import {
  Timeline,
  Text,
  Title,
  Group,
  Modal,
  Button,
  Badge,
  Card,
  SimpleGrid,
  Center,
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
import { updateAppointment } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TimeLineItem = ({ appointment }: any) => {
  const appointmentDate = new Date(appointment.date_of_appointment);
  const [opened, { open, close }] = useDisclosure(false);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data: any) => {
      return updateAppointment(data.id, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["appointment"]);
      },
    }
  );
  const theme = useMantineTheme();
  return (
    <>
      <div>
        <Card withBorder>
          <SimpleGrid
            cols={2}
            breakpoints={[
              { maxWidth: "sm", cols: 1 },

              { maxWidth: "xs", cols: 1 },
            ]}
          >
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
              <Badge
                color={
                  appointment.status === "pending"
                    ? "yellow"
                    : appointment.status === "completed"
                    ? "green"
                    : "red"
                }
              >
                <Text size="sm" p={5}>
                  {appointment.status}
                </Text>
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
                  {appointment.Patient?.firstname}{" "}
                  {appointment.Patient?.lastname}{" "}
                </Text>
                <IconStethoscope> </IconStethoscope>
                <Text variant="link" component="span" inherit>
                  {appointment.Doctor?.firstname && appointment.Doctor?.lastname
                    ? `${appointment.Doctor.firstname} ${appointment.Doctor.lastname}`
                    : "Unassigned"}
                </Text>

                <Modal opened={opened} onClose={close}>
                  <AppointmentModal appointment={appointment} close={close} />
                </Modal>
              </Group>
            </div>

            <Center>
            <div>
               
             
            <Button m={5} radius="sm" variant="light" onClick={open}>
              View Details
            </Button>
            <Button
              m={5}
              radius="sm"
              variant="light"
              color="green"
              onClick={() => {
                mutate({ id: appointment.id, status: "completed" });
              }}
            >
              Complete
            </Button>
            <Button
              m={5}
              radius="sm"
              variant="light"
              color="red"
              onClick={() => {
                mutate({ id: appointment.id, status: "cancel" });
              }}
            >
              Cancel
            </Button>
          
            </div>
            </Center>
          </SimpleGrid>
        </Card>
      </div>
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
    const filteredAppointments =
      appointments?.filter((appointment: { date_of_appointment: string }) =>
        isSameDay(parseISO(appointment.date_of_appointment), date)
      ) ?? [];
    setAppointmentFiltered(filteredAppointments);
  }, [appointments, date]);

  return (
    <>
      <Title m="xl" align="center">
        {date && format(date, "MMMM do, yyyy")}
      </Title>
      {appointments && appointmentFiltered.length > 0 ? (
        <Timeline m={10}>
          {appointmentFiltered.map((appointment: any, index) => (
            <Timeline.Item
              title={`${appointment.appointment_time}`}
              key={appointment.id}
            >
              <TimeLineItem appointment={appointment} />
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Text weight={500} fz={15} color="dimmed">
          No appointments today
        </Text>
      )}
    </>
  );
}
