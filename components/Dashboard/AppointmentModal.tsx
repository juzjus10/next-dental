import { getAllDoctors, updateAppointment } from "@/lib/api";
import {
  Card,
  Grid,
  Badge,
  Divider,
  Group,
  Button,
  Text,
  Select,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const AppointmentModal = ({
  appointment,
  close,
}: {
  appointment: any;
  close: any;
}) => {
  const router = useRouter();
  const [status, setStatus] = useState(appointment.status);
  const queryClient = useQueryClient();
  const [doctor, setDoctor] = useState(appointment.doctor_id);
  const {
    isError,
    error,
    data: doctors,
    isFetching,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getAllDoctors,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation(
    (data: any) => {
      return updateAppointment(data.id, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["patient"]);
        queryClient.invalidateQueries(["appointment"]);
      },
    }
  );

  const appointmentDate = new Date(appointment.date_of_appointment);
  useEffect(() => {
    console.log("Doctor", doctor);
  }, [doctor]);
  return (
    <Grid p="lg">
      <Grid.Col>
        <Group grow>
          <Text size={20} weight={700} align="left">
            Status
          </Text>
          <Badge size="lg" variant="light">
            {status}
          </Badge>
        </Group>

        <Divider my={10} size={2} />

        <Group grow>
          <Text fz="md" fw={500} c="dimmed">
            First Name:
          </Text>
          <Text fz="md" fw={600}>
            {appointment.Patient.firstname}
          </Text>
        </Group>
        <Group grow>
          <Text fz="md" fw={500} c="dimmed">
            Middle Name:
          </Text>
          <Text fz="md" fw={600}>
            {appointment.Patient.middlename || "n/a"}
          </Text>
        </Group>

        <Group grow>
          <Text fz="md" fw={500} c="dimmed">
            Last Name:
          </Text>
          <Text fz="md" fw={600}>
            {appointment.Patient.lastname}
          </Text>
        </Group>
        <Group grow>
          <Text fz="md" fw={500} c="dimmed">
            Doctor:
          </Text>
          <Select
            fz="md"
            fw={600}
            placeholder="Select Doctor"
            maxDropdownHeight={160}
            variant="filled"
            dropdownPosition="bottom"
            data={
              doctors?.map(
                (doctor: {
                  firstname: string;
                  lastname: string;
                  id: string;
                }) => ({
                  label: `${doctor.firstname} ${doctor.lastname}`,
                  value: doctor.id,
                })
              ) ?? []
            }
            searchable
            value={doctor}
            onChange={(value) => {
              setDoctor(value);
            }}
          />
        </Group>
        <Group grow>
          <Text fz="md" fw={500} c="dimmed">
            Purpose:
          </Text>
          <Text fz="md" fw={600}>
            {appointment.purpose || "n/a"}
          </Text>
        </Group>

        <Group grow>
          <Text fz="md" fw={500} c="dimmed">
            Appointment Date:
          </Text>
          <Text fz="md" fw={600}>
            {new Date(appointment.date_of_appointment).toLocaleDateString()}
          </Text>
        </Group>

        <Group grow>
          <Text fz="md" fw={500} c="dimmed">
            Appointment Time:
          </Text>
          <Text fz="md" fw={600}>
            {appointment.appointment_time}
          </Text>
        </Group>

        <Group grow>
          <Text fz="md" fw={500} c="dimmed">
            Created At:
          </Text>
          <Text fz="md" fw={600}>
            {new Date(appointment.created_at).toLocaleDateString()}
          </Text>
        </Group>
        {/* <Divider my={10} size={2} /> */}

        <Group grow mt={20}>
          <Button
            color="green"
            variant="light"
            size="sm"
            onClick={() => {
              mutate({
                id: appointment.id,

                doctor_id: doctor,
              });
              close();
            }}
          >
            Assign
          </Button>

          <Button
            color="blue"
            variant="light"
            size="sm"
            disabled={doctor === null}
            onClick={() => 
            {
              router.push(`/patient/${appointment.Patient.id}?appointmentId=${appointment.id}`);
              close();
            }
          }
          >
            Proceed
          </Button>
        </Group>
      </Grid.Col>
    </Grid>
  );
};

export default AppointmentModal;
