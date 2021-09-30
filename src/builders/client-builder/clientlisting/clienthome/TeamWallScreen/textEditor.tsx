//import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TextEditor = () => {
     //  const [value, setValue] = useState("");

     //var richText: any = [{ type: "text" }];

     return (
          <div id="editor1">
               <CKEditor
                    editor={ClassicEditor}
                    onChange={(event, editor) => {
                         const data = editor.getData();
                         console.log({ event, editor, data });
                    }}
               />
          </div>
     );
};

export default TextEditor;
