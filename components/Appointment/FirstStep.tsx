import {
  Image,
  Button,
  Center,
  Grid,
  Group,
  SegmentedControl,
  Select,
  TextInput,
  Textarea,
  Title,
  rem,
  Skeleton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconSun,
  IconPhone,
  IconMapPin,
  IconAt,
  IconNavigation,
  IconDentalBroken,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import clinicImage from "public/clinic.jpg";
import { getAllSettings } from "@/lib/api";
import { ContactIconsList } from "@/components/Appointment/ContactIcons";

const FirstStep = (props: any) => {
  const { close, readOnly, form } = props;
  const queryClient = useQueryClient();

  const { mutate } = useMutation((data) => createAppointment(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["appointment"]);
    },
  });
  //get all settings using react query
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getAllSettings,
    refetchOnWindowFocus: false,
  });
  

  const handleSubmit = (values: any) => {
    // try {
    //   const newAppointment = mutate(values);
    //   console.log("New Appointment created:", newAppointment);
    // } catch (error) {
    //   console.error("Error creating Appointment:", error);
    // }
    console.log(values);
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
        <Grid.Col span={12} mt="md" md={6} px={20}>
          <DateInput
            clearable
            label="Date of Appointment "
            placeholder="MM/DD/YYYY"
            {...form.getInputProps("date_of_appointment")}
          />
          <TimeInput
            mt="md"
            label="Time of Appointment "
            {...form.getInputProps("appointment_time")}
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
        <Grid.Col
          span={12}
          mt="md"
          md={6}
          sx={(theme) => ({
            borderRadius: theme.radius.lg,
            padding: rem(20),
            border: `2px dashed ${theme.colors[theme.primaryColor][8]}`,
          })}
        >
          {settings && (
            <ContactIconsList
              variant="white"
              data={[
                {
                  title: "Clinic",
                  description: settings[0]?.clinic_name,
                  icon: IconDentalBroken,
                },
                {
                  title: "Phone",
                  description: settings[0]?.clinic_contact,
                  icon: IconPhone,
                },
                {
                  title: "Address",
                  description: settings[0]?.clinic_address,
                  icon: IconMapPin,
                },
                {
                  title: "Working Hours",
                  description: `${settings[0]?.opening_time} - ${settings[0]?.closing_time}`,
                  icon: IconSun,
                },
              ]}
            />
          )}
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default FirstStep;
