import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import { deleteAppointment, deleteUser, getAllAppointments } from "@/lib/api";
import {
  Group,
  Paper,
  Text,
  ActionIcon,
  Grid,
  TextInput,
  Button,
  Modal,
  Divider,
  Badge,
  Box,
  Container,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { IconEye, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import DoctorForm from "@/components/Forms/DoctorForm";
import AppointmentForm from "@/components/Forms/AppointmentForm";

const Users = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

  const { mutate } = useMutation(deleteAppointment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["appointment"], { exact: true });
    },
  });

  return (
    <ApplicationShell>
    <Container my="md" >
      <Paper p={10}>
        <Text size={30} weight={700} align="center">
          Book an Appointment
        </Text>
        <Box p={20}>
          <AppointmentForm data={[]} />
        </Box>
      </Paper>
    </Container>
    </ApplicationShell>
    
  );
};

export default Users;
