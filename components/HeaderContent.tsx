import { useState } from "react";
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconChevronDown,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";


const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.xs,
    // backgroundColor:
    //   theme.colorScheme === "dark"
    //     ? theme.colors.dark[6]
    //     : theme.colors.gray[0],

    marginBottom: rem(120),
  },

  user: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[9],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

   

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },


}));

interface HeaderTabsProps {
  user: { name: string; image: string };
  tabs: string[];
}

export function HeaderContent({ user, tabs }: HeaderTabsProps) {
  const { classes, theme, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { data: session } = useSession();

  return (
    <div className={classes.header}>
      <Container>
        <Group position="apart">
          <Image
            src="./header-logo.png"
            alt="MC Dental Clinic Logo"
            width={50}
            height={50}
            fit="contain"
          />

          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color={theme.white}
          />

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
              
              >
                <Group spacing={7}>
                  {/* <Avatar src={user.image} alt={user.name} radius="xl" size={20} /> */}
                  <Text
                    weight={500}
                    size="sm"
                    sx={{
                      lineHeight: 1,
                      color:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[0]
                          : theme.colors.gray[9],
                    }}
                    mr={3}
                    tt={"capitalize"}
                  >
                    
                    {`${session?.user?.firstname} ${session?.user?.lastname}`}
                  </Text>
                  <IconChevronDown size={rem(12)} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              

              <Menu.Label>Settings</Menu.Label>
              <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
                Account settings
              </Menu.Item>
              <Menu.Item
                icon={<IconSwitchHorizontal size="0.9rem" stroke={1.5} />}
              >
                Change account
              </Menu.Item>
           

              <Menu.Divider />

             
              <Menu.Item 
              color="red"
              icon={<IconLogout size="0.9rem" stroke={1.5} />}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </div>
  );
}
