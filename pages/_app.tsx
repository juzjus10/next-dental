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
                    "#d7c1c1",
                    "#cdb2b2",
                    "#c3a2a2",
                    "#b99393",
                    "#9a6565",
                    "#8b5b5b",
                    "#7b5151",
                    "#6c4646",
                    "#5d3c3c",
                    "#170f0f"
                  ],
                  gradientTo: [
                    "#f0dea8",
                    "#ebd48e",
                    "#e8ce7d",
                    "#e4c567",
                    "#d9ad26",
                    "#c39b23",
                    "#ad8a1f",
                    "#98791b",
                    "#826817",
                    "#57450f"
                  ]
                },
                primaryShade: 8,
                primaryColor: "primary",
                defaultRadius: "sm",
                defaultGradient: {
                  deg: 45,
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
