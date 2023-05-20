import {
  createStyles,
  Text,
  Title,
  TextInput,
  Button,
  Image,
  rem,
} from "@mantine/core";
import openedEmail from "public/opened_email.svg";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
  //  padding: `calc(${theme.spacing.xl} * 2)`,
    borderRadius: theme.radius.md,
    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    // border: `${rem(1)} solid ${
    //   theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
    // }`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column-reverse",
      padding: theme.spacing.xl,
    },
  },

  image: {
    maxWidth: "40%",

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
    },
  },

  body: {
    paddingRight: `calc(${theme.spacing.xl} * 4)`,

    [theme.fn.smallerThan("sm")]: {
      paddingRight: 0,
      marginTop: theme.spacing.xl,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
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

export function EmailBanner(props: any) {
  const { email } = props;
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title className={classes.title}>
          Appointment booked! 🎉
        </Title>
        <Text fw={500} fz="lg" mb={5}>
          We have sent an email to the address you provided with all the details
          of your appointment. 
        </Text>
        <Text fz="sm" c="dimmed">
        Please check your inbox for further instructions. Thank you for choosing our services. We look forward to serving you!
        </Text>

        <div className={classes.controls}>
          <Text fz="sm" c="dimmed">
            Your email: 
          </Text>
          <Text fz="sm" weight={600} ml={5}>
            {email}
          </Text>
        </div>
      </div>
      <Image src={openedEmail.src} className={classes.image} />
    </div>
  );
}
