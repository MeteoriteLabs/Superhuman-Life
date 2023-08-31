import {
    useRef,
    useState,
    useQuery,
    GET_TAG_BY_ID,
    Row,
    Col,
    DisplayImage,
    Dropdown,
    Table,
    Card,
    Badge,
    Accordion,
    SchedulerPage,
    moment,
    FitnessAction,
    Link,
    flattenObj,
    SideNav,
    useContext,
    GET_TAGS,
    useLazyQuery,
    useEffect
} from './import';
import 'react-calendar/dist/Calendar.css';
import '../../profilepicture.css';
import '../Group/actionButton.css';
import EditProgramName from '../../EditProgramName/index';
import Reschedule from './Reschedule';
import AuthContext from 'context/auth-context';

const Scheduler = (): JSX.Element => {
    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    // const [show, setShow] = useState<boolean>(false);
    const [sessionIds, setSessionIds] = useState<string[]>([]);
    const [clientIds, setClientIds] = useState<string[]>([]);
    // these are the sessions that will passed onto the scheduler
    const [schedulerSessions, setSchedulerSessions] = useState<any>([]);
    const [program, setProgram] = useState('none');
    const [sessionFilter, setSessionFilter] = useState('none');
    const [showRestDay, setShowRestDay] = useState<boolean>(false);
    const [tag, setTag] = useState<any>();
    const [key, setKey] = useState('');
    const [collapse, setCollapse] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [show24HourFormat, setShow24HourFormat] = useState(false);
    const ref = useRef<any>(null);
    const [showProgramNameModal, setShowProgramNameModal] = useState<boolean>(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
    const [isReschedule, setIsReschedule] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(10);
    const [eventDate, setEventDate] = useState<any>();
    const [blockedSessions, setBlockedSessions] = useState<any>();

    const handleScrollScheduler = () => {
        ref.current?.scrollIntoView({ behaviour: 'smooth', inline: 'nearest' });
        window.scrollBy(0, -200);
    };

    const handleAccordionToggle = () => {
        setAccordionExpanded(!accordionExpanded);
    };

    const fitnessActionRef = useRef<any>(null);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setShow(true);
    //     }, 1500);
    // }, [show]);

    const mainQuery = useQuery(GET_TAG_BY_ID, {
        variables: { id: tagId },
        onCompleted: (data) => loadTagData(data)
    });

    const [tags, { data: get_tags }] = useLazyQuery(GET_TAGS, {
        variables: { tagId: tagId, userId: auth.userid, count: total },
        onCompleted: (data) => {
            setTotal(data.tags.meta.pagination.total);
            const flattenData = flattenObj({ ...data });
            
            const sessions = flattenData.tags && flattenData.tags.length && flattenData.tags.map((currentTag) =>
                currentTag.sessions).flat().filter(
                    (currentSession) => {
                        return currentSession.session_date === moment(eventDate).format("YYYY-MM-DD")
                    }
                );

            setBlockedSessions(sessions);
        }
    });

    useEffect(() => {
        tags();
    }, [total]);

    function loadTagData(data: any) {
        setSchedulerSessions(data);
        const flattenData = flattenObj({ ...data });

        const total = [0];
        const clientValues = [...clientIds];
        const values = [...flattenData.tags[0]?.sessions];

        // const ids = [...sessionIds];
        const ids = sessionIds ? [...sessionIds] : [];
        for (let i = 0; i < values.length; i++) {
            ids.push(values[i].id);
            if (values[i].tag === 'Classic') {
                total[0] += 1;
            }
        }

        setEventDate(flattenData.tags[0].fitnesspackage.Start_date);
        setClientIds(clientValues);
        setSessionIds(ids);
        setTag(flattenData.tags[0]);

        setIsReschedule(
            flattenData && flattenData.tags && flattenData.tags.length
                ? moment(flattenData.tags[0].fitnesspackage.Start_date)
                      .subtract(1, 'day')
                      .diff(moment.utc()) > 0
                : false
        );
    }

    function calculateLastSession(sessions) {
        if (sessions.length === 0) {
            return 'N/A';
        }

        const moments = sessions.map((d) => moment(d.session_date)),
            maxDate = moment.max(moments);

        return maxDate.format('MMM Do,YYYY');
    }

    function calculateDuration(startDate: string, endDate: string) {
        const packageStartDate = moment(startDate);
        const packageEndDate = moment(endDate);
        return packageEndDate.diff(packageStartDate, 'days') + 1;
    }

    // function calculateDailySessions(sessions) {
    //     const dailySessions = sessions.filter(
    //         (ses: any) => ses.session_date === moment().format('YYYY-MM-DD')
    //     );
    //     return dailySessions.length ? dailySessions.length : 'N/A';
    // }

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

                    {showRescheduleModal && (
                        <Reschedule
                            show={showRescheduleModal}
                            onHide={() => setShowRescheduleModal(false)}
                            id={tagId}
                        />
                    )}

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
                                                                    tag.fitnesspackage?.packagename}
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
                                                                    {!isReschedule ? null : (
                                                                        <Dropdown.Item
                                                                            key={2}
                                                                            onClick={() =>
                                                                                setShowRescheduleModal(
                                                                                    true
                                                                                )
                                                                            }
                                                                        >
                                                                            Reschedule
                                                                        </Dropdown.Item>
                                                                    )}
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </Row>
                                                    </Col>
                                                </Row>

                                                <Card.Text>
                                                    <Row className="mt-2">
                                                        <Col lg={9} sm={5}>
                                                            <Badge
                                                                pill
                                                                variant="dark"
                                                                className="p-2"
                                                            >
                                                                {tag && tag.fitnesspackage
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
                                                            <b>Event Date:</b>{' '}
                                                            {tag && tag.fitnesspackage
                                                                ? moment
                                                                      .utc(
                                                                          tag.fitnesspackage
                                                                              .Start_date
                                                                      )
                                                                      .format('DD MMMM, YYYY')
                                                                : null}
                                                            <br />
                                                        </Col>
                                                        <Col>
                                                            <DisplayImage
                                                                imageName={
                                                                    tag &&
                                                                    tag.client_packages &&
                                                                    tag.client_packages.length &&
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
                                                                            actionType:
                                                                                'allClients',
                                                                            type: 'Classic Class'
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
                                                                    <th>Total sessions </th>
                                                                    <th>Total no. of days</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-center">
                                                                <tr>
                                                                    <td>Event</td>
                                                                    <td>
                                                                        {tag && tag.sessions
                                                                            ? tag.sessions.length
                                                                            : 0}
                                                                    </td>
                                                                    <td>1</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
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
                    </Row>

                    {/* Scheduler */}
                    <Row>
                        <Col lg={11} className="pl-0 pr-0">
                            <div className="mt-5">
                                <SchedulerPage
                                    show24HourFormat={show24HourFormat} //boolean
                                    type="date" //string
                                    callback={handleCallback} //()=>void
                                    sessionIds={sessionIds}
                                    days={calculateDuration(
                                        tag?.fitnesspackage?.Start_date,
                                        tag?.fitnesspackage?.End_date
                                    )} //number
                                    restDays={tag?.sessions.filter((ses) => ses.type === 'restday')}
                                    schedulerSessions={schedulerSessions}
                                    clientIds={clientIds}
                                    classType={'Event'} //string
                                    programId={tagId ? tagId : null} //string
                                    startDate={tag?.fitnesspackage?.Start_date} //string
                                    showRestDay={showRestDay} //boolean
                                    handleFloatingActionProgramCallback={
                                        handleFloatingActionProgramCallback
                                    }
                                    handleFloatingActionProgramCallback2={
                                        handleFloatingActionProgramCallback2
                                    }
                                    handleRefetch={handleRefetch} //()=> void
                                    sessionFilter={sessionFilter} //string
                                    program={program} //string
                                    ref={ref}
                                    blockedSessions={blockedSessions}
                                />
                            </div>
                        </Col>
                        <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                    </Row>
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
