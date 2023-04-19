import { AppShell, Navbar, Header } from '@mantine/core';
import { NavbarSimple } from '@/components/NavbarSimple';

// create type for props
type Props = {
  children: any;
};
export default function Layout({ children }: Props) {
  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 300 }}   p="xs">{<NavbarSimple/>}</Navbar>}
      header={<Header height={60} p="xs">{/* Header content */}</Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {children}
    </AppShell>
  );
}