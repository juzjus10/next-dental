import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  NumberInput,
  Paper,
  SegmentedControl,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrencyPeso, IconStethoscope, IconWheelchair } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createDoctor, updateDoctor } from "@/lib/api";
import { ReactPropTypes, useEffect } from "react";
import { DateInput } from "@mantine/dates";
import { DataTable } from "mantine-datatable";

// create a type for the initial values of the form
type DoctorFormValues = {
  firstname: string;
  middlename: string;
  lastname: string;
  gender: string;

  dob: Date;
  hire_date: Date;
};
const DoctorForm = (props: any) => {
  const { close, readOnly, data } = props;
  const queryClient = useQueryClient();

  

  const { mutate } = useMutation(
    (doctorData) => (data.id ? updateDoctor(data.id, doctorData) : createDoctor(doctorData)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["doctor"]);
        close();
      },
    }
  );

  const form = useForm<DoctorFormValues>({
    initialValues: {
      firstname: "",
      middlename: "",
      lastname: "",
      gender: "",

      dob: new Date(),
      hire_date: new Date(),
    },
  });

  useEffect(() => {
    console.log("data", data);
    
    // convert date string to Date object
    if (data.dob || data.hire_date) {
      form.setValues({
        ...data,
        dob: new Date(data.dob),
        hire_date: new Date(data.hire_date),
      });
    }
  }, [data]);

  const handleSubmit = (values: any) => {
    try {
      const doctorData = mutate(values);
      console.log("New Doctor created:", doctorData);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <>
      <Paper mih={550} miw={900}>
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
            close();
          })}
        >
          <Grid>
            <Grid.Col span={6}>
              
                  <TextInput
                    mt="md"
                    label="First Name"
                    placeholder="First Name"
                    disabled={readOnly}
                    {...form.getInputProps("firstname")}
                  />
                  <TextInput
                    mt="md"
                    label="Middle Name"
                    placeholder="Middle Name"
                    disabled={readOnly}
                    {...form.getInputProps("middlename")}
                  />
                  <TextInput
                    mt="md"
                    label="Last Name"
                    placeholder="Last Name"
                    disabled={readOnly}
                    {...form.getInputProps("lastname")}
                  />
              

              
                <TextInput
                  mt="md"
                  label="Gender"
                  placeholder="Gender"
                  disabled={readOnly}
                  {...form.getInputProps("gender")}
                />
                <DateInput
                  mt="md"
                  label="Date of Birth"
                  placeholder="Date of Birth"
                  disabled={readOnly}
                  {...form.getInputProps("dob")}
                />
                <DateInput
                  mt="md"
                  label="Date Hired"
                  placeholder="Date Hired"
                  disabled={readOnly}
                  {...form.getInputProps("hire_date")}
                />
             
              {!readOnly && (
                <Button mt={20} type="submit" fullWidth>
                  Submit
                </Button>
              )}
            </Grid.Col>

            <Grid.Col span={6}>
            <DataTable mt="md" 
              withBorder
              height={500}
              records={
                data.Records
              }
              columns={[
                {
                  accessor: "id",
                  title: "Record #",
                  // render the index
                  render: (row: any, index) => index + 1,

                  
                },
                {
                  accessor: "doctor_commission",
                  title: "Doctor Commission",
                  render: (row: any) => 
                  {
                    return (
                      <Group>
                    <IconCurrencyPeso size={20} />
                    {row.doctor_commission}
                    </Group>
                    );
                      
                  },
                }
              ]}></DataTable>

            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default DoctorForm;
