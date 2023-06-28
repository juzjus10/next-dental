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
import { useSession } from "next-auth/react";
import { modals } from "@mantine/modals";
import PaymentModal from "./PaymentModal";

const TimeLineItem = ({ appointment }: any) => {
  const appointmentDate = new Date(appointment.date_of_appointment);
  const [opened, { open, close }] = useDisclosure(false);
  const { data: session } = useSession();

  const user = session?.user;

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

  const StatusBadge = (status: string) => {
    let color = "";
    switch (status) {
      case "pending":
        color = "yellow";
        break;
      case "request":
        color = "blue";
        break;
      case "completed":
        color = "green";
        break;
      case "cancel":
        color = "red";
        break;
      case "payment":
        color = "orange";
        break;
      default:
        color = "gray";
    }
    return <Badge color={color}>{status}</Badge>;
  };
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
              {StatusBadge(appointment.status)}

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
                <Button
                  m={5}
                  radius="sm"
                  variant="light"
                  onClick={() => {
                    if (appointment.status != "payment") {
                      modals.open({
                        children: (
                          <AppointmentModal
                            appointment={appointment}
                            close={close}
                          />
                        ),
                      });
                    } else {
                      modals.open({
                        size: 800,
                        title: (
                          <>
                            <Group>
                              <Text size="sm" p={5} weight={600}>
                                STATUS
                              </Text>
                              <Badge color="orange">{appointment.status}</Badge>
                            </Group>
                          </>
                        ),
                        children: (
                          <PaymentModal
                            appointment={appointment}
                            close={close}
                          />
                        ),
                      });
                    }
                  }}
                >
                  View Details
                </Button>
                {/* {user?.user_level === "admin" && (
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
                )}
                {user?.user_level === "admin" && (
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
                )} */}
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
      <div>
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
      </div>
    </>
  );
}
