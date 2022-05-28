import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Card, Col, Row, Button, Spinner} from 'react-bootstrap';
import moment from 'moment';
import RosterTabs from './tabs';
import {GET_SESSION_AND_SESSION_BOOKINGS} from './graphql/queries';
import {useQuery} from '@apollo/client';
import { flattenObj } from '../../../components/utils/responseFlatten';

const Roster =  () => {

    const [scheduleDay, setScheduleDay] = useState(0);
    const [scheduleDate, setScheduleDate] = useState(moment().format("YYYY-MM-DD"));
    const [sessionData, setSessionData] = useState<any>([]);
    const [show, setShow] = useState(false);

    useQuery(GET_SESSION_AND_SESSION_BOOKINGS, {
        variables: {
            id: window.location.pathname.split('/').pop()
        },
        onCompleted: (data) => {
            const flattenedData = flattenObj(data);
            setSessionData(flattenedData.sessionsBookings);
            setShow(true);
        }
    });

    console.log(sessionData);

    function handleIconRender(tag: any, mode: any){
        if(tag === 'Personal Training'){
            if(mode === 'Online'){
                return <img src="/assets/PTonline.svg" alt="pt_online"/>
            }else {
                return <img src="/assets/PToffline.svg" alt="pt_offline"/>
            }
        }else if(tag === 'Group Class'){
            if(mode === 'Online'){
                return <img src="/assets/Grouponline.svg" alt="group_online"/>
            }else {
                return <img src="/assets/Groupoffline.svg" alt="group_offline"/>
            }
        }
    }

    function handleDatePicked(val: any){
        // console.log(val);
        setScheduleDate(val);
    }

    function handleSubChangeDay(day: any){
        setScheduleDay(day - 1);
        setScheduleDate(moment().add(day - 1, 'days').format("YYYY-MM-DD"));
    } 
    
    function handleAddChangeDay(day: any){
        setScheduleDay(day + 1);
        setScheduleDate(moment().add(day + 1, 'days').format("YYYY-MM-DD"));
    }

    function toHoursAndMinutes(totalMinutes) {
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);
      
        return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
    }
      
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function handleClassTimeDisplay(time: any){
        const value = moment(time, 'hh:mm a').isBefore(moment());

        if(value){
            return <span className="text-danger">Class Has Ended</span>
        }else {
            const leftTime = moment(time, 'hh:mm a').diff(moment(), 'minutes');
            const timeLeft = toHoursAndMinutes(leftTime);
            const timeLeftHours = timeLeft.split(':')[0];
            const timeLeftMinutes = timeLeft.split(':')[1];
            return <span className="text-success">Class Starts in {timeLeftHours}h {timeLeftMinutes}m</span>
        }
    }

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
                        <Col lg={6} style={{ borderRight: '2px dashed gray'}}>
                            <div className='text-center mb-2'>
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay - 7);
                                        handleSubChangeDay(scheduleDay);
                                    }}
                                    className="rounded-circle"
                                    style={{ cursor: 'pointer', fontSize: '20px'}}
                                    >
                                    <i className="fa fa-chevron-left mr-5"></i>
                                </span>
                                <span style={{ fontSize: '30px', fontWeight: 'bold'}}>{sessionData[0]?.session?.activity === null ? sessionData[0]?.session?.workout?.workouttitle : sessionData[0]?.session?.activity?.title}</span>
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay + 7);
                                        handleAddChangeDay(scheduleDay);
                                    }}
                                    style={{ cursor: 'pointer', fontSize: '20px'}}
                                    >
                                    <i className="fa fa-chevron-right ml-5"></i>
                                </span>
                            </div>
                            <div className='text-center' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <div className='pl-3 pr-3' style={{border: '1px solid black', borderRadius: '20px'}}>
                                    <span>{moment(sessionData[0]?.session?.start_time, "hh:mm a").format("hh:mm a")}</span>
                                </div>
                                <div className='pl-3 pr-3'>
                                    to
                                </div>
                                <div className='pl-3 pr-3' style={{border: '1px solid black', borderRadius: '20px'}}>
                                    <span>{moment(sessionData[0]?.session?.end_time, "hh:mm a").format("hh:mm a")}</span>
                                </div>
                            </div>
                            <div className='mt-2' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                <div style={{ maxWidth: '300px'}}>
                                    <img src="/assets/navigation_icon.svg" alt="navigation-icon"/>
                                    <span className='pl-2'>asdfasdfasdfuis asdiohf aisd iasdfh ianw ei asidi oasud asdfhiu</span>
                                </div>
                                <div>
                                    <span>{handleIconRender(sessionData[0]?.session?.tag, sessionData[0]?.session?.mode)}</span>
                                    <span className='pl-2'>{sessionData[0]?.session?.tag}</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} style={{ borderRight: '2px dashed gray'}}>
                            <div className='text-center'>
                                <span><b>{handleClassTimeDisplay(sessionData[0]?.session?.start_time)}</b></span>
                            </div>
                            <div className='text-center'>
                                <Button variant='success'
                                    disabled={moment(sessionData[0]?.session?.start_time, 'hh:mm a').isBefore(moment())}
                                    >Join Session
                                </Button>
                            </div>
                            <div className='text-center mt-4'>
                                <button className='pl-3 pr-3' style={{ border: '2px solid gray', borderRadius: '10px'}}>Attendance</button>
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
                                        handleSubChangeDay(scheduleDay);
                                    }}
                                    className="rounded-circle"
                                    style={{ cursor: 'pointer'}}
                                    >
                                    <i className="fa fa-chevron-left mr-5"></i>
                                </span>
                                <span><b>{moment().add(scheduleDay, 'days').format("Do MMM, YY")}</b></span>
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay + 7);
                                        handleAddChangeDay(scheduleDay);
                                    }}
                                    style={{ cursor: 'pointer'}}
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
                                    onChange={(e) => 
                                        handleDatePicked(e.target.value)
                                    }
                                />{" "}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <div className='mt-4'>
                {!show ? <div className="text-center mt-5">
                    <Spinner animation="border" variant="danger" />
                    <h5 className="mt-5">
                        <b>Please wait while we load your Schedule for the day...</b>
                    </h5>
                </div> : 
                <RosterTabs data={sessionData}/>}
            </div>
        </>
    );
};

export default Roster;