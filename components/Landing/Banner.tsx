import {
  createStyles,
  Text,
  Title,
  TextInput,
  Button,
  Image,
  rem,
} from "@mantine/core";
import hero2 from "../../public/hero2.jpg";
import { motion } from "framer-motion";
import router from "next/router";
const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    padding: `calc(${theme.spacing.md} * 2)`,
    borderRadius: theme.radius.md,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column-reverse",
      padding: theme.spacing.xl,
    },
  },

  image: {
    maxWidth: "100%",

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      marginTop: theme.spacing.xl,
    },
  },

  body: {
    paddingLeft: `calc(${theme.spacing.md} * 4)`,

    [theme.fn.smallerThan("sm")]: {
      paddingLeft: 0,
      marginTop: theme.spacing.xl,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

  controls: {
    display: "flex",
    marginTop: theme.spacing.xl,
  },

  inputWrapper: {
    width: "100%",
    flex: "1",
  },

  input: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: 0,
  },

  control: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
}));

export function Banner() {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Image src={hero2.src} className={classes.image} />

      <motion.div initial={{ height: 0 }} animate={{ height: "100%" }}>
        <div className={classes.body}>

          <Title className={classes.title}>
        
            Your Smile is Our Top Priority
          </Title>
          <Text fw={500} fz="lg" mb={5}>
            We're Here to Help You Achieve a Healthy, Beautiful Smile.
          </Text>
          <Text fz="md" c="dimmed">
            At M.C. Dental Clinic, we believe that a healthy smile is a happy
            smile. That's why we offer comprehensive dental care for the whole
            family, from routine cleanings and checkups to advanced restorative
            treatments.
          </Text>

          <div className={classes.controls}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
            <Button radius="xl" size="md" onClick={
              () => router.push('/appointment/create')
            }>
              BOOK NOW
            </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
