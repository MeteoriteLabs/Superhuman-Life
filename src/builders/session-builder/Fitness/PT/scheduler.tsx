import { useState, useEffect, useRef } from 'react';
import { GET_TAG_BY_ID } from '../../graphQL/queries';
import { UPDATE_USERPACKAGE_EFFECTIVEDATE } from '../../graphQL/mutation';
import { useQuery, useMutation } from '@apollo/client';
import {
    Row,
    Col,
    Dropdown,
    Button,
    Modal,
    InputGroup,
    FormControl,
    Card,
    Badge,
    Table,
    Accordion
} from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import '../fitness.css';
import '../Group/actionButton.css';
import Loader from '../../../../components/Loader/Loader';
import DisplayImage from '../../../../components/DisplayImage';
import '../../profilepicture.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { SideNav } from '../Event/import';

const Scheduler: React.FC = () => {
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    const [show, setShow] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userPackage, setUserPackage] = useState<any>([]);
    const [editDatesModal, setEditdatesModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [schedulerSessions, setSchedulerSessions] = useState([]);
    const [tag, setTag] = useState<any>();
    const [totalClasses, setTotalClasses] = useState<any>([]);
    const [key, setKey] = useState('');
    const [collapse, setCollapse] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [show24HourFormat, setShow24HourFormat] = useState(false);
    const [sessionIds, setSessionIds] = useState<string[]>([]);
    // const [clientIds, setClientIds] = useState<string[]>([]);
    // these are the sessions that will passed onto the scheduler
    const [program, setProgram] = useState('none');
    const [sessionFilter, setSessionFilter] = useState('none');
    const [showRestDay, setShowRestDay] = useState<boolean>(false);
    const ref = useRef<any>(null);

    const mainQuery = useQuery(GET_TAG_BY_ID, {
        variables: { id: tagId },
        onCompleted: (data) => loadTagData(data)
    });

    const handleScrollScheduler = () => {
        ref.current?.scrollIntoView({ behaviour: 'smooth', inline: 'nearest' });
        window.scrollBy(0, -200);
    };

    const handleAccordionToggle = () => {
        setAccordionExpanded(!accordionExpanded);
    };

    let programIndex;

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 1500);
    }, [show]);

    const handleCloseDatesModal = () => setEditdatesModal(false);
    // const handleShowDatesModal = () => setEditdatesModal(true);

    function calculateDuration(startDate: string, endDate: string) {
        const packageStartDate = moment(startDate);
        const packageEndDate = moment(endDate);
        return packageEndDate.diff(packageStartDate, 'days') + 1;
    }

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

    function handleShowRestDay() {
        setShowRestDay(!showRestDay);
        handleScrollScheduler();
    }

    const [updateDate] = useMutation(UPDATE_USERPACKAGE_EFFECTIVEDATE);

    function loadTagData(data: any) {
        setSchedulerSessions(data);
        const flattenData = flattenObj({ ...data });
        const ids = [...sessionIds];
        setSessionIds(ids);
        const total = [0, 0, 0, 0, 0];
        const values = [...flattenData.tags[0].sessions];
        for (let i = 0; i < values.length; i++) {
            if (values[i].tag === 'One-On-One' && values[i].mode === 'Online') {
                total[0] += 1;
            } else if (values[i].tag === 'One-On-One' && values[i].mode === 'Offline') {
                total[1] += 1;
            } else if (values[i].tag === 'Group Class' && values[i].mode === 'Online') {
                total[2] += 1;
            } else if (values[i].tag === 'Group Class' && values[i].mode === 'Offline') {
                total[3] += 1;
            } else if (values[i].tag === 'Classic') {
                total[4] += 1;
            }
        }
        setTotalClasses(total);
        setTag(flattenData.tags[0]);
    }

    if (userPackage.length) {
        programIndex = userPackage.findIndex(
            (item) => item.id === last[1] && item.clientId === last[2]
        );
    }

    function handleDateEdit() {
        updateDate({
            variables: {
                id: userPackage[programIndex].userPackageId,
                effectiveDate: moment(startDate).format('YYYY-MM-DD') + 'T00:00:00.000Z'
            }
        });

        handleCloseDatesModal();
    }

    function handleTimeFormatting(data: any, duration: number) {
        const digits = duration <= 30 ? 2 : 3;
        return (data === undefined ? 0 : data).toLocaleString('en-US', {
            minimumIntegerDigits: digits.toString(),
            useGrouping: false
        });
    }

    // function handleTotalClasses(data: any, duration: number) {
    //     let sum = 0;
    //     for (let i = 0; i < data.length; i++) {
    //         sum += data[i];
    //     }
    //     const formattedSum = handleTimeFormatting(sum, duration);
    //     return formattedSum;
    // }

    function calculateLastSession(sessions) {
        if (sessions.length === 0) {
            return 'N/A';
        }

        const moments = sessions.map((currentDate) => moment(currentDate.session_date));
        const maxDate = moment.max(moments);

        return maxDate.format('MMM Do,YYYY');
    }

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

                        {/* Cards for service details and movement sessions */}
                        <Row>
                            <Col lg={11}>
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
                                            {/* Package details card */}
                                            <Card style={{ width: '100%' }}>
                                                <Card.Body>
                                                    <Row>
                                                        <Col lg={10} sm={8}>
                                                            <Card.Title>
                                                                {tag &&
                                                                    tag.fitnesspackage?.packagename}
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
                                                                            // onClick={() => deleteUserAddress(currValue)}
                                                                        >
                                                                            Renew subscription
                                                                        </Dropdown.Item>

                                                                        <Dropdown.Item
                                                                            key={2}
                                                                            // onClick={() => updateAddress(currValue)}
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
                                                            <Col lg={9} sm={5}>
                                                                <Badge
                                                                    pill
                                                                    variant="dark"
                                                                    className="p-2"
                                                                >
                                                                    {tag.fitnesspackage?.level}
                                                                </Badge>

                                                                <br />
                                                                {tag &&
                                                                tag.fitnesspackage &&
                                                                tag.fitnesspackage
                                                                    .fitness_package_type.type ===
                                                                    'On-Demand PT' ? (
                                                                    <b>
                                                                        Date of session:{' '}
                                                                        {tag &&
                                                                        tag.client_packages &&
                                                                        tag.client_packages.length
                                                                            ? moment(
                                                                                  tag
                                                                                      .client_packages[0]
                                                                                      .effective_date
                                                                              ).format(
                                                                                  'DD MMMM, YY'
                                                                              )
                                                                            : null}{' '}
                                                                    </b>
                                                                ) : (
                                                                    <>
                                                                        <b>Start Date:</b>
                                                                        {tag &&
                                                                        tag.client_packages &&
                                                                        tag.client_packages.length
                                                                            ? moment(
                                                                                  tag
                                                                                      .client_packages[0]
                                                                                      .effective_date
                                                                              ).format(
                                                                                  'DD MMMM, YY'
                                                                              )
                                                                            : null}
                                                                        <br />
                                                                        <b>End Date: </b>
                                                                        {tag &&
                                                                        tag.client_packages &&
                                                                        tag.client_packages.length
                                                                            ? moment
                                                                                  .utc(
                                                                                      tag
                                                                                          .client_packages[0]
                                                                                          .effective_date
                                                                                  )
                                                                                  .add(
                                                                                      tag
                                                                                          .client_packages[0]
                                                                                          .effective_date
                                                                                          .package_duration,
                                                                                      'days'
                                                                                  )
                                                                                  .format(
                                                                                      'DD MMMM, YY'
                                                                                  )
                                                                            : null}
                                                                    </>
                                                                )}
                                                            </Col>
                                                            <Col>
                                                                <DisplayImage
                                                                    imageName={
                                                                        'Photo_ID' in
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
                                                                    imageCSS="rounded-circle profile_pic text-center img-fluid ml-4 "
                                                                />
                                                                <br />
                                                                <b>
                                                                    {tag.client_packages.length &&
                                                                    tag.client_packages[0]
                                                                        .users_permissions_user &&
                                                                    tag.client_packages[0]
                                                                        .users_permissions_user
                                                                        .First_Name
                                                                        ? tag.client_packages[0]
                                                                              .users_permissions_user
                                                                              .First_Name
                                                                        : null}{' '}
                                                                    {tag.client_packages.length &&
                                                                    tag.client_packages[0]
                                                                        .users_permissions_user &&
                                                                    tag.client_packages[0]
                                                                        .users_permissions_user
                                                                        .Last_Name
                                                                        ? tag.client_packages[0]
                                                                              .users_permissions_user
                                                                              .Last_Name
                                                                        : null}
                                                                </b>
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
                                                        Last planned session{' '}
                                                        {calculateLastSession(tag.sessions)}
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
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            ?.ptonline ? (
                                                                            <th>Plan Online</th>
                                                                        ) : null}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            ?.ptoffline ? (
                                                                            <th>Plan Offline</th>
                                                                        ) : null}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            .fitness_package_type
                                                                            .type ===
                                                                            'On-Demand PT' ? null : (
                                                                            <th>Plan Rest</th>
                                                                        )}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            ?.ptonline ? (
                                                                            <th>
                                                                                Completed Online
                                                                            </th>
                                                                        ) : null}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            ?.ptoffline ? (
                                                                            <th>
                                                                                Completed Offline
                                                                            </th>
                                                                        ) : null}
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
                                                                        <td></td>
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            .ptonline ? (
                                                                            <td>{`${handleTimeFormatting(
                                                                                totalClasses[0],
                                                                                tag.fitnesspackage
                                                                                    ?.duration
                                                                            )}/${
                                                                                tag.fitnesspackage
                                                                                    .ptonline
                                                                            }`}</td>
                                                                        ) : null}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            .ptoffline ? (
                                                                            <td>
                                                                                {
                                                                                    tag
                                                                                        .fitnesspackage
                                                                                        .ptoffline
                                                                                }
                                                                            </td>
                                                                        ) : null}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            .fitness_package_type
                                                                            .type ===
                                                                            'On-Demand PT' ? null : (
                                                                            <td>
                                                                                {
                                                                                    tag
                                                                                        .fitnesspackage
                                                                                        ?.restdays
                                                                                }
                                                                            </td>
                                                                        )}

                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            .ptonline ? (
                                                                            <td></td>
                                                                        ) : null}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage &&
                                                                        tag.fitnesspackage
                                                                            .ptoffline ? (
                                                                            <td></td>
                                                                        ) : null}
                                                                    </tr>
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
                                                    <small className="text-muted">
                                                        Note: Plan all the sessions in advance
                                                    </small>
                                                </Card.Body>
                                            </Card>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Col>
                        </Row>

                        {/* <Row>
                    <Col
                        lg={11}
                        className="p-4 shadow-lg bg-white"
                        style={{ borderRadius: '10px' }}
                    >
                        <Row>
                            <Col lg={7}>
                                <Row>
                                    <h3 className="text-capitalize">{tag?.tag_name}</h3>
                                </Row>
                                <Row>
                                    <span>{tag && tag.fitnesspackage?.packagename}</span>
                                    <div
                                        className="ml-3 mt-1"
                                        style={{ borderLeft: '1px solid black', height: '20px' }}
                                    ></div>
                                    <span className="ml-4">
                                        {tag.fitnesspackage?.duration + ' days'}
                                    </span>
                                    <div
                                        className="ml-3"
                                        style={{ borderLeft: '1px solid black', height: '20px' }}
                                    ></div>
                                    <span className="ml-4">
                                        {'Level: ' + tag.fitnesspackage?.level}
                                    </span>
                                </Row>
                                <Row>
                                    <Col lg={4} className="pl-0 pr-0">
                                        <Col
                                            className="ml-1 mt-3"
                                            style={{
                                                border: '2px solid gray',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <Row>
                                                <h5>
                                                    <b>Client</b>
                                                </h5>
                                            </Row>
                                            <Col lg={{ offset: 4 }}>
                                                <Row>
                                                    <div className="ml-2">
                                                        <img
                                                            src="https://picsum.photos/200/100"
                                                            alt="pic"
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                    </div>
                                                </Row>
                                                <Row className="mt-1">
                                                    <span className="text-capitalize">
                                                        <b style={{ color: 'gray' }}>
                                                            {tag &&
                                                            tag.client_packages &&
                                                            tag.client_packages.length
                                                                ? tag.client_packages[0]
                                                                      ?.users_permissions_user
                                                                      ?.username
                                                                : null}
                                                        </b>
                                                    </span>
                                                </Row>
                                            </Col>
                                        </Col>
                                    </Col>
                                    <Col lg={7} className="mt-4 ml-2">
                                        <div className="mb-4 mt-4">
                                            <Row>
                                                <Col lg={1}>
                                                    <span>Date:</span>
                                                </Col>
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 ml-2 scheduler-badge">
                                                        {tag &&
                                                        tag.client_packages &&
                                                        tag.client_packages.length
                                                            ? moment(
                                                                  tag.client_packages[0]
                                                                      .effective_date
                                                              ).format('DD MMMM, YY')
                                                            : null}
                                                    </span>
                                                </Col>
                                                to
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 scheduler-badge">
                                                        {tag &&
                                                        tag.client_packages &&
                                                        tag.client_packages.length
                                                            ? moment(
                                                                  tag.client_packages[0]
                                                                      .effective_date
                                                              )
                                                                  .add(
                                                                      tag.fitnesspackage?.duration -
                                                                          1,
                                                                      'days'
                                                                  )
                                                                  .format('DD MMMM, YY')
                                                            : null}
                                                    </span>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={4} xs={11} style={{ borderLeft: '2px dashed gray' }}>
                                <div
                                    className="m-2 ml-2 text-center p-2"
                                    style={{ border: '2px solid gray', borderRadius: '10px' }}
                                >
                                    <h4>
                                        <b>Movement</b>
                                    </h4>
                                    <Row>
                                        <Col>
                                            <Row style={{ justifyContent: 'space-around' }}>
                                                <div>
                                                    <img
                                                        src="/assets/custompersonal-training-Online.svg"
                                                        alt="PT-Online"
                                                    />
                                                    <br />
                                                    <span>{tag.fitnesspackage?.ptonline} PT</span>
                                                    <br />
                                                    <span>
                                                        <b>
                                                            {handleTimeFormatting(
                                                                totalClasses[0],
                                                                tag.fitnesspackage?.duration
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                                <div>
                                                    <img
                                                        src="/assets/custompersonal-training-Offline.svg"
                                                        alt="PT-Offline"
                                                    />
                                                    <br />
                                                    <span>{tag.fitnesspackage?.ptoffline} PT</span>
                                                    <br />
                                                    <span>
                                                        <b>
                                                            {handleTimeFormatting(
                                                                totalClasses[1],
                                                                tag.fitnesspackage?.duration
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                                {totalClasses[2] !== 0 && (
                                                    <div>
                                                        <img
                                                            src="/assets/customgroup-Online.svg"
                                                            alt="Group-Online"
                                                        />
                                                        <br />
                                                        <span>
                                                            {tag.fitnesspackage?.grouponline} Group
                                                        </span>
                                                        <br />
                                                        <span>
                                                            <b>
                                                                {handleTimeFormatting(
                                                                    totalClasses[2],
                                                                    tag?.fitnesspackage?.duration
                                                                )}
                                                            </b>
                                                        </span>
                                                    </div>
                                                )}
                                                {totalClasses[3] !== 0 && (
                                                    <div>
                                                        <img
                                                            src="/assets/customgroup-Offline.svg"
                                                            alt="GRoup-Offline"
                                                        />
                                                        <br />
                                                        <span>
                                                            {tag.fitnesspackage?.groupoffline} Group
                                                        </span>
                                                        <br />
                                                        <span>
                                                            <b>
                                                                {handleTimeFormatting(
                                                                    totalClasses[3],
                                                                    tag.fitnesspackage?.duration
                                                                )}
                                                            </b>
                                                        </span>
                                                    </div>
                                                )}
                                                {totalClasses[4] !== 0 && (
                                                    <div>
                                                        <img
                                                            src="/assets/customclassic.svg"
                                                            alt="Classic"
                                                        />
                                                        <br />
                                                        <span>
                                                            {tag.fitnesspackage?.recordedclasses}{' '}
                                                            Recorded
                                                        </span>
                                                        <br />
                                                        <span>
                                                            <b>
                                                                {handleTimeFormatting(
                                                                    totalClasses[4],
                                                                    tag.fitnesspackage?.duration
                                                                )}
                                                            </b>
                                                        </span>
                                                    </div>
                                                )}
                                            </Row>
                                            <Row></Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <span>
                                                <b style={{ color: 'gray' }}>Status: </b>{' '}
                                                {handleTotalClasses(
                                                    totalClasses,
                                                    tag.fitnesspackage?.duration
                                                )}
                                                /{tag.fitnesspackage?.duration}
                                            </span>
                                        </Col>
                                        <Col>
                                            <span>
                                                <b style={{ color: 'gray' }}>Rest-Days: </b>
                                                {tag.fitnesspackage?.restdays} days
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Dropdown className="ml-5">
                                <Dropdown.Toggle
                                    id="dropdown-basic"
                                    as="button"
                                    className="actionButtonDropDown"
                                >
                                    <i className="fas fa-ellipsis-v"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleShowDatesModal}>
                                        Edit Dates
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Row>
                    </Col>
                </Row> */}

                        <Row>
                            <Col lg={11} className="pl-0 pr-0">
                                <div className="mt-5">
                                    <SchedulerPage
                                        show24HourFormat={show24HourFormat} //boolean
                                        type="date"
                                        days={
                                            tag?.fitnesspackage?.fitness_package_type.type ===
                                            'On-Demand PT'
                                                ? 1
                                                : tag?.fitnesspackage?.duration
                                        }
                                        classType={
                                            tag?.fitnesspackage?.fitness_package_type.type ===
                                            'On-Demand PT'
                                                ? 'On-Demand PT'
                                                : 'One-On-One'
                                        }
                                        restDays={tag?.sessions.filter(
                                            (ses) => ses.type === 'restday'
                                        )}
                                        schedulerSessions={schedulerSessions}
                                        programId={tagId ? tagId : null}
                                        startDate={
                                            tag &&
                                            tag.client_packages &&
                                            tag.client_packages.length &&
                                            tag?.client_packages[0].effective_date
                                        }
                                        clientId={
                                            tag &&
                                            tag.client_packages &&
                                            tag.client_packages.length &&
                                            tag?.client_packages[0].users_permissions_user.id
                                        }
                                        sessionFilter={sessionFilter} //string
                                        program={program} //string
                                        ref={ref}
                                        showRestDay={showRestDay} //boolean
                                        handleFloatingActionProgramCallback={
                                            handleFloatingActionProgramCallback
                                        }
                                        handleFloatingActionProgramCallback2={
                                            handleFloatingActionProgramCallback2
                                        }
                                        handleRefetch={handleRefetch} //()=> void
                                        callback={handleCallback} //()=>void
                                        sessionIds={sessionIds}

                                        // clientIds={clientIds}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Modal show={editDatesModal} onHide={handleCloseDatesModal}>
                            <Modal.Body>
                                <label>Edit Start Date: </label>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        value={
                                            startDate === ''
                                                ? tag &&
                                                  tag.client_packages &&
                                                  tag.client_packages.length &&
                                                  moment(
                                                      tag?.client_packages[0].effective_date
                                                  ).format('YYYY-MM-DD')
                                                : startDate
                                        }
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                        }}
                                        type="date"
                                    />
                                </InputGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="outline-danger" onClick={handleCloseDatesModal}>
                                    Close
                                </Button>
                                <Button
                                    variant="outline-success"
                                    disabled={startDate === '' ? true : false}
                                    onClick={() => {
                                        handleDateEdit();
                                    }}
                                >
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </Col>
                {/* Right sidebar */}
                <Col lg={collapse ? '1' : '2'} className="d-lg-block">
                    <SideNav
                        handleScrollScheduler={handleScrollScheduler}
                        show24HourFormat={show24HourFormat}
                        setShow24HourFormat={setShow24HourFormat}
                        collapse={collapse}
                        setCollapse={setCollapse}
                        accordionExpanded={accordionExpanded}
                        onAccordionToggle={handleAccordionToggle}
                        clientIds={
                            tag &&
                            tag.client_packages &&
                            tag.client_packages.length &&
                            tag?.client_packages[0].users_permissions_user.id
                        }
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
