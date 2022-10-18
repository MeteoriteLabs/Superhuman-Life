import { SketchPicker } from "react-color";

function NewCustomColorPicker(props: any) {
  return (
    <>
      <SketchPicker
        color={props.value ? props.value : "ffff"}
        onChange={(event: any) => {
          props.onChange(event.hex);
        }}
      />
    </>
  );
}

export default NewCustomColorPicker;
