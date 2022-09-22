import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TextEditor = (props: any) => {

     console.log(props);

     const [value, setValue] = useState(props.val ? props.val : props.value ? props.value : "");

     var richText: any = [{ "type": "text" }];
     if (props.type === "build") {
          richText[0].value = value;
          props.onChangebuild(richText);
     } else {
          if(props.type !== 'text'){
               props.onChange(value);
          }
     }


     return (
          <div id="editor1">
               <CKEditor editor={ClassicEditor}
                    data={value}
                    disabled={props.type === 'text' ? true : false}
                    onChange={(event, editor) => {
                         const data = editor.getData();
                         setValue(data);
                    }}
               />
          </div>
     )
}

export default TextEditor;