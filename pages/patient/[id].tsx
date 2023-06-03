import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import {
  deleteRecord, getAppointment,
  getPatient,
  getRecordByID
} from "@/lib/api";
import {
  Group,
  Paper,
  Text,
  ActionIcon,
  Grid, Title,
  Card
} from "@mantine/core";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { requireAuth } from "common/requireAuth";

const UsersInfo = (props: any) => {
  const { id, appointmentId } = props;
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

  //create a query to get patient info by id
  const [patientQuery, recordQuery, appointmentQuery] = useQueries({
    queries:[{
      queryKey: ["patient", { id }],
      queryFn: () => getPatient(id as string),
      enabled: !!id,
    },
    {
      queryKey: ["record", { id }],
      queryFn: () => getRecordByID(id as string),
      enabled: !!id,
    },
    {
      queryKey: ["appointment", { id }],
      queryFn: () => getAppointment(appointmentId as string),
      enabled: !!appointmentId,
    }],
  })
  const patient = patientQuery.data;
  const record = recordQuery.data;
  const appointment = appointmentQuery.data;

  const { mutate } = useMutation((data: any) => deleteRecord(data.id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["record"]);
    },
  });

  const [records, setRecords] = useState(record || []);

  useEffect(() => {
    if (!record) return;
    console.log("Record: ", record);
    setRecords(record);
  }, [debouncedQuery, patient]);

 
    

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
          {record && patient && appointmentId && (
            <FormModal
              title={"Add Record"}
              record={record}
              patientId={patient.id}
              doctorId={appointment?.Doctor?.id}
            />
          )}
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
              {record && (
                <DataTable
                  mih={200}
                  withBorder
                  borderRadius="sm"
                  withColumnBorders
                  striped
                  highlightOnHover
                 // fetching={isFetching}
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
                      render: (record: any) => (
                        // prevent click on row
                        
                        <Group spacing={4} position="center" noWrap>
                          <FormModal
                            title={"View Record"}
                            record={record}
                            patientId={patient.id}
                            icon
                          />
                         
                         
                      
                          <ActionIcon
                            color="red"
                            onClick={() => mutate(record.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      ),
                    },
                  ]}
                />
              )}
            </Grid.Col>
          </Grid>
        )}
      </Paper>
    </ApplicationShell>
  );
};

export default UsersInfo;

export const getServerSideProps = requireAuth(async (ctx) => {
  // get id and appointment from query
  const { id, appointmentId } = ctx.query;

  console.log("ID: ", id);
  console.log("Appointment: ", appointmentId);

  // if query is not defined, redirect to /patient
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
      appointmentId: appointmentId || null,
    },
  };
});