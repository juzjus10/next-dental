import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  SegmentedControl,
  Select,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconStethoscope, IconWheelchair } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createAppointment } from "@/lib/api";
import { ReactPropTypes, useEffect } from "react";
import {
  DateInput,
  DatePicker,
  DateTimePicker,
  TimeInput,
} from "@mantine/dates";
import moment from "moment";

const SecondStep = (props: any) => {
  const { close, readOnly, data, form } = props;
  const queryClient = useQueryClient();

  const { mutate } = useMutation((data) => createAppointment(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["appointment"]);
    },
  });

  
  useEffect(() => {
    console.log(form.values);
    // console.log(  form.getTransformedValues())
  }, [form.values]);

  useEffect(() => {
    form.setValues(data);
  }, [data]);

  const handleSubmit = (values: any) => {
    try {
      const newAppointment = mutate(values);
      console.log("New Appointment created:", newAppointment);
    } catch (error) {
      console.error("Error creating Appointment:", error);
    }
  };
  return (
    <form
      onSubmit={form.onSubmit((values: any) => {
        handleSubmit(values);
        // console.log(values);

        close();
      })}
    >
      <Title size={20} mt="md" weight={400}>
        Patient Details
      </Title>
      <Grid>
        <Grid.Col span={12} mt="md">
          <Group grow>
            <TextInput
              label="First Name"
              placeholder="First Name"
              disabled={readOnly}
              {...form.getInputProps("firstname")}
            />
            <TextInput
              label="Middle Name"
              placeholder="Middle Name"
              disabled={readOnly}
              {...form.getInputProps("middlename")}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              disabled={readOnly}
              {...form.getInputProps("lastname")}
            />
          </Group>

          <TextInput
            mt="md"
            label="Address"
            placeholder="Street, Barangay, City, Province"
            disabled={readOnly}
            {...form.getInputProps("address")}
          />
          <Group grow>
            <TextInput
              mt="md"
              label="Email"
              placeholder="email@domain.com"
              type="email"
              disabled={readOnly}
              {...form.getInputProps("email")}
            />
            <TextInput
              mt="md"
              label="Contact Number"
              placeholder="(+63) 912 345 6789"
              disabled={readOnly}
              {...form.getInputProps("mobile_no")}
            />
          </Group>

          <Group grow>
            <TextInput
              mt="md"
              label="Age"
              placeholder="Age"
              disabled={readOnly}
              {...form.getInputProps("age")}
            />
            <Select
              mt="md"
              label="Sex"
              placeholder="Pick one"
              data={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              {...form.getInputProps("sex")}
            ></Select>
            <Select
              mt="md"
              label="Civil Status"
              placeholder="Pick one"
              data={[
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "widowed", label: "Widowed" },
                { value: "separated", label: "Separated" },
                { value: "divorced", label: "Divorced" },
              ]}
              {...form.getInputProps("sex")}
            ></Select>
          </Group>
          <DateInput
            mt="md"
            clearable
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            {...form.getInputProps("dob")}
          />
          <Title size={20} mt="md" weight={400}>
            Emergency Details
          </Title>
          <Group grow>
            <TextInput
              mt="md"
              label="Emergency Contact Name"
              placeholder="John Doe"
              disabled={readOnly}
              {...form.getInputProps("emergency_contact")}
            />
            <TextInput
              mt="md"
              label="Emergency Contact Number"
              placeholder="(+63) 912 345 6789"
              disabled={readOnly}
              {...form.getInputProps("emergency_mobile_no")}
            />
          </Group>
          <Textarea
            mt="md"
            label="Medical History"
            placeholder="sickness, allergies, etc."
            {...form.getInputProps("medical_history")}
          ></Textarea>

          {/* <DateTimePicker
            mt="md"
            clearable
            label="Date and Time of Appointment "
            placeholder="MM/DD/YYYY"
            {...form.getInputProps("date_of_appointment")}
          /> */}

          {/* <DateInput 
            mt="md"
            clearable
            label="Date and Time of Appointment "
            placeholder="MM/DD/YYYY HH:MM"
            {...form.getInputProps("date_of_appointment")}
          />
          <TimeInput 
           mt="md"
           label="Time of Appointment "
          
           {...form.getInputProps("appointment_time")}
          /> */}
          {!readOnly && (
            <Button
              mt={20}
              type="submit"
              sx={{
                float: "right",
              }}
            >
              Submit
            </Button>
          )}
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default SecondStep;
