import { FormModal } from "@/components/Forms/FormModal";
import ApplicationShell from "@/components/Layout";
import { getAllPatients, deletePatient, getDoctor, getUser } from "@/lib/api";
import {
  Group,
  Paper,
  Text,
  ActionIcon,
  Grid,
  TextInput,
  Button,
  Modal,
  Divider,
  Badge,
} from "@mantine/core";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconPaperclip,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import UsersForm from "@/components/Forms/UsersForm";
import axios from "axios";
import { requireAuth } from "common/requireAuth";
import { useRouter } from "next/router";
import PatientForm from "@/components/Forms/PatientForm";
import { modals } from "@mantine/modals";
import { exportToPdf } from "@/utils/exportToPdf";
import { getSession } from "next-auth/react";
import DoctorForm from "@/components/Forms/DoctorForm";

const Profile = (props: any) => {
  const router = useRouter();

  const { session } = props;

  const user = session.user;

  const {data: user_data } = useQuery({
    queryKey: ["user", user.id],
    queryFn: () => getUser(user.id as string),
    enabled: !!user.id,
  })


  const {
    isError,
    error,
    data: doctor,
    isFetching,
  } = useQuery({
    queryKey: ["doctor"],
    queryFn: () => getDoctor(user_data?.doctor.id as string),
    refetchOnWindowFocus: false,
    enabled: !!user_data?.doctor.id,
  });

  console.log(doctor);

  return (
    <ApplicationShell>
      <Paper p={10}>
        <Text size={30} weight={700} align="center">
          Doctor Profile
        </Text>
        {doctor && <DoctorForm data={doctor}  readOnly/>}
      </Paper>
    </ApplicationShell>
  );
};

export default Profile;

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
