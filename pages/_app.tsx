import { AppProps } from "next/app";
import Head from "next/head";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { getCookie, setCookies } from "cookies-next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookies("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Head>
            <title>Page title</title>
            <link rel="shortcut icon" href="/favicon.svg" />
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
              <Component {...pageProps} />
            </MantineProvider>
          </ColorSchemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
