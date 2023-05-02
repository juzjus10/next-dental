import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import { getAllPatients, deletePatient } from "@/lib/api";
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
import UsersForm from "@/components/Forms/UsersForm";
import axios from "axios";
const Patient = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

  const {
    isError,
    error,
    data: initialrecord,
    isFetching,
  } = useQuery({
    queryKey: ["patient"],
    queryFn: getAllPatients,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation(deletePatient, {
    onSuccess: () => {
      queryClient.invalidateQueries(["patient"], { exact: true });
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
         Patient List
        </Text>
        <Group position="apart" m={10}>
          <TextInput
            sx={{ flexBasis: "40%" }}
            placeholder="Search patient..."
            icon={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />

          <FormModal title={"Create Patient"} patient={records}/>
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
              accessor: "address",
              title: "Address",
              textAlignment: "left",
            },

            {
              accessor: "age",
              title: "Age",
              textAlignment: "left",
            },
            {
              accessor: "sex",
              title: "Sex",
              textAlignment: "left",
            },
            {
              accessor: "civil_status",
              title: "Civil Status",
              textAlignment: "left",
            },
            {
              accessor: "dob",
              title: "Date of Birth",
              textAlignment: "left",
              render : (row : any) => new Date(row.dob).toLocaleDateString()
            },
            {
              accessor: "mobile_no",
              title: "Mobile Number",
              textAlignment: "left",
              
            },
            {
              accessor: "emergency_contact",
              title: "Emergency Contact Person",
              textAlignment: "left",
              
            },
            {
              accessor: "emergency_mobile_no",
              title: "Emergency Contact Number",
              textAlignment: "left",
              
            },
            {
              accessor: "medical_history",
              title: "Medical History",
              textAlignment: "left",
              
            },
            // {
            //   accessor: "civil_status",
            //   title: "User Level",
            //   textAlignment: "center",
            //   render: (row: any) =>
            //     row.user_level == "admin" ? (
            //       <Badge color="violet">{row.user_level}</Badge>
            //     ) : (
            //       <Badge>{row.user_level}</Badge>
            //     ),
            // },
            {
              accessor: "actions",
              title: <Text mr="xs">Actions</Text>,
              textAlignment: "center",
              render: (patient) => (
                // prevent click on row

                <Group spacing={4} position="center" noWrap>
                  <FormModal title={"View Patient"} patient={patient} icon />

                  <ActionIcon color="red" onClick={() => mutate(patient.id)}>
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

export default Patient;
