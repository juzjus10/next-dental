import {
  getAllDoctors,
  getRecordByAppointmentID,
  getRecordByID,
  updateAppointment,
} from "@/lib/api";
import {
  Card,
  Grid,
  Badge,
  Divider,
  Group,
  Button,
  Text,
  Select,
  Paper,
  ActionIcon,
  Center,
  Stack,
  TextInput,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { IconCurrencyPeso, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";

const PaymentModal = ({
  appointment,
  close,
}: {
  appointment: any;
  close: any;
}) => {
  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const user = session?.user;

  const {
    isError,
    error,
    data: doctors,
    isFetching,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getAllDoctors,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation(
    (data: any) => {
      return updateAppointment(data.id, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["patient"]);
        queryClient.invalidateQueries(["appointment"]);
      },
    }
  );

  const { data: record } = useQuery({
    queryKey: ["record", appointment.id],
    queryFn: () => getRecordByAppointmentID(appointment.id),
    refetchOnWindowFocus: false,
  });

  const [amount_paid, setAmountPaid] = useState(record?.amount_paid || 0);
  const [balance, setBalance] = useState(record?.balance || 0);
  const [total_amount, setTotalAmount] = useState(0);
  const [doctor_commission, setDoctorCommission] = useState(
    record?.doctor_commission || 0
  );

  const handleComplete = () => {
    mutate({
      id: appointment.id,
      status: "completed",

      record_id: record.id,
      doctor_commission,
      amount_paid,
      balance,
    
    });
  };

  useEffect(() => {
    console.log("Appointment", appointment);
    console.log("Record", record);

    if (record) {
      setTotalAmount(record.items.reduce((a: any, b: any) => a + b.cost, 0));

      //calculate balance  by subtracting total amount to amount paid
      setBalance(total_amount - amount_paid);
    }
  }, [record, amount_paid, balance]);
  return (
    <>
      <Divider />
      <Grid p="sm">
        <Grid.Col span={6}>
          <Group>
            <div>
              <Text> First Name: {appointment.Patient.firstname}</Text>
              <Text> Middle Name: {appointment.Patient.middlename}</Text>
              <Text> Last Name: {appointment.Patient.lastname}</Text>
              <Text>
                Doctor: {appointment.Doctor.firstname}
                {appointment.Doctor.lastname}
              </Text>
              <Text>
                Appointment Date:{" "}
                {new Date(
                  Date.parse(appointment.date_of_appointment)
                ).toLocaleDateString()}{" "}
              </Text>
            </div>
          </Group>
          <Divider my={10} />
          {record && (
            <Stack spacing={5}>
              <Group>
                <Center>
                  <Text mr={2} color="dimmed">
                    Total Amount
                  </Text>

                  <IconCurrencyPeso size={20}></IconCurrencyPeso>
                  {total_amount}
                </Center>
              </Group>

              <Group>
                <Center>
                  <Text mr={2} color="dimmed">
                    Balance
                  </Text>

                  <IconCurrencyPeso size={20}></IconCurrencyPeso>
                  {balance}
                </Center>
              </Group>

              <Group>
                <Text color="dimmed">Amount Paid:</Text>
                <TextInput
                  value={amount_paid}
                  onChange={(e) => {
                    setAmountPaid(e.currentTarget.value);
                  }}
                ></TextInput>
              </Group>
              <Group>
                <Text color="dimmed">Doctor Commission:</Text>
                <TextInput
                  value={doctor_commission}
                  onChange={(e) => {
                    setDoctorCommission(e.currentTarget.value);
                  }}
                ></TextInput>
              </Group>
            </Stack>
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          <DataTable
            height={300}
            withBorder
            withColumnBorders
            records={record?.items}
            borderRadius="sm"
            columns={[
              {
                accessor: "id",

                hidden: true,
              },
              {
                accessor: "name",
                title: "Service Rendered",
              },
              {
                accessor: "cost",
                title: "Cost",
              },
            ]}
          ></DataTable>
        </Grid.Col>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            paddingTop: "10px",
            paddingRight: "10px",
          }}
        >
          <Button variant="light" onClick={handleComplete}>
            Complete
          </Button>
        </div>
      </Grid>
    </>
  );
};

export default PaymentModal;
