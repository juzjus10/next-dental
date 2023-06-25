import Logo from "@/components/Logo";
import { Group, Navbar, createStyles, getStylesRef, rem } from "@mantine/core";
import {
  IconCalendarEvent,
  IconCalendarStats,
  IconEmpathize,
  IconGauge,
  IconHome,
  IconLayoutDashboard,
  IconListCheck,
  IconLogout,
  IconNotes,
  IconNurse,
  IconSettings,
  IconStethoscope,
  IconSwitchHorizontal,
  IconUserBolt,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useState } from "react";
import router from "next/router";
import { useSession, signOut } from "next-auth/react";
import { LinksGroup } from "./NavbarLinksGroup";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  version: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background!,
      0.1
    ),
    color: theme.white,
    fontWeight: 700,
  },

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[9]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid `,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.1
      ),
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
    opacity: 0.75,
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.15
      ),
      [`& .${getStylesRef("icon")}`]: {
        opacity: 0.9,
      },
    },
  },
}));

export function NavbarSimple(props: any) {
  const { opened } = props;
  const { classes, cx } = useStyles();

  // get session
  const { data: session } = useSession();
 

  const mockdata = [
    // {
    //   label: "Home",
    //   icon: IconHome,
    //   links: [{ label: "Dashboard", link: "/dashboard" }],
    // },
    {
      label: "Admin",
      icon: IconUserBolt,
      initiallyOpened: true,
      links: [
        { label: "Users", link: "/users" },
        { label: "Doctors", link: "/doctors" },
        { label: "Patients", link: "/patient" },
        { label: "Appointment", link: "/appointment" },
        { label: "Settings", link: "/settings" },
        { label: "Dashboard", link: "/dashboard" },
        // { label: "Releases schedule", link: "/" },
      ],
    },
    {
      label: "Doctor",
      icon: IconStethoscope,
      initiallyOpened: true,
      links: [
        { label: "Dashboard", link: `/doctors/${session?.user.id}` },
        {
          label: "Appointment",
          link: `/doctors/${session?.user.id}/appointment`,
        },
        { label: "Patient", link: `/doctors/${session?.user.id}/patient` },
        { label: "Profile", link: `/doctors/${session?.user.id}/profile` },
      ],
    },
  ];

  const links = mockdata.map((item) => {
    if (item.label === "Admin" && session?.user?.user_level !== "admin") {
      return null;
    }

    return <LinksGroup {...item} key={item.label} />;
  });
  // const links = data
  // .filter((item) => {
  //   if (session?.user?.user_level === 'doctor' && ['Users', 'Settings'].includes(item.label)) {
  //     return false;
  //   }
  //   return !item.user_level || item.user_level !== 'doctor';
  // })
  // .map((item) => (
  //   <a
  //     className={cx(classes.link, {
  //       [classes.linkActive]: item.label === active,
  //     })}
  //     href={item.link}
  //     key={item.label}
  //     onClick={(event) => {
  //       event.preventDefault();
  //       setActive(item.label);
  //       router.push(item.link);
  //     }}
  //   >
  //     <item.icon className={classes.linkIcon} stroke={1.5} />
  //     <span>{item.label}</span>
  //   </a>
  // ));

  return (
    <Navbar
      width={{ sm: 300 }}
      p="md"
      className={classes.navbar}
      hidden={opened}
      hiddenBreakpoint="sm"
    >
      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: "/" });
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}
