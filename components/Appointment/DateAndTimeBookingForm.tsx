import { ContactIconsList } from "@/components/Appointment/ContactIcons";
import { getAllSettings } from "@/lib/api";
import { generateTimeFromRange } from "@/utils/generateTime";
import {
  Grid, Select, rem
} from "@mantine/core";
import {
  DateInput
} from "@mantine/dates";
import {
  IconDentalBroken,
  IconMapPin,
  IconPhone,
  IconSun
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const DateAndTimeBookingForm = (props: any) => {
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
            minDate={new Date()}
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

export default DateAndTimeBookingForm;
