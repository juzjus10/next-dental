import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAppsFilled,
  IconCalendar,
  IconCurrencyPeso,
  IconEdit,
  IconPlus,
  IconReceipt2,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRecord, getAllServices, updateAppointment } from "@/lib/api";
import { useEffect, useState } from "react";
import { DateInput } from "@mantine/dates";
import { DataTable } from "mantine-datatable";
// create a type for the initial values of the form
type RecordFormValues = {
  date: Date;
  doctor_notes: string;
  patientId: string;
  cost: number;
  items: any[];
  doctorId: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  doctor_commission: number;
};

const SelectService = (props: any) => {
  const { services, form } = props;
  // console.log(services);

  const [category, setCategory] = useState<any>();

  const categories = Array.from(
    new Set(services.map((item: any) => item.category))
  );

  const CheckBoxes = () => {
    const [checked, setChecked] = useState<boolean[]>([]);

    const servicesByCategory = services.filter(
      (service: any) => service.category === category
    );

    const handleCheck = (index: number) => {
      const newChecked = [...checked];
      newChecked[index] = !newChecked[index];
      setChecked(newChecked);
    };

    const handleAddService = () => {
      const selectedServices = servicesByCategory.filter(
        (service: any, index: number) => checked[index]
      );

      const items = selectedServices.map((service: any) => ({
        id: service.id,
        category: service.category,
        name: service.name,
        cost: service.cost,
      }));

      form.values.items.push(...items);
      form.setFieldValue(
        "total_amount",
        items.reduce((a: any, b: any) => a + b.cost, 0)
      );

      console.log(form.values.items);
    };

    return (
      <div>
        {servicesByCategory.map((service: any, index: number) => (
          <Checkbox
            m={5}
            key={service.id}
            checked={checked[index] || false}
            onChange={() => handleCheck(index)}
            label={service.name}
          />
        ))}

        <Button mt="md" variant="light" fullWidth onClick={handleAddService}>
          Add Service
        </Button>
      </div>
    );
  };

  return (
    <>
      <Select
        placeholder="Select service"
        value={category}
        data={[
          ...categories.map((category: any) => ({
            label: category,
            value: category,
          })),
        ]}
        onChange={(value) => setCategory(value)}
      />
      <CheckBoxes />
    </>
  );
};
const RecordForm = (props: any) => {
  const { close, readOnly, data, patientId, doctorId, appointment } = props;
  const queryClient = useQueryClient();

  //create query to get all services
  console.log("appointment: ", appointment);

  const { data: services } = useQuery(["services"], () => getAllServices());

  const { mutate: mutated_record } = useMutation(
    (recordData) => createRecord(recordData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["patient"]);
        queryClient.invalidateQueries(["record"]);
      },
    }
  );

  const form = useForm<RecordFormValues>({
    initialValues: {
      date: new Date(),
      doctor_notes: "",
      patientId: "",
      cost: 0,
      items: [],
      doctorId: doctorId || "",
      total_amount: 0,
      amount_paid: 0,
      balance: 0,
      doctor_commission: 0,
    },

    validate: (values) => ({
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
        date: new Date(data.date),
        doctor_notes: data.doctor_notes,
        patientId: patientId,
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
  }, [data, form.values.items, services]);

  const handleSubmit = (values: any) => {
    try {
      const recordData = mutated_record({
        ...values,
        appointment_id: appointment.id,
      });

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
              {appointment?.Service?.name && (
                <Group my="md">
                  <Text>Main Procedure: </Text>
                  <Text>{appointment?.Service?.name}</Text>
                </Group>
              )}
              <Paper withBorder p={10} mih={300}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",

                    height: "100%",
                    gap: "20px",
                  }}
                >
                  {services && (
                    <SelectService services={services} form={form} />
                  )}
                  {/* <Select
                    data={services ? services.filter(
                      (service: any) => service.category === "Procedure"
                    ) : [] } 
                    label="Services"
                    disabled={readOnly}
                    icon={<IconAppsFilled size={20} />}
                    {...form.getInputProps("service_rendered")}
                             /> */}
                  {/* <NumberInput
                    label="Cost"
                    disabled={readOnly}
                    icon={<IconReceipt2 />}
                    hideControls
                    {...form.getInputProps("cost")}
                  /> */}

                  {/* <Button
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
                  </Button> */}
                </div>
              </Paper>

              <DateInput
                mt="md"
                icon={<IconCalendar />}
                label="Date"
                disabled={readOnly}
                {...form.getInputProps("date")}
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
                    accessor: "name",
                    title: "Service Rendered",
                  },
                  {
                    accessor: "cost",
                    title: "Cost",
                  },
                  {
                    accessor: "actions",
                    title: "Actions",

                    render: (row: any) => (
                      //Delete button
                      <Center>
                        <ActionIcon
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            form.setValues((prev) => ({
                              ...prev,
                              items: prev?.items?.filter(
                                (item: any) => item.id !== row.id
                              ),
                            }));
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Center>
                    ),
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
