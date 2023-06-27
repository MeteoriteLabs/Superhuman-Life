import { useMemo, useState, useContext, useRef } from 'react';
import {
    Badge,
    TabContent,
    Row,
    Col,
    Card,
    InputGroup,
    Button,
    FormControl
} from 'react-bootstrap';
import Table from '../../../components/table/leads-table';
import ActionButton from '../../../components/actionbutton/index';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ALL_CLIENTS, GET_SESSION_BOOKINGS_FOR_CLIENTS } from './queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import AuthContext from '../../../context/auth-context';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import CancelComponent from './CancelComponent';
import OfferingsDisplayImage from '../../../components/customWidgets/offeringsDisplayImage';
import './Client.css';

export default function Clients() {
    const [searchFilter, setSearchFilter] = useState('');
    const searchInput = useRef<any>();
    const auth = useContext(AuthContext);
    const [clientsData, setClientsData] = useState<any>([]);
    const [activeCard, setActiveCard] = useState<number>(0);
    const cancelComponent = useRef<any>(null);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    const columns = useMemo<any>(
        () => [
            { accessor: 'name', Header: 'Name' },
            { accessor: 'sessionDate', Header: 'Date' },
            { accessor: 'sessionTime', Header: 'Time' },
            { accessor: 'bookingTime', Header: 'Booked On' },
            {
                accessor: 'tag',
                Header: 'Type',
                Cell: ({ row }: any) => {
                    return (
                        <div className="d-flex justify-content-center align-items-center">
                            <div>
                                <OfferingsDisplayImage
                                    mode={row.original?.mode}
                                    packageType={row.values?.tag}
                                />
                                <p className="mb-0">{row.values?.tag}</p>
                            </div>
                        </div>
                    );
                }
            },
            {
                accessor: 'status',
                Header: 'Status',
                Cell: ({ row }: any) => {
                    let statusColor = '';
                    switch (row.values.status) {
                        case 'Booked':
                            statusColor = 'success';
                            break;

                        case 'Attended':
                            statusColor = 'primary';
                            break;

                        case 'Rescheduled':
                            statusColor = 'info';
                            break;

                        case 'Canceled':
                            statusColor = 'secondary';
                            break;

                        case 'Rejected':
                            statusColor = 'danger';
                            break;
                    }
                    return (
                        <>
                            <Badge
                                className="px-3 py-1"
                                style={{ fontSize: '1rem', borderRadius: '10px' }}
                                variant={statusColor}
                            >
                                {row.values.status}
                            </Badge>
                        </>
                    );
                }
            },
            {
                id: 'edit',
                Header: 'Actions',
                Cell: ({ row }: any) => {
                    const history = useHistory();
                    const routeChange = () => {
                        const path = `clients`;
                        history.push(path);
                    };

                    const rescheduleHandler = () => {
                        cancelComponent.current.TriggerForm({
                            id: row.original.sessionId,
                            type: 'reschedule',
                            tag: row.original.tag
                        });
                    };

                    const cancelHandler = () => {
                        cancelComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'cancel'
                        });
                    };

                    const arrayAction = [
                        {
                            actionName: 'Reschedule',
                            actionClick: rescheduleHandler
                        },
                        {
                            actionName: 'Cancel',
                            actionClick: cancelHandler
                        },
                        {
                            actionName: 'Manage Program',
                            actionClick: routeChange
                        },
                        {
                            actionName: 'Go to client',
                            actionClick: routeChange
                        }
                    ];

                    const arrayActionForCancelledAndAttended = [
                        {
                            actionName: 'Manage Program',
                            actionClick: routeChange
                        },
                        {
                            actionName: 'Go to client',
                            actionClick: routeChange
                        }
                    ];

                    const arrayActionForGroup = [
                        {
                            actionName: 'Cancel',
                            actionClick: cancelHandler
                        },
                        {
                            actionName: 'Manage Program',
                            actionClick: routeChange
                        },
                        {
                            actionName: 'Go to client',
                            actionClick: routeChange
                        }
                    ];

                    return (
                        <ActionButton
                            arrayAction={
                                row.values.tag === 'Live Stream Channel' ||
                                row.values.tag === 'Group Class' ||
                                row.values.tag === 'Cohort'
                                    ? arrayActionForGroup
                                    : row.values.status === 'Canceled' ||
                                      row.values.status === 'Attended'
                                    ? arrayActionForCancelledAndAttended
                                    : arrayAction
                            }
                        ></ActionButton>
                    );
                }
            }
        ],
        []
    );

    const [datatable, setDataTable] = useState<Record<string, unknown>[]>([]);

    useQuery(GET_ALL_CLIENTS, {
        variables: { filter: searchFilter, id: Number(auth.userid) },
        onCompleted: (data) => {
            const flattenClientsData = flattenObj({ ...data.clientPackages });
            setClientsData(flattenClientsData);
            getSessionBookings({
                variables: {
                    id: flattenClientsData[0]?.users_permissions_user?.id,
                    loginUserId: auth.userid,
                    status: ['Booked']
                }
            });
        }
    });

    const [
        getSessionBookings,
        // eslint-disable-next-line
        { data: get_session_bookings, refetch: refetch_session_bookings }
    ] = useLazyQuery(GET_SESSION_BOOKINGS_FOR_CLIENTS, {
        onCompleted: (data) => {
            loadData(data);
        }
    });

    function getTime(startTime: string): string {
        const splitTime: string[] = startTime.split(':');
        const date: moment.Moment = moment().set({
            hour: Number(splitTime[0]),
            minute: Number(splitTime[1])
        });
        const time: string = moment(date).format('h:mm A');
        return time;
    }

    function loadData(data: any) {
        const flattenBookingsData = flattenObj({ ...data });

        setDataTable(
            [...flattenBookingsData.sessionsBookings].flatMap((Detail) => {
                return {
                    id: Detail.id,
                    sessionId: Detail.session && Detail.session.id ? Detail.session.id : null,
                    name:
                        Detail.session && Detail.session.type && Detail.session.type === 'activity'
                            ? Detail.session.activity.title
                            : Detail.session &&
                              Detail.session.workout &&
                              Detail.session.workout.workouttitle,
                    tag: Detail.session && Detail.session.tag,
                    mode: Detail.session && Detail.session.mode,
                    sessionDate: Detail.session && Detail.session.session_date,
                    bookingTime: moment(Detail.createdAt).format('DD/MM/YYYY, hh:mm'),
                    sessionTime: Detail.session
                        ? `${getTime(Detail.session.start_time)} - ${getTime(
                              Detail.session.end_time
                          )}`
                        : null,
                    status: Detail.Session_booking_status
                };
            })
        );
    }

    return (
        <>
            <div className="mt-3">
                <h3>Clients</h3>

                <TabContent>
                    <Row className="mt-5">
                        <Col lg={3} className="mb-4">
                            {/* Search bar for clients based on their name */}

                            <Row>
                                <Col lg={12}>
                                    <InputGroup className="mb-3 mt-3">
                                        <FormControl
                                            aria-describedby="basic-addon1"
                                            placeholder="Search for client's name"
                                            ref={searchInput}
                                        />
                                        <InputGroup.Prepend>
                                            <Button
                                                variant="outline-secondary"
                                                onClick={(e: any) => {
                                                    e.preventDefault();
                                                    setSearchFilter(searchInput.current.value);
                                                }}
                                            >
                                                <i className="fas fa-search"></i>
                                            </Button>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                </Col>
                            </Row>

                            {/* Clients cards */}
                            {clientsData.map((currentValue: any, index: number) => (
                                <Card
                                    style={{
                                        width: '16rem',
                                        cursor: 'pointer',
                                        border: '3px solid '
                                    }}
                                    className="mt-4 bg-white rounded shadow"
                                    key={currentValue.id}
                                    border={activeCard === index ? 'success' : 'light'}
                                    onClick={() => {
                                        setActiveCard(index);
                                        setSelectedCardId(currentValue.id);
                                        getSessionBookings({
                                            variables: {
                                                id: currentValue.users_permissions_user.id,
                                                loginUserId: auth.userid,
                                                status: ['Booked']
                                            }
                                        });
                                    }}
                                >
                                    <Card.Body>
                                        <Card.Title>
                                            {currentValue.users_permissions_user.First_Name}{' '}
                                            {currentValue.users_permissions_user.Last_Name}
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            @{currentValue.users_permissions_user.username}
                                        </Card.Subtitle>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>
                        <div style={{ border: '1px solid black' }} />

                        {/* Session grid */}
                        <Col lg={8}>
                            <h3>Sessions</h3>

                            <Row>
                                <Col lg={4} className="pt-5">
                                    <h6>Filter based on session&apos;s range</h6>
                                </Col>

                                {/* session starts date picker */}
                                <Col className="m-1" lg={4}>
                                    <label>Session&apos;s Start Date</label>
                                    <input
                                        className="date__input m-1"
                                        name="sessionStartDate"
                                        onChange={(e) => {
                                            getSessionBookings({
                                                variables: {
                                                    id: selectedCardId
                                                        ? selectedCardId
                                                        : clientsData && clientsData.length
                                                        ? clientsData[0].users_permissions_user.id
                                                        : null,
                                                    session_starts_date_filter: e.target.value,
                                                    loginUserId: auth.userid,
                                                    status: [
                                                        'Booked',
                                                        'Rejected',
                                                        'Canceled',
                                                        'Attended',
                                                        'Rescheduled'
                                                    ]
                                                }
                                            });
                                        }}
                                        placeholder="Start Date"
                                        type="date"
                                    />
                                </Col>

                                {/* session end date picker */}
                                <Col className="m-1" lg={4}>
                                    <label>Session&apos;s End Date</label>
                                    <input
                                        className="date__input m-1"
                                        name="sessionEndDate"
                                        onChange={(e) => {
                                            getSessionBookings({
                                                variables: {
                                                    id: selectedCardId
                                                        ? selectedCardId
                                                        : clientsData && clientsData.length
                                                        ? clientsData[0].users_permissions_user.id
                                                        : null,
                                                    session_ends_date_filter: e.target.value,
                                                    loginUserId: auth.userid,
                                                    status: [
                                                        'Booked',
                                                        'Rejected',
                                                        'Canceled',
                                                        'Attended',
                                                        'Rescheduled'
                                                    ]
                                                }
                                            });
                                        }}
                                        placeholder="Start Date"
                                        type="date"
                                    />
                                </Col>
                            </Row>

                            {/* session booking grid */}
                            <Table columns={columns} data={datatable} />
                        </Col>
                    </Row>
                </TabContent>
            </div>

            <CancelComponent
                ref={cancelComponent}
                callback={refetch_session_bookings}
            ></CancelComponent>
        </>
    );
}
