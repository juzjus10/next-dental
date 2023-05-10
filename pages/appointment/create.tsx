import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import { deleteAppointment, deleteUser, getAllAppointments } from "@/lib/api";
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



import { useForm } from "@mantine/form";

import FirstStep from "@/components/Appointment/FirstStep";
import SecondStep from "@/components/Appointment/SecondStep";
import moment from "moment";

const Users = () => {
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;

    if (isOutOfBounds) {
      return;
    }

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  // Allow the user to freely go back and forth between visited steps.
  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step;

  useEffect(() => {
    console.log(active);
  }, [active]);

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

  
  const form = useForm({
    initialValues: {
      status: "pending",
      appointment_time: "",
      date_of_appointment: "",

      patient_id: "",
      firstname: "",
      middlename: "",
      lastname: "",
      address: "",
      sex: "",
      civil_status: "",
      dob: "",
      mobile_no: "",
      emergency_contact: "",
      emergency_mobile_no: "",
      medical_history: "",
    },

    transformValues: (values) => ({
      ...values,
      age: moment().diff(values.dob, "years"),
     
    }),
  });

  useEffect(() => {
    console.log("form.values", form.values);
    
  }, [form.values]);

  
  return (
    <ApplicationShell>
      <Container my="md" size="lg" >
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
                >
                  <Stepper.Step
                    label="Date & Time"
                    description="Select date and time"
                    allowStepSelect={shouldAllowSelectStep(0)}
                  >
                    <FirstStep form={form} />
                  </Stepper.Step>
                  <Stepper.Step
                    label="Personal Info"
                    description="Fill up personal details"
                    allowStepSelect={shouldAllowSelectStep(1)}
                  >
                    <SecondStep data={[]} form={form} />
                  </Stepper.Step>
                  <Stepper.Step
                    label="Email Confirmation"
                    description="Confirm your email"
                    allowStepSelect={shouldAllowSelectStep(2)}
                  >
                    {/* <Content>Step 3 content: Get full access</Content> */}
                  </Stepper.Step>

                  <Stepper.Completed>
                    {/* <Content>
                      Completed, click back button to get to previous step
                    </Content> */}
                  </Stepper.Completed>
                </Stepper>

                <Group position="center" mt="xl">
                  <Button
                    variant="default"
                    onClick={() => handleStepChange(active - 1)}
                  >
                    Back
                  </Button>
                  <Button onClick={() => handleStepChange(active + 1)}>
                    Next step
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

export default Users;
