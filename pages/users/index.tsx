import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import { getAllUsers, deleteUser } from "@/lib/api";
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
import { IconEye, IconEdit, IconTrash, IconSearch, IconPaperclip } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import UsersForm from "@/components/Forms/UsersForm";
import axios from "axios";
import { requireAuth } from "common/requireAuth";
import { exportToPdf } from "@/utils/exportToPdf";
import { modals } from "@mantine/modals";
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
    queryKey: ["users"],
    queryFn: getAllUsers,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"], { exact: true });
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
  }, [debouncedQuery, initialrecord]);

  console.log(records);

  return (
    <ApplicationShell>
      <Paper p={10}>
        <Text size={30} weight={700} align="center">
          {" "}
          Users List{" "}
        </Text>
        <Group position="apart" m={10}>
          <TextInput
            sx={{ flexBasis: "40%" }}
            placeholder="Search users..."
            icon={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          <div>
          <Button
            leftIcon={<IconPaperclip />}
            mr={10}
            variant="light"
            radius="xl"
            color="red"
            onClick={() => {
              exportToPdf("#user-table", `Users-${new Date()}`);
            }}
          >Save as PDF</Button>
          
          <FormModal title={"Create User"} user={records} />
          </div>
        </Group>

        <DataTable
          /*
          // @ts-ignore */
          id="user-table"
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

                  <ActionIcon
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      modals.open({
                        title: "Patient Details",
                        children: (
                          <UsersForm
                            data={user}
                            close={modals.closeAll}
                           
                          ></UsersForm>
                        ),
                      });
                    }}
                  >
                    <IconEdit size={16} />
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

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});
