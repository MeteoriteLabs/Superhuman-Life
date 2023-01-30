import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TextEditor = (props: any) => {
  const [value, setValue] = useState(props.value ? props.value : " ");

  function setData(data: any) {
    props.onChange(
      JSON.stringify({ rpm: props.value1, mood: props.value2, note: value })
    );
    props.sendValue(value);
  }

  return (
    <div id="editor1">
      <CKEditor
        data={value}
        editor={ClassicEditor}
        onChange={(event, editor) => {
          const data = editor.getData();
          setValue(data);
          setData(data);
        }}
      />
    </div>
  );
};

export default TextEditor;
