import React, {useState} from 'react';
import {Row, Col, Form, InputGroup, FormControl} from 'react-bootstrap';

const BookingConfig = (props) => {

    const [acceptBooking, setAcceptBooking] = useState(false);

    return (
        <>
            <div>
                <h4>Package settings</h4>
                <hr />
                <h5>Visibility</h5>
                <Row>
                    <Col lg={2}>
                        <Form.Check type="radio" label="Private" aria-label="radio 1" />
                    </Col>
                    <Col>
                        <Form.Check type="radio" label="Public" aria-label="radio 1" /> 
                    </Col>
                </Row>
                 <br/>
                <Row>
                    <Col lg={2}>
                        <span><b>Start Date</b></span>
                    </Col>
                    <Col lg={3}>
                        <InputGroup className="mb-3">
                            <FormControl
                            aria-label="Default"
                            type='date'
                            aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <span><b>Publishing Date</b></span>
                    </Col>
                    <Col lg={3}>
                        <InputGroup className="mb-3">
                            <FormControl
                            aria-label="Default"
                            type='date'
                            aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <span><b>Expiry Date</b></span>
                    </Col>
                    <Col lg={3}>
                        <InputGroup className="mb-3">
                            <FormControl
                            aria-label="Default"
                            type='date'
                            aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </div>
            <div>
                <h4>Booking Config</h4>
                <hr />
                <Row>
                <Col>
                        <Row>
                            <Col lg={1}><b>Manual</b></Col>
                            <Col lg={1}>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switchs"
                                    defaultChecked={acceptBooking}
                                    onClick={() => setAcceptBooking(!acceptBooking)}
                                />
                            </Form>
                            </Col>
                            <Col lg={1}><b>Auto</b></Col>
                        </Row>
                    </Col>
                </Row>
                 <br/>
                <Row>
                    <Col lg={3}>
                        <span><b>Maximum booking/per month</b></span>
                    </Col>
                    <Col lg={2}>
                        <InputGroup className="mb-3">
                            <FormControl
                            aria-label="Default"
                            type='number'
                            aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={3}>
                        <span><b>Maximum booking/per day</b></span>
                    </Col>
                    <Col lg={2}>
                        <InputGroup className="mb-3">
                            <FormControl
                            aria-label="Default"
                            type='number'
                            aria-describedby="inputGroup-sizing-default"
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default BookingConfig;