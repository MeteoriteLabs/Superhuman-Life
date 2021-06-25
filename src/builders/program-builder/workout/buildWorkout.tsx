import { useState } from 'react';
import { Button, Row, Col, Accordion, Card, Dropdown, InputGroup, FormControl } from 'react-bootstrap';

const BuildWorkout = (props: any) => {

     const [exerciseFields, setExerciseFields] = useState<any[]>([]);
     const [textFields, setTextFields] = useState<any[]>([]);
     const [urlFields, setUrlFields] = useState<any[]>([]);

     function handleExerciseFieldChange(i: any, event: any){
          const values = [...exerciseFields];
          values[i].value = event.target.value;
          setExerciseFields(values);
     }

     function handleTextFieldChange(i: any, event: any){
          const values = [...textFields];
          values[i].value = event.target.value;
          setTextFields(values);
     }
     function handleUrlFieldChange(i: any, event: any){
          const values = [...urlFields];
          values[i].value = event.target.value;
          setUrlFields(values);
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
     function handleUrlFieldAdd(){
          const values = [...urlFields];
          values.push({ value: null});
          setUrlFields(values);
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

     function handleUrlFieldRemove(i: any){
          const values = [...urlFields];
          values.splice(i, 1);
          setUrlFields(values);
     }


     return (
          <Accordion defaultActiveKey="0">
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" style={{ backgroundColor: 'grey', color: 'white'}}>
                    Warm Up
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                         <Card.Body>
                         <Button className="m-2" variant="outline-secondary" type="button" onClick={() => handleExerciseFieldAdd()}>
                              add from exercise +
                         </Button>
                         <Button className="m-2" type="button" variant="outline-secondary" onClick={() => handleTextFieldAdd()}>
                              add Text +
                         </Button>
                         <Button className="m-2" type="button" variant="outline-secondary" onClick={() => handleUrlFieldAdd()}>
                              add URL +
                         </Button>

                              {exerciseFields.map((field, idx) => {
                                   return (
                                        <div key={`${field}-${idx}`}>
                                        <InputGroup className="mb-3">
                                             <FormControl
                                                  placeholder="Search From exercise"
                                                  value={field.value || ""}
                                                  onChange={e => handleExerciseFieldChange(idx, e)}
                                             />
                                             <InputGroup.Append>
                                                  <Button variant="outline-danger" onClick={() => handleExerciseFieldRemove(idx)}>
                                                       <i className="far fa-trash-alt"></i>
                                                  </Button>
                                             </InputGroup.Append>
                                             </InputGroup>
                                        </div>
                                   );
                                   })}

                              {textFields.map((field, idx) => {
                                   return (
                                        <div key={`${field}-${idx}`}>
                                        <InputGroup className="mb-3">
                                             <FormControl
                                                  type="textarea"
                                                  placeholder="Add Text"
                                                  value={field.value || ""}
                                                  onChange={e => handleTextFieldChange(idx, e)}
                                             />
                                             <InputGroup.Append>
                                                  <Button variant="outline-danger" onClick={() => handleTextFieldRemove(idx)}>
                                                       <i className="far fa-trash-alt"></i>
                                                  </Button>
                                             </InputGroup.Append>
                                             </InputGroup>
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