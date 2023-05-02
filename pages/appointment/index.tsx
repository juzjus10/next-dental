import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import {  deleteAppointment, deleteUser, getAllAppointments } from "@/lib/api";
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
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { IconEye, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";


const Users = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

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
      initialrecord.filter(({ firstname, lastname } : any) => {
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
  }, [debouncedQuery, initialrecord]);

  console.log(records);

  return (
    <ApplicationShell>
      <Paper p={10}>
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

          <FormModal title={"Create Appointment"} appointment={records}/>
        </Group>

        <DataTable
          m={10}
          mih={200}
          withBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          fetching={isFetching}
          records={records}
          // define columns
          columns={[
            {
              accessor: "id",
              // this column has a custom title
              title: "ID",
              // right-align column
              textAlignment: "left",
              hidden: true,
            },
            {
              accessor: "firstname",
              title: "First Name",
              textAlignment: "left",
            },

            {
              accessor: "middlename",
              title: "Middle Name",
              textAlignment: "left",
            },
            {
              accessor: "lastname",
              title: "Last Name",
              textAlignment: "left",
            },

            {
              accessor: "user_level",
              title: "User Level",
              textAlignment: "center",
              render: (row: any) =>
                row.user_level == "admin" ? (
                  <Badge color="violet">{row.user_level}</Badge>
                ) : (
                  <Badge>{row.user_level}</Badge>
                ),
            },
            {
              accessor: "actions",
              title: <Text mr="xs">Actions</Text>,
              textAlignment: "center",
              render: (user) => (
                // prevent click on row

                <Group spacing={4} position="center" noWrap>
                  <FormModal title={"View User"} user={user} icon />

                  <ActionIcon color="red" onClick={() => mutate(user.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          // execute this callback when a row is clicked
          onRowClick={(row) => console.log(row)}
        />
      </Paper>
    </ApplicationShell>
  );
};

export default Users;
