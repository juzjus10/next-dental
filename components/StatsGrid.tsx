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
    padding: `calc(${theme.spacing.md} * 1.5)`,
  },

  value: {
    fontSize: rem(24),
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
      description: "This is a description",
    },
    {
      title: "Pending",
      icon: "pending",
      value: 0,
      diff: 0,
      description: "This is a description",
    },
    {
      title: "Completed",
      icon: "complete",
      value: 0,
      diff: 0,
      description: "This is a description",
    },
    {
      title: "Cancelled",
      icon: "cancel",
      value: 0,
      diff: 0,
      description: "This is a description",
    },
  ]);

  useEffect(() => {
    if (!appointments) return;

    // find row with title "Requests" and update value
    const requestsRow = rows.find(
      (row: { title: string }) => row.title === "Requests"
    );
    if (!requestsRow) return;
    requestsRow.value = appointments.length;

    // find row with title "Pending" and update value
    const pendingRow = rows.find(
      (row: { title: string }) => row.title === "Pending"
    );
    if (!pendingRow) return;
    pendingRow.value = appointments.filter(
      (appointment: { status: string }) => appointment.status === "pending"
    ).length;

    // find row with title "Completed" and update value
    const completedRow = rows.find(
      (row: { title: string }) => row.title === "Completed"
    );
    if (!completedRow) return;
    completedRow.value = appointments.filter(
      (appointment: { status: string }) => appointment.status === "completed"
    ).length;

    // find row with title "Cancelled" and update value
    const cancelledRow = rows.find(
      (row: { title: string }) => row.title === "Cancelled"
    );
    if (!cancelledRow) return;
    cancelledRow.value = appointments.filter(
      (appointment: { status: string }) => appointment.status === "cancelled"
    ).length;
  }, [appointments]);

  const stats = rows.map((stat) => {
    const Icon = icons[stat.icon];
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
            <span>{stat.diff}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
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
