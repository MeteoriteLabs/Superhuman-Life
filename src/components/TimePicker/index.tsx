import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/analog_time_picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/red.css";
import "react-multi-date-picker/styles/colors/analog_time_picker_red.css";

export default function StaticTimePickerLandscape() {
  const [value, setValue] = useState<any>(new Date());

  console.log(value);

  return (
    <DatePicker
      disableDayPicker
      value={value}
      onChange={(dateObject) => {
        console.log(dateObject?.toString(), typeof(dateObject?.toString()));
        setValue(dateObject)
      }}
      format="HH:mm"
      className="bg-dark red"
      plugins={[<TimePicker hideSeconds/>]}
      placeholder="select time"
    />
  );
}
