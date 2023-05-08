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
  Container,
  Card,
  Select,
  rem,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { IconEye, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import UsersForm from "@/components/Forms/UsersForm";
import axios from "axios";
import { requireAuth } from "common/requireAuth";
import moment from "moment";

// generate a time string from 12:00 AM to 11:30 PM
function generateTime() {
  let times = [];
  let time = moment("12:00 AM", "h:mm A");
  const endTime = moment("11:50 PM", "h:mm A");

  while (time <= endTime) {
    times.push(time.format("h:mm A"));
    time = time.add(30, "minutes");
  }

  return times;
}

const Patient = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

  const [time, setTime] = useState({
    opens: "8:00 AM",
    closes: "5:00 PM",
  });

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

  return (
    <ApplicationShell>
      <Card withBorder radius="md" p="xl" mih={600}>
        <Text size={30} weight={700} align="center">
          Settings
        </Text>

        <Grid m={10}>
          <Grid.Col
            span={8}
            sx={(theme) => ({
              borderRight: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
              borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}
          >
            <Group>
              <div>
                <Text fz="lg" fw={500}>
                  Name
                </Text>
                <Text fz="xs" c="dimmed" mt={3} mb="xl">
                  set the name of your clinic
                </Text>
              </div>
            </Group>
          </Grid.Col>
          <Grid.Col
            span={4}
            p={20}
            sx={(theme) => ({
              borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}
          >
            <TextInput
            variant="filled"
              label="Clinic Name"
              placeholder="(YourName) Dental Clinic"
            />
          </Grid.Col>

          <Grid.Col
            span={8}
            sx={(theme) => ({
              borderRight: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
              borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}
          >
            <div>
              <Text fz="lg" fw={500}>
                Operating Hours
              </Text>
              <Text fz="xs" c="dimmed" mt={3} mb="xl">
                set the operating hours of your clinic
              </Text>
            </div>
          </Grid.Col>
          <Grid.Col
            span={4}
            p={20}
            sx={(theme) => ({
              borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}
          >
            <Select
            variant="filled"
              data={generateTime()}
              label="Opens"
              value={time.opens}
              onChange={(e: string) => {
                setTime({ ...time, opens: e });
              }}
            />
            <Select
            variant="filled"
              data={generateTime()}
              label="Closes"
              value={time.closes}
              onChange={(e: string) => {
                setTime({ ...time, closes: e });
              }}
            />
          </Grid.Col>
          <Grid.Col
            span={8}
            sx={(theme) => ({
              borderRight: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
              borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}
          >
            <Group>
              <div>
                <Text fz="lg" fw={500}>
                  Contact Number
                </Text>
                <Text fz="xs" c="dimmed" mt={3} mb="xl">
                  set the contact number of your clinic
                </Text>
              </div>
            </Group>
          </Grid.Col>
          <Grid.Col span={4} p={20} sx={(theme) => ({
              borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}>
            <TextInput
            variant="filled"
              label="Clinic Contact Number"
              placeholder="(+63) 912 3456 789"
            />
          </Grid.Col>

          <Grid.Col
            span={8}
            sx={(theme) => ({
              borderRight: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
              borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}
          >
            <Group>
              <div>
                <Text fz="lg" fw={500}>
                  Address
                </Text>
                <Text fz="xs" c="dimmed" mt={3} mb="xl">
                  set the address location of your clinic
                </Text>
              </div>
            </Group>
          </Grid.Col>
          <Grid.Col span={4} p={20} sx={(theme) => ({
              borderBottom: `${rem(1)} solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}>
            <TextInput variant="filled" label="Clinic Address" />
          </Grid.Col>
        </Grid>
      </Card>
    </ApplicationShell>
  );
};

export default Patient;

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});
