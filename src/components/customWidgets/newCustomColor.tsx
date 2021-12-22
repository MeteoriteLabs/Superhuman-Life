import { useState } from "react";
import { SketchPicker, ChromePicker } from "react-color";

function NewCustomColorPicker(props: any) {
  // const [color, setColor] = useState<string>("jkjlk");
  console.log(props);

  // console.log(color);
  // setColor(props.value);
  return (
    <>
      <SketchPicker
        color={props.value != undefined ? props.value.hex : "ffff"}
        onChangeComplete={(event: any) => {
          debugger;
          console.log(typeof event.hex);
          // setColor(event.hex);
          props.onChange(event.hex);
        }}
      />
    </>
  );
}

export default NewCustomColorPicker;
