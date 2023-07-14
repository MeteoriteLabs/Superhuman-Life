import { useState, useEffect, useRef, useContext } from 'react';
import {
    GET_TABLEDATA,
    GET_ALL_FITNESS_PACKAGE_BY_TYPE,
    GET_ALL_CLIENT_PACKAGE,
    GET_TAG_BY_ID
} from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import { Row, Col, Table, Card, Dropdown, Badge, Accordion } from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import FitnessAction from '../FitnessAction';
import AuthContext from 'context/auth-context';
import { Link } from 'react-router-dom';
import { flattenObj } from 'components/utils/responseFlatten';
import Loader from 'components/Loader/Loader';
import DisplayImage from 'components/DisplayImage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../profilepicture.css';

const Scheduler: React.FC = () => {
    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [userPackage, setUserPackage] = useState<any>([]);
    const [tagSeperation, setTagSeperation] = useState<any>([]);
    const [statusDays, setStatusDays] = useState();
    const [clientIds, setClientIds] = useState<any>([]);
    const [totalClasses, setTotalClasses] = useState<any>([]);
    // these are the sessions that will passed onto the scheduler
    const [schedulerSessions, setSchedulerSessions] = useState<any>([]);
    //im using this session ids from parent only in case of day wise session
    const [sessionIds, setSessionIds] = useState<any>([]);
    const [tag, setTag] = useState<any>();
    const [key, setKey] = useState('');

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
        setTotalClasses(total);
        setTag(flattenData.tags[0]);
    }

    const { data: data4 } = useQuery(GET_TABLEDATA, {
        variables: {
            id: last[0]
        }
    });

    const { data: data1 } = useQuery(GET_ALL_FITNESS_PACKAGE_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Classic'
        }
    });

    // const { data: data2 } = useQuery(GET_ALL_PROGRAM_BY_TYPE, {
    //     variables: {
    //         id: auth.userid,
    //         type: 'Classic'
    //     },

    // });

    const { data: data3 } = useQuery(GET_ALL_CLIENT_PACKAGE, {
        variables: {
            id: auth.userid,
            type: 'Classic'
        }
    });

    function handleEventsSeperation(data: any, rest_days: any) {
        let classic = 0;
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].tag === 'Classic') {
                    classic++;
                }
            }
            setTagSeperation([classic]);
            const arr: any = [];
            for (let j = 0; j < data.length; j++) {
                if (arr.includes(parseInt(data[j].day)) === false) arr.push(parseInt(data[j].day));
            }
            const restDays = rest_days === null ? 0 : rest_days.length;
            setStatusDays(arr.length + restDays);
        }
    }

    function loadData() {
        const flattenData1 = flattenObj({ ...data1 });
        // const flattenData2 = flattenObj({ ...data2 });
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
                    events: handleEventsSeperation(detail.events, detail.rest_days),
                    duration: detail.duration_days,
                    details: detail.description,
                    restDays: detail.rest_days
                };
            })
        );

        const arrayData: any[] = [];

        // let fitnessProgramItem: any = {};
        // for (let i = 0; i < flattenData1?.fitnesspackages.length; i++) {
        //     for (let j = 0; j < flattenData2?.programManagers.length; j++) {

        //         if (flattenData1.fitnesspackages[i].id === flattenData2.programManagers[j].fitnesspackages[0].id) {
        //             fitnessProgramItem.proManagerFitnessId = flattenData2.programManagers[j].fitnessprograms[0].id;
        //             fitnessProgramItem.title = flattenData2.programManagers[j].fitnessprograms[0].title;
        //             fitnessProgramItem.published_at = flattenData2.programManagers[j].fitnessprograms[0].published_at;
        //             fitnessProgramItem.proManagerId = flattenData2.programManagers[j].id;

        //             arrayData.push({ ...flattenData1.fitnesspackages[i], ...fitnessProgramItem });
        //         }

        //     }
        // }

        const arrayA = arrayData.map((item) => item.id);

        const filterPackage = flattenData1?.fitnesspackages.filter(
            (item: { id: string }) => !arrayA.includes(item.id)
        );
        filterPackage.forEach((item) => {
            arrayData.push(item);
        });

        const arrayFitnessPackage = arrayData.map((fitnessPackage) => {
            const client: string[] = [];

            flattenData3.clientPackages.forEach(
                (userPackage: {
                    fitnesspackages: { id: string };
                    users_permissions_user: { username: string };
                }) => {
                    if (fitnessPackage.id === userPackage.fitnesspackages[0].id) {
                        client.push(userPackage.users_permissions_user.username);
                    }
                    fitnessPackage = { ...fitnessPackage, client };
                }
            );

            return fitnessPackage;
        });

        for (let i = 0; i < arrayFitnessPackage.length - 1; i++) {
            if (arrayFitnessPackage[i].id === arrayFitnessPackage[i + 1].id) {
                arrayFitnessPackage.splice(arrayFitnessPackage[i], 1);
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
                    client: packageItem.client ? packageItem.client : 'N/A',
                    time: packageItem.published_at
                        ? moment(packageItem.published_at).format('h:mm:ss a')
                        : 'N/A',
                    programName: packageItem.title ? packageItem.title : 'N/A',
                    programStatus: packageItem.client.length > 0 ? 'Assigned' : 'N/A',
                    renewal: packageItem.title ? '25/08/2021' : 'N/A'
                };
            })
        ]);
    }

    // if(userPackage.length > 0){
    //     programIndex = userPackage.findIndex(item => item.id === last[1] && item.proManagerFitnessId === last[0])
    // }

    function handleTimeFormatting(data: any, duration: number) {
        const digits = duration <= 30 ? 2 : 3;
        return data.toLocaleString('en-US', {
            minimumIntegerDigits: digits.toString(),
            useGrouping: false
        });
    }

    function handleCallback() {
        mainQuery.refetch();
        // setSessionIds([]);
    }

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
                                <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => {key==='' ? setKey('0') : setKey('')}}>
                                <span className="d-inline-block">
                                        <b>{tag && tag.fitnesspackage?.packagename}</b>
                                    </span>
                                    <span className="d-inline-block btn float-right">
                                        {key === '0' ? (
                                            <i className="fa fa-chevron-up d-flex justify-content-end" />
                                        ) : (
                                            <i className="fa fa-chevron-down d-flex justify-content-end" />
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
                                                            {tag.fitnesspackage?.level}
                                                        </Badge>

                                                        <br />
                                                        <b>
                                                            {tag.fitnesspackage.duration === 1
                                                                ? `${tag.fitnesspackage.duration} day program`
                                                                : `${tag.fitnesspackage.duration} days program`}
                                                        </b>
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
                                <Accordion.Toggle as={Card.Header} eventKey="1" onClick={() => {key === '' ? setKey('1') : setKey('')}}>
                                    
                                    <span className="d-inline-block">
                                        <b>Movement Session</b>
                                    </span>
                                    <span className="d-inline-block btn float-right">
                                        {key === '1' ? (
                                            <i className="fa fa-chevron-up d-flex justify-content-end" />
                                        ) : (
                                            <i className="fa fa-chevron-down d-flex justify-content-end" />
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
                                                                <th>Plan Recorded</th>
                                                                <th>Plan Rest</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                            <tr>
                                                                <td>Recorded</td>
                                                                <td>
                                                                    {
                                                                        tag.fitnesspackage
                                                                            .recordedclasses
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {handleTimeFormatting(
                                                                        totalClasses[0],
                                                                        tag.fitnesspackage.duration
                                                                    )}
                                                                    /{tag.fitnesspackage.duration}
                                                                </td>
                                                                <td>
                                                                    {tag &&
                                                                    tag.fitnesspackage &&
                                                                    tag.fitnesspackage
                                                                        ? tag.fitnesspackage
                                                                              .restdays
                                                                        : null}
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
                                            <p>Note: Plan all the sessions in advance</p>
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
                            <Col xs={11} lg={6} className="pl-4" style={{ paddingRight: '20%' }}>
                                <Row>
                                    <h3 className="text-capitalize">{tag?.tag_name}</h3>
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
                                <Row
                                    className="p-1 mt-2"
                                    style={{ border: '2px solid gray', borderRadius: '10px' }}
                                >
                                    <Col lg={12} className="pl-0 pr-0">
                                        <Col>
                                            <Row>
                                                <h5>
                                                    <b>Clients</b>
                                                </h5>
                                            </Row>
                                            <Col lg={{ offset: 4 }}>
                                                <Row>
                                                    <div className="position-relative">
                                                        {tag.client_packages
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
                                                                        className="position-absolute"
                                                                    />
                                                                );
                                                            })}
                                                        <Button
                                                            onClick={() => {
                                                                fitnessActionRef.current.TriggerForm(
                                                                    {
                                                                        id: last[1],
                                                                        actionType: 'allClients',
                                                                        type: 'Classic'
                                                                    }
                                                                );
                                                            }}
                                                            style={{ marginLeft: '150px' }}
                                                            variant="outline-primary"
                                                        >
                                                            All clients
                                                        </Button>
                                                    </div>
                                                </Row>
                                                <Row className="mt-1">
                                                    <span>{tag.client_packages.length} people</span>
                                                </Row>
                                            </Col>
                                        </Col>
                                    </Col>
                                </Row>
                            </Col>
                            <Col
                                lg={5}
                                xs={11}
                                className="ml-5"
                                style={{ borderLeft: '2px dashed gray' }}
                            >
                                <div
                                    className="m-2 ml-5 text-center p-2"
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
                                                                totalClasses[0],
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
                                                <b style={{ color: 'gray' }}>Status: </b>{' '}
                                                {handleTimeFormatting(
                                                    totalClasses[0],
                                                    tag.fitnesspackage.duration
                                                )}
                                                /{tag.fitnesspackage.duration}
                                            </span>
                                        </Col>
                                        <Col>
                                            <span>
                                                <b style={{ color: 'gray' }}>Rest-Days: </b>{' '}
                                                {tag.fitnesspackage.restdays} days
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row> */}
                {/* Scheduler */}
                <Row>
                    <Col lg={11} className="pl-0 pr-0">
                        <div className="mt-5">
                            <SchedulerPage
                                callback={handleCallback}
                                type="day"
                                sessionIds={sessionIds}
                                schedulerSessions={schedulerSessions}
                                clientIds={clientIds}
                                days={tag.fitnesspackage.duration}
                                restDays={tag?.sessions.filter((ses) => ses.type === 'restday')}
                                classType={'Classic Class'}
                                startDate={'2021-05-01'}
                                programId={tagId}
                            />
                        </div>
                    </Col>
                    <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                </Row>
            </div>
        );
};

export default Scheduler;
