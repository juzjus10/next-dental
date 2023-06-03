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
  Select,
  Stack,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconPaperclip,
  IconCalendarPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { requireAuth } from "common/requireAuth";
import { useRouter } from "next/router";
import { modals } from "@mantine/modals";
import AppointmentForm from "@/components/Forms/AppointmentForm";
import { exportToPdf } from "@/utils/exportToPdf";
import AppointmentModal from "@/components/Dashboard/AppointmentModal";

type FilterType = "day" | "week" | "month";

function filterAppointmentsByDate(
  appointments: any,
  filterType: FilterType
): any {
  const now = new Date();
  const filteredAppointments = appointments.filter((appointment: any) => {
    const appointmentDate = new Date(appointment.date_of_appointment);
    switch (filterType) {
      case "day":
        return appointmentDate.getDate() === now.getDate();
      case "week":
        const weekStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay()
        );
        const weekEnd = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay() + 6
        );
        return appointmentDate >= weekStart && appointmentDate <= weekEnd;
      case "month":
        return appointmentDate.getMonth() === now.getMonth();
      default:
        return true;
    }
  });
  return filteredAppointments;
}

type StatusType = "pending" | "completed" | "cancel";

function filterAppointmentsByStatus(
  appointments: any,
  status: StatusType
): any {
  const filteredAppointments = appointments.filter((appointment: any) => {
    switch (status) {
      case "pending":
        return appointment.status === "pending";
      case "completed":
        return appointment.status === "completed";
      case "cancel":
        return appointment.status === "cancel";
      default:
        return true;
    }
  });
  return filteredAppointments;
}

const Appointment = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>("day");
  const [statusFilter, setStatusFilter] = useState<StatusType>("pending");
  const router = useRouter();
  const {
    isError,
    error,
    data: initialrecord,
    isFetching,
  } = useQuery({
    queryKey: ["appointment"],
    queryFn: getAllAppointments,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation(deleteAppointment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["appointment"], { exact: true });
    },
  });

  const [records, setRecords] = useState(initialrecord || []);

  useEffect(() => {
    if (!initialrecord) return;
    setRecords(
      initialrecord.filter(({ firstname, lastname }: any) => {
        if (
          debouncedQuery !== "" &&
          !`${firstname} ${lastname}`
            .toLowerCase()
            .includes(debouncedQuery.trim().toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    );

    console.log("filter", filter);

    if (filter) {
      setRecords(filterAppointmentsByDate(initialrecord, filter));
    }

    if (statusFilter) {
      setRecords(filterAppointmentsByStatus(initialrecord, statusFilter));
    }
  }, [debouncedQuery, initialrecord, filter]);

  console.log(records);

  return (
    <ApplicationShell>
      <Paper p={10}>
        <Stack>
        <Text size={30} weight={700} align="center">
          Appointment List
        </Text>
        <Group position="apart" m={10}>
          <TextInput
            sx={{ flexBasis: "40%" }}
            placeholder="Search user"
            icon={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />

          <Select
            value={filter}
            onChange={(e) => setFilter(e as FilterType)}
            data={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
          ></Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e as StatusType)}
            data={[
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
              { value: "cancel", label: "Cancel" },
            ]}
          ></Select>

          <div>
          <Button
            leftIcon={<IconPaperclip />}
            mr={10}
            variant="light"
            radius="xl"
            color="red"
            onClick={() => {
              exportToPdf("#appointment-table", `Appointment-${new Date()}`);
            }}
          >
            Save as PDF
          </Button>

          <Button
            variant="light"
            radius="xl"
            onClick={() => {
              router.push("/appointment/create");
            }}
            leftIcon={<IconCalendarPlus/>}
          >
            Create Appointment
          </Button>
          </div>
        </Group>

        <DataTable
          /*
          // @ts-ignore */
          id="appointment-table"
          m={10}
          mih={200}
          withBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          fetching={isFetching}
          records={records}
          onRowClick={(row) => {
            modals.open({
              children: (
                <AppointmentModal appointment={row} close={modals.closeAll} />
              ),
            });
          }}
          columns={[
            {
              accessor: "id",
              title: "ID",
              textAlignment: "left",
              hidden: true,
            },

            {
              accessor: "Patient.firstname",
              title: "First Name",
              textAlignment: "left",
            },

            {
              accessor: "Patient.middlename",
              title: "Middle Name",
              textAlignment: "left",
            },
            {
              accessor: "Patient.lastname",
              title: "Last Name",
              textAlignment: "left",
            },
            {
              accessor: "appointment_time",
              title: "Time of Appointment",
              textAlignment: "left",
            },
            {
              accessor: "date_of_appointment",
              title: "Date of Appointment",
              textAlignment: "left",
              render: (row: any) =>
                new Date(row.date_of_appointment).toLocaleDateString(),
            },
            {
              accessor: "Doctor.firstname",
              title: "Doctor First Name",
              textAlignment: "left",
            },
            {
              accessor: "Doctor.lastname",
              title: "Doctor Last Name",
              textAlignment: "left",
            },
            {
              accessor: "status",
              title: "Status",
              textAlignment: "center",
              render: (row: any) => {
                let color = "";
                switch (row.status) {
                  case "pending":
                    color = "yellow";
                    break;
                  case "completed":
                    color = "green";
                    break;
                  case "cancel":
                    color = "red";
                    break;
                  default:
                    color = "gray";
                }
                return <Badge color={color}>{row.status}</Badge>;
              },
            },

            {
              accessor: "actions",
              title: <Text mr="xs">Actions</Text>,
              textAlignment: "center",
              render: (appointment) => (
                // prevent click on row

                <Group spacing={4} position="center" noWrap>
                  <ActionIcon
                    color="green"
                    onClick={(e) => {
                      e.stopPropagation();
                      modals.open({
                        title: "Appointment Details",
                        children: (
                          <AppointmentForm
                            data={appointment ? appointment : null}
                            readOnly={appointment.id ? true : false}
                          ></AppointmentForm>
                        ),
                      });
                    }}
                  >
                    <IconEye size={16} />
                  </ActionIcon>

                  <ActionIcon
                    color="red"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      mutate(appointment.id);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
        />
        </Stack>
      </Paper>
    </ApplicationShell>
  );
};

export default Appointment;

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});
