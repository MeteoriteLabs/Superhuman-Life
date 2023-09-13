import React, { useRef, useState } from 'react';
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
    2;
    const [key, setKey] = useState('');
    const [tag, setTag] = useState<any>();
    const [showProgramNameModal, setShowProgramNameModal] = useState<boolean>(false);
    const [totalClasses, setTotalClasses] = useState<any>([]);

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
            const flattenData = flattenObj({ ...data });
            const ids = [...sessionIds];
            setTag(flattenData.tags[0]);
            setSessionIds(ids);
            setRestDays(flattenData);
        }
    });

    mainQuery.refetch();
    function handleCallback() {
        mainQuery.refetch();
    }

    function calculateLastSession(sessions) {
        if (sessions.length === 0) {
            return 'N/A';
        }

        const moments = sessions.map((currentDate) => moment(currentDate.session_date));
        const maxDate = moment.max(moments);

        return maxDate.format('MMM Do,YYYY');
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

    function handleTimeFormatting(data: any, duration: number) {
        const digits = duration <= 30 ? 2 : 3;
        return (data === undefined ? 0 : data).toLocaleString('en-US', {
            minimumIntegerDigits: digits.toString(),
            useGrouping: false
        });
    }

    return (
        <Row>
            <Col lg={collapse ? '11' : '10'}>
                <Accordion>
                    <Card>
                        <Accordion.Toggle
                            as={Card.Header}
                            eventKey="0"
                            onClick={() => {
                                key === '' ? setKey('0') : setKey('');
                            }}
                            style={{ backgroundColor: '#343A40', color: 'white' }}
                        >
                            <span className="d-inline-block">
                                <b> {props.clientName ? props.clientName : null}</b>
                            </span>
                            <span className="d-inline-block btn float-right">
                                {key === '0' ? (
                                    <i className="fa fa-chevron-up d-flex justify-content-end text-white" />
                                ) : (
                                    <i className="fa fa-chevron-down d-flex justify-content-end text-white" />
                                )}
                            </span>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            {/* Package details card */}
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <Row>
                                        <Col lg={10} sm={8}>
                                            <Card.Title className="mt-2">
                                                <h4 style={{ letterSpacing: '1px' }}>
                                                    {props.clientName ? props.clientName : null}
                                                </h4>
                                            </Card.Title>
                                        </Col>
                                        <Col>
                                            <Row className="justify-content-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="bg-light"
                                                        id="dropdown-basic"
                                                    >
                                                        <img
                                                            src="/assets/cardsKebab.svg"
                                                            alt="notification"
                                                            className="img-responsive "
                                                            style={{
                                                                height: '20px',
                                                                width: '20px'
                                                            }}
                                                        />
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            key={1}
                                                            onClick={() =>
                                                                setShowProgramNameModal(true)
                                                            }
                                                        >
                                                            Edit Program Name
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Card.Text>
                                        <Row>
                                            <Col lg={9} sm={5} style={{ fontWeight: '500' }}>
                                                <b>
                                                    Date of session:{' '}
                                                    {props.effectiveDate
                                                        ? moment(props.effectiveDate).format(
                                                              'DD MMMM, YY'
                                                          )
                                                        : null}
                                                </b>
                                            </Col>
                                            <Col style={{ marginTop: '-20px' }}>
                                                {' '}
                                                <img
                                                    src={
                                                        props.clientPhoto
                                                            ? props.clientPhoto
                                                            : '/assets/image_placeholder.svg'
                                                    }
                                                    height="100"
                                                    className="rounded-circle"
                                                    width="100"
                                                    alt="avatar"
                                                    style={{ backgroundColor: 'gray' }}
                                                />
                                                <br />
                                                <b>{props.clientName ? props.clientName : null}</b>
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Accordion.Collapse>
                    </Card>
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

                                        <Col>
                                            <Calendar
                                                className="disabled"
                                                // tileClassName={tileContent}
                                                // onChange={onChange}
                                                // onActiveStartDateChange={({ action }) => {
                                                //     action === 'next'
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
                    type="date"
                    days={moment(scheduleDate).daysInMonth()}
                    classType={'One-On-One'}
                    restDays={restDays.sessionsBookings}
                    programId={clientsSessions}
                    startDate={moment(scheduleDate).startOf('month').format('YYYY-MM-DD')}
                    clientId={1}
                    clientSessions={true}
                    sessionIds={sessionIds}
                    program={program}
                    sessionFilter={sessionFilter}
                    handleFloatingActionProgramCallback={handleFloatingActionProgramCallback}
                    handleFloatingActionProgramCallback2={handleFloatingActionProgramCallback2}
                />
            </Col>

            <Col lg={collapse ? '1' : '2'} className="d-lg-block">
                <SideNav
                    sessionDate=""
                    type=""
                    handleScrollScheduler={handleScrollScheduler}
                    show24HourFormat={show24HourFormat}
                    setShow24HourFormat={setShow24HourFormat}
                    collapse={collapse}
                    setCollapse={setCollapse}
                    accordionExpanded={accordionExpanded}
                    onAccordionToggle={handleAccordionToggle}
                    clientIds=""
                    sessionIds={sessionIds}
                    startDate=""
                    duration=""
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
