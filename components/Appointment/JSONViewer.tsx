import { ScrollArea } from '@mantine/core';
import { Prism } from '@mantine/prism';

// create type for JSONViewerProps
type JSONViewerProps = {
 
  data: {
    [key: string]: string;
  }
};
export const JSONViewer = ({ data }: JSONViewerProps) => {
  const {values} = data;
  return (
    <>
    <ScrollArea scrollbarSize={6}>
      <Prism language="tsx">{JSON.stringify(values, null, 2)}</Prism>
      </ScrollArea>
    </>
  );
};