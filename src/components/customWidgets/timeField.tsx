import React, { useState } from 'react';
import { InputGroup, FormControl, Row, Col, Form } from 'react-bootstrap';

const TimeFieldInput = (props: any) => {

     const [hour, setHour] = useState(props.hr ? props.hr : '');
     const [min, setMin] = useState(props.m ? props.m : '0');

     props.onChange(hour + ":" + min);

     return (
          <>
               <label>{props.title}</label>
               <Row>
                    <Col>
                         <InputGroup>
                              <FormControl
                                   placeholder="24Hr format"
                                   type="number"
                                   min="0"
                                   max="23"
                                   value={hour}
                                   onChange={(e) => setHour(e.target.value)}
                              />
                              <InputGroup.Text id="basic-addon2">Hour</InputGroup.Text>
                         </InputGroup>
                    </Col>
                    <Col>
                         <InputGroup>
                              <Form.Control as="select" value={min} onChange={(e) => setMin(e.target.value)}>
                                   <option>0</option>
                                   <option>15</option>
                                   <option>30</option>
                                   <option>45</option>
                              </Form.Control>
                              <InputGroup.Text id="basic-addon2">Min</InputGroup.Text>
                         </InputGroup>
                    </Col>
               </Row>
          </>
     )
}

export default TimeFieldInput;