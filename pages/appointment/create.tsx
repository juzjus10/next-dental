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
import DoctorForm from "@/components/Forms/DoctorForm";
import AppointmentForm from "@/components/Forms/AppointmentForm";
import clinicImage from "public/clinic.jpg";

const Users = () => {
  const [active, setActive] = useState(1);
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

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const queryClient = useQueryClient();

  const { mutate } = useMutation(deleteAppointment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["appointment"], { exact: true });
    },
  });

  return (
    <ApplicationShell>
      <Container my="md">
        <Grid>
          {/* <Grid.Col span={12} sm={6}>
            <Image
              src={clinicImage.src}
              radius={10}
              fit="contain"
              height="100%"
            />
          </Grid.Col> */}
          <Grid.Col span={12}>
            <Paper p={10} radius={10}>
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
                    label="First step"
                    description="Create an account"
                    allowStepSelect={shouldAllowSelectStep(0)}
                  >
                    <AppointmentForm data={[]} />
                  </Stepper.Step>
                  <Stepper.Step
                    label="Second step"
                    description="Verify email"
                    allowStepSelect={shouldAllowSelectStep(1)}
                  >
                    {/* <Content>Step 2 content: Verify email</Content> */}
                  </Stepper.Step>
                  <Stepper.Step
                    label="Final step"
                    description="Get full access"
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
