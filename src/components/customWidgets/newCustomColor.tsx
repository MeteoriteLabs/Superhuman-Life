import { SketchPicker } from "react-color";

function NewCustomColorPicker(props: any) {
  return (
    <>
      <SketchPicker
        color={props.value !== undefined ? props.value : "ffff"}
        onChange={(event: any) => {
          props.onChange(event.hex);
        }}
      />
    </>
  );
}

export default NewCustomColorPicker;
