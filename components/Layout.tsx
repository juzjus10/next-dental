import { AppShell, Navbar, Header } from "@mantine/core";
import { NavbarSimple } from "@/components/NavbarSimple";
import { HeaderContent } from "./HeaderContent";
import { useDisclosure } from "@mantine/hooks";

// create type for props
type Props = {
  children: any;
};
export default function Layout({ children }: Props) {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <AppShell
      
      navbarOffsetBreakpoint="md"
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }}  hidden={!opened} >
          {<NavbarSimple/>}
        </Navbar>
      }
      header={
        <Header height={60}>
          {<HeaderContent opened={opened} toggle={toggle}></HeaderContent>}
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
