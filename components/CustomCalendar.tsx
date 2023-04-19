import { DatePicker } from "@mantine/dates";
import { useState } from "react";

export default function CustomCalendar() {
    const [value, setValue] = useState<Date | null>(null);
    return (
        <DatePicker
        value={value}
        onChange={setValue}
        
        size="xl"
        styles={{
          month: {
            width: "100%",
          },
          yearLevelGroup: {
            width: "100%",
          },
          yearLevel: {
            width: "100%",
          },
          calendarHeader: {
            width: "100%",
            maxWidth: "100%",
          },
          monthsList: {
            width: "100%",
          },
          pickerControl: {
            margin: "0 auto",
          },
          decadeLevelGroup: {
            width: "100%",
          },
          decadeLevel: {
            width: "100%",
          },
          yearsList: {
            width: "100%",
          },
          monthCell: {
            textAlign: "center",
          },
        }}
      />
    );  
}