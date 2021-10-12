import React, { useState } from 'react';
import { InputGroup, FormControl, Row, Col, Form } from 'react-bootstrap';

//NOTE: This widget is used if you want a single component for timeField
const TimeFieldInput = (props: any) => {

    const [sthour, setStHour] = useState(props.hr ? props.hr : '');
    const [stmin, setStMin] = useState(props.m ? props.m : '0');
    const [ethour, setEtHour] = useState(props.ehr ? props.ehr : '');
    const [etmin, setEtMin] = useState(props.em ? props.em : '0');

    const object = {"startTime": sthour + ":" + stmin, "endTime": ethour + ":" + etmin};

    props.onChange(JSON.stringify(object));

     return (
          <>
               <label>Start Time: </label>
               <Row>
                    <Col>
                         <InputGroup>
                              <FormControl
                                   placeholder="24Hr format"
                                   type="number"
                                   min={0}
                                   max={23}
                                   disabled={props.disabled ? props.disabled : false}
                                   value={sthour}
                                   onChange={(e) => setStHour(e.target.value)}
                              />
                              <InputGroup.Text id="basic-addon2">Hour</InputGroup.Text>
                         </InputGroup>
                    </Col>
                    <Col>
                         <InputGroup>
                              <Form.Control as="select" disabled={props.disabled ? props.disabled : false} value={stmin} onChange={(e) => setStMin(e.target.value)}>
                                   <option>0</option>
                                   <option>15</option>
                                   <option>30</option>
                                   <option>45</option>
                              </Form.Control>
                              <InputGroup.Text id="basic-addon2">Min</InputGroup.Text>
                         </InputGroup>
                    </Col>
               </Row>
               <span style={{display: `${parseInt(sthour) > 23 ? 'block' : 'none'}`, color: 'red'}}>The value should be lesser than 23.</span>
               <br />
               <label>End Time: </label>
               <Row>
                    <Col>
                         <InputGroup>
                              <FormControl
                                   placeholder="24Hr format"
                                   type="number"
                                   min={0}
                                   max={23}
                                   disabled={props.disabled ? props.disabled : false}
                                   isInvalid={parseInt(sthour) > parseInt(ethour) ? true : false}
                                   value={ethour}
                                   onChange={(e) => setEtHour(e.target.value)}
                              />
                              <InputGroup.Text id="basic-addon2">Hour</InputGroup.Text>
                         </InputGroup>
                    </Col>
                    <Col>
                         <InputGroup>
                              <Form.Control as="select" disabled={props.disabled ? props.disabled : false} value={etmin} onChange={(e) => setEtMin(e.target.value)}>
                                   <option>0</option>
                                   <option>15</option>
                                   <option>30</option>
                                   <option>45</option>
                              </Form.Control>
                              <InputGroup.Text id="basic-addon2">Min</InputGroup.Text>
                         </InputGroup>
                    </Col>
               </Row>
               <span style={{display: `${parseInt(ethour) > 23 ? 'block' : 'none'}`, color: 'red'}}>The value should be lesser than 23.</span>
               <span style={{display: `${parseInt(sthour) > parseInt(ethour) ? 'block' : 'none'}`, color: 'red'}}>The End Time should be greater than Start Time: </span>
          </>
     )
}

export default TimeFieldInput;