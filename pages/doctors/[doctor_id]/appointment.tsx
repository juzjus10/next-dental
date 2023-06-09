import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import {
  deleteAppointment,
  deleteUser,
  getAllAppointments,
  getUser,
} from "@/lib/api";
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
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { getSession } from "next-auth/react";

type FilterType = "day" | "week" | "month" | "all";
type StatusType = "pending" | "completed" | "cancel" | "payment" | "all" | "payment";

function filterAppointments(
  appointments: any,
  filterType: FilterType,
  status: StatusType,
  debouncedQuery: string
): any {
  const now = new Date();
  const filteredAppointments = appointments.filter((appointment: any) => {
    const appointmentDate = new Date(appointment.date_of_appointment);
    switch (filterType) {
      case "day":
        if (appointmentDate.getDate() !== now.getDate()) {
          return false;
        }
        break;
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
        if (!(appointmentDate >= weekStart && appointmentDate <= weekEnd)) {
          return false;
        }
        break;
      case "month":
        if (appointmentDate.getMonth() !== now.getMonth()) {
          return false;
        }
        break;
      default:
        break;
    }

    switch (status) {
      case "pending":
        if (appointment.status !== "pending") {
          return false;
        }
        break;
      case "completed":
        if (appointment.status !== "completed") {
          return false;
        }
        break;
      case "cancel":
        if (appointment.status !== "cancel") {
          return false;
        }
      case "payment":
        if (appointment.status !== "payment") {
          return false;
        }
        break;
      default:
        break;
    }

    if (
      debouncedQuery !== "" &&
      !`${appointment.Patient.firstname} ${appointment.Patient.lastname}`
        .toLowerCase()
        .includes(debouncedQuery.trim().toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return filteredAppointments;
}

const Appointment = (props: any) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>("day");
  const [statusFilter, setStatusFilter] = useState<StatusType>("pending");
  const router = useRouter();
  const { session } = props;

  const user = session.user;

  const [patientQuery, appointmentQuery] = useQueries({
    queries: [
      {
        queryKey: ["user", user.id],
        queryFn: () => getUser(user.id as string),
        enabled: !!user.id,
      },

      {
        queryKey: ["appointments"],
        queryFn: () => getAllAppointments(),
        enabled: !!user.id,
      },
    ],
  });
  const user_data = patientQuery.data;

  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!appointmentQuery?.data) return;
    const initialrecord = appointmentQuery?.data?.filter(
      ({ Doctor }: any) => Doctor?.id === user_data.doctor.id
    );

    setRecords(initialrecord);

    setRecords(
      initialrecord.filter(({ Patient }: any) => {
        if (
          debouncedQuery !== "" &&
          !`${Patient.firstname} ${Patient.lastname}`
            .toLowerCase()
            .includes(debouncedQuery.trim().toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    );

    console.log("filter", filter);

    const filteredAppointments = filterAppointments(
      initialrecord,
      filter,
      statusFilter,
      debouncedQuery
    );
    setRecords(filteredAppointments);
  }, [debouncedQuery, filter, statusFilter]);
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
              placeholder="Search user in appointment list"
              icon={<IconSearch size={16} />}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />

            <Select
              value={filter}
              onChange={(e) => setFilter(e as FilterType)}
              data={[
                { value: "all", label: "All" },
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ]}
            ></Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e as StatusType)}
              data={[
                { value: "all", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "cancel", label: "Cancel" },
                { value: "payment", label: "Payment" },
                { value: "request", label: "Request" },
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
                  exportToPdf(
                    "#appointment-table",
                    `Appointment-${new Date()}`
                  );
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
                leftIcon={<IconCalendarPlus />}
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
            //   fetching={isLoading}
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
                    case "payment":
                      color = "orange";
                    case "request":
                      color = "blue";
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

                    {/* <ActionIcon
                    color="red"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      mutate(appointment.id);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon> */}
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
  const session = await getSession(ctx);

  if (session?.user.user_level !== "doctor") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
});
