import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconStethoscope, IconWheelchair } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createPatient, updatePatient } from "@/lib/api";
import { ReactPropTypes, useEffect } from "react";
import { DateInput } from "@mantine/dates";

// create a type for the initial values of the form
type PatientFormValues = {
  address: string;
  age: string;
  sex: string;
  civil_status: string;
  dob: Date;
  mobile_no: string;
  emergency_contact: string;
  emergency_mobile_no: string;
  medical_history: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
};
const PatientForm = (props: any) => {
  const { close, readOnly, data } = props;
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (patientData) => (data.id ? updatePatient(data.id, patientData) : createPatient(patientData)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["patient"]);
        close();
      },
    }
  );

  const form = useForm<PatientFormValues>({
    initialValues: {
      address: "",
      age: "",
      sex: "",
      civil_status: "",
      dob: new Date(),
      mobile_no: "",
      emergency_contact: "",
      emergency_mobile_no: "",
      medical_history: "",
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
    },
  });

  useEffect(() => {
    // convert date string to Date object
    console.log("data", data)
  
    
    if (data.dob) {
      form.setValues({
        ...data,
        dob: new Date(data.dob),
      });
    }
    
  }, [data]);

  const handleSubmit = (values: any) => {
    try {
      const newPatient = mutate(values);
      console.log("New patient created:", newPatient);
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
          </Group>
          <Group grow>
            <TextInput
              mt="md"
              label="Address"
              placeholder="Address"
              disabled={readOnly}
              {...form.getInputProps("address")}
            />
            <NumberInput
              mt="md"
              label="Age"
              placeholder="Age"
              disabled={readOnly}
              {...form.getInputProps("age")}
            />
            <TextInput
              mt="md"
              label="Sex"
              placeholder="Sex"
              disabled={readOnly}
              {...form.getInputProps("sex")}
            />
          </Group>
          <Group grow>
            <TextInput
              mt="md"
              label="Civil Status"
              placeholder="Civil Status"
              disabled={readOnly}
              {...form.getInputProps("civil_status")}
            />
            <DateInput
              mt="md"
              label="Date of Birth"
              placeholder="Date of Birth"
              disabled={readOnly}
              {...form.getInputProps("dob")}
            />
          </Group>

          <TextInput
            mt="md"
            label="Mobile Number"
            placeholder="(+63) 123 456 7890"
            disabled={readOnly}
            {...form.getInputProps("mobile_no")}
          />
           <TextInput
              mt="md"
              type="email"
              label="Email"
              placeholder="domain@host.com"
              disabled={readOnly}
              {...form.getInputProps("email")}
            />

          <Group grow>
            <TextInput
              mt="md"
              label="Emergency Contact Person"
              placeholder="Emergency Contact Person"
              disabled={readOnly}
              {...form.getInputProps("emergency_contact")}
            />
            <TextInput
              mt="md"
              label="Emergency Contact Number"
              placeholder="(+63) 123 456 7890"
              disabled={readOnly}
              {...form.getInputProps("emergency_mobile_no")}
            />
          </Group>
          <Textarea
            mt="md"
            label="Medical History"
            placeholder="Medical History"
            disabled={readOnly}
            {...form.getInputProps("medical_history")}
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

export default PatientForm;
