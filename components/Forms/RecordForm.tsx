import {
  Button,
  Grid,
  NumberInput,
  Paper,
  Stack,
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
  IconTrash,
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
      queryClient.invalidateQueries(["patient"]),
        queryClient.invalidateQueries(["record"]);
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

    validate: (values) => ({
      procedure: !values.procedure ? "Procedure is required" : null,
      date: !values.date ? "Date is required" : null,
      patientId: !values.patientId ? "Patient is required" : null,
      // service_rendered: !values.service_rendered
      //   ? "Service rendered is required"
      //   : null,
     //  cost: !values.cost ? "Cost is required" : null,
      items: !values.items ? "Items is required" : null,
      doctorId: !values.doctorId ? "Doctor is required" : null,
      
     // amount_paid: !values.amount_paid ? "Amount paid is required" : null,
      // doctor_commission: !values.doctor_commission
      //   ? "Doctor commission is required"
      //   : null,

      doctor_notes: !values.doctor_notes ? "Doctor notes is required" : null,
    }),
  });
  useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      balance: (prev.total_amount ?? 0) - (prev.amount_paid ?? 0),
    }));
  }, [form.values.amount_paid]);
  useEffect(() => {
    // convert date string to Date object
    if (!data) return;

    console.log("RecordForm: ", data);

    patientId && form.setValues({ patientId: patientId });

    // loop through items and add cost to total_amount
    let total = 0;

    // if (form.values.items) {
    //   form.values.items.forEach((item: any) => {
    //     total += item.cost;
    //   });
    //   form.setValues({ items: data.items, total_amount: total });
    // }

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
  }, [data, form.values.items]);

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
              <Paper withBorder p={10} mih={300}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                   
                    height: "100%",
                    gap: "20px",
                  }}
                >
                  <TextInput
                    label="Service Rendered"
                    disabled={readOnly}
                    icon={<IconAppsFilled size={20} />}
                    {...form.getInputProps("service_rendered")}
                  />
                  <NumberInput
                    label="Cost"
                    disabled={readOnly}
                    icon={<IconReceipt2 />}
                    hideControls
                    {...form.getInputProps("cost")}
                  />

                  <Button
                    color="green"
                    variant="light"
                    leftIcon={<IconPlus />}
                    fullWidth
                    onClick={() => {
                      form.values.items.push({
                        service_rendered: form.values.service_rendered,
                        cost: form.values.cost,
                      });

                      form.setValues((prev) => ({
                        ...prev,
                        total_amount:
                          (prev.total_amount ?? 0) + (prev.cost ?? 0),
                      }));
                      console.log(form.values);
                    }}
                    disabled={readOnly}
                  >
                    Add
                  </Button>
                  <Button
                    color="red"
                    variant="light"
                    leftIcon={<IconTrash />}
                    fullWidth
                    onClick={() => {
                      //clear form.values.items
                      form.setValues((prev) => ({
                        ...prev,
                        items: [],
                      }));
                    }}
                    disabled={readOnly}
                  >
                    Clear
                  </Button>
                </div>
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
                borderRadius="sm"
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
                disabled
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
                disabled
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
