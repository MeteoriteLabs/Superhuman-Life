import { useState } from 'react';
import { Row, Col, Accordion, Card, Dropdown } from 'react-bootstrap';

const BuildWorkout = (props: any) => {

     const [exerciseFields, setExerciseFields] = useState<any[]>([]);
     const [textFields, setTextFields] = useState<any[]>([]);

     function handleExerciseFieldChange(i: any, event: any){
          const values = [...exerciseFields];
          values[i].value = event.target.value;
          setExerciseFields(values);
     }

     function handleTextFieldChange(i: any, event: any){
          const values = [...textFields];
          values[i].value = event.target.value;
          setExerciseFields(values);
     }

     function handleExerciseFieldAdd(){
          const values = [...exerciseFields];
          values.push({ value: null});
          setExerciseFields(values);
     }
     function handleTextFieldAdd(){
          const values = [...textFields];
          values.push({ value: null});
          setTextFields(values);
     }

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

     return (
          <Accordion defaultActiveKey="0">
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" style={{ backgroundColor: 'grey', color: 'white'}}>
                    Warm Up
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                         <Card.Body>
                         <button type="button" onClick={() => handleExerciseFieldAdd()}>
                              add from exercise
                         </button>
                         <button type="button" onClick={() => handleTextFieldAdd()}>
                              add Text
                         </button>

                              {exerciseFields.map((field, idx) => {
                                   return (
                                        <div key={`${field}-${idx}`}>
                                        <input
                                        type="text"
                                        placeholder="Search From exercise"
                                        value={field.value || ""}
                                        onChange={e => handleExerciseFieldChange(idx, e)}
                                        />
                                        <button type="button" onClick={() => handleExerciseFieldRemove(idx)}>
                                        X
                                        </button>
                                        </div>
                                   );
                                   })}

                              {textFields.map((field, idx) => {
                                   return (
                                        <div key={`${field}-${idx}`}>
                                        <input
                                        type="text"
                                        placeholder="Enter Text"
                                        value={field.value || ""}
                                        onChange={e => handleTextFieldChange(idx, e)}
                                        />
                                        <button type="button" onClick={() => handleTextFieldRemove(idx)}>
                                        X
                                        </button>
                                        </div>
                                   );
                                   })}
                         </Card.Body>
                    </Accordion.Collapse>
               </Card>
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                    Main Movement
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body>
                    <Dropdown>
                              <Dropdown.Toggle variant="success" id="dropdown-basic">
                              Dropdown Button
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                   <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                   <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                   <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                              </Dropdown.Menu>
                         </Dropdown>
                    </Card.Body>
                    </Accordion.Collapse>
               </Card>
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                    Cool Down
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                    <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
               </Card>
          </Accordion>
     );
};

export default BuildWorkout;