import { useState, useEffect, useRef, useContext, forwardRef } from 'react';
import {
    GET_TABLEDATA,
    GET_ALL_FITNESS_PACKAGE_BY_TYPE,
    GET_ALL_CLIENT_PACKAGE,
    GET_TAG_BY_ID, GET_TAGS
} from '../../graphQL/queries';
import { UPDATE_STARTDATE } from '../../graphQL/mutation';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
    Row,
    Col,
    Button,
    Dropdown,
    Modal,
    InputGroup,
    FormControl,
    Table,
    Card,
    Badge,
    Accordion,
    Form
} from 'react-bootstrap';
import SchedulerPage from 'builders/program-builder/program-template/scheduler';
import moment from 'moment';
import '../fitness.css';
import FitnessAction from '../FitnessAction';
import AuthContext from 'context/auth-context';
import { Link } from 'react-router-dom';
import TimePicker from 'rc-time-picker';
import { flattenObj } from 'components/utils/responseFlatten';
import 'rc-time-picker/assets/index.css';
import './actionButton.css';
import Loader from 'components/Loader/Loader';
import DisplayImage from 'components/DisplayImage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../profilepicture.css';
import SideNav from 'builders/program-builder/program-template/SchedulerSideBar';
import CollapsibleScheduler from 'builders/program-builder/program-template/CollapsibleScheduler';
import EditProgramName from '../../EditProgramName';
import ExtendProgram from '../../ExtendProgram';

const Scheduler = () => {
    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [userPackage, setUserPackage] = useState<any>([]);
    const [editDatesModal, setEditdatesModal] = useState(false);
    const [editTimeModal, setEditTimeModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [totalClasses, setTotalClasses] = useState<any>([]);
    const [sessionIds, setSessionIds] = useState<any>([]);
    const [clientIds, setClientIds] = useState<any>([]);
    // these are the sessions that will passed onto the scheduler
    const [schedulerSessions, setSchedulerSessions] = useState<any>([]);
    // the group end and start date are actual dates
    const [groupStartDate, setGroupStartDate] = useState('');
    const [groupEndDate, setGroupEndDate] = useState('');
    // this is used for monthly toggle
    const [prevDate, setPrevDate] = useState('');
    const [nextDate, setNextDate] = useState('');
    const [tagSeperation, setTagSeperation] = useState<any>([]);
    const [statusDays, setStatusDays] = useState();
    const [tag, setTag] = useState<any>();
    const [key, setKey] = useState('');
    const [collapse, setCollapse] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [showRestDay, setShowRestDay] = useState<boolean>(false);
    const [showCollapseView, setShowCollapseView] = useState<boolean>(false);
    const [program, setProgram] = useState('none');
    const [sessionFilter, setSessionFilter] = useState('none');
    const [show24HourFormat, setShow24HourFormat] = useState(false);
    const [showBlockedSlots, setShowBlockedSlots] = useState(true);
    const ref = useRef<any>(null);
    const [showProgramNameModal, setShowProgramNameModal] = useState<boolean>(false);
    const [showExtendProgramModal, setShowExtendProgramModal] = useState<boolean>(false);
    const [blockedSessions, setBlockedSessions] = useState<any>();
    const [total, setTotal] = useState<number>(10);

    const handleScrollScheduler = () => {
        ref.current?.scrollIntoView({ behaviour: 'smooth', inline: 'nearest' });
        window.scrollBy(0, -200);
    };

    const handleAccordionToggle = () => {
        setAccordionExpanded(!accordionExpanded);
    };

    let programIndex;

    const fitnessActionRef = useRef<any>(null);

    const handleCloseDatesModal = () => setEditdatesModal(false);
    const handleShowDatesModal = () => setEditdatesModal(true);

    const handleCloseTimeModal = () => setEditTimeModal(false);
    const handleShowTimeModal = () => setEditTimeModal(true);

    const [updateDate] = useMutation(UPDATE_STARTDATE);

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
        const total = [0, 0];
        const clientValues = [...clientIds];
        const values = [...flattenData.tags[0].sessions];
        const ids = [...sessionIds];
        for (let i = 0; i < flattenData.tags[0].client_packages.length; i++) {
            clientValues.push(flattenData.tags[0].client_packages[i].users_permissions_user.id);
        }
        for (let i = 0; i < values.length; i++) {
            ids.push(values[i].id);
            // eslint-disable-next-line
            if (values[i].mode === 'Online') {
                total[0] += 1;
            } else if (values[i].mode === 'Offline') {
                total[1] += 1;
            }
        }
        setGroupStartDate(
            moment(flattenData.tags[0].fitnesspackage.Start_date).format('YYYY-MM-DD')
        );
        setGroupEndDate(moment(flattenData.tags[0].fitnesspackage.End_date).format('YYYY-MM-DD'));
        handleRangeDates(
            flattenData.tags[0].fitnesspackage.Start_date,
            flattenData.tags[0].fitnesspackage.End_date
        );
        setClientIds(clientValues);
        setSessionIds(ids);
        setTotalClasses(total);
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
                        return currentSession.session_date >= groupStartDate && currentSession.session_date <= groupEndDate
                    }
                );

            setBlockedSessions(sessions);
        }
    });

    useEffect(() => {
        tags();
    }, [total]);

    const { data: data4 } = useQuery(GET_TABLEDATA, {
        variables: {
            id: last[0]
        }
    });

    const { data: data1 } = useQuery(GET_ALL_FITNESS_PACKAGE_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Group Class'
        }
    });

    const { data: data3 } = useQuery(GET_ALL_CLIENT_PACKAGE, {
        variables: {
            id: auth.userid,
            type: 'Group Class'
        }
    });

    function handleEventsSeperation(data: any, rest_days: any) {
        let grouponline = 0;
        let groupoffline = 0;
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].tag === 'Group Class') {
                    if (data[i].mode === 'Online') {
                        grouponline++;
                    } else {
                        groupoffline++;
                    }
                }
            }
            setTagSeperation([grouponline, groupoffline]);
            const arr: any = [];
            for (let j = 0; j < data.length; j++) {
                if (arr.includes(parseInt(data[j].day)) === false) arr.push(parseInt(data[j].day));
            }
            const restDays = rest_days === null ? 0 : rest_days.length;
            setStatusDays(arr.length + restDays);
        }
    }

    const loadData = () => {
        const flattenData1 = flattenObj({ ...data1 });
        // const flattenData2 = flattenObj({...data2});
        const flattenData3 = flattenObj({ ...data3 });
        const flattenData4 = flattenObj({ ...data4 });

        setData(
            [...flattenData4.fitnessprograms].map((detail) => {
                return {
                    id: detail.id,
                    programName: detail.title,
                    discipline: detail.fitnessdisciplines
                        .map((val: any) => {
                            return val.disciplinename;
                        })
                        .join(', '),
                    level: detail.level,
                    sdate: detail.start_dt,
                    events: handleEventsSeperation(detail.events, detail.rest_days),
                    edate: detail.end_dt,
                    duration: detail.duration_days,
                    details: detail.description,
                    restDays: detail.rest_days
                };
            })
        );
        const arrayFitnessPackage: any[] = [];
        const arrayData: any[] = [];

        const arrayA = arrayData.map((item) => item.id);

        const filterPackage = flattenData1?.fitnesspackages.filter(
            (item: { id: string }) => !arrayA.includes(item.id)
        );
        filterPackage.forEach((item) => {
            arrayData.push(item);
        });

        for (let i = 0; i < arrayData.length; i++) {
            for (let j = 0; j < flattenData3.clientPackages.length; j++) {
                if (flattenData3.clientPackages[j].program_managers.length > 0) {
                    if (
                        arrayData[i].proManagerFitnessId ===
                        flattenData3.clientPackages[j].program_managers[0].fitnessprograms[0].id
                    ) {
                        arrayFitnessPackage.push({
                            ...arrayData[i],
                            ...flattenData3.clientPackages[j].users_permissions_user
                        });
                    } else {
                        arrayFitnessPackage.push(arrayData[i]);
                        break;
                    }
                }
            }
        }

        setUserPackage([
            ...arrayFitnessPackage.map((packageItem) => {
                return {
                    id: packageItem.id,
                    packageName: packageItem.packagename,
                    duration: packageItem.duration,
                    details: [
                        packageItem.ptonline,
                        packageItem.ptoffline,
                        packageItem.grouponline,
                        packageItem.groupoffline,
                        packageItem.recordedclasses,
                        packageItem.restdays
                    ],
                    groupStart: packageItem.groupstarttime,
                    groupEnd: packageItem.groupendtime,
                    expiry: moment(packageItem.expiry_date).format('MMMM DD,YYYY'),
                    packageStatus: packageItem.Status ? 'Active' : 'Inactive',

                    proManagerId: packageItem.proManagerId,
                    proManagerFitnessId: packageItem.proManagerFitnessId,
                    client: packageItem.username ? [packageItem.username] : 'N/A',
                    time: packageItem.published_at
                        ? moment(packageItem.published_at).format('h:mm:ss a')
                        : 'N/A',
                    programName: packageItem.title ? packageItem.title : 'N/A',
                    programStatus: packageItem.username ? 'Assigned' : 'N/A',
                    renewal: packageItem.title ? '25/08/2021' : 'N/A'
                };
            })
        ]);
    };

    const arr: any = [];
    for (let i = 0; i < userPackage.length - 1; i++) {
        if (userPackage[i].id === userPackage[i + 1].id) {
            if (userPackage[i].proManagerFitnessId === userPackage[i + 1].proManagerFitnessId) {
                if (typeof userPackage[i].client === 'string') {
                    arr[0] = userPackage[i].client;
                }
                arr.push(userPackage[i + 1].client);
                userPackage[i + 1].client = arr;
                userPackage.splice(i, 1);
                i--;
            }
        }
    }

    if (userPackage.length) {
        programIndex = userPackage.findIndex(
            (item) => item.proManagerId === last[1] && item.proManagerFitnessId === last[0]
        );
    }

    function handleDateEdit() {
        const edate = moment(startDate).add(
            moment(data[0].edate).diff(data[0].sdate, 'days'),
            'days'
        );

        updateDate({
            variables: {
                id: last[0],
                startDate: moment(startDate).format('YYYY-MM-DD'),
                endDate: moment(edate).format('YYYY-MM-DD')
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

    // function handleTotalClasses(data: any, duration: number) {
    //     let sum = 0;
    //     for (let i = 0; i < data.length; i++) {
    //         sum += data[i];
    //     }
    //     const formattedSum = handleTimeFormatting(sum, duration);
    //     return formattedSum;
    // }

    function handleCallback() {
        // setSessionIds([]);
        mainQuery.refetch();
    }

    // function handleDatePicked(date: string) {
    //     // setGroupStartDate(moment(date).startOf('month').format('YYYY-MM-DD'));
    // }

    function handlePrevMonth(date: string) {
        // setGroupStartDate(moment(date).subtract(1, 'month').format('YYYY-MM-DD'));
        setNextDate(moment(date).format('YYYY-MM-DD'));

        if (moment(date).subtract(30, 'days').isSameOrAfter(moment(groupStartDate))) {
            setPrevDate(moment(date).subtract(30, 'days').format('YYYY-MM-DD'));
        } else {
            setPrevDate(moment(groupStartDate).format('YYYY-MM-DD'));
        }
    }

    function handleNextMonth(date: string) {
        // setGroupStartDate(moment(date).add(1, 'month').format('YYYY-MM-DD'));
        setPrevDate(moment(date).format('YYYY-MM-DD'));

        if (moment(date).add(30, 'days').isBefore(moment(groupEndDate))) {
            setNextDate(moment(date).add(30, 'days').format('YYYY-MM-DD'));
        } else {
            setNextDate(moment(groupEndDate).format('YYYY-MM-DD'));
        }
    }

    function handleCurrentDate() {
        // setGroupStartDate(moment(date).add(1, 'month').format('YYYY-MM-DD'));
        setPrevDate(moment().format('YYYY-MM-DD'));

        if (moment().add(30, 'days').isBefore(moment(groupEndDate))) {
            setNextDate(moment().add(30, 'days').format('YYYY-MM-DD'));
        } else {
            setNextDate(moment(groupEndDate).format('YYYY-MM-DD'));
        }
    }

    // this is to handle the left chevron, if we have to display it or no.
    function handlePrevDisplay(date: string) {
        return moment(date).isSame(moment(groupStartDate)) ? 'none' : '';
    }

    // this is to handle the right chevron, if we have to display it or no.
    function handleNextDisplay(date: string) {
        return moment(date).isSame(moment(groupEndDate)) ? 'none' : '';
    }

    // this is to calculate the number of days for the scheduler
    function calculateDays(sd: string, ed: string) {
        const days = moment(ed).diff(moment(sd), 'days');
        return days + 1;
    }

    function calculateDuration(sd: any, ed: any) {
        const start = moment(sd);
        const end = moment(ed);
        return end.diff(start, 'days') + 1;
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

    function calculateLastSession(sessions) {
        if (sessions.length === 0) {
            return 'N/A';
        }

        const moments = sessions.map((currentDate) => moment(currentDate.session_date));
        const maxDate = moment.max(moments);

        return maxDate.format('MMM Do,YYYY');
    }

    const completedSessions =
        tag && tag.sessions && tag.sessions.length
            ? tag.sessions.filter((curr) => {
                  if (
                      moment(curr.session_date)
                          .add(curr.end_time?.split(':')[0], 'hours')
                          .add(curr.end_time?.split(':')[1])
                          .diff(moment.utc()) < 0 &&
                      curr.type !== 'restday'
                  )
                      return curr.session_date;
              })
            : null;
    const plannedSessions =
        tag && tag.sessions && tag.sessions.length
            ? tag.sessions.filter((curr) => {
                  if (curr.type !== 'restday') return curr.session_date;
              })
            : null;
    
    const restDays =
        tag && tag.sessions && tag.sessions.length
            ? tag.sessions.filter((curr) => curr.type === 'restday')
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
                                                                            key={1}
                                                                            onClick={() =>
                                                                                setShowProgramNameModal(
                                                                                    true
                                                                                )
                                                                            }
                                                                        >
                                                                            Edit Program Name
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item key={2}
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
                                                                        ? tag.fitnesspackage
                                                                              .classsize
                                                                        : null}{' '}
                                                                    people
                                                                </b>
                                                                <br />
                                                                <b>
                                                                    {moment(groupEndDate).diff(
                                                                        moment(groupStartDate),
                                                                        'days'
                                                                    ) + ' days'}
                                                                </b>
                                                                <br />
                                                                <b>Start Date:</b>{' '}
                                                                {moment(groupStartDate).format(
                                                                    'DD MMMM, YY'
                                                                )}
                                                                <br />
                                                                <b>End Date: </b>
                                                                {moment(groupEndDate).format(
                                                                    'DD MMMM, YY'
                                                                )}
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
                                                                    className="py-2 px-4 ml-1"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => {
                                                                        fitnessActionRef.current.TriggerForm(
                                                                            {
                                                                                id: tagId,
                                                                                actionType:
                                                                                    'allClients',
                                                                                type: 'Group Class'
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    View all
                                                                </Badge>
                                                                <p className="ml-3">
                                                                    {tag &&
                                                                        tag.client_packages &&
                                                                        tag.client_packages
                                                                            .length}{' '}
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
                                                        {tag && tag.sessions && tag.sessions.length ? calculateLastSession(tag.sessions) : null}
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
                                                                        (tag.fitnesspackage.mode ===
                                                                            'Online' ||
                                                                            tag.fitnesspackage
                                                                                .mode ===
                                                                                'Hybrid') ? (
                                                                            <th>Plan Online</th>
                                                                        ) : null}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        (tag.fitnesspackage.mode ===
                                                                            'Offline' ||
                                                                            tag.fitnesspackage
                                                                                .mode ===
                                                                                'Hybrid') ? (
                                                                            <th>Plan Offline</th>
                                                                        ) : null}

                                                                        <th>Plan Rest</th>
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        (tag.fitnesspackage.mode ===
                                                                            'Online' ||
                                                                            tag.fitnesspackage
                                                                                .mode ===
                                                                                'Hybrid') ? (
                                                                            <th>
                                                                                Completed Online
                                                                            </th>
                                                                        ) : null}
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        (tag.fitnesspackage.mode ===
                                                                            'Offline' ||
                                                                            tag.fitnesspackage
                                                                                .mode ===
                                                                                'Hybrid') ? (
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
                                                                        <td>
                                                                            {moment(
                                                                                groupEndDate
                                                                            ).diff(
                                                                                moment(
                                                                                    groupStartDate
                                                                                ),
                                                                                'days'
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {(tag.fitnesspackage
                                                                                .mode ===
                                                                                'Online' ||
                                                                                tag.fitnesspackage
                                                                                    .mode ===
                                                                                    'Hybrid') && (
                                                                                <div>
                                                                                    {handleTimeFormatting(
                                                                                        totalClasses[0],
                                                                                        tag
                                                                                            .fitnesspackage
                                                                                            .duration
                                                                                    )}
                                                                                    /
                                                                                    {
                                                                                        tag
                                                                                            .fitnesspackage
                                                                                            .grouponline
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                            {tag &&
                                                                            tag.fitnesspackage &&
                                                                            tag.fitnesspackage
                                                                                ? tag.fitnesspackage
                                                                                      ?.ptonline
                                                                                : null}
                                                                        </td>
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        (tag.fitnesspackage.mode ===
                                                                            'Offline' ||
                                                                            tag.fitnesspackage
                                                                                .mode ===
                                                                                'Hybrid') ? (
                                                                            <td>
                                                                                {
                                                                                    tag
                                                                                        .fitnesspackage
                                                                                        .groupoffline
                                                                                }
                                                                            </td>
                                                                        ) : null}
                                                                        <td>
                                                                            {restDays &&
                                                                            restDays.length
                                                                                ? restDays.length
                                                                                : 0}
                                                                        </td>
                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        (tag.fitnesspackage.mode ===
                                                                            'Online' ||
                                                                            tag.fitnesspackage
                                                                                .mode ===
                                                                                'Hybrid') ? (
                                                                            <td>
                                                                                {completedSessions &&
                                                                                completedSessions.length
                                                                                    ? completedSessions.length
                                                                                    : 0}
                                                                            </td>
                                                                        ) : null}

                                                                        {tag &&
                                                                        tag.fitnesspackage &&
                                                                        (tag.fitnesspackage.mode ===
                                                                            'Offline' ||
                                                                            tag.fitnesspackage
                                                                                .mode ===
                                                                                'Hybrid') ? (
                                                                            <td>
                                                                                {completedSessions &&
                                                                                completedSessions.length
                                                                                    ? completedSessions.length
                                                                                    : 0}
                                                                            </td>
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

                        {/* Scheduler manager based on dates */}
                        <Row className="mt-5 mb-2 d-flex align-items-center">
                            <Col lg={2}>
                                {moment().isBefore(moment(groupEndDate)) ? (
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
                            <Col lg={8}>
                                <div className="text-center">
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
                                    <span className="shadow-lg bg-dark p-2 rounded-lg text-white">
                                        {moment(prevDate).format('MMMM, YYYY')} -{' '}
                                        {moment(nextDate).format('MMMM, YYYY')}
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
                                    <div className="mt-5">
                                        <SchedulerPage
                                            blockedSessions={blockedSessions}
                                            ref={ref}
                                            show24HourFormat={show24HourFormat}
                                            showBlockedSlots={showBlockedSlots}
                                            type="date"
                                            days={calculateDays(prevDate, nextDate)}
                                            callback={handleCallback}
                                            restDays={tag?.sessions.filter(
                                                (ses) => ses.type === 'restday'
                                            )}
                                            programId={tagId ? tagId : null}
                                            schedulerSessions={schedulerSessions}
                                            sessionIds={sessionIds}
                                            clientIds={clientIds}
                                            classType={'Group Class'}
                                            startDate={prevDate}
                                            duration={moment(nextDate).diff(
                                                moment(prevDate),
                                                'days'
                                            )}
                                            showRestDay={showRestDay}
                                            handleFloatingActionProgramCallback={
                                                handleFloatingActionProgramCallback
                                            }
                                            handleFloatingActionProgramCallback2={
                                                handleFloatingActionProgramCallback2
                                            }
                                            handleRefetch={handleRefetch}
                                            sessionFilter={sessionFilter}
                                            program={program}
                                        />
                                    </div>
                                </Col>
                                <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                            </Row>
                        ) : null}
                        {
                            <Modal show={editDatesModal} onHide={handleCloseDatesModal}>
                                <Modal.Body>
                                    <label>Edit Start Date: </label>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            value={
                                                startDate === ''
                                                    ? tag?.client_packages[0]?.effective_date
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
                                    <Button
                                        variant="outline-danger"
                                        onClick={handleCloseDatesModal}
                                    >
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
                        }
                        {
                            <Modal show={editTimeModal} onHide={handleCloseTimeModal}>
                                <Modal.Body>
                                    <label>Edit Group Start Time: </label>
                                    <Row>
                                        <Col lg={4}>
                                            <TimePicker showSecond={false} minuteStep={15} />
                                        </Col>
                                    </Row>
                                    <label>Edit Group End Time: </label>
                                    <Row>
                                        <Col lg={4}>
                                            <TimePicker showSecond={false} minuteStep={15} />
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="outline-danger" onClick={handleCloseTimeModal}>
                                        Close
                                    </Button>
                                    <Button
                                        variant="outline-success"
                                        onClick={() => {
                                            handleDateEdit();
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </div>
                </Col>
                {/* Right sidebar */}
                <Col lg={collapse ? '1' : '2'} className="d-lg-block">
                    <SideNav
                        type="date"
                        handleScrollScheduler={handleScrollScheduler}
                        show24HourFormat={show24HourFormat}
                        setShow24HourFormat={setShow24HourFormat}
                        showBlockedSlots={showBlockedSlots}
                        setShowBlockedSlots={setShowBlockedSlots}
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

// export default Scheduler;
export default forwardRef(Scheduler);
