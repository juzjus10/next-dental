import React from "react";
import { Modal, Text, Button, ActionIcon } from "@mantine/core";
import UsersForm from "@/components/Forms/UsersForm";
import AppointmentForm from "@/components/Forms/AppointmentForm";
import PatientForm from "@/components/Forms/PatientForm";
import DoctorForm from "@/components/Forms/DoctorForm";
import RecordForm from "@/components/Forms/RecordForm";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconPlus } from "@tabler/icons-react";



export function FormModal(props: any) {
  const { title, icon, user, appointment, patient, doctor, record, patientId, doctorId} = props;
  const [opened, { open, close }] = useDisclosure(false);

  //console.log(patientId);

  const renderActionButton = () => {
    if (icon) {
      return (
        <ActionIcon
          color="green"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
        >
          <IconEye size={16} />
        </ActionIcon>
      );
    } else {
      return (
        <Button onClick={open} variant="light" radius="xl" leftIcon={<IconPlus/>}>
          Create
        </Button>
      );
    }
  };
  return (
    <>
      {renderActionButton()}

      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        mih={400}
       
        title={
          <Text
          
            size={20}
            weight={700}
            sx={(theme) => ({
              color: theme.colors.primary[6],
            })}
          >
            {title}
          </Text>
        }
        withCloseButton
      >
        {user && (
          <UsersForm
            close={close}
            data={user ? user : null}
            readOnly={user.id ? true : false}
          ></UsersForm>
        )}

        {appointment && (
          <AppointmentForm
            close={close}
            data={appointment ? appointment : null}
            readOnly={appointment.id ? true : false}
          ></AppointmentForm>
        )}

        {patient && (
          <PatientForm
            close={close}
            data={patient ? patient : null}
            readOnly={patient.id ? true : false}
          ></PatientForm>
        )}

        {doctor && (
          <DoctorForm
            close={close}
            data={doctor ? doctor : null}
            readOnly={doctor.id ? true : false}
          ></DoctorForm>
        )}

        {record && patientId && (
          <RecordForm
            close={close}
            data={record ? record : null}
            patientId={patientId}
            doctorId={doctorId}
            readOnly={record.id ? true : false}
          ></RecordForm>
        )}
      </Modal>
    </>
  );
}
