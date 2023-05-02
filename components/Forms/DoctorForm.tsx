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
import { IconStethoscope, IconWheelchair } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createDoctor } from "@/lib/api";
import { ReactPropTypes, useEffect } from "react";
import { DateInput } from "@mantine/dates";

// create a type for the initial values of the form
type DoctorFormValues = {
  doctor_name: string;
  gender: string;
 
  dob: Date;
  hire_date: Date;
};
const DoctorForm = (props: any) => {
  const { close, readOnly, data } = props;
  const queryClient = useQueryClient();

  const { mutate } = useMutation((doctorData) => createDoctor(doctorData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["doctor"]);
    },
  });

  const form = useForm<DoctorFormValues>({
    initialValues: {
      doctor_name: "",
      gender: "",
    
      dob: new Date(),
      hire_date: new Date(),
    },
  });

  useEffect(() => {
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
      <Paper mih={500}>
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
            close();
          })}
        >
          <Grid>
            <Grid.Col span={12}>
              <Group grow>
                <TextInput
                  mt="md"
                  label="Doctor Name"
                  placeholder="Doctor Name"
                  disabled={readOnly}
                  {...form.getInputProps("doctor_name")}
                />
                <TextInput
                  mt="md"
                  label="Gender"
                  placeholder="Gender"
                  disabled={readOnly}
                  {...form.getInputProps("gender")}
                />
              </Group>
              <Group grow>
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
              </Group>

              {!readOnly && (
                <>
                  <div
                    style={{
                      //place in bottom right corner
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                    }}
                  >
                    <Button m={5} type="submit">
                      Submit
                    </Button>
                    
                  </div>
                </>
              )}
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default DoctorForm;
