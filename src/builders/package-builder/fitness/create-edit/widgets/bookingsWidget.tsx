import React, {useState} from 'react';
import {Row, Col, Form} from 'react-bootstrap';

const BookingsWidget = (props) => {

    const [instantBookings, setInstantBookings] = useState(false);
    const [freebooking, setFreeBooking] = useState(false);

    props.onChange(JSON.stringify({instantBooking: instantBookings, freeBooking: freebooking}));

    return(
        <>
            <div>
                <Row>
                    <Col>
                        <h4>Allow instant Bookings</h4>
                        <span>This will let people join this group call for a day on demand</span>
                    </Col>
                    <Col>
                        <Row>
                            <Col lg={1}>Yes</Col>
                            <Col lg={1}>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    defaultChecked={instantBookings}
                                    onClick={() => setInstantBookings(!instantBookings)}
                                />
                            </Form>
                            </Col>
                            <Col lg={1}>No</Col>
                        </Row>
                    </Col>    
                </Row>
                <br/> 
                <br/> 
                <Row>
                    <Col>
                        <h4>Free Instant booking</h4>
                        <span>People can join one session for free</span>
                    </Col>
                    <Col>
                        <Row>
                            <Col lg={1}>Yes</Col>
                            <Col lg={1}>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switchs"
                                    defaultChecked={freebooking}
                                    onClick={() => setFreeBooking(!freebooking)}
                                />
                            </Form>
                            </Col>
                            <Col lg={1}>No</Col>
                        </Row>
                    </Col>    
                </Row> 
            </div>
        </>
    )
};

export default BookingsWidget;