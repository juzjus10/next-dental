import { Timeline, Text } from "@mantine/core";
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
} from "@tabler/icons-react";
import { format, parseISO } from "date-fns";

const TimeLineItem = ({ appointment }: any) => {
  const appointmentDate = new Date(appointment.date_of_appointment);

  return (
    <>
      <Text color="dimmed" size="sm">
        {appointmentDate.toLocaleDateString()} - {appointment.appointment_time}
        <Text variant="link" component="span" inherit>
          {appointment.Doctor?.firstname} {appointment.Doctor?.lastname}
        </Text>{" "}
        {appointment.purpose}
      </Text>
      <Text size="xs" mt={4}>
        {appointment.Patient?.firstname} {appointment.Patient?.lastname}
      </Text>
    </>
  );
};
export default function TimelineSchedule(props: any) {
  const { appointments } = props;
  const sortedAppointments = appointments?.sort((a: any, b: any) => {
    const aTime = parseISO(`${a.date_of_appointment.split('T')[0]}T${convertTo24HourTime(a.appointment_time)}:00.000Z`);
    const bTime = parseISO(`${b.date_of_appointment.split('T')[0]}T${convertTo24HourTime(b.appointment_time)}:00.000Z`);
    return aTime.getTime() - bTime.getTime();
  });

  function convertTo24HourTime(time: string) {
    const [hour, minute, period] = time.split(' ');
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  }

  console.log(sortedAppointments);
  
  return (
    <Timeline active={1} bulletSize={24} lineWidth={2}>
      {sortedAppointments?.map((appointment: any) => (
        <Timeline.Item title={`${appointment.appointment_time}`} key={appointment.id}>
          <TimeLineItem appointment={appointment} />
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
