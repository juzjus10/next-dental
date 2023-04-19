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
              "#fabf9e",
              "#f8ae86",
              "#f79e6e",
              "#f58e56",
              "#f3722c",
              "#d9540c",
              "#c14b0b",
              "#a9420a",
              "#913808",
              "#612605"
            ],
            gradientFrom: [
              "#ffee99",
              "#ffea80",
              "#ffe566",
              "#ffe14d",
              "#ffd60a",
              "#e6bf00",
              "#ccaa00",
              "#b39500",
              "#997f00",
              "#665500"
            ],
            gradientTo: [
              "#99c9ff",
              "#80bcff",
              "#66afff",
              "#4da1ff",
              "#0079ff",
              "#006de6",
              "#0061cc",
              "#0055b3",
              "#004999",
              "#001d3d"
            ]
          },
          primaryShade: 4,
          primaryColor: "primary",
          defaultRadius: "sm",
          defaultGradient: {
            deg: 45,
            to: "gradientTo",
            from: "gradientFrom"
          }
        }}
      >
         
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
