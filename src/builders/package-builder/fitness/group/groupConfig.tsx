import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const PackageDateConfig = (props: any) => {

     console.log(props);

     var inputDisabled = JSON.parse(props.formContext.programDetails).mode === "2" ? true : props.readonly;

     const [instantBooking, setInstantBooking] = useState(props.value !== undefined ? JSON.parse(props.value).instantBooking : JSON.parse(props.formContext.programDetails).mode === "2" ? false : true);
     const [freeDemo, setFreeDemo] = useState(props.value !== undefined ? JSON.parse(props.value).freeDemo : JSON.parse(props.formContext.programDetails).mode ? false : false);

     var isHybrid: boolean = false

     // useEffect(() => {
     //      const val = JSON.parse(props.formContext.programDetails);
     //      console.log(val);
     //      if(val.mode === "2"){
     //           setInstantBooking(false);
     //           setFreeDemo(false);
     //           isHybrid = true;
     //      } 
     // }, []);

     console.log(isHybrid);

     props.onChange(JSON.stringify({instantBooking: instantBooking, freeDemo: freeDemo}));

     return (<>
          <div>
               <Row>
                    <Col>
                         <h4>Allow instant bookings</h4>
                         <p className='small text-muted'>This will let people join this group class for a session on demand</p>
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
                                    disabled={inputDisabled || isHybrid}
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
                                   disabled={inputDisabled || isHybrid}
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