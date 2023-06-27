import React, { useImperativeHandle, useState, useContext } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
    UPDATE_STATUS,
    UPDATE_SCHEDULE,
    CREATE_SCHEDULE,
    GET_FUTURE_SESSIONS,
    GET_SESSION
} from './queries';
import StatusModal from '../../../components/StatusModal/StatusModal';
import { flattenObj } from '../../../components/utils/responseFlatten';
import AuthContext from '../../../context/auth-context';
import moment from 'moment';
import Toaster from '../../../components/Toaster';
import { Modal, DropdownButton, Dropdown, Row, Col, Button } from 'react-bootstrap';
import './RescheduleModal.css';

interface Operation {
    id: string;
    modal_status: boolean;
    type: 'reschedule' | 'cancel';
    tag: string;
}

function CancelComponent(props: any, ref: any) {
    const [isScheduleCanceled, setIsScheduleCanceled] = useState<boolean>(false);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [selectedTime, setSelectedTime] = useState<string | null | any>(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
    const [sessionData, setSessionData] = useState<any>([]);
    const [currentSessionData, setCurrentSessionData] = useState<any>([]);
    const auth = useContext(AuthContext);
    const currentDate = new Date();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            // render delete modal for delete operation
            if (msg.type === 'cancel') {
                setShowCancelModal(true);
            }
            // restrict reschedule modal to render for cancel operation
            if (msg.type !== 'cancel') {
                setShowRescheduleModal(true);
            }
        }
    }));

    const [updateStatus] = useMutation(UPDATE_STATUS, {
        onCompleted: () => {
            props.callback();
        }
    });

    const [updateSchedule] = useMutation(UPDATE_SCHEDULE, {
        onCompleted: () => {
            setIsScheduleCanceled(true);
        }
    });

    const [createSchedule] = useMutation(CREATE_SCHEDULE, {
        onCompleted: () => {
            props.callback();
        }
    });

    function getDate(time: Date): string {
        const dateObj: Date = new Date(time);
        const month: number = dateObj.getMonth() + 1;
        const year: number = dateObj.getFullYear();
        const date: number | string =
            dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();

        return `${year}-${month}-${date}`;
    }

    // eslint-disable-next-line
    const [getSession, { data: get_session, refetch: refetch_session }] = useLazyQuery(
        GET_SESSION,
        {
            onCompleted: (data) => {
                const flattenSessionsData = flattenObj({ ...data.session });
                setCurrentSessionData(flattenSessionsData);
            }
        }
    );

    useQuery(GET_FUTURE_SESSIONS, {
        variables: {
            id: Number(auth.userid),
            tag: operation.tag,
            session_date: getDate(currentDate)
        },
        skip: !operation.tag,
        onCompleted: (data) => {
            const currentTime = new Date();
            const flattenSessionsData = flattenObj({ ...data.sessions });
            const nextUpcomingSessions = flattenSessionsData.filter((currentValue) => {
                const [hours, minutes] = currentValue.start_time.split(':');
                const date = new Date(
                    currentTime.getFullYear(),
                    currentTime.getMonth(),
                    currentTime.getDate(),
                    +hours,
                    +minutes,
                    0
                );

                return date >= currentTime;
            });
            setSessionData(nextUpcomingSessions);
            getSession({ variables: { id: operation.id } });
        }
    });

    const CancelStatus = (id: string) => {
        updateStatus({
            variables: { id: id, data: { Session_booking_status: 'Canceled' } }
        });
    };

    function getTime(startTime: string): string {
        const splitTime: string[] = startTime.split(':');
        const date: moment.Moment = moment().set({
            hour: Number(splitTime[0]),
            minute: Number(splitTime[1])
        });
        const time: string = moment(date).format('h:mm A');
        return time;
    }

    const changeScheduleHandler = (id: string, selectedTime: any) => {
        const selectedSession = sessionData.find((currentValue: any) => currentValue.id === id);

        const sessionBookingArray =
            selectedSession &&
            selectedSession.sessions_bookings.length &&
            selectedSession.sessions_bookings.map((currentValue: any) => currentValue.id);

        const feedbackNotesArray =
            selectedSession &&
            selectedSession.feedback_notes.length &&
            selectedSession.feedback_notes.map((currentValue: any) => currentValue.id);

        updateSchedule({
            variables: {
                id: id,
                data: {
                    start_time: selectedTime.start_time,
                    end_time: selectedTime.end_time
                }
            },
            onCompleted: () => {
                createSchedule({
                    variables: {
                        data: {
                            start_time: selectedTime.start_time,
                            end_time: selectedTime.end_time,
                            Is_program_template:
                                selectedSession && selectedSession.Is_program_template
                                    ? selectedSession.Is_program_template
                                    : null,
                            Is_restday:
                                selectedSession && selectedSession.Is_restday
                                    ? selectedSession.Is_restday
                                    : false,
                            day_of_program:
                                selectedSession && selectedSession.day_of_program
                                    ? selectedSession.day_of_program
                                    : null,
                            session_date:
                                selectedSession && selectedSession.session_date
                                    ? selectedSession.session_date
                                    : null,
                            tag:
                                selectedSession && selectedSession.tag ? selectedSession.tag : null,
                            type:
                                selectedSession && selectedSession.type
                                    ? selectedSession.type
                                    : null,
                            mode:
                                selectedSession && selectedSession.mode
                                    ? selectedSession.mode
                                    : null,
                            activity_target:
                                selectedSession && selectedSession.activity_target
                                    ? selectedSession.activity_target
                                    : null,
                            workout:
                                selectedSession && selectedSession.workout
                                    ? selectedSession.workout.id
                                    : null,
                            activity:
                                selectedSession && selectedSession.activity
                                    ? selectedSession.activity.id
                                    : null,
                            changemaker:
                                selectedSession &&
                                selectedSession.changemaker &&
                                selectedSession.changemaker.id,
                            sessions_bookings: sessionBookingArray,
                            feedback_notes: feedbackNotesArray
                        }
                    }
                });
            }
        });
        props.callback();
        setShowRescheduleModal(false);
    };

    return (
        <>
            <Modal
                show={showRescheduleModal}
                onHide={() => setShowRescheduleModal(false)}
                backdrop="static"
                keyboard={false}
                dialogClassName="custom-large-modal"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Reschedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>When do you want to reschedule?</p>
                    <Row>
                        <Col md={{ offset: 3, span: 8 }}>
                            <div
                                style={{
                                    height: '60vh',
                                    overflowX: 'hidden',
                                    overflowY: 'auto'
                                }}
                            >
                                <Row>
                                    <Col sm={10} lg={6}>
                                        Current Booking
                                        <DropdownButton
                                            title={`${currentSessionData.start_time} to ${currentSessionData.end_time}, ${currentSessionData.session_date}`}
                                            id="dropdown-menu-align-right"
                                            variant="secondary"
                                        >
                                            {sessionData.map((currentValue: any) => (
                                                <Dropdown.Item
                                                    eventKey={currentValue.id}
                                                    key={currentValue.id}
                                                >
                                                    {currentValue.type === 'activity'
                                                        ? currentValue.activity.title
                                                        : currentValue.workout.workouttitle}
                                                    , (
                                                    {currentValue.start_time
                                                        ? getTime(currentValue.start_time)
                                                        : null}{' '}
                                                    to{' '}
                                                    {currentValue.end_time
                                                        ? getTime(currentValue.end_time)
                                                        : null}
                                                    ) ,{' '}
                                                    {currentValue.session_date
                                                        ? currentValue.session_date
                                                        : null}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Col>
                                    <Col sm={10} lg={6}>
                                        Reschedule to
                                        <DropdownButton
                                            title={
                                                selectedTime
                                                    ? `${
                                                          selectedTime.type === 'activity'
                                                              ? selectedTime.activity.title
                                                              : selectedTime.workout.workouttitle
                                                      } ${selectedTime.start_time} to ${
                                                          selectedTime.end_time
                                                      } , ${selectedTime.session_date}`
                                                    : 'Select Session'
                                            }
                                            id="dropdown-menu-align-right"
                                            variant="secondary"
                                        >
                                            {sessionData.map((currentValue: any) => (
                                                <Dropdown.Item
                                                    eventKey={currentValue.id}
                                                    key={currentValue.id}
                                                    onSelect={() => setSelectedTime(currentValue)}
                                                >
                                                    {currentValue.type === 'activity'
                                                        ? currentValue.activity.title
                                                        : currentValue.workout.workouttitle}
                                                    , (
                                                    {currentValue.start_time
                                                        ? getTime(currentValue.start_time)
                                                        : null}{' '}
                                                    to{' '}
                                                    {currentValue.end_time
                                                        ? getTime(currentValue.end_time)
                                                        : null}
                                                    ) ,{' '}
                                                    {currentValue.session_date
                                                        ? currentValue.session_date
                                                        : null}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => changeScheduleHandler(operation.id, selectedTime)}
                        >
                            Reschedule
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>

            {/* Cancel Modal */}
            {showCancelModal && (
                <StatusModal
                    show={showCancelModal}
                    onHide={() => setShowCancelModal(false)}
                    modalTitle="Cancel Booking"
                    modalBody="Are you sure you want to cancel the booking, because once cancelled new booking has to be made?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        CancelStatus(operation.id);
                    }}
                />
            )}

            {/* success toaster notification */}
            {isScheduleCanceled ? (
                <Toaster
                    handleCallback={() => setIsScheduleCanceled(!isScheduleCanceled)}
                    type="success"
                    msg="Your Scheduled session is cancelled"
                />
            ) : null}
        </>
    );
}

export default React.forwardRef(CancelComponent);
