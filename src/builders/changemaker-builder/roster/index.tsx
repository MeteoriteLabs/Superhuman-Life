import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Card, Col, Row, Button} from 'react-bootstrap';
import moment from 'moment';
import RosterTabs from './tabs';

const Roster =  () => {

    const [scheduleDay, setScheduleDay] = useState(1);
    const [scheduleDate, setScheduleDate] = useState(moment().startOf("week").format("YYYY-MM-DD"));

    return (
        <>
            <div className="mb-3">
                <span style={{ fontSize: '30px'}}>
                    <Link to="/schedule"><i className="fa fa-arrow-circle-left" style={{ color: 'black'}}></i></Link>
                    <b> Back</b>
                </span>
            </div>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Row>
                        <Col lg={6} style={{ borderRight: '2px dotted gray'}}>
                            <div className='text-center'>
                                <h2>Session Name</h2>
                            </div>
                            <div className='text-center' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <div className='pl-3 pr-3' style={{border: '1px solid black', borderRadius: '20px'}}>
                                    <span>07:00 am</span>
                                </div>
                                <div className='pl-3 pr-3'>
                                    to
                                </div>
                                <div className='pl-3 pr-3' style={{border: '1px solid black', borderRadius: '20px'}}>
                                    <span>07:00 am</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                <div>
                                    <span>location icon</span>
                                    <span className='pl-2'>alksdjfopi oashdfo saonvoasd fasodfoi</span>
                                </div>
                                <div>
                                    <span>Group icon</span>
                                    <span className='pl-2'>Group Class</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} style={{ borderRight: '2px dotted gray'}}>
                            <div className='text-center'>
                                <span><b>Class in 01hr 32min</b></span>
                            </div>
                            <div className='text-center'>
                                <Button variant='success'>Join Session</Button>
                            </div>
                            <div className='text-center mt-4'>
                                <button className='pl-3 pr-3' style={{ border: '1px solid black', borderRadius: '20px'}}>Attendance</button>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className='text-center'>
                                <span><b>Tag Program Name</b></span>
                            </div>
                            <div className="text-center">
                                <br />
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay - 7);
                                        // handleSubChangeDay(days, timePeriod);
                                    }}
                                    className="rounded-circle"
                                    >
                                    <i className="fa fa-chevron-left mr-5"></i>
                                </span>
                                <span><b>Today</b></span>
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay + 7);
                                        // handleAddChangeDay(days, timePeriod);
                                    }}
                                    >
                                    <i className="fa fa-chevron-right ml-5"></i>
                                </span>
                                <br />
                                <input
                                    min={moment().subtract(3, "months").format("YYYY-MM-DD")}
                                    max={moment().add(3, "months").format("YYYY-MM-DD")}
                                    className="p-1 mt-3 rounded shadow-sm mb-3"
                                    type="date"
                                    style={{
                                        border: "none",
                                        backgroundColor: "rgba(211,211,211,0.8)",
                                    }}
                                    value={scheduleDate}
                                    // onChange={(e) => 
                                    //     // handleDatePicked(e.target.value)
                                    // }
                                />{" "}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <div className='mt-4'>
                <RosterTabs />
            </div>
        </>
    );
};

export default Roster;