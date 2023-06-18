import ApplicationShell from "@/components/Layout";
import { useRouter } from "next/router";
import { HeroContentLeft } from "@/components/Landing/HeroContentLeft";
import {
  Container,
  Divider,
  Grid,
  Header,
  Paper,
  ScrollArea,
  Title,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { HeaderContent } from "@/components/HeaderContent";
import { Banner } from "@/components/Landing/Banner";
import { ContactIconsList } from "@/components/Appointment/ContactIcons";
import { useQuery } from "@tanstack/react-query";
import { getAllSettings } from "@/lib/api";
import {
  IconDentalBroken,
  IconMapPin,
  IconPhone,
  IconSun,
} from "@tabler/icons-react";
import { Services } from "@/components/Landing/Services";
import { useScroll, motion, useTransform } from "framer-motion";

export default function IndexPage(props: any) {
  const theme = useMantineTheme();
  const { scrollY } = useScroll();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getAllSettings,
    refetchOnWindowFocus: false,
  });

  const y = useTransform(scrollY, [0, 1200], ["0%", "50%"]);
  return (
    <>
      <HeaderContent {...props} />


      <motion.div style={{ y }} initial={{ y: 0 }}>
        <HeroContentLeft />
      </motion.div>

      <div id="services" style={{ position: "relative", zIndex: 1 }}>
        <Paper
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
            padding: `calc(${theme.spacing.md} * 2)`,
          })}
        >
          <Services />
        </Paper>
      </div>


      <div id="appointment">
        <Banner />
      </div>
      <div id="contact">
        <Paper
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
            padding: `calc(${theme.spacing.md} * 2)`,
          })}
        >
          <Title align="left" mb="lg">
            Contact Us
          </Title>
          <Grid>
            <Grid.Col span={12} md={6}>
              {settings && (
                <ContactIconsList
                  variant="white"
                  data={[
                    {
                      title: "Clinic",
                      description: settings[0]?.clinic_name,
                      icon: IconDentalBroken,
                    },
                    {
                      title: "Phone",
                      description: settings[0]?.clinic_contact,
                      icon: IconPhone,
                    },
                    {
                      title: "Address",
                      description: settings[0]?.clinic_address,
                      icon: IconMapPin,
                    },
                    {
                      title: "Working Hours",
                      description: `${settings[0]?.opening_time} - ${settings[0]?.closing_time}`,
                      icon: IconSun,
                    },
                  ]}
                />
              )}
            </Grid.Col>

            <Grid.Col span={12} md={6}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.7638366244573!2d121.03613397567337!3d14.725939685775337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b1d0c14be3d9%3A0x25023d281e9961f4!2sM.C%20Dental%20Clinic%20Susano!5e0!3m2!1sen!2sph!4v1687082919230!5m2!1sen!2sph"
                style={{
                  border: 0,
                  height: 450,
                  width: "100%",
                  [theme.fn.smallerThan("sm")]: {
                    maxWidth: "100%",
                  },
                }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Grid.Col>
          </Grid>
        </Paper>
      </div>
    </>
  );
}
