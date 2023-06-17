import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import {
  IconUserPlus,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCheck,
  IconHourglassEmpty,
  IconClockCancel,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    //padding: `calc(${theme.spacing.md} * 1.5)`,
    paddingTop: `calc(${theme.spacing.md} * 1.5)`,
    paddingBottom: `calc(${theme.spacing.md} * 1.5)`,
  },

  value: {
    fontSize: rem(38),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    fontSize: rem(18),
    textTransform: "uppercase",
  },
}));

const icons = {
  user: IconUserPlus,
  pending: IconHourglassEmpty,
  complete: IconCheck,
  cancel: IconClockCancel,
};

interface StatsGridProps {
  appointments: any;
}

export function StatsGrid({ appointments }: StatsGridProps) {
  const { classes } = useStyles();

  const [rows, setRows] = useState([
    {
      title: "Requests",
      icon: "user",
      value: 0,
      diff: 0,
      description: "Total number of appointment requests",
    },
    {
      title: "Pending",
      icon: "pending",
      value: 0,
      diff: 0,
      description: "Pending appointment requests",
    },
    {
      title: "Completed",
      icon: "complete",
      value: 0,
      diff: 0,
      description: "Completed appointments this month",
    },
    {
      title: "Cancelled",
      icon: "cancel",
      value: 0,
      diff: 0,
      description: "Appointments cancelled this month",
    },
  ]);
  interface Appointment {
    status: string;
    // add other properties here
  }
  useEffect(() => {
    if (!appointments) return;

    const rowsToUpdate = [
      { title: "Requests", filter: () => true },
      { title: "Pending", filter: (appointment: { status: string }) => appointment.status === "pending" },
      { title: "Completed", filter: (appointment: { status: string }) => appointment.status === "completed" },
      { title: "Cancelled", filter: (appointment: { status: string }) => appointment.status === "cancel" },
    ];
    
    rowsToUpdate.forEach(({ title, filter }) => {
      const row = rows.find(({ title: rowTitle }) => rowTitle === title);
      if (!row) return;
      const count = appointments.reduce((acc: string, appointment: Appointment) => {
        return acc + (filter(appointment) ? 1 : 0);
      }, 0);
      row.value = count;
    });
  }, [appointments]);

  const stats = rows.map((stat) => {
    const Icon = icons[stat.icon as keyof typeof icons];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="md" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="2rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            color={stat.diff > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          {stat.description}
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
}
