import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import { getPatient, updatePatient } from "@/lib/api";
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
  Title,
  Card,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { IconEye, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { requireAuth } from "common/requireAuth";
import { useRouter } from "next/router";

const UsersInfo = (props: any) => {
  const { id } = props;
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

  //create a query to get patient info by id
  const { data: patient, isFetching } = useQuery(
    ["patient", { id }],
    () => getPatient(id as string),
    {
      enabled: !!id,
    }
  );

  const { mutate } = useMutation((data: any) => updatePatient(data.id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["patient"]);
    },
  });

  const [records, setRecords] = useState(patient || []);

  useEffect(() => {
    if (!patient) return;
    setRecords(patient);
  }, [debouncedQuery, patient]);

  
  console.log(records);

  return (
    <ApplicationShell>
      <Paper p={10}>
        <Title order={1} align="center">
          Patient Record
        </Title>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
           
          }}
        >
          {patient && <FormModal title={"Add Record"} record={patient.Records}   patientId={patient.id}/>}
        </div>
       
        {patient && (
          <Grid mt={10} ml={5}>
            <Grid.Col span={12} md={4}>
              <Card withBorder shadow="sm" radius="md">
                <Card.Section withBorder inheritPadding py="xs">
                  <Text size="xl" weight={500}>
                    {patient.firstname} {patient.middlename} {patient.lastname}
                  </Text>
                </Card.Section>

                <Text mt="sm" weight={500}>
                  Personal Info
                </Text>
                {Object.keys(patient).map((key, index) => {
                  if (
                    key !== "id" &&
                    key !== "Appointment" &&
                    key !== "medical_history" &&
                    key !== "Records"
                  ) {
                    if (key === "dob") {
                      return (
                        <Text mt={"sm"} color="dimmed" size="sm">
                          {key}:{" "}
                          <Text component="span" inherit color="yellow" ml={2}>
                            {new Date(patient[key]).toLocaleDateString()}
                          </Text>
                        </Text>
                      );
                    }
                    return (
                      <Text mt={"sm"} color="dimmed" size="sm">
                        {key}:{" "}
                        <Text component="span" inherit color="yellow" ml={2}>
                          {patient[key]}
                        </Text>
                      </Text>
                    );
                  }
                })}

                <Card.Section withBorder inheritPadding py="xs" mt="sm">
                  <Text mt="sm" weight={500}>
                    Medical History
                  </Text>
                  <Text mt={"sm"} color="dimmed" size="sm">
                    {patient.medical_history}
                  </Text>
                </Card.Section>

                <Card.Section withBorder inheritPadding py="xs" mt="sm">
                  <Text mt="sm" weight={500}>
                    Balance Info
                  </Text>
                  <Text mt={"sm"} color="dimmed" size="sm">
                    {}
                  </Text>
                </Card.Section>
              </Card>
            </Grid.Col>
            <Grid.Col span={12} md={8}>
              <DataTable
                mih={200}
                withBorder
                borderRadius="sm"
                withColumnBorders
                striped
                highlightOnHover
                fetching={isFetching}
                records={patient.Records}
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
                    accessor: "procedure",
                    title: "Procedure",
                    textAlignment: "left",
                  },

                  {
                    accessor: "date",
                    title: "Date",
                    textAlignment: "left",
                    render: (record: any) => (
                      <Text component="span" color="yellow">
                        {new Date(record.date).toLocaleDateString()}
                      </Text>
                    ),
                    
                  },
                  {
                    accessor: "doctor_notes",
                    title: "Doctor Notes ",
                    textAlignment: "left",
                  },
                  {
                    accessor: "actions",
                    title: <Text mr="xs">Actions</Text>,
                    textAlignment: "center",
                    render: (patient: any) => (
                      // prevent click on row

                      <Group spacing={4} position="center" noWrap>
                        <FormModal
                          title={"View Patient"}
                          record={patient.Records}
                          icon
                        />

                        <ActionIcon
                          color="red"
                          onClick={() => mutate(patient.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    ),
                  },
                ]}
              />
            </Grid.Col>
          </Grid>
        )}
      </Paper>
    </ApplicationShell>
  );
};

export default UsersInfo;

export const getServerSideProps = requireAuth(async (ctx) => {
  // get id from  query
  const { id } = ctx.query;

  // if query is not defined,  redirect to /patient

  if (!id) {
    return {
      redirect: {
        destination: "/patient",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
    },
  };
});
