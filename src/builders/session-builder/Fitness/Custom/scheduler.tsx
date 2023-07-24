import { useState, useEffect } from 'react';
import { GET_TAG_BY_ID } from '../../graphQL/queries';
import { UPDATE_USERPACKAGE_EFFECTIVEDATE } from '../../graphQL/mutation';
import { useQuery, useMutation } from '@apollo/client';
import {
    Row,
    Col,
    Dropdown,
    Modal,
    InputGroup,
    FormControl,
    Button,
    Table,
    Card,
    Badge,
    Accordion
} from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import { Link } from 'react-router-dom';
import '../Group/actionButton.css';
import '../fitness.css';
import { flattenObj } from 'components/utils/responseFlatten';
import Loader from 'components/Loader/Loader';
import DisplayImage from 'components/DisplayImage';
import { SideNav } from '../Event/import';

const Scheduler = () => {
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    const [show, setShow] = useState(false);
    // eslint-disable-next-line
    const [userPackage, setUserPackage] = useState<any>([]);
    const [editDatesModal, setEditdatesModal] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>('');
    const [totalClasses, setTotalClasses] = useState<any>([]);
    const [tag, setTag] = useState<any>();
    const [key, setKey] = useState('');
    const [collapse, setCollapse] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [clientIds, setClientIds] = useState<any>([]);
    const [showRestDay, setShowRestDay] = useState<boolean>(false);
    const [program, setProgram] = useState('none');
    const [sessionFilter, setSessionFilter] = useState('none');
    const [sessionIds, setSessionIds] = useState<any>([]);
    const [show24HourFormat, setShow24HourFormat] = useState(false);

    const handleAccordionToggle = () => {
        setAccordionExpanded(!accordionExpanded);
    };

    let programIndex;

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 1500);
    }, [show]);

    const mainQuery = useQuery(GET_TAG_BY_ID, {
        variables: { id: tagId },
        onCompleted: (data) => loadTagData(data)
    });

    function loadTagData(data: any) {
        const flattenData = flattenObj({ ...data });
        const total = [0, 0, 0, 0, 0];
        const values = [...flattenData.tags[0].sessions];
        const clientValues = [...clientIds];
        for (let i = 0; i < values.length; i++) {
            if (values[i].tag === 'One-On-One' && values[i].mode === 'Online') {
                total[0] += 1;
            } else if (values[i].tag === 'One-On-One' && values[i].mode === 'Offline') {
                total[1] += 1;
            } else if (values[i].tag === 'Group Class' && values[i].mode === 'Online') {
                total[2] += 1;
                // eslint-disable-next-line
            } else if (values[i].tag === 'Group Class' && values[i].mode === 'Offline') {
                total[3] += 1;
            } else {
                total[4] += 1;
            }
        }
        setClientIds(clientValues);
        setTotalClasses(total);
        setTag(flattenData.tags[0]);
        const ids = [...sessionIds];

        setSessionIds(ids);
    }

    const handleCloseDatesModal = () => setEditdatesModal(false);
    const handleShowDatesModal = () => setEditdatesModal(true);

    const [updateDate] = useMutation(UPDATE_USERPACKAGE_EFFECTIVEDATE);

    if (userPackage.length) {
        programIndex = userPackage.findIndex(
            (item) => item.programId === last[0] && item.clientId === last[1]
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
        return data.toLocaleString('en-US', {
            minimumIntegerDigits: digits.toString(),
            useGrouping: false
        });
    }

    function handleCallback() {
        mainQuery.refetch();
    }

    function handleFloatingActionProgramCallback(event: any) {
        setProgram(`${event}`);
        handleCallback();
    }

    function handleFloatingActionProgramCallback2(event: any) {
        setSessionFilter(`${event}`);
        handleCallback();
    }

    function handleRefetch() {
        handleCallback();
    }

    function handleShowRestDay() {
        setShowRestDay(!showRestDay);
    }

    function calculateDuration(sd: any, ed: any) {
        const start = moment(sd);
        const end = moment(ed);
        return end.diff(start, 'days') + 1;
    }

    // function handleTotalClasses(data: any, duration: number) {
    //     let sum = 0;
    //     for (let i = 0; i < data.length; i++) {
    //         sum += data[i];
    //     }
    //     const formattedSum = handleTimeFormatting(sum, duration);
    //     return formattedSum;
    // }

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
                                                key === '1' || key === ''
                                                    ? setKey('0')
                                                    : setKey('');
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
                                                                            src="/assets/kebabcase.svg"
                                                                            alt="notification"
                                                                            className="img-responsive "
                                                                            style={{
                                                                                height: '20px',
                                                                                width: '20px'
                                                                            }}
                                                                        />
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item key={1}>
                                                                            Renew subscription
                                                                        </Dropdown.Item>

                                                                        <Dropdown.Item key={2}>
                                                                            Edit Program Name
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                    <Card.Text>
                                                        <Badge pill variant="dark" className="p-2">
                                                            {tag.fitnesspackage?.level}
                                                        </Badge>

                                                        <br />
                                                        <Row>
                                                            <Col lg={9} sm={5}>
                                                                <b>Start Date:</b>{' '}
                                                                {tag &&
                                                                tag.client_packages &&
                                                                tag.client_packages.length
                                                                    ? moment(
                                                                          tag.client_packages[0]
                                                                              .effective_date
                                                                      ).format('DD MMMM, YY')
                                                                    : null}
                                                                <br />
                                                                <b>End Date: </b>
                                                                {tag &&
                                                                tag.client_packages &&
                                                                tag.client_packages.length
                                                                    ? moment(
                                                                          tag.client_packages[0]
                                                                              .effective_date
                                                                      )
                                                                          .add(
                                                                              tag.fitnesspackage
                                                                                  ?.duration - 1,
                                                                              'days'
                                                                          )
                                                                          .format('DD MMMM, YY')
                                                                    : null}
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
                                                                    imageCSS="rounded-circle display_pic text-center img-fluid ml-4 "
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
                                                key === '' || key === '0'
                                                    ? setKey('1')
                                                    : setKey('');
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
                                            {/* Movement sessions */}
                                            <Card style={{ width: '100%' }} className="mt-3">
                                                <Card.Body>
                                                    <Card.Title>Movement Sessions</Card.Title>
                                                    <Card.Text>
                                                        Last planned session 25 may 2023
                                                    </Card.Text>
                                                    <Row>
                                                        <Col lg={8}>
                                                            <Table striped bordered hover size="sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Type</th>
                                                                        <th>Total Sessions</th>
                                                                        <th>Plan Online</th>
                                                                        <th>Plan Offline</th>
                                                                        <th>Plan Rest</th>
                                                                        <th>Completed Online</th>
                                                                        <th>Completed Offline</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>One-on-One</td>
                                                                        <td>
                                                                            {tag &&
                                                                            tag.fitnesspackage &&
                                                                            tag.fitnesspackage
                                                                                ? tag.fitnesspackage
                                                                                      .ptonline +
                                                                                  tag.fitnesspackage
                                                                                      .ptoffline
                                                                                : null}
                                                                        </td>
                                                                        <td>
                                                                            {handleTimeFormatting(
                                                                                totalClasses[0],
                                                                                tag.fitnesspackage
                                                                                    .duration
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {handleTimeFormatting(
                                                                                totalClasses[1],
                                                                                tag.fitnesspackage
                                                                                    .duration
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {tag &&
                                                                            tag.fitnesspackage &&
                                                                            tag.fitnesspackage
                                                                                ? tag.fitnesspackage
                                                                                      .restdays
                                                                                : null}
                                                                        </td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Group Class</td>
                                                                        <td>
                                                                            {tag &&
                                                                            tag.fitnesspackage &&
                                                                            tag.fitnesspackage
                                                                                ? tag.fitnesspackage
                                                                                      .grouponline +
                                                                                  tag.fitnesspackage
                                                                                      .groupoffline
                                                                                : null}
                                                                        </td>
                                                                        <td>
                                                                            {' '}
                                                                            {handleTimeFormatting(
                                                                                totalClasses[2],
                                                                                tag.fitnesspackage
                                                                                    .duration
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {handleTimeFormatting(
                                                                                totalClasses[3],
                                                                                tag.fitnesspackage
                                                                                    .duration
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {tag &&
                                                                            tag.fitnesspackage &&
                                                                            tag.fitnesspackage
                                                                                ? tag.fitnesspackage
                                                                                      .restdays
                                                                                : null}
                                                                        </td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Recorded Class</td>
                                                                        <td>
                                                                            {tag &&
                                                                            tag.fitnesspackage &&
                                                                            tag.fitnesspackage
                                                                                ? tag.fitnesspackage
                                                                                      ?.recordedclasses
                                                                                : null}
                                                                        </td>
                                                                        <td>
                                                                            {handleTimeFormatting(
                                                                                totalClasses[4],
                                                                                tag.fitnesspackage
                                                                                    .duration
                                                                            )}
                                                                        </td>
                                                                        <td>N/A</td>
                                                                        <td>
                                                                            {tag &&
                                                                            tag.fitnesspackage &&
                                                                            tag.fitnesspackage
                                                                                ? tag.fitnesspackage
                                                                                      .restdays
                                                                                : null}
                                                                        </td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
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
                                    <h3 className="text-capitalize">{tag.tag_name}</h3>
                                </Row>
                                <Row>
                                    <span>{tag.fitnesspackage.packagename}</span>
                                    <div
                                        className="ml-3 mt-1"
                                        style={{ borderLeft: '1px solid black', height: '20px' }}
                                    ></div>
                                    <span className="ml-4">
                                        {tag.fitnesspackage.duration + ' days'}
                                    </span>
                                    <div
                                        className="ml-3"
                                        style={{ borderLeft: '1px solid black', height: '20px' }}
                                    ></div>
                                    <span className="ml-4">
                                        {'Level: ' + tag.fitnesspackage.level}
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
                                                    <div className="ml-4">
                                                        <img
                                                            src="assets/image_placeholder.svg"
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
                                                                tag.client_packages.length &&
                                                                tag.client_packages[0]
                                                                    .users_permissions_user
                                                                    .username}
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
                                                            : 'N/A'}
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
                                                    <span>{tag.fitnesspackage.ptonline} PT</span>
                                                    <br />
                                                    <span>
                                                        <b>
                                                            {handleTimeFormatting(
                                                                totalClasses[0],
                                                                tag.fitnesspackage.duration
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
                                                    <span>
                                                        {tag && tag.fitnesspackage.ptoffline} PT
                                                    </span>
                                                    <br />
                                                    <span>
                                                        <b>
                                                            {handleTimeFormatting(
                                                                totalClasses[1],
                                                                tag.fitnesspackage.duration
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                                <div>
                                                    <img
                                                        src="/assets/customgroup-Online.svg"
                                                        alt="Group-Online"
                                                    />
                                                    <br />
                                                    <span>
                                                        {tag.fitnesspackage.grouponline} Group
                                                    </span>
                                                    <br />
                                                    <span>
                                                        <b>
                                                            {handleTimeFormatting(
                                                                totalClasses[2],
                                                                tag.fitnesspackage.duration
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                                <div>
                                                    <img
                                                        src="/assets/customgroup-Offline.svg"
                                                        alt="GRoup-Offline"
                                                    />
                                                    <br />
                                                    <span>
                                                        {tag.fitnesspackage.groupoffline} Group
                                                    </span>
                                                    <br />
                                                    <span>
                                                        <b>
                                                            {handleTimeFormatting(
                                                                totalClasses[3],
                                                                tag.fitnesspackage.duration
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                                <div>
                                                    <img
                                                        src="/assets/customclassic.svg"
                                                        alt="Classic"
                                                    />
                                                    <br />
                                                    <span>
                                                        {tag.fitnesspackage.recordedclasses}{' '}
                                                        Recorded
                                                    </span>
                                                    <br />
                                                    <span>
                                                        <b>
                                                            {handleTimeFormatting(
                                                                totalClasses[4],
                                                                tag.fitnesspackage.duration
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </Row>
                                            <Row></Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <span>
                                                <b style={{ color: 'gray' }}>Status:</b>{' '}
                                                {handleTotalClasses(
                                                    totalClasses,
                                                    tag.fitnesspackage.duration
                                                )}
                                                /{tag.fitnesspackage.duration} days
                                            </span>
                                        </Col>
                                        <Col>
                                            <span>
                                                <b style={{ color: 'gray' }}>Rest-Days:</b>{' '}
                                                {tag.fitnesspackage.restdays} days
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
                                        callback={() => mainQuery}
                                        type="date"
                                        days={tag?.fitnesspackage?.duration}
                                        restDays={[]}
                                        // totalClasses={5}
                                        // assignedClasses={5}
                                        sessionIds={sessionIds}
                                        programId={tagId ? tagId : null}
                                        classType={'Custom'}
                                        startDate={
                                            tag &&
                                            tag.client_packages &&
                                            tag.client_packages.length &&
                                            tag?.client_packages[0].effective_date
                                        }
                                        clientIds={
                                            tag &&
                                            tag.client_packages &&
                                            tag.client_packages.length &&
                                            tag.client_packages[0]?.users_permissions_user.id
                                        }
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
