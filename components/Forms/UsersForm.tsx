import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  SegmentedControl,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconStethoscope, IconWheelchair } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createUser, updateUser } from "@/lib/api";
import { ReactPropTypes, useEffect } from "react";

import { useSession } from "next-auth/react";

const UsersForm = (props: any) => {
  const { close, readOnly, data } = props;
  const queryClient = useQueryClient();
  const { update, data:session  } = useSession();

  const { mutate } = useMutation(
    (userData) =>
      data.id ? updateUser(data.id, userData) : createUser(userData),
    {
      onSuccess: async (userData) => {
         await update({
          ...session,
          user: {
            ...session?.user,
            user_level: userData.user_level,
          },

          
         });
        queryClient.invalidateQueries(["users"]);
        close();
      },
    }
  );

  const form = useForm({
    initialValues: {
      firstname: "",
      lastname: "",
      middlename: "",
      user_level: "dentist",
      email: "",
      patient: true,
      doctor: false,
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    form.setValues(data);
  }, [data]);

  const handleSubmit = (values: any) => {
    try {
      const newUser = mutate(values);
      console.log("New user created:", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
        close();
      })}
    >
      <Grid>
        <Grid.Col span={12}>
          <Group grow>
            <TextInput
              mt="md"
              label="First Name"
              placeholder="First Name"
              disabled={readOnly}
              {...form.getInputProps("firstname")}
            />
            <TextInput
              mt="md"
              label="Middle Name"
              placeholder="Middle Name"
              disabled={readOnly}
              {...form.getInputProps("middlename")}
            />
            <TextInput
              mt="md"
              label="Last Name"
              placeholder="Last Name"
              disabled={readOnly}
              {...form.getInputProps("lastname")}
            />
          </Group>
          <Group grow>
            <TextInput
              mt="md"
              label="Username"
              placeholder="username"
              disabled={readOnly}
              {...form.getInputProps("username")}
            />
            <TextInput
              mt="md"
              label="Password"
              type="password"
              placeholder="password"
              disabled={readOnly}
              {...form.getInputProps("password")}
            />
          </Group>

          <Select
            mt="md"
            label="User Level"
            placeholder="Pick one"
            data={[
              { value: "admin", label: "Admin" },
              { value: "dentist", label: "Dentist" },
            ]}
            disabled={readOnly}
            {...form.getInputProps("user_level")}
          />
          <TextInput
            mt="md"
            label="Email"
            placeholder="email@domain.com"
            type="email"
            disabled={readOnly}
            {...form.getInputProps("email")}
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

        {/* <Grid.Col span={6}>
          {form.values.patient && (
            <>
              <TextInput
                mt="md"
                label="Address"
                placeholder="address"
                {...form.getInputProps("address")}
              />
              <TextInput
                mt="md"
                label="Age"
                placeholder="age"
                {...form.getInputProps("age")}
              />
              <TextInput
                mt="md"
                label="Sex"
                placeholder="sex"
                {...form.getInputProps("sex")}
              />
              <TextInput
                mt="md"
                label="Civil Status"
                placeholder="civil status"
                {...form.getInputProps("civil_status")}
              />
              <TextInput
                mt="md"
                label="Date of Birth"
                placeholder="date of birth"
                {...form.getInputProps("dob")}
              />
              <TextInput
                mt="md"
                label="Mobile Number"
                placeholder="(+63) 1234 567 890"
                {...form.getInputProps("mobile_number")}
              />
            </>
          )}
          {form.values.doctor && (
            <>
              <TextInput
                mt="md"
                label="Name"
                placeholder="name"
                {...form.getInputProps("name")}
              />
              <TextInput
                mt="md"
                label="Sex"
                placeholder="sex"
                {...form.getInputProps("sex")}
              />
              <TextInput
                mt="md"
                label="Date of Birth"
                placeholder="date of birth"
                {...form.getInputProps("dob")}
              />
              <TextInput
                mt="md"
                label="Hire Date"
                placeholder="hire date"
                {...form.getInputProps("hire_date")}
              />
            
            </>
          )}
        </Grid.Col> */}
      </Grid>
    </form>
  );
};

export default UsersForm;
