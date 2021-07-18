import {useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TextEditor = (props: any) => {
     
    const [value, setValue] = useState("");

    if(props.type === "build"){
         const richTextFields: any = {
              "richText": {
                   value
              }
         }
          props.onChangebuild(richTextFields);
    }else {
          props.onChange(value);
    }


     return (
          <div id="editor1">
               <CKEditor editor={ClassicEditor}
                    onChange={(event, editor) => {
                         const data = editor.getData();
                         setValue(data);
                    }}
               />
          </div>
     )
}

export default TextEditor;