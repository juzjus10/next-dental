import { ContactIconsList } from "@/components/Appointment/ContactIcons";
import {
  getAllSettings,
  getAllDoctors,
  getAllServices,
  getAvailableTimes,
} from "@/lib/api";
import { generateTimeFromRange } from "@/utils/generateTime";
import { Grid, Group, Select, rem, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconClock,
  IconDentalBroken,
  IconMapPin,
  IconPhone,
  IconSun,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const DateAndTimeBookingForm = (props: any) => {
  const { setDateValidated, form } = props;
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const queryClient = useQueryClient();

  //get all doctor using react query
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: getAllDoctors,
    refetchOnWindowFocus: false,
  });

  // get all services using react query
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
    refetchOnWindowFocus: false,
  });

  //get all settings using react query
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getAllSettings,
    refetchOnWindowFocus: false,
  });

  console.log(settings);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (
        form.values.appointment.date_of_appointment &&
        form.values.doctor.id
      ) {
        const response = await queryClient.fetchQuery(
          [
            "availableSlots",
            form.values.appointment.date_of_appointment,
            form.values.doctor.id,
          ],
          () =>
            getAvailableTimes({
              date_of_appointment: form.values.appointment.date_of_appointment,
              doctor_id: form.values.doctor.id,
            })
        );

        setTimeSlots(response);
      }
    };

    fetchAvailableSlots();
  }, [form.values.appointment.date_of_appointment, form.values.doctor.id]);

  return (
    <form>
      <Grid>
        <Grid.Col span={12} mt="md" md={6}>
          <DateInput
            minDate={
              /* 5 days from now  */
              new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
            }
            variant="filled"
            value={form.values.appointment.date_of_appointment}
            label="Date of Appointment "
            placeholder="MM/DD/YYYY"
            onChange={(e: any) => {
              form.setFieldValue(
                "appointment.date_of_appointment",
                new Date(e)
              );
              setDateValidated(false);
            }}
          />
          {services && (
            <Select
              mt="md"
              variant="filled"
              value={form.values.service.id}
              data={services.map((service: any) => ({
                value: service.id,
                label: service.name,
              }))}
              onChange={(e) => {
                form.setFieldValue("service.id", e);
              }}
              label="Service"
            />
          )}
          {doctors && (
            <Select
              mt="md"
              variant="filled"
              value={form.values.doctor.id}
              data={doctors.map((doctor: any) => ({
                value: doctor.id,
                label: `${doctor.firstname} ${doctor.lastname}`,
              }))}
              onChange={(e) => {
                console.log("e", e);
                form.setFieldValue("doctor.id", e);
              }}
              label="Preferred Doctor"
            />
          )}

          {settings && (
            <Select
              mt="md"
              variant="filled"
              value={form.values.appointment.appointment_time}
              data={timeSlots?.map((timeSlot: any) => ({
                value: timeSlot,
                label: timeSlot,
              }))}
              onChange={(e) => {
                form.setFieldValue("appointment.appointment_time", e);
                setDateValidated(false);
              }}
              label="  Time of Appointment"
              icon={<IconClock size={18} />}
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
            boxShadow:
              theme.colorScheme === "dark"
                ? "none"
                : `10px 7px 10px 0px ${theme.colors.yellow[4]}`,
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
