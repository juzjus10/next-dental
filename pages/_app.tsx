import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
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
    </>
  );
}
