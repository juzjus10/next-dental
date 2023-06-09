import {
  Burger,
  Button,
  Container,
  Group,
  Image,
  Menu,
  Paper,
  Text,
  Transition,
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
import router, { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.xs,
    // backgroundColor:
    //   theme.colorScheme === "dark"
    //     ? theme.colors.dark[6]
    //     : theme.colors.gray[0],

    // marginBottom: rem(120),
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

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
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
  const router = useRouter();

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const links = [
    {
      link: "/",
      label: "Home",
      id: "home",
    },
    {
      link: "/appointment",
      label: "Appointment",
      id: "appointment",
    },
    {
      link: "/services",
      label: "Services",
      id: "services",
    },
    {
      link: "/contact",
      label: "Contact Us",
      id: "contact",
    },
  ];
  const [active, setActive] = useState(links[0].link);
  const items = links.map((link) => (
    <a
      key={link.label}
      href={`#${link.id}`}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        close();
        const element = document.getElementById(link.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      {link.label}
    </a>
  ));

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
            {router.pathname === "/" && items}
            {router.pathname === "/" ? (
              <Button
                radius="xl"
                variant="outline"
                miw={90}
                onClick={() => {
                  router.push("/auth/login");
                }}
              >
                Login
              </Button>
            ) : (
              <ColorSchemeToggle />
            )}

            {session && (
              <>
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
              </>
            )}
          </Group>
        </Group>
      </Container>
    </div>
  );
}
