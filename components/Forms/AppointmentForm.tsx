import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/lib/api";
import { useEffect } from "react";
import { DateInput } from "@mantine/dates";

const AppointmentForm = (props: any) => {
  const { close, readOnly, data } = props;
  const queryClient = useQueryClient();

  const { mutate } = useMutation((userData) => createUser(userData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["appointment"]);
    },
  });

  const form = useForm({
    initialValues: {
      id: "",
      status: "",
      appointment_time: "",
      date_of_appointment: new Date(),
      created_at: "",
      patient_id: "",
      doctor_id: null,
      Patient: {},
      Doctor: {},
    },
  });

  useEffect(() => {
    data.date_of_appointment = new Date(data.date_of_appointment);
    data.created_at = new Date(data.created_at);
    form.setValues(data);
  }, [data]);

  const handleSubmit = (values: any) => {
    try {
      const newUser = mutate(values);
      console.log("New user created:", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
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
              label="First Name"
              placeholder="First Name"
              disabled={readOnly}
              {...form.getInputProps("Patient.firstname")}
            />

            <TextInput
              mt="md"
              label="Last Name"
              placeholder="Last Name"
              disabled={readOnly}
              {...form.getInputProps("Patient.lastname")}
            />
          </Group>
          <Group grow>
            <TextInput
              mt="md"
              label="Doctor First Name"
              placeholder="Doctor First Name"
              disabled={readOnly}
              {...form.getInputProps("Doctor?.firstname")}
            />
            <TextInput
              mt="md"
              label="Doctor Last Name"
              placeholder="Doctor Last Name"
              disabled={readOnly}
              {...form.getInputProps("Doctor?.lastname")}
            />
          </Group>

          <DateInput
            mt="md"
            label="Date of Appointment"
            placeholder="Date of Appointment"
            disabled={readOnly}
            {...form.getInputProps("date_of_appointment")}
          />
          <TextInput
            mt="md"
            label="Appointment Time"
            placeholder="email@domain.com"
            disabled={readOnly}
            {...form.getInputProps("appointment_time")}
          />

          <TextInput
            mt="md"
            label="Created at"
            placeholder="Time of Appointment Creation"
            disabled={readOnly}
            {...form.getInputProps("created_at")}
          />
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
