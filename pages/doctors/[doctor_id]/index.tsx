import { useEffect, useState } from "react";
import {
  Text,
  Card,
  Paper,
  Grid, Flex
} from "@mantine/core";
import ApplicationShell from "@/components/Layout";
import { StatsGrid } from "@/components/StatsGrid";
import { DatePicker } from "@mantine/dates";
import { requireAuth } from "common/requireAuth";
import { getSession } from "next-auth/react";
import { getAllAppointments, getUser } from "@/lib/api";
import { useQueries, useQuery } from "@tanstack/react-query";
import TimelineSchedule from "@/components/Dashboard/TimelineSchedule";
import { useRouter } from "next/router";

export default function Dashboard(props: any) {
  const router = useRouter();
  const { session } = props;

  const user = session.user;

  const { date_of_appointment } = router.query;


  const [patientQuery, appointmentQuery] = useQueries({
    queries:[{
      queryKey:  ["user", user.id],
      queryFn: () => getUser(user.id as string),
      enabled: !!user.id,
    },

    {
      queryKey: ["appointments"],
      queryFn: () => getAllAppointments(),
      enabled: !!user.id,
    }],
  })
  const user_data = patientQuery.data;
  const appointments = appointmentQuery.data;



  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);

  const [date, setDate] = useState<Date | null>(
    date_of_appointment ? new Date(date_of_appointment[0]) : new Date()
  );

  

 


  useEffect(() => {
    // filter appointments by doctor id
    const filteredAppointments = appointments?.filter(
      (appointment: any) => appointment.doctor_id === user_data?.doctor.id
    );

    setFilteredAppointments(filteredAppointments);
  }, [date, appointments, user_data, user]);

  return (
    <ApplicationShell>
      {user?.user_level === "doctor" ? (
        <Paper shadow="sm" p="md">
          <StatsGrid appointments={filteredAppointments} />
          <Grid>
            <Grid.Col span={12} md={4} mih={300}>
              <Card withBorder>
                <DatePicker
                  value={date}
                  onChange={setDate}
                  styles={{
                    calendar: {
                      height: "10%",
                      width: "100%",
                    },
                    yearLevelGroup: {
                      width: "100%",
                    },
                    yearLevel: {
                      width: "100%",
                    },
                    calendarHeader: {
                      width: "100%",
                      maxWidth: "100%",
                    },
                    monthsList: {
                      width: "100%",
                    },
                    month: {
                      width: "100%",
                    },
                    pickerControl: {
                      margin: "0 auto",
                    },
                    decadeLevelGroup: {
                      width: "100%",
                    },
                    decadeLevel: {
                      width: "100%",
                    },
                    yearsList: {
                      width: "100%",
                    },
                  }}
                />
              </Card>
            </Grid.Col>
            <Grid.Col span={12} md={8}>
              <TimelineSchedule
                appointments={filteredAppointments}
                date={date}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      ) : (
        <Flex
          mih={500}
          bg="rgba(0, 0, 0, .3)"
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Text>Only doctors can access this page</Text>
        </Flex>
      )}
    </ApplicationShell>
  );
}

export const getServerSideProps = requireAuth(async (ctx) => {
  const session = await getSession(ctx);

  if (session?.user.user_level !== "doctor") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  
  

  return {
    props: {
      session,
    },
  };
});
