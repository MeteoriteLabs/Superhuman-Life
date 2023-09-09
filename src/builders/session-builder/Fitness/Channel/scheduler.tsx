import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    // GET_TABLEDATA,
    // GET_ALL_FITNESS_PACKAGE_BY_TYPE,
    // GET_ALL_CLIENT_PACKAGE,
    GET_TAG_BY_ID
} from '../../graphQL/queries';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Row, Col, Dropdown, Card, Badge, Table, Accordion, Button, Form } from 'react-bootstrap';
import SchedulerPage from 'builders/program-builder/program-template/scheduler';
import moment from 'moment';
import FitnessAction from '../FitnessAction';
import { Link } from 'react-router-dom';
import '../../profilepicture.css';
import { flattenObj } from 'components/utils/responseFlatten';
import '../Group/actionButton.css';
import Loader from 'components/Loader/Loader';
import DisplayImage from 'components/DisplayImage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { SideNav } from '../Event/import';
import EditProgramName from '../../EditProgramName/index';
import ExtendProgram from './ExtendProgram';
import { CollapsibleScheduler } from '../Cohort/import';
import { GET_TAGS } from '../../graphQL/queries';
import AuthContext from 'context/auth-context';

const Scheduler: React.FC = () => {
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    const [show, setShow] = useState(false);
    // const [totalClasses, setTotalClasses] = useState<any>([]);
    const [tag, setTag] = useState<any>();
    const [channelStartDate, setChannelStartDate] = useState('');
    const [channelEndDate, setChannelEndDate] = useState('');
    // this is used for monthly toggle
    const [prevDate, setPrevDate] = useState('');
    const [nextDate, setNextDate] = useState('');
    const [sessionIds, setSessionIds] = useState<any>([]);
    const [clientIds, setClientIds] = useState<any>([]);
    // these are the sessions that will passed onto the scheduler
    const [schedulerSessions, setSchedulerSessions] = useState<any>([]);
    const [key, setKey] = useState('');
    const [collapse, setCollapse] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [show24HourFormat, setShow24HourFormat] = useState(false);
    const ref = useRef<any>(null);
    const [showProgramNameModal, setShowProgramNameModal] = useState<boolean>(false);
    const [showExtendProgramModal, setShowExtendProgramModal] = useState<boolean>(false);
    const [showCollapseView, setShowCollapseView] = useState<boolean>(false);
    const [blockedSessions, setBlockedSessions] = useState<any>();
    const auth = useContext(AuthContext);
    const [total, setTotal] = useState<number>(10);

    const handleScrollScheduler = () => {
        ref.current?.scrollIntoView({ behaviour: 'smooth', inline: 'nearest' });
        window.scrollBy(0, -200);
    };

    const handleAccordionToggle = () => {
        setAccordionExpanded(!accordionExpanded);
    };

    const [program, setProgram] = useState('none');
    const [sessionFilter, setSessionFilter] = useState('none');
    const [showRestDay, setShowRestDay] = useState<boolean>(false);

    const fitnessActionRef = useRef<any>(null);

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 1500);
    }, [show]);

    function handleRangeDates(startDate: string, endDate: string) {
        setPrevDate(moment(startDate).format('YYYY-MM-DD'));

        if (moment(startDate).add(30, 'days').isBefore(moment(endDate))) {
            setNextDate(moment(startDate).add(30, 'days').format('YYYY-MM-DD'));
        } else {
            setNextDate(moment(endDate).format('YYYY-MM-DD'));
        }
    }

    const mainQuery = useQuery(GET_TAG_BY_ID, {
        variables: { id: tagId },
        onCompleted: (data) => loadTagData(data)
    });

    function loadTagData(data: any) {
        setSchedulerSessions(data);
        const flattenData = flattenObj({ ...data });

        const total = [0];
        const clientValues = [...clientIds];
        const values = flattenData.tags ? [...flattenData.tags[0].sessions] : [];
        const ids = [...sessionIds];
        for (let i = 0; i < values.length; i++) {
            ids.push(values[i].id);
            if (values[i].tag === 'Classic') {
                total[0] += 1;
            }
        }
        setChannelStartDate(
            moment(flattenData.tags[0].fitnesspackage.Start_date).format('YYYY-MM-DD')
        );
        setChannelEndDate(moment(flattenData.tags[0].fitnesspackage.End_date).format('YYYY-MM-DD'));
        handleRangeDates(
            flattenData.tags[0].fitnesspackage.Start_date,
            flattenData.tags[0].fitnesspackage.End_date
        );
        setSessionIds(ids);
        setClientIds(clientValues);
        // setTotalClasses(total);
        setTag(flattenData.tags[0]);
    }

    const [tags, { data: get_tags }] = useLazyQuery(GET_TAGS, {
        variables: { tagId: tagId, userId: auth.userid, count: total },
        onCompleted: (data) => {
            setTotal(data.tags.meta.pagination.total);
            const flattenData = flattenObj({ ...data });
            
            const sessions = flattenData.tags && flattenData.tags.length && flattenData.tags.map((currentTag) =>
                currentTag.sessions).flat().filter(
                    (currentSession) => {
                        return currentSession.session_date >= channelStartDate && currentSession.session_date <= channelEndDate
                    }
                );

            setBlockedSessions(sessions);
        }
    });

    useEffect(() => {
        tags();
    }, [total]);

    function calculateLastSession(sessions) {
        if (sessions.length === 0) {
            return 'N/A';
        }

        const moments = sessions.map((currentDate) => moment(currentDate.session_date));
        const maxDate = moment.max(moments);

        return maxDate.format('MMM Do,YYYY');
    }

    // function calculateDailySessions(sessions) {
    //     const dailySessions = sessions.filter(
    //         (ses: any) => ses.session_date === moment().format('YYYY-MM-DD')
    //     );
    //     return dailySessions.length >= 1 ? dailySessions.length : 'N/A';
    // }

    function calculateDays(sd: string, ed: string) {
        const days = moment(ed).diff(moment(sd), 'days');
        return days + 1;
    }

    function handleCurrentDate() {
        setPrevDate(moment().format('YYYY-MM-DD'));

        if (moment().add(30, 'days').isBefore(moment(channelEndDate))) {
            setNextDate(moment().add(30, 'days').format('YYYY-MM-DD'));
        } else {
            setNextDate(moment(channelEndDate).format('YYYY-MM-DD'));
        }
    }

    function handleDatePicked(date: string) {
        setPrevDate(moment(date).format('YYYY-MM-DD'));

        if (moment(date).add(30, 'days').isBefore(moment(channelEndDate))) {
            setNextDate(moment(date).add(30, 'days').format('YYYY-MM-DD'));
        } else {
            setNextDate(moment(channelEndDate).format('YYYY-MM-DD'));
        }
    }

    // this is to handle the left chevron, if we have to display it or no.
    function handlePrevDisplay(date: string) {
        return moment(date).isSame(moment(channelStartDate)) ? 'none' : '';
    }

    // this is to handle the right chevron, if we have to display it or no.
    function handleNextDisplay(date: string) {
        return moment(date).isSame(moment(channelEndDate)) ? 'none' : '';
    }

    function handlePrevMonth(date: string) {
        // setScheduleDate(moment(date).subtract(1, 'month').format('YYYY-MM-DD'));
        setNextDate(moment(date).format('YYYY-MM-DD'));

        if (moment(date).subtract(30, 'days').isSameOrAfter(moment(channelStartDate))) {
            setPrevDate(moment(date).subtract(30, 'days').format('YYYY-MM-DD'));
        } else {
            setPrevDate(moment(channelStartDate).format('YYYY-MM-DD'));
        }
    }

    function calculateDuration(sd: any, ed: any) {
        const start = moment(sd);
        const end = moment(ed);
        return end.diff(start, 'days') + 1;
    }

    // function calculateDailySessions(sessions) {
    //     const dailySessions = sessions.filter(
    //         (ses: any) => ses.session_date === moment().format('YYYY-MM-DD')
    //     );
    //     return dailySessions.length ? dailySessions.length : 'N/A';
    // }

    function handleFloatingActionProgramCallback(event: any) {
        setProgram(`${event}`);
        handleScrollScheduler();
        handleCallback();
    }

    function handleFloatingActionProgramCallback2(event: any) {
        handleScrollScheduler();
        handleCallback();
        setSessionFilter(`${event}`);
    }

    function handleRefetch() {
        handleCallback();
    }

    function handleShowRestDay() {
        setShowRestDay(!showRestDay);
        handleScrollScheduler();
    }

    function handleNextMonth(date: string) {
        // setScheduleDate(moment(date).add(1, 'month').format('YYYY-MM-DD'));
        setPrevDate(moment(date).format('YYYY-MM-DD'));

        if (moment(date).add(30, 'days').isBefore(moment(channelEndDate))) {
            setNextDate(moment(date).add(30, 'days').format('YYYY-MM-DD'));
        } else {
            setNextDate(moment(channelEndDate).format('YYYY-MM-DD'));
        }
    }

    function handleCallback() {
        mainQuery.refetch();
    }

    const completedSessions =
        tag && tag.sessions && tag.sessions.length
            ? tag.sessions.filter((curr) => {
                  if (
                      moment(curr.session_date)
                          .add(+curr.end_time.split(':')[0], 'hours')
                          .add(+curr.end_time.split(':')[1])
                          .diff(moment.utc()) < 0
                  )
                      return curr.session_date;
              })
            : null;

    if (!show) return <Loader msg="loading scheduler..." />;
    else
        return (
            <Row noGutters className="bg-light  py-4 mb-5  min-vh-100">
                <Col lg={collapse ? '11' : '10'} className="pr-2 pl-3 mb-5">
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <span style={{ fontSize: '30px' }}>
                                <Link to="/session">
                                    <i
                                        className="fa fa-arrow-circle-left"
                                        style={{ color: 'black' }}
                                    ></i>
                                </Link>
                                <b> back</b>
                            </span>
                        </div>

                        {showProgramNameModal && (
                            <EditProgramName
                                show={showProgramNameModal}
                                onHide={() => setShowProgramNameModal(false)}
                                id={tagId}
                            />
                        )}

{showExtendProgramModal && (
                            <ExtendProgram
                                show={showExtendProgramModal}
                                onHide={() => setShowExtendProgramModal(false)}
                                id={tagId}
                            />
                        )}

                        {/* Cards for service details and movement sessions */}
                        <Row>
                            <Col lg={11}>
                                <Accordion>
                                    {/* Service details card */}
                                    <Card>
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            eventKey="0"
                                            onClick={() => {
                                                key === '' ? setKey('0') : setKey('');
                                            }}
                                            style={{ background: '#343A40', color: '#fff' }}
                                        >
                                            <span className="d-inline-block">
                                                <b>{tag && tag.fitnesspackage?.packagename}</b>
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
                                            <Card style={{ width: '100%' }}>
                                                <Card.Body>
                                                    <Row>
                                                        <Col lg={10} sm={8}>
                                                            <Card.Title>
                                                                <h4>
                                                                    {tag &&
                                                                        tag.fitnesspackage
                                                                            ?.packagename}
                                                                    {tag?.tag_name
                                                                        ? ` (${tag?.tag_name})`
                                                                        : null}
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
                                                                            alt="edit"
                                                                            className="img-responsive "
                                                                            style={{
                                                                                height: '20px',
                                                                                width: '20px'
                                                                            }}
                                                                        />
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item
                                                                            key={2}
                                                                            onClick={() =>
                                                                                setShowProgramNameModal(
                                                                                    true
                                                                                )
                                                                            }
                                                                        >
                                                                            Edit Program Name
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item key={1}
                                                                        onClick={() =>
                                                                            setShowExtendProgramModal(
                                                                                true
                                                                            )
                                                                        }
                                                                        >
                                                                            Extend program and
                                                                            offering
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                    <Card.Text>
                                                        <Row>
                                                            <Col lg={9} sm={5}>
                                                                <Badge
                                                                    pill
                                                                    variant="dark"
                                                                    className="py-2 px-3 my-2"
                                                                >
                                                                    {tag && tag.fitnesspackage
                                                                        ? tag.fitnesspackage.level
                                                                        : null}
                                                                </Badge>
                                                                <br />
                                                                <b>Start Date:</b>{' '}
                                                                {channelStartDate}
                                                                <br />
                                                                <b>End Date: </b>
                                                                {channelEndDate}
                                                            </Col>
                                                            <Col>
                                                                <DisplayImage
                                                                    imageName={
                                                                        tag &&
                                                                        tag.client_packages &&
                                                                        tag.client_packages
                                                                            .length &&
                                                                        tag.client_packages[0]
                                                                            .users_permissions_user &&
                                                                        tag.client_packages[0]
                                                                            .users_permissions_user
                                                                            .Photo_ID
                                                                            ? tag.client_packages[0]
                                                                                  .users_permissions_user
                                                                                  .Photo_ID
                                                                            : null
                                                                    }
                                                                    defaultImageUrl="assets/image_placeholder.svg"
                                                                    imageCSS="rounded-circle profile_pic text-center img-fluid ml-2"
                                                                />
                                                                <br />
                                                                <br />
                                                                <Badge
                                                                    pill
                                                                    variant="dark"
                                                                    className="py-2 px-4 "
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => {
                                                                        fitnessActionRef.current.TriggerForm(
                                                                            {
                                                                                id: last[0],
                                                                                actionType:
                                                                                    'allClients',
                                                                                type: 'Live Stream Channel'
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    View all
                                                                </Badge>
                                                                <p className="ml-3">
                                                                    {tag && tag.client_packages
                                                                        ? tag.client_packages.length
                                                                        : null}{' '}
                                                                    people
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Accordion.Collapse>
                                    </Card>
                                    {/* Movement Card */}
                                    <Card>
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            eventKey="1"
                                            onClick={() => {
                                                key === '' ? setKey('1') : setKey('');
                                            }}
                                            style={{ background: '#343A40', color: '#fff' }}
                                        >
                                            <span className="d-inline-block">
                                                <b>Movement Sessions</b>
                                            </span>
                                            <span className="d-inline-block btn float-right">
                                                {key === '1' ? (
                                                    <i className="fa fa-chevron-up d-flex justify-content-end text-white" />
                                                ) : (
                                                    <i className="fa fa-chevron-down d-flex justify-content-end text-white" />
                                                )}
                                            </span>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="1">
                                            <Card style={{ width: '100%' }}>
                                                <Card.Body>
                                                    <Card.Title>
                                                        <h4>Movement Sessions</h4>
                                                    </Card.Title>
                                                    <Card.Text>
                                                        Last planned session{' '}
                                                        {tag &&
                                                            tag.sessions &&
                                                            calculateLastSession(tag.sessions)}
                                                    </Card.Text>
                                                    <Row>
                                                        <Col lg={8}>
                                                            <Table
                                                                striped
                                                                bordered
                                                                hover
                                                                size="sm"
                                                                responsive
                                                            >
                                                                <thead className="text-center">
                                                                    <tr>
                                                                        <th>Type</th>
                                                                        <th>Total</th>
                                                                        <th>Plan</th>
                                                                        <th>Completed</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="text-center">
                                                                    <tr>
                                                                        <td>
                                                                            {tag &&
                                                                            tag.fitnesspackage &&
                                                                            tag.fitnesspackage
                                                                                .fitness_package_type
                                                                                ? tag.fitnesspackage
                                                                                      .fitness_package_type
                                                                                      .type
                                                                                : null}
                                                                        </td>
                                                                        <td>
                                                                            {moment(
                                                                                channelEndDate
                                                                            ).diff(
                                                                                moment(
                                                                                    channelStartDate
                                                                                ),
                                                                                'days'
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {tag &&
                                                                                tag.sessions &&
                                                                                tag.sessions.length}
                                                                        </td>
                                                                        <td>
                                                                            {completedSessions &&
                                                                            completedSessions.length
                                                                                ? completedSessions.length
                                                                                : 0}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </Col>
                                                        <Col className="h-25">
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
                                                                minDate={moment()
                                                                    .startOf('month')
                                                                    .toDate()}
                                                                maxDate={moment()
                                                                    .add(2, 'months')
                                                                    .toDate()}
                                                                maxDetail="month"
                                                                minDetail="month"
                                                                next2Label={null}
                                                                prev2Label={null}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <p className="text-dark">
                                                        Note: Create atleast 3 sessions to start
                                                        accepting bookings
                                                    </p>
                                                </Card.Body>
                                            </Card>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Col>
                        </Row>

                        {/* old code */}
                        {/* <Row>
                    <Col
                        lg={11}
                        className="p-4 shadow-lg bg-white"
                        style={{ borderRadius: '10px' }}
                    >
                        <Row>
                            <Col style={{ borderRight: '2px dotted grey' }}>
                                <Row>
                                    <div
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            position: 'absolute',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        <h3 className="text-center">
                                            {tag.fitnesspackage.packagename}
                                        </h3>
                                    </div>
                                </Row>
                            </Col>
                            <Col style={{ borderRight: '2px dotted grey ' }}>
                                <Row>
                                    <Col>
                                        <span>
                                            <b>Active Subscribers: </b>
                                        </span>
                                    </Col>
                                    <Col lg={7}>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <div className="position-relative">
                                                {tag.client_packages.length === 0 ? (
                                                    <span>N/A</span>
                                                ) : (
                                                    tag.client_packages
                                                        .slice(0, 4)
                                                        .map((item, index) => {
                                                            const postionLeft = 8;
                                                            return (
                                                                <img
                                                                    key={index}
                                                                    src="https://picsum.photos/200/100"
                                                                    alt="profile-pic"
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        borderRadius: '50%',
                                                                        left: `${
                                                                            postionLeft * index
                                                                        }%`
                                                                    }}
                                                                />
                                                            );
                                                        })
                                                )}
                                            </div>
                                        </Row>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <span>{tag.client_packages.length} people</span>
                                        </Row>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <button
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: 'white',
                                                    color: '#006E99',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    fitnessActionRef.current.TriggerForm({
                                                        id: last[0],
                                                        actionType: 'allClients',
                                                        type: 'Live Stream Channel'
                                                    });
                                                }}
                                            >
                                                View all
                                            </button>
                                        </Row>
                                    </Col>
                                </Row>
                                <div>
                                    <div>
                                        <b>Status:</b>{' '}
                                        {tag.fitnesspackage.Status === true ? (
                                            <span className="text-success">Active</span>
                                        ) : (
                                            <span className="text-danger">Inactive</span>
                                        )}
                                    </div>
                                    <br />
                                    <div>
                                        <b>Level:</b> {tag.fitnesspackage.level}
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <Row>
                                    <Col lg={8}>
                                        <div style={{ justifyContent: 'space-evenly' }}>
                                            <div>
                                                <b>Last scheduled session:</b>{' '}
                                                {calculateLastSession(tag.sessions)}
                                            </div>
                                            <br />
                                            <div>
                                                <b>No of session daily:</b>{' '}
                                                {calculateDailySessions(tag.sessions)}
                                            </div>
                                            <br />
                                            <div>
                                                <b>Active days:</b> {tag.fitnesspackage.level}
                                            </div>
                                            <br />
                                            <div>
                                                <b>Stream Sync:</b> &nbsp;
                                                <img
                                                    src="/assets/youtube_active.svg"
                                                    alt="youtuve-active"
                                                    height={25}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="text-right">
                                        <Dropdown className="ml-5">
                                            <Dropdown.Toggle
                                                id="dropdown-basic"
                                                as="button"
                                                className="actionButtonDropDown"
                                            >
                                                <i className="fas fa-ellipsis-v"></i>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>Not Assignes</Dropdown.Item>
                                                <Dropdown.Item>Pending</Dropdown.Item>
                                                <Dropdown.Item>Scheduled</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row> */}

                        {/* Scheduler manager based on dates */}
                        <Row className="mt-5 mb-2">
                            {/* Today Button */}
                            <Col lg={2}>
                                {moment().isBefore(moment(channelEndDate)) ? (
                                    <Button
                                        variant="dark"
                                        onClick={() => {
                                            handleCurrentDate();
                                        }}
                                    >
                                        Today
                                    </Button>
                                ) : null}
                            </Col>
                            {/* Previous and Next button */}
                            <Col lg={8}>
                                <div className="text-center">
                                    <input
                                        min={moment(channelStartDate).format('YYYY-MM-DD')}
                                        max={moment(channelEndDate).format('YYYY-MM-DD')}
                                        className="p-1 rounded shadow-sm mb-3"
                                        type="date"
                                        style={{
                                            border: 'none',
                                            backgroundColor: 'rgba(211,211,211,0.8)',
                                            cursor: 'pointer'
                                        }}
                                        value={prevDate}
                                        onChange={(e) => handleDatePicked(e.target.value)}
                                    />{' '}
                                    <br />
                                    <span
                                        style={{
                                            display: `${handlePrevDisplay(prevDate)}`,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            handlePrevMonth(prevDate);
                                        }}
                                        className="rounded-circle"
                                    >
                                        <i className="fa fa-chevron-left mr-4"></i>
                                    </span>
                                    <span className="shadow-lg bg-dark text-white p-2 rounded-lg">
                                        <b>
                                            {moment(prevDate).startOf('month').format('MMMM, YYYY')}{' '}
                                            - {moment(nextDate).endOf('month').format('MMMM, YYYY')}
                                        </b>
                                    </span>
                                    <span
                                        style={{
                                            display: `${handleNextDisplay(nextDate)}`,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            handleNextMonth(nextDate);
                                        }}
                                    >
                                        <i className="fa fa-chevron-right ml-4"></i>
                                    </span>
                                </div>
                            </Col>

                            {/* Collapse view Button */}
                            <Col lg={2}>
                                <Form>
                                    <Form.Check
                                        type="switch"
                                        id="scheduler"
                                        label="Collapse"
                                        onChange={() => {
                                            setShowCollapseView(!showCollapseView);
                                        }}
                                    />
                                </Form>
                            </Col>
                        </Row>

                        {/* Collapse view */}
                        {showCollapseView ? (
                            <Row>
                                <Col lg={11} className="pl-0 pr-0">
                                    <CollapsibleScheduler
                                        type="date"
                                        days={calculateDays(prevDate, nextDate)}
                                        callback={handleCallback}
                                        restDays={tag?.sessions.filter(
                                            (ses) => ses.type === 'restday'
                                        )}
                                        programId={tagId}
                                        schedulerSessions={schedulerSessions}
                                        sessionIds={sessionIds}
                                        clientIds={clientIds}
                                        classType={'Group Class'}
                                        startDate={prevDate}
                                        duration={moment(nextDate).diff(moment(prevDate), 'days')}
                                        showRestDay={showRestDay}
                                    />
                                </Col>
                            </Row>
                        ) : null}

                        {/* Scheduler */}
                        {!showCollapseView ? (
                            <Row>
                                <Col lg={11} className="pl-0 pr-0">
                                    <div className="mt-3">
                                        <SchedulerPage
                                            ref={ref}
                                            type="date"
                                            callback={handleCallback}
                                            blockedSessions={blockedSessions}
                                            sessionIds={sessionIds}
                                            days={calculateDays(prevDate, nextDate)}
                                            restDays={tag?.sessions.filter(
                                                (ses) => ses.type === 'restday'
                                            )}
                                            schedulerSessions={schedulerSessions}
                                            clientIds={clientIds}
                                            classType={'Live Stream Channel'}
                                            programId={tagId ? tagId : null}
                                            startDate={prevDate}
                                            handleFloatingActionProgramCallback={
                                                handleFloatingActionProgramCallback
                                            }
                                            handleFloatingActionProgramCallback2={
                                                handleFloatingActionProgramCallback2
                                            }
                                            handleRefetch={handleRefetch}
                                            sessionFilter={sessionFilter}
                                            program={program}
                                            showRestDay={showRestDay}
                                            show24HourFormat={show24HourFormat}
                                        />
                                    </div>
                                </Col>
                                <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                            </Row>
                        ) : null}
                    </div>
                </Col>
                {/* Right sidebar */}
                <Col lg={collapse ? '1' : '2'} className="d-lg-block">
                    <SideNav
                        type="date"
                        handleScrollScheduler={handleScrollScheduler}
                        show24HourFormat={show24HourFormat}
                        setShow24HourFormat={setShow24HourFormat}
                        collapse={collapse}
                        setCollapse={setCollapse}
                        accordionExpanded={accordionExpanded}
                        onAccordionToggle={handleAccordionToggle}
                        clientIds={clientIds}
                        sessionIds={sessionIds}
                        startDate={tag?.fitnesspackage?.Start_date}
                        duration={calculateDuration(
                            tag?.fitnesspackage?.Start_date,
                            tag?.fitnesspackage?.End_date
                        )}
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

export default Scheduler;
