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
  import { createRecord } from "@/lib/api";
  import { ReactPropTypes, useEffect } from "react";
  import { DateInput } from "@mantine/dates";
  
  // create a type for the initial values of the form
  type RecordFormValues = {
    procedure: string;
    date: Date;
    doctor_notes: string;
    patient_id: string;
    doctor_id: string;
  };
  const RecordForm = (props: any) => {
    const { close, readOnly, data } = props;
    const queryClient = useQueryClient();
  
    const { mutate } = useMutation((recordData) => createRecord(recordData), {
      onSuccess: () => {
        queryClient.invalidateQueries(["doctor"]);
      },
    });
  
    const form = useForm<RecordFormValues>({
      initialValues: {
        procedure: "",
        date: new Date(),
        doctor_notes: "",
        patient_id: "",
        doctor_id: "",
        
      },
    });
  
    useEffect(() => {
      // convert date string to Date object
      if (data) {
        form.setValues({
          ...data,
          patient_id: data.Patient.id,
            doctor_id: data.Doctor.id,
        });
      }
    }, [data]);
  
    const handleSubmit = (values: any) => {
      try {
        const recordData = mutate(values);
        console.log("New Record created:", recordData);
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
                
                    <NumberInput
                      mt="md"
                      label="Amount Paid"
                      disabled={readOnly}
                      {...form.getInputProps("amount_paid")}
                    />
                    <NumberInput
                      mt="md"
                      label="Balance"
                      disabled={readOnly}
                      {...form.getInputProps("balance")}
                    />
                    <NumberInput
                      mt="md"
                      label="Commission"
                      disabled={readOnly}
                      {...form.getInputProps("commission")}
                    />
                
  
                
  
                {!readOnly && (
                  <Button mt={20} type="submit" fullWidth>
                    Submit
                  </Button>
                )}
              </Grid.Col>
            </Grid>
          </form>
        </Paper>
      </>
    );
  };
  
  export default RecordForm;
  