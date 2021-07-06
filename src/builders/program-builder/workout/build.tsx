import React, {useState} from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import TextEditor from '../search-builder/textEditor';
import ExerciseList from '../search-builder/exerciseList';


const Build = () => {

     const [exerciseFields, setExerciseFields] = useState<any[]>([]);
     const [textFields, setTextFields] = useState<any[]>([]);
     const [urlFields, setUrlFields] = useState<any[]>([]);
     const [restTimeFields, setRestTimeFields] = useState<any[]>([]);
     const [uploadFields, setUploadFields] = useState<any[]>([]);

     // These functions handle the change in the input field
     // function handleExerciseFieldChange(i: any, event: any){
     //      const values = [...exerciseFields];
     //      values[i].value = event.target.value;
     //      setExerciseFields(values);
     // }

     // function handleTextFieldChange(i: any, event: any){
     //      const values = [...textFields];
     //      values[i].value = event.target.value;
     //      setTextFields(values);
     // }
     function handleUrlFieldChange(i: any, event: any){
          const values = [...urlFields];
          values[i].value = event.target.value;
          setUrlFields(values);
     }
     function handleRestTimeFieldChange(i: any, event: any){
          const values = [...restTimeFields];
          values[i].value = event.target.value;
          setRestTimeFields(values);
     }
     function handleUploadFieldChange(i: any, event: any){
          const values = [...uploadFields];
          values[i].value = event.target.value;
          setUploadFields(values);
     }

     //These functions hanlde the adding of the input field
     function handleExerciseFieldAdd(){
          const values = [...exerciseFields];
          let a = values.length === 0;
          if(a){
               values.push({ value: null});
          }
          setExerciseFields(values);
     }
     function handleTextFieldAdd(){
          const values = [...textFields];
          let a = values.length === 0;
          if(a){
               values.push({ value: null});
          }
          setTextFields(values);
     }
     function handleUrlFieldAdd(){
          const values = [...urlFields];
          values.push({ value: null});
          setUrlFields(values);
     }
     function handleRestTimeFieldAdd(){
          const values = [...restTimeFields];
          values.push({ value: null});
          setRestTimeFields(values);
     }
     function handleUploadFieldAdd(){
          const values = [...uploadFields];
          values.push({ value: null});
          setUploadFields(values);
     }

     //These functions handle the deletion of the input fields
     function handleExerciseFieldRemove(i: any){
          const values = [...exerciseFields];
          values.splice(i, 1);
          setExerciseFields(values);
     }

     function handleTextFieldRemove(i: any){
          const values = [...textFields];
          values.splice(i, 1);
          setTextFields(values);
     }

     function handleUrlFieldRemove(i: any){
          const values = [...urlFields];
          values.splice(i, 1);
          setUrlFields(values);
     }
     function handleRestTimeFieldRemove(i: any){
          const values = [...restTimeFields];
          values.splice(i, 1);
          setRestTimeFields(values);
     }
     function handleUploadFieldRemove(i: any){
          const values = [...uploadFields];
          values.splice(i, 1);
          setUploadFields(values);
     }

//      let exerciseListArray: any;
//     function handleEquipmentCallback(data: any) {
//           exerciseListArray = data;
//     }

//     let editorTextString: any;
//     function handleEditorTextCallBack(data:any){
//         editorTextString = data;
//     }

    function renderOptions(){
     return (
          <div>
           <Button size="sm" className="m-1" variant="outline-secondary" type="button" onClick={() => handleExerciseFieldAdd()}>
                Exercise <i style={{ fontSize: 12}} className="fas fa-plus"></i>
           </Button>
           <Button size="sm" className="m-1" type="button" variant="outline-secondary" onClick={() => handleTextFieldAdd()}>
                Text <i style={{ fontSize: 12}} className="fas fa-plus"></i>
           </Button>
           <Button size="sm" className="m-1" type="button" variant="outline-secondary" onClick={() => handleUrlFieldAdd()}>
                URL <i style={{ fontSize: 12}} className="fas fa-plus"></i>
           </Button>
           <Button size="sm" className="m-1" type="button" variant="outline-secondary" onClick={() => handleRestTimeFieldAdd()}>
                Rest Time <i style={{ fontSize: 12}} className="fas fa-plus"></i>
           </Button>
           <Button size="sm" className="m-1" type="button" variant="outline-secondary" onClick={() => handleUploadFieldAdd()}>
                Upload <i style={{ fontSize: 12}} className="fas fa-plus"></i>
           </Button>
      </div>
     )
}

     return (
          <div>
               {renderOptions()}
               {exerciseFields.map((field, idx) => {
                              console.log(field);
                              return (
                                   <div key={`${field}-${idx}`}>
                                        <span>Exercise <i className="far fa-trash-alt float-right"
                                             style={{ color: 'red', cursor: 'pointer'}}
                                        onClick={() => handleExerciseFieldRemove(idx)}></i></span>
                                        <ExerciseList />
                                   </div>
                              );
                              })}

               {textFields.map((field, idx) => {
                    return (
                         <div className="mt-4" key={`${field}-${idx}`}>
                              <span>Add Text <i className="far fa-trash-alt float-right"
                                   style={{ color: 'red', cursor: 'pointer'}}
                              onClick={() => handleTextFieldRemove(idx)}></i></span>
                              <TextEditor />
                         </div>
                    );
                    })}

               {urlFields.map((field, idx) => {
                    return (
                         <div key={`${field}-${idx}`}>
                         <InputGroup className="mb-3">
                              <FormControl
                                   type="text"
                                   placeholder="Add URL"
                                   value={field.value || ""}
                                   onChange={e => handleUrlFieldChange(idx, e)}
                              />
                              <InputGroup.Append>
                                   <Button variant="outline-danger" onClick={() => handleUrlFieldRemove(idx)}>
                                        <i className="far fa-trash-alt"></i>
                                   </Button>
                              </InputGroup.Append>
                              </InputGroup>
                         </div>
                    );
                    })}
                    {restTimeFields.map((field, idx) => {
                    return (
                         <div key={`${field}-${idx}`}>
                         <InputGroup className="mb-3">
                              <FormControl
                                   type="number"
                                   placeholder="Add Rest Time"
                                   value={field.value || ""}
                                   onChange={e => handleRestTimeFieldChange(idx, e)}
                              />
                              <InputGroup.Append>
                                   <Button variant="outline-danger" onClick={() => handleRestTimeFieldRemove(idx)}>
                                        <i className="far fa-trash-alt"></i>
                                   </Button>
                              </InputGroup.Append>
                              </InputGroup>
                         </div>
                    );
                    })}
                    {uploadFields.map((field, idx) => {
                    return (
                         <div key={`${field}-${idx}`} className="m-2">
                              <input type="file" id="myFile" name="filename" onChange={e => handleUploadFieldChange(idx, e)}/>
                                        
                                        
                              <i className="far fa-trash-alt float-right" style={{cursor: 'pointer', color:'red'}} onClick={() => handleUploadFieldRemove(idx)}></i>
                         </div>
                    );
                    })}
               </div>
     )
}

export default Build;