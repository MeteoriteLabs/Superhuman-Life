import { useState, useEffect, useRef } from 'react';
import { GET_TAG_BY_ID } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import { Row, Col, Dropdown, Card, Badge, Table, Accordion } from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import FitnessAction from '../FitnessAction';
import { Link } from 'react-router-dom';
import { flattenObj } from 'components/utils/responseFlatten';
import '../Group/actionButton.css';
import Loader from 'components/Loader/Loader';
import DisplayImage from 'components/DisplayImage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../profilepicture.css';

const Scheduler: React.FC = () => {
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    const [show, setShow] = useState<boolean>(false);
    const [sessionIds, setSessionIds] = useState<any>([]);
    const [clientIds, setClientIds] = useState<any>([]);
    // these are the sessions that will passed onto the scheduler
    const [schedulerSessions, setSchedulerSessions] = useState<any>([]);
    const [tag, setTag] = useState<any>();

    const fitnessActionRef = useRef<any>(null);

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
        setSchedulerSessions(data);
        const flattenData = flattenObj({ ...data });
        const total = [0];
        const clientValues = [...clientIds];
        const values = [...flattenData.tags[0].sessions];
        const ids = sessionIds ? [...sessionIds] : [];
        for (let i = 0; i < values.length; i++) {
            ids.push(values[i].id);
            if (values[i].tag === 'Classic') {
                total[0] += 1;
            }
        }
        setClientIds(clientValues);
        setSessionIds(ids);
        setTag(flattenData.tags[0]);
    }

    function calculateLastSession(sessions) {
        if (sessions.length === 0) {
            return 'N/A';
        }

        const moments = sessions.map((d) => moment(d.session_date)),
            maxDate = moment.max(moments);

        return maxDate.format('MMM Do,YYYY');
    }

    function calculateDuration(sd: any, ed: any) {
        const start = moment(sd);
        const end = moment(ed);
        return end.diff(start, 'days') + 1;
    }

    function calculateDailySessions(sessions) {
        const dailySessions = sessions.filter(
            (ses: any) => ses.session_date === moment().format('YYYY-MM-DD')
        );
        return dailySessions.length ? dailySessions.length : 'N/A';
    }

    function handleCallback() {
        mainQuery.refetch();
    }

    if (!show) return <Loader msg="loading scheduler..." />;
    else
        return (
            <div className="col-lg-12">
                <div className="mb-3">
                    <span style={{ fontSize: '30px' }}>
                        <Link to="/session">
                            <i className="fa fa-arrow-circle-left" style={{ color: 'black' }}></i>
                        </Link>
                        <b> back</b>
                    </span>
                </div>
                <Row>
                    <Col lg={11}>
                        <Accordion>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    <b>{tag && tag.fitnesspackage?.packagename}</b>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card style={{ width: '100%' }}>
                                        <Card.Body>
                                            <Row>
                                                <Col lg={10} sm={8}>
                                                    <Card.Title>
                                                        <h4>
                                                            {tag && tag.fitnesspackage?.packagename}
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
                                                                    // onClick={() => updateAddress(currValue)}
                                                                >
                                                                    Edit Program Name
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    key={2}
                                                                    // onClick={() => updateAddress(currValue)}
                                                                >
                                                                    Reschedule
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    key={1}
                                                                    // onClick={() => deleteUserAddress(currValue)}
                                                                >
                                                                    Send notification to subscribers
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </Row>
                                                </Col>
                                            </Row>

                                            <Card.Text>
                                                <Row>
                                                    <Col lg={9} sm={5}>
                                                        <Badge pill variant="dark" className="p-2">
                                                            {tag &&
                                                            tag.fitnesspackage &&
                                                            tag.fitnesspackage.level
                                                                ? tag.fitnesspackage.level
                                                                : null}
                                                        </Badge>
                                                        <br />
                                                        <b>
                                                            Capacity:{' '}
                                                            {tag && tag.fitnesspackage
                                                                ? tag.fitnesspackage.classsize
                                                                : null}{' '}
                                                            people
                                                        </b>
                                                        <br />
                                                        <b>Start Date:</b>{' '}
                                                        {tag &&
                                                        tag.fitnesspackage &&
                                                        tag.fitnesspackage.Start_date
                                                            ? moment(
                                                                  tag.fitnesspackage.Start_date
                                                              ).format('DD MMMM, YYYY')
                                                            : null}
                                                        <br />
                                                        <b>End Date: </b>
                                                        {tag &&
                                                        tag.fitnesspackage &&
                                                        tag.fitnesspackage.End_date
                                                            ? moment(
                                                                  tag.fitnesspackage.End_date
                                                              ).format('DD MMMM, YYYY')
                                                            : null}
                                                    </Col>
                                                    <Col>
                                                        <DisplayImage
                                                            imageName={
                                                                'Photo_ID' in tag.client_packages &&
                                                                tag.client_packages.length &&
                                                                tag.client_packages[0]
                                                                    .users_permissions_user &&
                                                                tag.client_packages[0]
                                                                    .users_permissions_user.Photo_ID
                                                                    ? tag.client_packages[0]
                                                                          .users_permissions_user
                                                                          .Photo_ID
                                                                    : null
                                                            }
                                                            defaultImageUrl="assets/image_placeholder.svg"
                                                            imageCSS="rounded-circle profile_pic text-center img-fluid ml-3 "
                                                        />
                                                        <br />
                                                        <Badge
                                                            pill
                                                            variant="dark"
                                                            className="py-2 px-4 ml-1 mt-2"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => {
                                                                fitnessActionRef.current.TriggerForm(
                                                                    {
                                                                        id: last[0],
                                                                        actionType: 'allClients',
                                                                        type: 'Classic Class'
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            View all
                                                        </Badge>
                                                        <p className="ml-3">
                                                            {tag.client_packages.length} people
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1">
                                    <b>Movement</b>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
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
                                                                <th>Completed</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                            <tr>
                                                                <td>Cohort</td>
                                                                <td>
                                                                    {moment(
                                                                        tag.fitnesspackage.End_date
                                                                    ).diff(
                                                                        moment(
                                                                            tag.fitnesspackage
                                                                                .Start_date
                                                                        ),
                                                                        'days'
                                                                    ) + 1}
                                                                </td>
                                                                <td></td>
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
                                                        minDate={moment().startOf('month').toDate()}
                                                        maxDate={moment().add(2, 'months').toDate()}
                                                        maxDetail="month"
                                                        minDetail="month"
                                                        next2Label={null}
                                                        prev2Label={null}
                                                    />
                                                </Col>
                                            </Row>
                                            <p>
                                                Note: Create all the sessions to start accepting
                                                bookings
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>

                    {/* <Card style={{ width: '90%' }}>
                <Card.Body>
                        <Row>
                            <Col lg={10} sm={8}>
                                <Card.Title><h4>{tag && tag.fitnesspackage?.packagename}</h4></Card.Title>
                            </Col>
                            <Col>
                                <Row className="justify-content-end">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="bg-light" id="dropdown-basic">
                                            <img
                                                src="/assets/cardsKebab.svg"
                                                alt="edit"
                                                className="img-responsive "
                                                style={{ height: '20px', width: '20px' }}
                                            />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                key={2}
                                                // onClick={() => updateAddress(currValue)}
                                            >
                                                Edit Program Name
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                key={2}
                                                // onClick={() => updateAddress(currValue)}
                                            >
                                                Reschedule
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                key={1}
                                                // onClick={() => deleteUserAddress(currValue)}
                                            >
                                                Send notification to subscribers
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Row>
                            </Col>
                        </Row>

                        <Card.Text>
                            <Row className="mt-2">
                                <Col lg={9} sm={5}>
                                    <Badge pill variant="dark" className="p-2">
                                        {tag && tag.fitnesspackage && tag.fitnesspackage.level ? tag.fitnesspackage.level : null }
                                    </Badge>

                                    <br />
                                    <b>Capacity: {tag && tag.fitnesspackage ? tag.fitnesspackage.classsize : null} people</b>
                                            <br/>
                                
                                    <b>Start Date:</b>{' '}
                                    
                                    {tag && tag.fitnesspackage && tag.fitnesspackage.Start_date ? moment(tag.fitnesspackage.Start_date).format(
                                                'DD MMMM, YYYY'
                                            ) : null}
                                    <br />
                                    <b>End Date: </b>
                                    {tag && tag.fitnesspackage && tag.fitnesspackage.End_date ? moment(tag.fitnesspackage.End_date).format(
                                                'DD MMMM, YYYY'
                                            ) : null}
                                </Col>
                                <Col>
                                    <DisplayImage
                                        imageName={
                                            'Photo_ID' in tag.client_packages &&
                                            tag.client_packages.length &&
                                            tag.client_packages[0].users_permissions_user &&
                                            tag.client_packages[0].users_permissions_user.Photo_ID
                                                ? tag.client_packages[0].users_permissions_user
                                                      .Photo_ID
                                                : null
                                        }
                                        defaultImageUrl="assets/image_placeholder.svg"
                                        imageCSS="rounded-circle profile_pic text-center img-fluid ml-3 "
                                    />
                                    <br />
                                    <Badge
                                        pill
                                        variant="dark"
                                        className="py-2 px-4 ml-1 mt-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            fitnessActionRef.current.TriggerForm({
                                                id: last[0],
                                                actionType: 'allClients',
                                                type: 'Classic Class'
                                            });
                                        }}
                                    >
                                        View all
                                    </Badge>
                                    <p className="ml-3">{tag.client_packages.length} people</p>
                                </Col>
                            </Row>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '90%' }} className="mt-3">
                    <Card.Body>
                        <Card.Title><h4>Movement Sessions</h4></Card.Title>
                        <Card.Text>
                            Last planned session {calculateLastSession(tag.sessions)}
                        </Card.Text>
                        <Row>
                            <Col lg={8}>
                                <Table striped bordered hover size="sm" responsive>
                                    <thead className='text-center'>
                                        <tr>
                                            <th>Type</th>
                                            <th>Total</th>
                                            <th>Completed</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        <tr>
                                            <td>Cohort</td>
                                            <td>{(moment(tag.fitnesspackage.End_date).diff(moment(tag.fitnesspackage.Start_date), 'days')) + 1
                                            }</td>
                                            <td>
                                               
                                            </td>
                                            
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
                                    minDate={moment().startOf('month').toDate()}
                                    maxDate={moment().add(2, 'months').toDate()}
                                    maxDetail="month"
                                    minDetail="month"
                                    next2Label={null}
                                    prev2Label={null}
                                />
                            </Col>
                        </Row>
                        <p>Note: Create all the sessions to start accepting bookings</p>
                    </Card.Body>
                </Card>  */}
                    {/* <Col
                        lg={11}
                        className="p-4 shadow-lg bg-white"
                        style={{ borderRadius: '10px' }}
                    >
                        <Row>
                            <Col style={{ borderRight: '2px dotted grey ' }}>
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
                                        <span>
                                            {moment(tag.fitnesspackage.Start_date).format(
                                                'DD MMMM, YYYY'
                                            )}
                                        </span>
                                        &nbsp;to&nbsp;
                                        <span>
                                            {moment(tag.fitnesspackage.End_date).format(
                                                'DD MMMM, YYYY'
                                            )}
                                        </span>
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
                                                {tag.client_packages.length ? (
                                                    tag.client_packages
                                                        .slice(0, 4)
                                                        .map((item, index: number) => {
                                                            const postionLeft = 8;
                                                            return (
                                                                <img
                                                                    key={index}
                                                                    src="assets/image_placeholder.svg"
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
                                                ) : (
                                                    <span>N/A</span>
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
                                                        type: 'Cohort'
                                                    });
                                                }}
                                            >
                                                View all
                                            </button>
                                        </Row>
                                    </Col>
                                </Row>
                                <div>
                                    <b>Status:</b>{' '}
                                    {tag.fitnesspackage.Status ? (
                                        <span className="text-success">Active</span>
                                    ) : (
                                        <span className="text-danger">Inactive</span>
                                    )}
                                </div>
                                <br />
                                <div>
                                    <b>Level:</b> {tag.fitnesspackage.level}
                                </div>
                                <br />
                                <div>
                                    <b>Type:</b> {tag.fitnesspackage.residential_type}
                                </div>
                            </Col>
                            <Col>
                                <Row>
                                    <Col lg={8}>
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
                                            <b>Program Status:</b> {tag.fitnesspackage.level}
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
                    </Col>*/}
                </Row>
                {/* Scheduler */}
                <Row>
                    <Col lg={11} className="pl-0 pr-0">
                        <div className="mt-5">
                            <SchedulerPage
                                type="date"
                                callback={handleCallback}
                                sessionIds={sessionIds}
                                days={calculateDuration(
                                    tag?.fitnesspackage?.Start_date,
                                    tag?.fitnesspackage?.End_date
                                )}
                                restDays={tag?.sessions.filter((ses) => ses.type === 'restday')}
                                schedulerSessions={schedulerSessions}
                                clientIds={clientIds}
                                classType={'Cohort'}
                                programId={tagId}
                                startDate={tag?.fitnesspackage?.Start_date}
                            />
                        </div>
                    </Col>
                    <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                </Row>
            </div>
        );
};

export default Scheduler;
