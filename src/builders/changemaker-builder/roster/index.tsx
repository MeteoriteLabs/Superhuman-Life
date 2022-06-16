import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Button, Spinner } from 'react-bootstrap';
import moment from 'moment';
import RosterTabs from './tabs';
import { GET_SESSION_AND_SESSION_BOOKINGS, GET_SESSIONS_BASED_ON_DATE, GET_TAG_BASED_ON_SESSION } from './graphql/queries';
import { useQuery } from '@apollo/client';
import { flattenObj } from '../../../components/utils/responseFlatten';
import AuthContext from '../../../context/auth-context';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Roster = () => {

    const auth = useContext(AuthContext);
    // const [scheduleDay, setScheduleDay] = useState(0);
    const [scheduleDate, setScheduleDate] = useState(moment().format('YYYY-MM-DD'));
    const [currentDateSessions, setCurrentDateSessions] = useState<any>([]);
    const [restDays, setRestDays] = useState<any>([]);
    const [tags, setTags] = useState<any>([]);
    const [sessionData, setSessionData] = useState<any>([]);
    const [show, setShow] = useState(false);
    const [anotherDate, setAnotherDate] = useState('');

    console.log(restDays);
    console.log(currentDateSessions);

    // if(sessionData.length > 0){
    //     setScheduleDate(sessionData[0]?.session?.session_date);
    // }

    // useEffect(() => {
    //     setScheduleDate(sessionData[0]?.session?.session_date);
    // }, [scheduleDate]);

    function handleSorting(data: any) {
        data.sort((a: any, b: any) => {
            var btime1: any = moment(a.start_time, "HH:mm a");
            var btime2: any = moment(b.start_time, "HH:mm a");
            return btime1 - btime2;
        });
        data.sort(function (a: any, b: any) {
            const date1: any = new Date(a.session_date)
            const date2: any = new Date(b.session_date)

            return date1 - date2;
        });
        data.filter((sess: any) => sess.Is_Holiday === true);
        if (scheduleDate === moment().format("YYYY-MM-DD")) {
            setCurrentDateSessions(data);
            // window.location.href = `/roster/${data[0]?.id}`;
        }
    };

    useEffect(() => {
        const restDaysSorted = currentDateSessions.filter(session => session.Is_restday === true && session.session_date === anotherDate);
        setRestDays(restDaysSorted);
    }, [anotherDate, currentDateSessions])

    useQuery(GET_TAG_BASED_ON_SESSION, {
        variables: {
            userid: auth.userid,
            id: window.location.pathname.split('/').pop(),
            lowerDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
            upperDate: moment().add(1, 'month').format('YYYY-MM-DD')
        },
        onCompleted: (data: any) => {
            const flattenData = flattenObj({ ...data });
            setTags(flattenData.tags);
            handleSorting(flattenData.tags[0].sessions);
        }
    })

    // const currentDateData = useQuery(GET_SESSIONS_BASED_ON_DATE, {
    //     variables: {
    //         id: auth.userid,
    //         date: scheduleDate === anotherDate ? scheduleDate : anotherDate 
    //     },
    //     onCompleted: (data) => {
    //         const flattenData = flattenObj({...data});
    //         handleSorting(flattenData.sessions);
    //     }
    // });

    const currentSession = useQuery(GET_SESSION_AND_SESSION_BOOKINGS, {
        variables: {
            id: window.location.pathname.split('/').pop()
        },
        onCompleted: (data) => {
            const flattenedData = flattenObj({ ...data });
            console.log(flattenedData);
            setAnotherDate(moment(flattenedData.sessionsBookings[0]?.session?.session_date).format("YYYY-MM-DD"));
            setSessionData(flattenedData.sessionsBookings);
            setShow(true);
        }
    });

    function handleIconRender(tag: any, mode: any) {
        if (tag === 'Personal Training') {
            if (mode === 'Online') {
                return <img src="/assets/PTonline.svg" alt="pt_online" />
            } else {
                return <img src="/assets/PToffline.svg" alt="pt_offline" />
            }
        } else if (tag === 'Group Class') {
            if (mode === 'Online') {
                return <img src="/assets/Grouponline.svg" alt="group_online" />
            } else {
                return <img src="/assets/Groupoffline.svg" alt="group_offline" />
            }
        }
    }

    function handleDatePicked(val: any) {
        // console.log(val);
        setScheduleDate(val);
        setAnotherDate(val);
    }

    function handleSubChangeDay(day: any) {
        // setScheduleDay(day - 1);
        // setScheduleDate(moment(day).subtract(1, 'days').format("YYYY-MM-DD"));
        // setAnotherDate(moment(day).subtract(1, 'days').format("YYYY-MM-DD"));
        // currentDateData.refetch();
        const getChangeDateSessions = currentDateSessions.filter((sess: any) => moment(sess.session_date).format("YYYY-MM-DD") === moment(day).subtract(1, 'days').format("YYYY-MM-DD"));
        window.location.href = `/roster/${getChangeDateSessions[0]?.id}`;
    }

    function handleAddChangeDay(day: any) {
        // setScheduleDay(day + 1);
        // setScheduleDate(moment(day).add(1, 'days').format("YYYY-MM-DD"));
        // setAnotherDate(moment(day).add(1, 'days').format("YYYY-MM-DD"));
        // currentDateData.refetch();
        const getChangeDateSessions = currentDateSessions.filter((sess: any) => moment(sess.session_date).format("YYYY-MM-DD") === moment(day).add(1, 'days').format("YYYY-MM-DD"));
        window.location.href = `/roster/${getChangeDateSessions[0]?.id}`;
    }

    function toHoursAndMinutes(totalMinutes) {
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);

        return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function handleClassTimeDisplay(time: any) {
        const value = moment(time, 'hh:mm a').isBefore(moment());

        if (value) {
            return <span className="text-danger">Class Has Ended</span>
        } else {
            const leftTime = moment(time, 'hh:mm a').diff(moment(), 'minutes');
            const timeLeft = toHoursAndMinutes(leftTime);
            const timeLeftHours = timeLeft.split(':')[0];
            const timeLeftMinutes = timeLeft.split(':')[1];
            return <span className="text-success">Class Starts in {timeLeftHours}h {timeLeftMinutes}m</span>
        }
    }

    function handlePrevSessionLoad(currentId: any) {
        const location = currentDateSessions.findIndex(session => session.id === currentId);
        if (location === 0 || currentDateSessions.length === 1) {
            console.log('no previous sessions available');
            // handleSubChangeDay(anotherDate);
            // currentDateData.refetch()
        } else {
            window.location.href = `/roster/${currentDateSessions[location - 1].id}`;
        }
    }

    function handleNextSessionLoad(currentId: any) {
        const location = currentDateSessions.findIndex(session => session.id === currentId);
        if (location === currentDateSessions.length - 1) {
            console.log('no next sessions available');
            // handleAddChangeDay(scheduleDate === anotherDate ? scheduleDate : anotherDate);
            // currentDateData.refetch();
        } else {
            window.location.href = `/roster/${currentDateSessions[location + 1].id}`;
        }
    }

    // function handlePrevDayLoad(){
    //     setScheduleDate(moment(scheduleDate).subtract(1, 'days').format("YYYY-MM-DD"));
    //     // currentDateData.refetch();
    // }

    return (
        <>
            <div className="mb-3">
                <span style={{ fontSize: '30px' }}>
                    <Link to="/schedule"><i className="fa fa-arrow-circle-left" style={{ color: 'black' }}></i></Link>
                    <b> Back</b>
                </span>
            </div>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Row>
                        <Col lg={6} style={{ borderRight: '2px dashed gray' }}>
                            <div className='text-center mb-2'>
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay - 7);
                                        // handleSubChangeDay(scheduleDay);
                                        handlePrevSessionLoad(window.location.pathname.split('/').pop());
                                    }}
                                    className="rounded-circle"
                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                >
                                    <i className="fa fa-chevron-left mr-5"></i>
                                </span>
                                <span style={{ fontSize: '30px', fontWeight: 'bold' }}>{sessionData[0]?.session?.activity === null ? sessionData[0]?.session?.workout?.workouttitle : sessionData[0]?.session?.activity?.title}</span>
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay + 7);
                                        // handleAddChangeDay(scheduleDay);
                                        handleNextSessionLoad(window.location.pathname.split('/').pop())
                                    }}
                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                >
                                    <i className="fa fa-chevron-right ml-5"></i>
                                </span>
                            </div>
                            <div className='text-center' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <div className='pl-3 pr-3' style={{ border: '1px solid black', borderRadius: '20px' }}>
                                    <span>{moment(sessionData[0]?.session?.start_time, "hh:mm a").format("hh:mm a")}</span>
                                </div>
                                <div className='pl-3 pr-3'>
                                    to
                                </div>
                                <div className='pl-3 pr-3' style={{ border: '1px solid black', borderRadius: '20px' }}>
                                    <span>{moment(sessionData[0]?.session?.end_time, "hh:mm a").format("hh:mm a")}</span>
                                </div>
                            </div>
                            <div className='mt-2' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                <div style={{ maxWidth: '300px' }}>
                                    <img src="/assets/navigation_icon.svg" alt="navigation-icon" />
                                    <span className='pl-2'>{tags[0]?.fitnesspackage?.address === null ? 'Class will be on google meet' : tags[0]?.fitnesspackage?.address?.address1}</span>
                                </div>
                                <div>
                                    <span>{handleIconRender(sessionData[0]?.session?.tag, sessionData[0]?.session?.mode)}</span>
                                    <span className='pl-2'>{sessionData[0]?.session?.tag}</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} style={{ borderRight: '2px dashed gray' }}>
                            <div className='text-center'>
                                <span><b>{moment(sessionData[0]?.session?.session_date).isAfter(moment()) ? <span className="text-success">Class Is Tomorrow</span> : handleClassTimeDisplay(sessionData[0]?.session?.start_time)}</b></span>
                            </div>
                            <div className='text-center'>
                                <Button variant='success'
                                    disabled={moment(sessionData[0]?.session?.start_time, 'hh:mm a').isBefore(moment())}
                                >Join Session
                                </Button>
                            </div>
                            <div className='text-center mt-4'>
                                <button className='pl-3 pr-3' style={{ border: '2px solid gray', borderRadius: '10px' }}>Attendance</button>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className='text-center'>
                                <span><b>{tags?.map((item: any) => {
                                    return item.tag_name
                                }).join(", ")}</b></span>
                            </div>
                            <div className="text-center">
                                <br />
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay - 7);
                                        handleSubChangeDay(scheduleDate === anotherDate ? scheduleDate : anotherDate);
                                        // handlePrevDayLoad();
                                    }}
                                    className="rounded-circle"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa fa-chevron-left mr-5"></i>
                                </span>
                                <span><b>{scheduleDate === anotherDate ? moment(scheduleDate).format("Do MMM, YY") : moment(anotherDate).format("Do MMM, YY")}</b></span>
                                <span
                                    onClick={() => {
                                        // handleTimeUpdate(scheduleDay + 7);
                                        handleAddChangeDay(scheduleDate === anotherDate ? scheduleDate : anotherDate);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa fa-chevron-right ml-5"></i>
                                </span>
                                <br />
                                {/* <input
                                    min={moment().subtract(3, "months").format("YYYY-MM-DD")}
                                    max={moment().add(3, "months").format("YYYY-MM-DD")}
                                    className="p-1 mt-3 rounded shadow-sm mb-3"
                                    type="date"
                                    style={{
                                        border: "none",
                                        backgroundColor: "rgba(211,211,211,0.8)",
                                    }}
                                    value={scheduleDate === anotherDate ? scheduleDate : anotherDate}
                                    onChange={(e) => 
                                        handleDatePicked(e.target.value)
                                    }
                                />{" "} */}
                                <Calendar
                                    className="disabled mt-3"
                                    // tileClassName={tileContent}
                                    // onChange={onChange}
                                    // onActiveStartDateChange={({ action }) => {
                                    //     action === "next"
                                    //         ? setMonth(month + 1)
                                    //         : setMonth(month - 1);
                                    // }}
                                    // value={value}
                                    minDate={moment().startOf('month').toDate()}
                                    maxDate={moment().add(2, 'months').toDate()}
                                    maxDetail="month"
                                    minDetail="month"
                                    next2Label={null}
                                    prev2Label={null}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {restDays?.length > 0 && <div className="mt-4 mb-4 p-3 text-center" style={{ backgroundColor: '#F5A947', borderRadius: '10px' }}>
                <b>Rest Day</b>
            </div>}
            {sessionData.length > 0 && <div className='mt-4'>
                {!show ? <div className="text-center mt-5">
                    <Spinner animation="border" variant="danger" />
                    <h5 className="mt-5">
                        <b>Please wait while we load your Schedule for the day...</b>
                    </h5>
                </div> :
                    <RosterTabs data={sessionData} />}
            </div>}
        </>
    );
};

export default Roster;