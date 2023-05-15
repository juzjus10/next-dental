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
import { generateTime, generateTimeFromRange } from "@/utils/generateTime";

const FirstStep = (props: any) => {
  const { setDateValidated, form } = props;
  const queryClient = useQueryClient();

  //get all settings using react query
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getAllSettings,
    refetchOnWindowFocus: false,
  });

  console.log(settings);

  return (
    <form>
      <Grid>
        <Grid.Col span={12} mt="md" md={6} px={20}>
          <DateInput
            mt="md"
            
            variant="filled"
            value={form.values.appointment.date_of_appointment}
            label="Date of Appointment "
            placeholder="MM/DD/YYYY"
            onChange={(e: any) => {
              

              form.setFieldValue("appointment.date_of_appointment", new Date(e));
              setDateValidated(false);
            }}
          />
          {settings && (
            <Select
              mt="md"
              variant="filled"
              value={form.values.appointment.appointment_time}
              data={generateTimeFromRange(
                settings[0]?.opening_time,
                settings[0]?.closing_time
              )}
              onChange={(e) => {
                form.setFieldValue("appointment.appointment_time", e);
                setDateValidated(false)}}
              label="Time of Appointment"
            
            />
          )}

          {/* {!readOnly && (
            <Button
              mt={20}
              type="submit"
              sx={{
                float: "right",
              }}
            >
              Submit
            </Button>
          )} */}
        </Grid.Col>
        <Grid.Col
          span={12}
          mt="md"
          md={6}
          sx={(theme) => ({
            borderRadius: theme.radius.lg,
            padding: rem(20),
            border: `2px dashed ${theme.colors[theme.primaryColor][8]}`,
          //  backgroundColor: theme.colors.gray[9],
            // create a  yellow outer glow
            boxShadow: theme.colorScheme === "dark" ? "none" : `10px 7px 10px 0px ${theme.colors.yellow[4]}`,

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
