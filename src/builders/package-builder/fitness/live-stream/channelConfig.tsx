import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const PackageDateConfig = (props: any) => {

     const inputDisable = props.readonly;
     const [instantBooking, setInstantBooking] = useState(props.value !== undefined ? JSON.parse(props.value).instantBooking : true);
     const [freeDemo, setFreeDemo] = useState(props.value !== undefined ? JSON.parse(props.value).freeDemo : false);

     props.onChange(JSON.stringify({instantBooking: instantBooking, freeDemo: freeDemo}));

     return (<>
          <div>
               <Row>
                    <Col>
                         <h4>Allow instant bookings</h4>
                         <p className='small'>This will let people join this group class for a day on demand</p>
                    </Col>
                    <Col>
                        <Row>
                            <Col lg={1}><b>No</b></Col>
                            <Col lg={1}>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    defaultChecked={instantBooking}
                                    onClick={() => setInstantBooking(!instantBooking)}
                                    disabled={inputDisable}
                                />
                            </Form>
                            </Col>
                            <Col lg={3}><b>Yes</b></Col>
                        </Row>
                    </Col>
               </Row>
          </div>
          {instantBooking && <div className='mt-5'>
               <Row>
                    <Col>
                         <h4>Free Demo Booking</h4>
                         <p className='small'>People can join one session for free</p>
                    </Col>
                    <Col>
                    <Row>
                         <Col lg={1}><b>No</b></Col>
                         <Col lg={1}>
                         <Form>
                              <Form.Check 
                                   type="switch"
                                   id="custom-switch2"
                                   defaultChecked={freeDemo}
                                   onClick={() => setFreeDemo(!freeDemo)}
                                   disabled={inputDisable}
                              />
                         </Form>
                         </Col>
                         <Col lg={3}><b>Yes</b></Col>
                    </Row>
                    </Col>
               </Row>
          </div>}
     </>);
};

export default PackageDateConfig;