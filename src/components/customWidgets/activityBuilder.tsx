import React, {useState} from 'react';
import { InputGroup, Row, Col, Form, Button, FormControl } from 'react-bootstrap';

const ActivityBuilder = (props: any) => {

     const [none, setNone] = useState(false);
     const [time, setTime] = useState(false);
     const [distance, setDistance] = useState(false);
     const [incline, setIncline] = useState(false);
     const [speed, setSpeed] = useState(false);
     const [calories, setCalories] = useState(false);
     const [selected, setSelected] = useState<any>([{activity: `${props.activity}`}]);

     function renderOptions(){
          return (
               <div>
                    <Form>
                         <div key={1} className="mb-3">
                              <Form.Check inline label="None" name="group1" type='checkbox' onClick={(e) => {setNone(!none); setSelected([{activity: `${props.activity}`}]);}}/>
                              <Form.Check inline label="Time" name="group1" type='checkbox' disabled={none} onClick={(e) => setTime(!time)}/>
                              <Form.Check inline label="Distance" name="group1" type='checkbox' disabled={none} onClick={(e) => setDistance(!distance)}/>
                              <Form.Check inline label="Incline" name="group1" type='checkbox' disabled={none} onClick={(e) => setIncline(!incline)}/>
                              <Form.Check inline label="Speed" name="group1" type='checkbox' disabled={none} onClick={(e) => setSpeed(!speed)}/>
                              <Form.Check inline label="Calories" name="group1" type='checkbox' disabled={none} onClick={(e) => setCalories(!calories)}/>
                         </div>
                    </Form>
               </div>
          )
     }

     function handleDataChange(id: any, data: any) {
          const values = [...selected];
          if(id === 1){
               values[0].timeHr = parseInt(data);
          }else if(id === 2){
               values[0].timeMin = parseInt(data); 
          }else if(id === 3){
               values[0].distance = parseInt(data);
          }else if(id === 4){
               values[0].incline = parseInt(data); 
          }else if(id === 5){
               values[0].speed = parseInt(data);
          }else {
               values[0].calories = parseInt(data);
          }
          setSelected(values);
     }

     console.log(selected);
     props.onChange(selected);

     return (
          <div className="m-2 shadow-sm" style={{ borderRadius: '10px', backgroundColor: 'white', display: `${props.activity === '' ? 'none' : 'block'}`}}>
               <div style={{ backgroundColor: 'white', borderBottom: '1px solid black'}}>
                    <Col>
                         <Row style={{ justifyContent: 'center'}} className="m-3">
                              <span style={{ fontSize: '20px', fontWeight: 'bold'}}>Set target for {props.activity}</span>
                         </Row>
                         <Row style={{justifyContent: 'center'}}>
                              {renderOptions()}
                         </Row>
                    </Col>
               </div>
               <div className="m-2" style={{display: `${time ? 'block': 'none'}`, backgroundColor: 'white'}}>
                    <label>Time</label>
                         <Form.Row>
                              <Col>
                                   <InputGroup className="mb-3">
                                        <FormControl type="number" onChange={(e) => handleDataChange(1, e.target.value)}/>
                                        <InputGroup.Append>
                                             <InputGroup.Text id="basic-addon2">Hrs</InputGroup.Text>
                                        </InputGroup.Append>
                                   </InputGroup>
                              </Col>
                              <Col>
                              <InputGroup className="mb-3">
                                        <FormControl type="number" onChange={e => handleDataChange(2, e.target.value)}/>
                                        <InputGroup.Append>
                                             <InputGroup.Text id="basic-addon2">mins</InputGroup.Text>
                                        </InputGroup.Append>
                                   </InputGroup>
                              </Col>
                         </Form.Row>
               </div>
               <div className="m-2" style={{display: `${distance ? 'block': 'none'}`}}>
                    <label>Distance</label>
                    <Form.Row>
                         <Col>
                         <InputGroup className="mb-3">
                         <FormControl placeholder="10km" type="number" onChange={e => handleDataChange(3, e.target.value)}/>
                         <InputGroup.Append>
                              <InputGroup.Text id="basic-addon2">Kms</InputGroup.Text>
                         </InputGroup.Append>
                         </InputGroup>
                         </Col>
                    </Form.Row>
               </div>
               <div className="m-2" style={{display: `${incline ? 'block': 'none'}`}}>
                    <label>incline</label>
                    <Form.Row>
                         <Col>
                         <InputGroup className="mb-3">
                         <FormControl placeholder="10km/hr" type="number" onChange={(e) => {handleDataChange(4, e.target.value)}}/>
                         <InputGroup.Append>
                              <InputGroup.Text id="basic-addon2">km/hr</InputGroup.Text>
                         </InputGroup.Append>
                         </InputGroup>
                         </Col>
                    </Form.Row>
               </div>
               <div className="m-2" style={{display: `${speed ? 'block': 'none'}`}}>
                    <label>speed</label>
                    <Form.Row>
                         <Col>
                         <InputGroup className="mb-3">
                         <FormControl type="number" onChange={(e) => {handleDataChange(5, e.target.value)}}/>
                         <InputGroup.Append>
                              <InputGroup.Text id="basic-addon2">Km/hr</InputGroup.Text>
                         </InputGroup.Append>
                         </InputGroup>
                         </Col>
                    </Form.Row>
               </div>
               <div className="m-2" style={{display: `${calories ? 'block': 'none'}`}}>
                    <label>calories</label>
                    <Form.Row>
                         <Col>
                         <InputGroup className="mb-3">
                         <FormControl type="number" onChange={(e) => {handleDataChange(6, e.target.value)}}/>
                         <InputGroup.Append>
                              <InputGroup.Text id="basic-addon2"></InputGroup.Text>
                         </InputGroup.Append>
                         </InputGroup>
                         </Col>
                    </Form.Row>
               </div>
          </div>
     );
}

export default ActivityBuilder;