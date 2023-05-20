import { JSONViewer } from "@/components/Appointment/JSONViewer";
import { Container, Group } from "@mantine/core";
import { EmailBanner } from "@/components/Appointment/EmailBanner";

const Completed = (props: any) => {
  const { email } = props;
  return (
    <Container size="md">
      
        <EmailBanner email={email} />
     
    </Container>
  );
};

export default Completed;
