import {
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
} from "@mantine/core";
import {
  IconGauge,
  IconUser,
  IconCookie,
  IconRotate,
  IconBrain,
  IconDental,
  IconEggCracked,
  IconDentalBroken,
  IconPlaceholder,
  IconDentalOff,
  IconEggs,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
const mockdata = [
  {
    title: "Class IV Restoration",
    description:
      "Using composite resin, we can restore your teeth to their natural strength and beauty. Tooth-colored fillings are a great alternative to silver amalgam fillings. They are virtually undetectable and contain no mercury.",
    icon: IconRotate,
  },
  {
    title: "Replacement of Class II Amalgam",
    description:
      "Amalgam fillings are a thing of the past. We can replace your old fillings with tooth-colored composite resin fillings for a more natural look.",
    icon: IconBrain,
  },
  {
    title: "Tooth Reshaping ",
    description:
      "With tooth reshaping, we can correct minor imperfections such as slightly crooked or chipped teeth. This procedure is often combined with bonding.",
    icon: IconDental,
  },
  {
    title: "Incisal Fracture  ",
    description:
      "Repairing a fractured tooth is important to your oral health. We can repair your fractured tooth with a tooth-colored filling material.",
    icon: IconDentalBroken,
  },
  {
    title: "Replace of Old Restoration",
    description:
      "Old restorations can be replaced with tooth-colored fillings for a more natural look.",
    icon: IconPlaceholder,
  },
  {
    title: "Veneers",
    description:
      "We can create a beautiful smile with veneers. Veneers are thin, custom-made shells that cover the front of your teeth. They can be used to change the shape, color, size, or length of your teeth.",
    icon: IconEggs,
  },
];

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  },
}));

export function Services() {
  const { classes, theme } = useStyles();
  const features = mockdata.map((feature) => (
    <motion.div whileHover={{ scale: 1.05,  }}   key={ feature.title} >
      <Card
        shadow="md"
        radius="md"
        className={classes.card}
        padding="xl"
       
       mih={rem(300)}
      >
        <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
          {feature.title}
        </Text>
        <Text fz="sm" c="dimmed" mt="sm">
          {feature.description}
        </Text>
      </Card>
        </motion.div>
   
  ));

  return (
    <Container size="lg" py="xl">
      <Group position="center">
        <Badge variant="filled" size="lg">
          Our Services
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Experience the wonders of cosmetic dentistry
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Our team of dental professionals offers a wide range of dental services
        including restoration, replacement, and reshaping of teeth, as well as
        cosmetic procedures such as teeth whitening and veneers.
      </Text>

      <motion.div
     
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
    >
      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={50}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        {features}
      </SimpleGrid>
        </motion.div>
    </Container>
  );
}
