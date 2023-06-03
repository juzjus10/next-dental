import {
  Button,
  Grid,
  NumberInput,
  Paper,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAppsFilled,
  IconCalendar,
  IconCurrencyPeso,
  IconPlus,
  IconReceipt2,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecord } from "@/lib/api";
import { useEffect } from "react";
import { DateInput } from "@mantine/dates";
import { DataTable } from "mantine-datatable";

// create a type for the initial values of the form
type RecordFormValues = {
  procedure: string;
  date: Date;
  doctor_notes: string;
  patientId: string;
  service_rendered: string;
  cost: number;
  items: any[];
  doctorId: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  doctor_commission: number;
};
const RecordForm = (props: any) => {
  const { close, readOnly, data, patientId, doctorId } = props;
  const queryClient = useQueryClient();

  const { mutate } = useMutation((recordData) => createRecord(recordData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["doctor"]);
    },
  });

  const form = useForm<RecordFormValues>({
    initialValues: {
      procedure: "",
      date: new Date(),
      doctor_notes: "",
      patientId: "",
      service_rendered: "",
      cost: 0,
      items: [],
      doctorId: doctorId || "",
      total_amount: 0,
      amount_paid: 0,
      balance: 0,
      doctor_commission: 0,
    },
  });

  useEffect(() => {
    // convert date string to Date object
    if (!data) return;

    console.log("RecordForm: ", data);

    patientId && form.setValues({ patientId: patientId });

    if (data.date) {
      data.date && form.setValues({ date: new Date(data.date) });

      form.setValues({
        procedure: data.procedure,
        date: new Date(data.date),
        doctor_notes: data.doctor_notes,
        patientId: patientId,
        service_rendered: data.service_rendered,
        cost: data.cost,
        items: data.items,
        doctorId: doctorId,
        total_amount: data.total_amount,
        amount_paid: data.amount_paid,
        balance: data.balance,
        doctor_commission: data.doctor_commission,
      });
      console.log("RecordForm: ", data);
      console.log(form.values);
    }
  }, [data]);

  const handleSubmit = (values: any) => {
    try {
      const recordData = mutate(values);
      console.log("New Record created:", recordData);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <>
      <Paper mih={400} miw={800}>
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
            close();
          })}
        >
          <Grid>
            <Grid.Col span={6}>
              <Paper withBorder p={10} >
                <TextInput
                  label="Service Rendered"
                  disabled={readOnly}
                  icon={<IconAppsFilled size={20} />}
                  {...form.getInputProps("service_rendered")}
                />
                <NumberInput
                  mt="md"
                  label="Cost"
                  disabled={readOnly}
                  icon={<IconReceipt2 />}
                  hideControls
                  {...form.getInputProps("cost")}
                />
                <Button
                  mt={20}
                  color="green"
                  variant="light"
                  leftIcon={<IconPlus />}
                  fullWidth
                  onClick={() => {
                    form.values.items.push({
                      service_rendered: form.values.service_rendered,
                      cost: form.values.cost,
                    });
                    form.setValues(form.values);
                    console.log(form.values);
                  }}
                  disabled={readOnly}
                >
                  Add
                </Button>
              </Paper>

              <DateInput
                mt="md"
                icon={<IconCalendar />}
                label="Date"
                disabled={readOnly}
                {...form.getInputProps("date")}
              />
              <TextInput
                mt="md"
                label="Procedure"
                disabled={readOnly}
                {...form.getInputProps("procedure")}
              />
              <Textarea
                mt="md"
                label="Doctor Notes"
                disabled={readOnly}
                {...form.getInputProps("doctor_notes")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DataTable
               
                height={300}
                withBorder
                withColumnBorders
                records={form.values.items}
                columns={[
                  {
                    accessor: "id",
                 
                    hidden: true,
                  },
                  {
                    accessor: "service_rendered",
                    title: "Service Rendered",
                  },
                  {
                    accessor: "cost",
                    title: "Cost",
                  },
                ]}
              ></DataTable>

              <NumberInput
                mt="md"
                icon={<IconCurrencyPeso />}
                hideControls
                label="Total Amount"
                disabled={readOnly}
                {...form.getInputProps("total_amount")}
              />
              <NumberInput
                mt="md"
                icon={<IconCurrencyPeso />}
                hideControls
                label="Amount Paid"
                disabled={readOnly}
                {...form.getInputProps("amount_paid")}
              />
              <NumberInput
                mt="md"
                icon={<IconCurrencyPeso />}
                hideControls
                label="Balance"
                disabled={readOnly}
                {...form.getInputProps("balance")}
              />

              <NumberInput
                mt="md"
                icon={<IconCurrencyPeso />}
                hideControls
                label="Doctor Commission"
                disabled={readOnly}
                {...form.getInputProps("doctor_commission")}
              />
            </Grid.Col>
            {!readOnly && (
              <Button mt={20} type="submit" variant="light" m={10} fullWidth>
                Submit
              </Button>
            )}
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default RecordForm;
