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
import { DateInput, DatePicker, DateTimePicker, TimeInput } from "@mantine/dates";
import moment from 'moment';

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
      status: "",
      appointment_time: "",
      date_of_appointment: "",
      patient: {
        patient_id: "",
        firstname: "",
        middlename: "",
        lastname: "",
      },
      doctor: {
        doctor_id: "",
        firstname: "",
        middlename: "",
        lastname: "",
      },
    },

    transformValues: (values) => ({
      ...values,
      appointment_time: values.date_of_appointment,
      // appointment_time: moment(values.date_of_appointment).format("h:mm a").toLocaleString(),
    }),
  });
  useEffect(() => {
    console.log(form.values)
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
          <Title order={4} pt={7}>
            Patient Details
          </Title>
          <Group grow>
            <TextInput
              label="First Name"
              placeholder="First Name"
              disabled={readOnly}
              {...form.getInputProps("patient.firstname")}
            />
            <TextInput
              label="Middle Name"
              placeholder="Middle Name"
              disabled={readOnly}
              {...form.getInputProps("patient.middlename")}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              disabled={readOnly}
              {...form.getInputProps("patient.lastname")}
            />
          </Group>

          <Title order={4} pt={7}>
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
          </Group>
          <Select
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
          />
       

          <TextInput
            mt="md"
            label="Email"
            placeholder="email@domain.com"
            type="email"
            disabled={readOnly}
            {...form.getInputProps("email")}
          />
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
