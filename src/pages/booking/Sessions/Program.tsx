import { useMemo, useState, useContext, useRef, useEffect } from 'react';
import {
    Badge,
    TabContent,
    Row,
    Col,
    Card,
    Container,
    Button,
    Dropdown,
    DropdownButton,
    ButtonGroup
} from 'react-bootstrap';
import Table from 'components/table/leads-table';
import ActionButton from 'components/actionbutton/index';
import { useLazyQuery } from '@apollo/client';
import { GET_SESSION_BOOKINGS, GET_TAGS } from './queries';
import { flattenObj } from 'components/utils/responseFlatten';
import AuthContext from 'context/auth-context';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import CancelComponent from './CancelComponent';
import './CardsStyle.css';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import ResponsiveTimePickers from 'components/ClockTimePicker';

export default function Program() {
    const auth = useContext(AuthContext);
    const [tagName, setTagName] = useState<string[]>([]);
    const [activeCard, setActiveCard] = useState<number>(0);
    const [selectedTagName, setSelectedTagName] = useState<string>('Show All');
    const [selectedFromDate, setSelectedFromDate] = useState<string>(
        moment().format('YYYY-MM-DD').toString()
    );
    const [selectedToDate, setSelectedToDate] = useState<string>(
        moment().add(2, 'days').format('YYYY-MM-DD').toString()
    );
    const [selectedFromTime, setSelectedFromTime] = useState<string>('00:00');
    const [selectedToTime, setSelectedToTime] = useState<string>('23:00');
    const [currentDaySessionData, setCurrentDaySessionData] = useState<any>([]);
    const [tomorrowDaySessionData, setTomorrowDaySessionData] = useState<any>([]);
    const [dayAfterTomorrowSessionData, setDayAfterTomorrowSessionData] = useState<any>([]);
    const cancelComponent = useRef<any>(null);

    const columns = useMemo<any>(
        () => [
            { accessor: 'name', Header: 'Name' },
            { accessor: 'bookingTime', Header: 'Booking Time' },
            { accessor: 'tag', Header: 'Type' },
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

    const [
        getTags,
        // eslint-disable-next-line
        { data: get_tags, refetch: refetch_tags }
    ] = useLazyQuery(GET_TAGS, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            const flattenTagData = flattenObj({ ...data.tags });

            const sessions = flattenTagData.map((currentValue) => currentValue.sessions);

            const todaysSession =
                sessions &&
                sessions.length &&
                sessions
                    .flat()
                    .filter(
                        (currentValue) =>
                            currentValue.session_date === moment().format('YYYY-MM-DD')
                    );

            const tomorrowsSession =
                sessions &&
                sessions.length &&
                sessions
                    .flat()
                    .filter(
                        (currentValue) =>
                            currentValue.session_date ===
                            moment().add(1, 'days').format('YYYY-MM-DD')
                    );

            const dayAfterTomorrowSession =
                sessions &&
                sessions.length &&
                sessions
                    .flat()
                    .filter(
                        (currentValue) =>
                            currentValue.session_date ===
                            moment().add(2, 'days').format('YYYY-MM-DD')
                    );

            setCurrentDaySessionData(todaysSession);
            setTomorrowDaySessionData(tomorrowsSession);
            setDayAfterTomorrowSessionData(dayAfterTomorrowSession);
            const arr = flattenTagData.map((currentValue) => currentValue.tag_name);
            setTagName(arr);

            if (
                (todaysSession && todaysSession.length) ||
                (tomorrowsSession && tomorrowsSession.length) ||
                (dayAfterTomorrowSession && dayAfterTomorrowSession.length)
            ) {
                getSessionBookings({
                    variables: {
                        id:
                            todaysSession && todaysSession.length
                                ? todaysSession[0].id
                                : tomorrowsSession && tomorrowsSession.length
                                ? tomorrowsSession[0].id
                                : dayAfterTomorrowSession && dayAfterTomorrowSession.length
                                ? dayAfterTomorrowSession[0].id
                                : null
                    }
                });
            }
        }
    });

    const [
        getSessionBookings,
        // eslint-disable-next-line
        { data: get_session_bookings, refetch: refetch_session_bookings }
    ] = useLazyQuery(GET_SESSION_BOOKINGS, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            loadData(data);
        }
    });

    function loadData(data: any) {
        const flattenBookingsData = flattenObj({ ...data });

        setDataTable(
            [...flattenBookingsData.sessionsBookings].flatMap((Detail) => {
                return {
                    id: Detail.id,
                    sessionId: Detail.session && Detail.session.id,
                    name: Detail.client ? Detail.client.username : null,
                    bookingTime: moment(Detail.createdAt).format('DD/MM/YY, hh:mm A'),
                    status: Detail.Session_booking_status,
                    tag: Detail.session?.tag
                };
            })
        );
    }

    function getStartTime(startTime: string): string {
        const splitTime: string[] = startTime.split(':');
        const date: moment.Moment = moment().set({
            hour: Number(splitTime[0]),
            minute: Number(splitTime[1])
        });
        const time: string = moment(date).format('h:mm A');
        return time;
    }

    useEffect(() => {
        getTags({
            variables: {
                id: Number(auth.userid),
                today: selectedFromDate,
                dayAfterTomorrow: selectedToDate
            }
        });
        // eslint-disable-next-line
    }, []);

    function handleFromTimeInput(val: any) {
        setSelectedFromTime(val.$H + ':' + (val.$m === 0 ? '00' : val.$m));
    }

    function handleToTimeInput(val: any) {
        setSelectedToTime(val.$H + ':' + (val.$m === 0 ? '00' : val.$m));
    }

    return (
        <>
            <div className="mt-3">
                <h3>Program Details</h3>

                <TabContent>
                    <Row className="mt-5">
                        {/* Session cards */}
                        <Col lg={3} className="mb-4">
                            <h3 className="mt-3">Sessions</h3>

                            {/* filters for sessions */}
                            <Container className="mt-3 border p-3">
                                <Row>
                                    <Col lg={12}>
                                        {/* tag select list  */}
                                        <DropdownButton
                                            as={ButtonGroup}
                                            key={'tagName'}
                                            id={`dropdown-button-drop-down`}
                                            drop={'down'}
                                            variant="dark"
                                            title={
                                                selectedTagName === ''
                                                    ? ` Select Program Name`
                                                    : selectedTagName
                                            }
                                            style={{ marginRight: '25px' }}
                                            defaultValue={'Show All'}
                                        >
                                            {tagName.map((currentValue, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    eventKey={currentValue}
                                                    onSelect={() =>
                                                        setSelectedTagName(currentValue)
                                                    }
                                                >
                                                    {currentValue}
                                                </Dropdown.Item>
                                            ))}
                                            <DropdownItem
                                                key="show all"
                                                onClick={() => setSelectedTagName('Show All')}
                                            >
                                                Show All
                                            </DropdownItem>
                                        </DropdownButton>
                                    </Col>

                                    {/* dates */}
                                    <Col className="mt-2">
                                        From Date
                                        <br />
                                        <input
                                            className="input"
                                            type="date"
                                            value={`${selectedFromDate}`}
                                            onChange={(e) => {
                                                setSelectedFromDate(e.target.value);
                                            }}
                                        />
                                    </Col>

                                    <Col className="mt-2">
                                        To Date
                                        <br />
                                        <input
                                            className="input"
                                            type="date"
                                            value={selectedToDate}
                                            onChange={(e) => {
                                                setSelectedToDate(e.target.value);
                                            }}
                                        />
                                    </Col>

                                    <Col lg={6} className="mt-2">
                                        From time <br />
                                        <ResponsiveTimePickers
                                            label=""
                                            disabled={false}
                                            onChange={handleFromTimeInput}
                                        />
                                    </Col>
                                    <Col lg={6} className="mt-2">
                                        To time <br />
                                        <ResponsiveTimePickers
                                            label=""
                                            disabled={false}
                                            onChange={handleToTimeInput}
                                        />
                                    </Col>
                                    <Col className="mt-2">
                                        <Button
                                            variant="outline-dark"
                                            disabled={selectedTagName !== 'Show All' ? false : true}
                                            onClick={() => {
                                                getTags({
                                                    variables: {
                                                        id: Number(auth.userid),
                                                        today: selectedFromDate,
                                                        dayAfterTomorrow: selectedToDate,
                                                        tag_name:
                                                            selectedTagName === 'Show All'
                                                                ? null
                                                                : selectedTagName,
                                                        start_time: selectedFromTime,
                                                        end_time: selectedToTime
                                                    }
                                                });
                                            }}
                                        >
                                            Apply
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>

                            <div
                                className="container animated animated-done bootdey"
                                data-animate="fadeIn"
                                data-animate-delay="0.05"
                                style={{ animationDelay: '0.05s' }}
                            >
                                <hr className="hr-lg mt-0 mb-2 w-10 mx-auto hr-primary" />

                                <div className="timeline timeline-left mx-lg-3">
                                    {currentDaySessionData.length ? (
                                        <div className="timeline-breaker">
                                            {moment().format('DD-MM-YYYY')}
                                        </div>
                                    ) : null}
                                    {currentDaySessionData && currentDaySessionData.length
                                        ? currentDaySessionData.map(
                                              (currentValue, index: number) => {
                                                  return (
                                                      <Card
                                                          className="bg-white rounded shadow timeline-item"
                                                          key={currentValue.id}
                                                          border={
                                                              activeCard === index
                                                                  ? 'success'
                                                                  : 'light'
                                                          }
                                                          onClick={() => {
                                                              setActiveCard(index);

                                                              getSessionBookings({
                                                                  variables: {
                                                                      id: currentValue.id,
                                                                      loginUserId: auth.userid,
                                                                      status: ['Booked']
                                                                  }
                                                              });
                                                          }}
                                                      >
                                                          <b>
                                                              {currentValue.type === 'activity'
                                                                  ? currentValue.activity.title
                                                                  : currentValue.workout
                                                                        ?.workouttitle}
                                                          </b>
                                                          {getStartTime(currentValue.start_time)}-
                                                          {getStartTime(currentValue.end_time)}
                                                          <br />
                                                          Mode : {currentValue.mode}
                                                          <br />
                                                          Type:{' '}
                                                          {currentValue.tag
                                                              ? currentValue.tag
                                                              : null}
                                                      </Card>
                                                  );
                                              }
                                          )
                                        : null}

                                    {tomorrowDaySessionData.length ? (
                                        <div className="timeline-breaker timeline-breaker-middle">
                                            {moment().add(1, 'days').format('DD-MM-YYYY')}
                                        </div>
                                    ) : null}
                                    {tomorrowDaySessionData && tomorrowDaySessionData.length
                                        ? tomorrowDaySessionData.map(
                                              (currentValue, index: number) => {
                                                  return (
                                                      <Card
                                                          className="bg-white rounded shadow timeline-item"
                                                          key={currentValue.id}
                                                          border={
                                                              activeCard ===
                                                              (currentDaySessionData &&
                                                              currentDaySessionData.length
                                                                  ? currentDaySessionData.length
                                                                  : index)
                                                                  ? 'success'
                                                                  : 'light'
                                                          }
                                                          onClick={() => {
                                                              setActiveCard(
                                                                  currentDaySessionData &&
                                                                      currentDaySessionData.length
                                                                      ? currentDaySessionData.length
                                                                      : 0
                                                              );

                                                              getSessionBookings({
                                                                  variables: {
                                                                      id: currentValue.id,
                                                                      loginUserId: auth.userid,
                                                                      status: ['Booked']
                                                                  }
                                                              });
                                                          }}
                                                      >
                                                          <b>
                                                              {currentValue.type === 'activity'
                                                                  ? currentValue.activity.title
                                                                  : currentValue.workout
                                                                        ?.workouttitle}
                                                          </b>
                                                          {getStartTime(currentValue.start_time)}-
                                                          {getStartTime(currentValue.end_time)}
                                                          <br />
                                                          Mode : {currentValue.mode}
                                                          <br />
                                                          Type:{' '}
                                                          {currentValue.tag
                                                              ? currentValue.tag
                                                              : null}
                                                      </Card>
                                                  );
                                              }
                                          )
                                        : null}
                                    {dayAfterTomorrowSessionData.length ? (
                                        <div className="timeline-breaker timeline-breaker-middle">
                                            {moment().add(2, 'days').format('DD-MM-YYYY')}
                                        </div>
                                    ) : null}
                                    {dayAfterTomorrowSessionData &&
                                    dayAfterTomorrowSessionData.length
                                        ? dayAfterTomorrowSessionData.map(
                                              (currentValue, index: number) => {
                                                  return (
                                                      <Card
                                                          className="bg-white rounded shadow timeline-item"
                                                          key={currentValue.id}
                                                          border={
                                                              activeCard ===
                                                                  tomorrowDaySessionData &&
                                                              tomorrowDaySessionData.length
                                                                  ? currentDaySessionData.length +
                                                                    tomorrowDaySessionData.length
                                                                  : index
                                                                  ? 'success'
                                                                  : 'light'
                                                          }
                                                          onClick={() => {
                                                              setActiveCard(
                                                                  tomorrowDaySessionData &&
                                                                      tomorrowDaySessionData.length
                                                                      ? currentDaySessionData.length +
                                                                            tomorrowDaySessionData.length
                                                                      : 0
                                                              );

                                                              getSessionBookings({
                                                                  variables: {
                                                                      id: currentValue.id,
                                                                      loginUserId: auth.userid,
                                                                      status: ['Booked']
                                                                  }
                                                              });
                                                          }}
                                                      >
                                                          <b>
                                                              {currentValue.type === 'activity'
                                                                  ? currentValue.activity.title
                                                                  : currentValue.workout
                                                                        ?.workouttitle}
                                                          </b>
                                                          {getStartTime(currentValue.start_time)}-
                                                          {getStartTime(currentValue.end_time)}
                                                          <br />
                                                          Mode : {currentValue.mode}
                                                          <br />
                                                          Type:{' '}
                                                          {currentValue.tag
                                                              ? currentValue.tag
                                                              : null}
                                                      </Card>
                                                  );
                                              }
                                          )
                                        : null}
                                </div>
                            </div>
                        </Col>
                        <div style={{ border: '1px solid black' }} />

                        {/* Booking grid */}
                        <Col lg={8}>
                            <h3>Booking Details</h3>
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
