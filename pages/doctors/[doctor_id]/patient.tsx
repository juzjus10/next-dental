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
import { IconEye, IconEdit, IconTrash, IconSearch, IconPaperclip } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import UsersForm from "@/components/Forms/UsersForm";
import axios from "axios";
import { requireAuth } from "common/requireAuth";
import { useRouter } from "next/router";
import PatientForm from "@/components/Forms/PatientForm";
import { modals } from "@mantine/modals";
import { exportToPdf } from "@/utils/exportToPdf";
import { getSession } from "next-auth/react";

const Patient = () => {
  const router = useRouter();
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

    console.log(records);
  }, [debouncedQuery, initialrecord]);

  //console.log(records);

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
          <div>
          <Button
              leftIcon={<IconPaperclip />}
              mr={10}
              variant="light"
              radius="xl"
              color="red"
            onClick={() => {
              exportToPdf('#patient-table', `Patient-${new Date()}`);
            }}
          >
            Save as PDF
          </Button>
          <FormModal title={"Create Patient"} patient/>
          </div>
        </Group>

        <DataTable
          /*
          // @ts-ignore */
          id="patient-table"
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
              render: (row: any) => new Date(row.dob).toLocaleDateString(),
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
            
                <Group spacing={4} position="center" noWrap>
                  <ActionIcon
                    color="green"
                    onClick={(e) => {
                      e.stopPropagation();
                      modals.open({
                        title: "Patient Details",
                        children: (
                          <PatientForm
                            data={patient ? patient : null}
                            readOnly={patient.id ? true : false}
                          ></PatientForm>
                        ),
                      });
                    }}
                  >
                    <IconEye size={16} />
                  </ActionIcon>

                  <ActionIcon
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      modals.open({
                        title: "Patient Details",
                        children: (
                          <PatientForm
                            data={patient}
                            close={modals.closeAll}
                           
                          ></PatientForm>
                        ),
                      });
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>

                  <ActionIcon color="red" onClick={(e) => {
                     e.stopPropagation();
                    mutate(patient.id)
                    }}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          // execute this callback when a row is clicked
          onRowClick={(row) => {
            router.push(`/patient/${row.id}`);
          }}
        />
      </Paper>
    </ApplicationShell>
  );
};

export default Patient;

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
  