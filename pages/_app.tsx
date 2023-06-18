import NextApp, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { getCookie, setCookie, setCookies } from "cookies-next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from '@mantine/modals';
import { ComponentType } from "react";
import "./styles.css";


const queryClient = new QueryClient();



export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

  const AnyComponent = Component as any;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const title = `M.C. Dental Clinic`;


  return (
    <>
      <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient} >
          <Head>
            <title>{title}</title>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
            />
          </Head>

          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                colorScheme,
                fontFamily: "SF Pro Text, sans-serif",
                colors: {
                  primary: [
                    "#ffee99",
                    "#ffea80",
                    "#ffe566",
                    "#ffe14d",
                    "#ffd400",
                    "#e6bf00",
                    "#ccaa00",
                    "#b39500",
                    "#967d00",
                    "#665500",
                  ],
                  gradientFrom: [
                    "#d7bfd9",
                    "#cdafcf",
                    "#c3a0c5",
                    "#b990bc",
                    "#9b609f",
                    "#8b568f",
                    "#7c4d7f",
                    "#714674",
                    "#5d3a5f",
                    "#3e2640",
                  ],
                  gradientTo: [
                    "#c7b1e7",
                    "#b99ee1",
                    "#ab8adb",
                    "#9d77d5",
                    "#733cc3",
                    "#6836af",
                    "#5c309c",
                    "#512a88",
                    "#432371",
                    "#2e184e",
                  ],
                },
                primaryShade: 8,
                primaryColor: "primary",
                defaultRadius: "sm",
                defaultGradient: {
                  deg: 90,
                  to: "gradientTo",
                  from: "gradientFrom",
                },
                components: {
                  Button: {
                    styles: {
                      root: {
                        borderWidth: 1,
                      },
                    },
                  },
                  Chip: {
                    styles: {
                      label: {
                        borderWidth: 1,
                      },
                    },
                  },
                  Input: {
                    styles: {
                      input: {
                        borderWidth: 1,
                      },
                    },
                  },
                  Pagination: {
                    styles: {
                      item: {
                        borderWidth: 1,
                      },
                    },
                  },
                  Switch: {
                    styles: {
                      track: {
                        borderWidth: 1,
                      },
                    },
                  },
                },
              }}
            >
              <ModalsProvider>
                <Notifications />
                
                <AnyComponent {...pageProps} />
             
              </ModalsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
          </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "light",
  };
};
