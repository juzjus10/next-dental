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
  patientId: string;
};
const RecordForm = (props: any) => {
  const { close, readOnly, data, patientId } = props;
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
      patientId: "",
    },
  });

  useEffect(() => {
    // convert date string to Date object
    if( !data) return;

    patientId && form.setValues({ patientId: patientId });
   

   
    if (data.date) {
      data.date && form.setValues({ date: new Date(data.date) });

      form.setValues({
        procedure: data.procedure,
        date: new Date(data.date),
        doctor_notes: data.doctor_notes,
        patientId: patientId,
      });
      console.log("RecordForm: ", data);
      console.log(form.values);
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
      <Paper mih={400}>
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
            close();
          })}
        >
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                mt="md"
                label="Procedure"
                disabled={readOnly}
                {...form.getInputProps("procedure")}
              />
              <Textarea
                mt="md"
                label="Doctor Notes"
                disabled={readOnly}
                {...form.getInputProps("doctor_notes")}
              />
              <DateInput
                mt="md"
                label="Date"
                disabled={readOnly}
                {...form.getInputProps("date")}
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
