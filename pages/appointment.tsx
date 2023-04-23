import ApplicationShell from "@/components/Layout";
import { Grid, Paper, Text} from "@mantine/core";
import { DataTable } from "mantine-datatable";

const Apointment = () => {
  const records = [
    {
      appointment_no: 1,
      patient_no: 1001,
      treatment: "Dental Cleaning",
      doctor_no: 2001,
      appointment_time: "2023-05-01T09:00:00.000Z",
      date_of_appointment: "2023-05-01"
    },
    {
      appointment_no: 2,
      patient_no: 1002,
      treatment: "Eye Exam",
      doctor_no: 2003,
      appointment_time: "2023-05-02T10:30:00.000Z",
      date_of_appointment: "2023-05-02"
    },
    {
      appointment_no: 3,
      patient_no: 1003,
      treatment: "Physical Therapy",
      doctor_no: 2004,
      appointment_time: "2023-05-03T14:00:00.000Z",
      date_of_appointment: "2023-05-03"
    },
    {
      appointment_no: 4,
      patient_no: 1004,
      treatment: "Blood Test",
      doctor_no: 2002,
      appointment_time: "2023-05-04T11:15:00.000Z",
      date_of_appointment: "2023-05-04"
    }
  ];
  return (
    <ApplicationShell>
      <Paper p={10} >
      <Text size={30} weight={700} color="blue" align="center"> Appointment List </Text>
      <DataTable
      m={10}
      mih={200}
      withBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      // provide data
      records={records}
      // define columns
      columns={[
        {
          accessor: 'id',
          // this column has a custom title
          title: '#',
          // right-align column
          textAlignment: 'right',
          hidden: true,
        },
        { accessor: 'treatment' },
        {
          accessor: 'appointment_time',
         
        },
        { accessor: 'createdAt' },
        {accessor: 'action'}
      ]}
      // execute this callback when a row is clicked
      onRowClick={({ name, party, bornIn }) =>
        alert(`You clicked me`)
      }
    />

      </Paper>
    
    </ApplicationShell>
  );
};

export default Apointment;
