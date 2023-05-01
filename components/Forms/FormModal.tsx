import React from "react";
import { Modal, Text, Button, ActionIcon } from "@mantine/core";
import UsersForm from "@/components/Forms/UsersForm";
import { useDisclosure } from "@mantine/hooks";
import { IconEye } from "@tabler/icons-react";

export function FormModal(props: any) {
  const { title, icon, user } = props;
  const [opened, { open, close }] = useDisclosure(false);

  //console.log(user);
  
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
        <Button onClick={open} variant="light" radius="xl">
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
        size="lg"
        title={
          <Text
            m={5}
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
        <UsersForm close={close} data={ user ? user : null}  readOnly= {user ? true: false} ></UsersForm>

       
      </Modal>
    </>
  );
}
