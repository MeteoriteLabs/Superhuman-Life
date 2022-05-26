import moment from 'moment';
import React from 'react';
import {Dropdown, Row, Col, Button} from 'react-bootstrap';

const RosterSettings = () => {
    return (
        <>
            <div className='shadow-lg p-4' style={{ borderRadius: '15px'}}>
                <div className='text-right' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
                    <h4>Sessions &nbsp;&nbsp;</h4>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" as="button" className="actionButtonDropDown">
                            <i className="fas fa-ellipsis-v"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item >Reschedule Time</Dropdown.Item>
                            <Dropdown.Item >Change Mode</Dropdown.Item>
                            <Dropdown.Item >Cancel Class</Dropdown.Item>
                            <Dropdown.Item >Reschedule Date</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <hr />
                <div className='shadow-lg p-4 mb-3' style={{ borderRadius: '15px', border: '1px solid black'}}>
                    <Row>
                        <Col lg={5}>
                            <h3>Class Date</h3>
                        </Col>
                        <div className='shadow-lg p-4' style={{ borderRadius: '15px'}}>
                            {moment().format('MMM DD, YYYY')}
                        </div>
                    </Row>
                </div>
                <div className='shadow-lg p-4 mb-3' style={{ borderRadius: '15px', border: '1px solid black'}}>
                    <Row>
                        <Col lg={5}>
                            <h3>Class Time</h3>
                        </Col>
                        <Col lg={5}>
                            <Row>
                                <div className='shadow-lg p-4' style={{ borderRadius: '15px'}}>
                                    {moment().format('MMM DD, YYYY')}
                                </div>
                                <div className='ml-4 mr-4'>to</div>
                                <div className='shadow-lg p-4' style={{ borderRadius: '15px'}}>
                                    {moment().format('MMM DD, YYYY')}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className='shadow-lg p-4 mb-3' style={{ borderRadius: '15px', border: '1px solid black'}}>
                    <Row>
                        <Col lg={5}>
                            <h3>Class Time</h3>
                        </Col>
                        <Col lg={5}>
                            <Row>
                                <div className='shadow-lg p-4' style={{ borderRadius: '15px'}}>
                                    PT Online
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className='shadow-lg p-4 mb-3' style={{ borderRadius: '15px', border: '1px solid black'}}>
                    <Row>
                        <Col lg={5}>
                            <h3>Class Time</h3>
                        </Col>
                        <Col lg={5}>
                            <Row>
                                <div>
                                    <Button variant='success'>Active</Button>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default RosterSettings;