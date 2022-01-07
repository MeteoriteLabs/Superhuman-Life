import { SketchPicker } from "react-color";

function NewCustomColorPicker(props: any) {
  return (
    <>
      <SketchPicker
        color={props.value !== undefined ? props.value.hex : "ffff"}
        onChange={(event: any) => {
          debugger;
          console.log(typeof event.hex);

          props.onChange(event.hex);
        }}
      />
    </>
  );
}

export default NewCustomColorPicker;
