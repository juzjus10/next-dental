import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import {
  checkAppointment,
  deleteAppointment,
  deleteUser,
  getAllAppointments,
} from "@/lib/api";
import {
  Group,
  Paper,
  Text,
  ActionIcon,
  Grid,
  TextInput,
  Button,
  Modal,
  Divider,
  Badge,
  Box,
  Container,
  Image,
  rem,
  Stepper,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { IconEye, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import { createAppointment } from "@/lib/api";

import { useForm } from "@mantine/form";

import PatientBookingForm from "@/components/Appointment/PatientBookingForm";
import DateAndTimeBookingForm from "@/components/Appointment/DateAndTimeBookingForm";
import moment from "moment";
import Completed from "@/components/Appointment/Completed";
import AppointmentEmail from "@/components/EmailTemplate/AppointmentEmail";

const CreateAppointment = () => {
  const [active, setActive] = useState(0);
  const [dateValidated, setDateValidated] = useState(false);
  const [highestStepVisited, setHighestStepVisited] = useState(active);
  const [patientExists, setPatientExists] = useState(false);


  

  // Allow the user to freely go back and forth between visited steps.
  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step;

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      // Appointment
      appointment: {
        id: "",
        status: "pending",
        appointment_time: "",
        date_of_appointment: "",
      },
      patient: {
        id: "",
        firstname: "",
        middlename: "",
        lastname: "",
        address: "",
        sex: "",
        civil_status: "",
        dob: "",
        mobile_no: "",
        email: "",
        emergency_contact: "",
        emergency_mobile_no: "",
        medical_history: "",
      },
    },

    transformValues: (values) => ({
      ...values,
      age: moment().diff(values.patient.dob, "years"),
    }),
  });

  const { mutate } = useMutation((appointment  :any) => createAppointment(appointment), {
    onSuccess: (response) => {
      console.log("Appointment", response);
      const { patient_id, id } = response.appointment;
      form.setValues({
        ...form.values,
        appointment: {
          ...form.values.appointment,
          id,
        },
        patient: {
          ...form.values.patient,
          id: patient_id,
        },
      });

      console.log(form.values);
      setDateValidated(true);

      queryClient.invalidateQueries(["appointment"]);
    },
  });
  

  const handleStepChange = async (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;

    if (isOutOfBounds) {
      return;
    }
    if (nextStep === 1) {
    }
    if (nextStep === 2 && !dateValidated) {
      //first step
      const { appointment_time, date_of_appointment, status } =
        form.values.appointment;
      if (!appointment_time || !date_of_appointment) {
        return;
      }

      const data = await checkAppointment({
        appointment_time,
        date_of_appointment,
        status,
      });
      console.log("Appointment Data", data);

      if (!data) return;
 
      mutate(form.values)
     
    }
    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  useEffect(() => {
    console.log("form.values", form.values);

    console.log("dateValidated", dateValidated);
  }, [form.values, dateValidated]);

  return (
    <ApplicationShell>
      <Container my="md" size="lg">
        <Grid>
          <Grid.Col span={12}>
            <Paper p={10} radius={10} withBorder>
              <Text size={30} weight={700} align="center">
                Book an Appointment
              </Text>
              <Box p={20}>
                <Stepper
                  active={active}
                  onStepClick={setActive}
                  breakpoint="sm"
                  p={20}
                >
                  <Stepper.Step
                    label="Personal Info"
                    description="Fill up personal details"
                    allowStepSelect={shouldAllowSelectStep(0)}
                  >
                    <PatientBookingForm
                      data={[]}
                      form={form}
                      patientExists={patientExists}
                      setPatientExists={setPatientExists}
                    />
                  </Stepper.Step>
                  <Stepper.Step
                    label="Date & Time"
                    description="Select date and time"
                    allowStepSelect={shouldAllowSelectStep(1)}
                  >
                    <DateAndTimeBookingForm
                      form={form}
                      setDateValidated={setDateValidated}
                    />
                  </Stepper.Step>

                  <Stepper.Completed>
                    <Completed email={form.values.patient.email} />
                  </Stepper.Completed>
                </Stepper>

                <Group position="center" mt="xl">
                  <Button
                    variant="default"
                    onClick={() => handleStepChange(active - 1)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (active === 2) {
                        handleStepChange(0);
                      } else {
                        handleStepChange(active + 1);
                      }
                    }}
                  >
                    {active === 2 ? "Create another appointment" : "Next step"}
                  </Button>
                </Group>
              </Box>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </ApplicationShell>
  );
};

export default CreateAppointment;
