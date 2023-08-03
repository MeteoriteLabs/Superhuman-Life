import React, { useState, useRef } from 'react';
import Schedular from 'builders/program-builder/program-template/scheduler';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { GET_CLIENT_SESSIONS } from './queries';
import { flattenObj } from 'components/utils/responseFlatten';
import { Row, Col } from 'react-bootstrap';
import SideNav from 'builders/program-builder/program-template/SchedulerSideBar';

const SchedulerScreen: React.FC = () => {
    const clientsSessions = window.location.href.split('/').pop();
    const [scheduleDate, setScheduleDate] = useState(moment().format('YYYY-MM-DD'));
    const [restDays, setRestDays] = useState<any>([]);
    const [collapse, setCollapse] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [show24HourFormat, setShow24HourFormat] = useState(false);
    const [showRestDay, setShowRestDay] = useState<boolean>(false);
    const [program, setProgram] = useState('none');
    const [sessionFilter, setSessionFilter] = useState('none');
    const ref = useRef<any>(null);

    const mainQuery = useQuery(GET_CLIENT_SESSIONS, {
        variables: {
            id: clientsSessions,
            startDate: moment(moment(scheduleDate).startOf('month').format('YYYY-MM-DD')).format(
                'YYYY-MM-DD'
            ),
            endDate: moment(moment(scheduleDate).startOf('month').format('YYYY-MM-DD'))
                .add(moment(scheduleDate).daysInMonth() - 1, 'days')
                .format('YYYY-MM-DD')
        },
        onCompleted: (data: any) => {
            const flattenData = flattenObj({ ...data });
            setRestDays(flattenData);
        }
    });

    const handleScrollScheduler = () => {
        ref.current?.scrollIntoView({ behaviour: 'smooth', inline: 'nearest' });
        window.scrollBy(0, -200);
    };

    const handleAccordionToggle = () => {
        setAccordionExpanded(!accordionExpanded);
    };

    function handleCallback() {
        mainQuery.refetch();
    }

    function handleFloatingActionProgramCallback(event: any) {
        setProgram(`${event}`);
        handleCallback();
        handleScrollScheduler();
    }

    function handleFloatingActionProgramCallback2(event: any) {
        setSessionFilter(`${event}`);
        handleCallback();
        handleScrollScheduler();
    }

    function handleRefetch() {
        handleCallback();
    }

    function handleDatePicked(date: any) {
        setScheduleDate(date);
    }

    function handleSubChangeDay(scheduleDate: any) {
        setScheduleDate(moment(scheduleDate).subtract(1, 'months').format('YYYY-MM-DD'));
    }

    function handleAddChangeDay() {
        setScheduleDate(moment(scheduleDate).add(1, 'months').format('YYYY-MM-DD'));
    }

    function handleShowRestDay() {
        setShowRestDay(!showRestDay);
        handleScrollScheduler();
    }

    return (
        <Row noGutters className="bg-light  py-4 mb-5  min-vh-100">
            <Col lg={collapse ? '11' : '10'} className="pr-2 pl-3 mb-5">
                <div className="col-lg-12">
                    <div className="text-center mb-4">
                        <input
                            min={moment().subtract(3, 'months').format('YYYY-MM-DD')}
                            max={moment().add(3, 'months').format('YYYY-MM-DD')}
                            className="p-1 rounded shadow-sm mb-3"
                            type="date"
                            style={{
                                border: 'none',
                                backgroundColor: 'rgba(211,211,211,0.8)'
                            }}
                            value={scheduleDate}
                            onChange={(e) => handleDatePicked(e.target.value)}
                        />{' '}
                        <br />
                        <span
                            onClick={() => {
                                // handleTimeUpdate(scheduleDay - 1);
                                handleSubChangeDay(scheduleDate);
                            }}
                            className="rounded-circle"
                        >
                            <i
                                className="fa fa-chevron-left mr-5"
                                style={{ cursor: 'pointer' }}
                            ></i>
                        </span>
                        <span>
                            <b>
                                {moment().format('YYYY-MM-DD') === scheduleDate
                                    ? moment().format('MMMM')
                                    : moment(scheduleDate).format('MMMM')}
                            </b>
                        </span>
                        <span
                            onClick={() => {
                                // handleTimeUpdate(scheduleDay + 1);
                                handleAddChangeDay();
                            }}
                        >
                            <i
                                className="fa fa-chevron-right ml-5"
                                style={{ cursor: 'pointer' }}
                            ></i>
                        </span>
                    </div>
                    <Schedular
                        type="date"
                        days={moment(scheduleDate).daysInMonth()}
                        classType={'One-On-One'}
                        restDays={restDays.sessionsBookings}
                        programId={clientsSessions}
                        startDate={moment(scheduleDate).startOf('month').format('YYYY-MM-DD')}
                        clientId={1}
                        clientSessions={true}
                        ref={ref}
                        showRestDay={showRestDay} //boolean
                        handleFloatingActionProgramCallback={handleFloatingActionProgramCallback}
                        handleFloatingActionProgramCallback2={handleFloatingActionProgramCallback2}
                        handleRefetch={handleRefetch} //()=> void
                        callback={handleCallback} //()=>void
                    />
                </div>
            </Col>
            {/* Right sidebar */}
            <Col lg={collapse ? '1' : '2'} className="d-lg-block">
                <SideNav
                    days={moment(scheduleDate).daysInMonth()}
                    type="date"
                    handleScrollScheduler={handleScrollScheduler}
                    show24HourFormat={show24HourFormat}
                    setShow24HourFormat={setShow24HourFormat}
                    collapse={collapse}
                    setCollapse={setCollapse}
                    accordionExpanded={accordionExpanded}
                    onAccordionToggle={handleAccordionToggle}
                    clientIds={[1]}
                    startDate={moment(scheduleDate).startOf('month').format('YYYY-MM-DD')}
                    callback={handleFloatingActionProgramCallback}
                    callback2={handleFloatingActionProgramCallback2}
                    callback3={handleRefetch}
                    restDayCallback={handleShowRestDay}
                    showRestDayAction={showRestDay}
                />
            </Col>
        </Row>
    );
};

export default SchedulerScreen;
