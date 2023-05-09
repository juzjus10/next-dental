import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  SegmentedControl,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
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

const AppointmentForm = (props: any) => {
  const { close, readOnly, data } = props;
  const queryClient = useQueryClient();

  const { mutate } = useMutation((data) => createAppointment(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["appointment"]);
    },
  });

  const form = useForm({
    initialValues: {
      status: "pending",
      appointment_time: "",
      date_of_appointment: "",

      patient_id: "",
      firstname: "",
      middlename: "",
      lastname: "",
    },

    transformValues: (values) => ({
      ...values,
      appointment_time: values.date_of_appointment,
      // appointment_time: moment(values.date_of_appointment).format("h:mm a").toLocaleString(),
    }),
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
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
        // console.log(values);

        close();
      })}
    >
      <Grid>
        <Grid.Col span={12}>
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

          {/* <Title order={4} pt={7}>
            Doctor Details
          </Title>
          <Group grow>
            <TextInput
              label="First Name"
              placeholder="First Name"
              disabled={readOnly}
              {...form.getInputProps("doctor.firstname")}
            />
            <TextInput
              label="Middle Name"
              placeholder="Middle Name"
              disabled={readOnly}
              {...form.getInputProps("doctor.middlename")}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              disabled={readOnly}
              {...form.getInputProps("doctor.lastname")}
            />
          </Group> */}
          {/* <Select
            mt="md"
            label="Status"
            placeholder="Pick one"
            data={[
              { value: "pending", label: "Pending" },
              { value: "finished", label: "Finished" },
              { value: "followUp", label: "Follow-up" },
            ]}
            disabled={readOnly}
            {...form.getInputProps("user_level")}
          /> */}

          <TextInput
            mt="md"
            label="Address"
            placeholder="Address"
            disabled={readOnly}
            {...form.getInputProps("address")}
          />

          <TextInput
            mt="md"
            label="Email"
            placeholder="email@domain.com"
            type="email"
            disabled={readOnly}
            {...form.getInputProps("email")}
          />
         
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

          <DateTimePicker
            mt="md"
            clearable
            label="Date and Time of Appointment "
            placeholder="MM/DD/YYYY"
            {...form.getInputProps("date_of_appointment")}
          />
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

export default AppointmentForm;
