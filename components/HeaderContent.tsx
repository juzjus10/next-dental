import {
  Burger,
  Container,
  Group,
  Image,
  Menu,
  Text,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { useState } from "react";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import headerLogoBlack from "public/header-logo.png";
import headerLogoWhite from "public/header-logo-white.png";
import router from "next/router";

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
    [theme.fn.largerThan("md")]: {
     display: "none",
    },
  },
}));

interface HeaderTabsProps {
  opened: boolean;
  toggle(): void;
  session: any;
}

export function HeaderContent({ opened, toggle, session }: HeaderTabsProps) {
  const { classes, theme, cx } = useStyles();

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <div className={classes.header}>
      <Container>
        <Group position="apart">
          
        <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color={theme.white}
          />
          <Image
            src={
              theme.colorScheme === "dark"
                ? headerLogoWhite.src
                : headerLogoBlack.src
            }
            alt="MC Dental Clinic Logo"
            width={50}
            height={50}
            fit="contain"
          />


          <Group>
            <ColorSchemeToggle />
            {session && (
              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: "pop-top-right" }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton>
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
                        {`${session?.user?.firstname || ""} ${
                          session?.user?.lastname || ""
                        }`}
                      </Text>
                      <IconChevronDown size={rem(12)} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item
                    icon={<IconSettings size="0.9rem" stroke={1.5} />}
                    onClick={() => {
                      router.push("/settings");
                    }}
                  >
                    Account settings
                  </Menu.Item>
                

                
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </Container>
    </div>
  );
}
