import React, { useEffect, useRef, useState } from 'react';
import Schedular from '../../../../../builders/program-builder/program-template/scheduler';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { GET_CLIENT_SESSIONS } from './queries';
import { flattenObj } from '../../../../../components/utils/responseFlatten';
import { Card, Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { SideNav } from '../../../../session-builder/Fitness/Event/import';
import { Accordion, Dropdown, Badge, Table } from 'react-bootstrap';
import DisplayImage from 'components/DisplayImage';

const SchedulerScreen = (props: any) => {
    const clientsSessions = window.location.href.split('/').pop();
    const [scheduleDate, setScheduleDate] = useState(moment().format('YYYY-MM-DD'));
    const [restDays, setRestDays] = useState<any>([]);
    const [collapse, setCollapse] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [show24HourFormat, setShow24HourFormat] = useState(false);
    const ref = useRef<any>(null);
    const [program, setProgram] = useState('none');
    const [sessionFilter, setSessionFilter] = useState('none');
    const [showRestDay, setShowRestDay] = useState<boolean>(false);
    const [sessionIds, setSessionIds] = useState<string[]>([]);
    const [key, setKey] = useState('');
    const [tag, setTag] = useState<any>();
    const [showProgramNameModal, setShowProgramNameModal] = useState<boolean>(false);
    const [totalClasses, setTotalClasses] = useState<any>([]);
    const [schedulerSessions, setSchedulerSessions] = useState([]);

    function handleDatePicked(date: any) {
        setScheduleDate(date);
    }

    function handleSubChangeDay(scheduleDate: any) {
        setScheduleDate(moment(scheduleDate).subtract(1, 'months').format('YYYY-MM-DD'));
    }

    function handleAddChangeDay(date: any) {
        setScheduleDate(moment(scheduleDate).add(1, 'months').format('YYYY-MM-DD'));
    }

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
            setSchedulerSessions(data);
            const flattenData = flattenObj({ ...data });
            const sessionIds = flattenData.sessionsBookings.map(
                (sessionBooking) => sessionBooking.session.id
            );
            setSessionIds(sessionIds);
            setRestDays(flattenData);
            setTag(flattenData.sessionsBookings[0]);
        }
    });

    function handleCallback() {
        mainQuery.refetch();
    }

    function calculateDuration(startDate: string, endDate: string) {
        const packageStartDate = moment(startDate);
        const packageEndDate = moment(endDate);
        return packageEndDate.diff(packageStartDate, 'days') + 1;
    }

    const handleScrollScheduler = () => {
        ref.current?.scrollIntoView({ behaviour: 'smooth', inline: 'nearest' });
        window.scrollBy(0, -200);
    };

    const handleAccordionToggle = () => {
        setAccordionExpanded(!accordionExpanded);
    };

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

    function handleShowRestDay() {
        setShowRestDay(!showRestDay);
        handleScrollScheduler();
    }

    return (
        <Row>
            <Col lg={collapse ? '11' : '10'}>
                <Accordion>
                    <Card>
                        <Accordion.Toggle
                            as={Card.Header}
                            eventKey="1"
                            onClick={() => {
                                key === '' ? setKey('1') : setKey('');
                            }}
                            style={{ backgroundColor: '#343A40', color: 'white' }}
                        >
                            <span className="d-inline-block">
                                <b>Movement Sessions</b>
                            </span>
                            <span className="d-inline-block btn float-right">
                                {key === '1' ? (
                                    <i className="fa fa-chevron-up d-flex justify-content-end text-white"></i>
                                ) : (
                                    <i className="fa fa-chevron-down d-flex justify-content-end text-white"></i>
                                )}
                            </span>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            {/* Movement sessions */}
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Title>
                                        <h4>Movement Sessions</h4>
                                    </Card.Title>
                                    <Card.Text>
                                        Last planned session :{' '}
                                        {props.effectiveDate
                                            ? moment(props.effectiveDate).format('DD MMMM, YY')
                                            : null}
                                    </Card.Text>

                                    <Row>
                                        <Col lg={8}>
                                            <Table striped bordered hover size="sm" responsive>
                                                <thead className="text-center">
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                    <tr></tr>
                                                </tbody>
                                            </Table>
                                        </Col>

                                    </Row>
                                </Card.Body>
                            </Card>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Col>

            <Col lg={collapse ? '11' : '10'} className="pr-2 pl-3 mb-5 mt-2">
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
                        <i className="fa fa-chevron-left mr-5" style={{ cursor: 'pointer' }}></i>
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
                            handleAddChangeDay(scheduleDate);
                        }}
                    >
                        <i className="fa fa-chevron-right ml-5" style={{ cursor: 'pointer' }}></i>
                    </span>
                </div>
                <Schedular
                    show24HourFormat={show24HourFormat}
                    type="date"
                    days={moment(scheduleDate).daysInMonth()}
                    classType={tag && tag.session ? tag.session.type : null}
                    sessionDate={tag && tag.session ? tag.session.session_date : null}
                    restDays={
                        restDays && restDays.sessionsBookings && restDays.sessionsBookings.length
                            ? restDays.sessionsBookings.filter(
                                  (ses) => ses.session.type === 'restday'
                              )
                            : null
                    }
                    schedulerSessions={schedulerSessions}
                    // programId={tag && tag.session && tag?.session.id}

                    startDate={moment(scheduleDate).startOf('month').format('YYYY-MM-DD')}
                    clientId={clientsSessions}
                    clientSessions={true}
                    sessionFilter={sessionFilter}
                    program={program}
                    ref={ref}
                    showRestDay={showRestDay}
                    handleFloatingActionProgramCallback={handleFloatingActionProgramCallback}
                    handleFloatingActionProgramCallback2={handleFloatingActionProgramCallback2}
                    handleRefetch={handleRefetch}
                    callback={handleCallback}
                    sessionIds={sessionIds}

                />
            </Col>

            <Col lg={collapse ? '1' : '2'} className="d-lg-block">
                <SideNav
                    sessionDate={tag && tag.session ? tag.session.session_date : null}
                    days={moment(scheduleDate).daysInMonth()}
                    type="workout"
                    handleScrollScheduler={handleScrollScheduler}
                    show24HourFormat={show24HourFormat}
                    setShow24HourFormat={setShow24HourFormat}
                    collapse={collapse}
                    setCollapse={setCollapse}
                    accordionExpanded={accordionExpanded}
                    onAccordionToggle={handleAccordionToggle}
                    clientIds={clientsSessions}
                    sessionIds={sessionIds}
                    startDate={moment(
                        moment(scheduleDate).startOf('month').format('YYYY-MM-DD')
                    ).format('YYYY-MM-DD')}
                    duration={calculateDuration(
                        moment(moment(scheduleDate).startOf('month').format('YYYY-MM-DD')).format(
                            'YYYY-MM-DD'
                        ),
                        moment(moment(scheduleDate).startOf('month').format('YYYY-MM-DD'))
                            .add(moment(scheduleDate).daysInMonth() - 1, 'days')
                            .format('YYYY-MM-DD')
                    )}
                    callback={handleFloatingActionProgramCallback}
                    callback2={handleFloatingActionProgramCallback2}
                    callback3={handleRefetch}
                    restDayCallback={handleShowRestDay}
                    showRestDayAction={showRestDay} showBlockedSlots={false} setShowBlockedSlots={function (parmas: boolean): void {
                        throw new Error('Function not implemented.');
                    } }                />
            </Col>
        </Row>
    );
};

export default SchedulerScreen;
