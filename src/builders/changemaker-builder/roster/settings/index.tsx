import React, { useState } from 'react';
import { Dropdown, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import {
    UPDATE_SESSION_TIME,
    UPDATE_SESSION_MODE,
    UPDATE_SESSION_BOOKING_STATUS,
    UPDATE_SESSION_DATE
} from '../graphql/mutations';
import moment from 'moment';
import TimePickers from 'components/ClockTimePicker';

const RosterSettings: React.FC<{ data: any[] }> = (props) => {
    const data = props.data[0];

    const [startTime, setStartTime] = useState(data?.session?.start_time);
    const [endTime, setEndTime] = useState(data?.session?.end_time);
    const [newMode, setNewMode] = useState(data?.session?.mode);
    const [newDate, setNewDate] = useState(data?.session?.session_date);
    const [classCancel, setClassCancel] = useState<string>('');
    const [classCancellationReason, setClassCancellationReason] = useState<string>('');
    const [showRescheduleTime, setShowRescheduleTime] = useState<boolean>(false);
    const [showChangeMode, setShowChangeMode] = useState<boolean>(false);
    const [showCancelStatus, setShowCancelStatus] = useState<boolean>(false);
    const [showRescheduleDate, setShowRescheduleDate] = useState<boolean>(false);

    const handleClose = () => setShowRescheduleTime(false);
    const handleShow = () => setShowRescheduleTime(true);

    const handleCloseMode = () => setShowChangeMode(false);
    const handleShowMode = () => setShowChangeMode(true);

    const handleCloseStatus = () => setShowCancelStatus(false);
    const handleShowStatus = () => setShowCancelStatus(true);

    const handleCloseDate = () => setShowRescheduleDate(false);
    const handleShowDate = () => setShowRescheduleDate(true);

    const [updateSessionTime] = useMutation(UPDATE_SESSION_TIME, {
        onCompleted: () => {
            handleClose();
        }
    });
    const [updateSessionMode] = useMutation(UPDATE_SESSION_MODE, {
        onCompleted: () => {
            handleCloseMode();
        }
    });
    const [updateSessionClassStatus] = useMutation(UPDATE_SESSION_BOOKING_STATUS, {
        onCompleted: () => {
            handleCloseStatus();
        }
    });
    const [updateSessionDate] = useMutation(UPDATE_SESSION_DATE, {
        onCompleted: () => {
            handleCloseDate();
        }
    });

    function convertToMoment(time: string) {
        const timeSplit = time.split(':').map(Number);
        return moment().set({ hour: timeSplit[0], minute: timeSplit[1] });
    }

    function handleFromTimeInput(val: any) {
        setStartTime((val.$H < 10 ? `0${val.$H}` : val.$H) + ':' + (val.$m === 0 ? '00' : val.$m));
    }

    function handleToTimeInput(val: any) {
        setEndTime((val.$H < 10 ? `0${val.$H}` : val.$H) + ':' + (val.$m === 0 ? '00' : val.$m));
    }

    function handleTimeValidation() {
        const sh = startTime.split(':')[0];
        const sm = startTime.split(':')[1];
        const eh = endTime.split(':')[0];
        const em = endTime.split(':')[1];

        if (startTime !== '00:00' || endTime !== '00:00') {
            if (parseInt(sh) > parseInt(eh)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time should be greater than Start Time
                    </span>
                );
            } else if (parseInt(sh) === parseInt(eh) && parseInt(sm) === parseInt(em)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time and start Time cannot be the same
                    </span>
                );
            } else if (parseInt(sh) === parseInt(eh) && parseInt(sm) > parseInt(em)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time Cannot be lesser than Start Time
                    </span>
                );
            } else {
                return <span style={{ color: 'green' }}>Valid Time</span>;
            }
        }
    }

    function handleDisableCheck() {
        const ele = document.getElementById('timeErr');
        if (ele) {
            return true;
        }
        return false;
    }

    return (
        <>
            <div className="shadow-lg p-4" style={{ borderRadius: '15px' }}>
                <div
                    className="text-right"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'end'
                    }}
                >
                    <h4>Sessions &nbsp;&nbsp;</h4>
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-basic"
                            as="button"
                            className="actionButtonDropDown"
                        >
                            <i className="fas fa-ellipsis-v"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleShow}>Reschedule Time</Dropdown.Item>
                            <Dropdown.Item onClick={handleShowMode}>Change Mode</Dropdown.Item>
                            <Dropdown.Item onClick={handleShowStatus}>Cancel Class</Dropdown.Item>
                            <Dropdown.Item onClick={handleShowDate}>Reschedule Date</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <hr />
                <div
                    className="shadow-lg p-4 mb-3"
                    style={{ borderRadius: '15px', border: '1px solid black' }}
                >
                    <Row>
                        <Col lg={5}>
                            <h3>Class Date</h3>
                        </Col>
                        <div className="shadow-lg p-4" style={{ borderRadius: '15px' }}>
                            {moment(data?.session?.session_date).format('MMM DD, YYYY')}
                        </div>
                    </Row>
                </div>
                <div
                    className="shadow-lg p-4 mb-3"
                    style={{ borderRadius: '15px', border: '1px solid black' }}
                >
                    <Row>
                        <Col lg={5}>
                            <h3>Class Time</h3>
                        </Col>
                        <Col lg={5}>
                            <Row>
                                <div className="shadow-lg p-4" style={{ borderRadius: '15px' }}>
                                    {moment(data?.session?.start_time, 'hh:mm a').format('hh:mm a')}
                                </div>
                                <div className="ml-4 mr-4">to</div>
                                <div className="shadow-lg p-4" style={{ borderRadius: '15px' }}>
                                    {moment(data?.session?.end_time, 'hh:mm a').format('hh:mm a')}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div
                    className="shadow-lg p-4 mb-3"
                    style={{ borderRadius: '15px', border: '1px solid black' }}
                >
                    <Row>
                        <Col lg={5}>
                            <h3>Class Mode</h3>
                        </Col>
                        <Col lg={5}>
                            <Row>
                                <div className="shadow-lg p-4" style={{ borderRadius: '15px' }}>
                                    {data?.session?.mode}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div
                    className="shadow-lg p-4 mb-3"
                    style={{ borderRadius: '15px', border: '1px solid black' }}
                >
                    <Row>
                        <Col lg={5}>
                            <h3>Class Status</h3>
                        </Col>
                        <Col lg={5}>
                            <Row>
                                <div>
                                    <Button variant="success">
                                        {data?.Session_booking_status}
                                    </Button>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
            {
                <Modal show={showRescheduleTime} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Reschedule Time</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <h4>Reschedule Time</h4>
                        </div>
                        <div className="text-center">
                            <TimePickers
                                label="Start time"
                                disabled={false}
                                onChange={handleFromTimeInput}
                            />
                            <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span>

                            <TimePickers
                                label="End time"
                                disabled={false}
                                onChange={handleToTimeInput}
                            />
                        </div>
                        <div className="text-center mt-2">{handleTimeValidation()}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="success"
                            disabled={handleDisableCheck()}
                            onClick={() => {
                                updateSessionTime({
                                    variables: {
                                        id: data?.session?.id,
                                        start_time: startTime,
                                        end_time: endTime
                                    }
                                });
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
            {
                <Modal show={showChangeMode} onHide={handleCloseMode} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Mode</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <h4>Reschedule Time</h4>
                        </div>
                        <div>
                            <Form.Control
                                as="select"
                                onChange={(e: any) => {
                                    setNewMode(e.target.value);
                                }}
                                defaultValue={data?.session?.mode}
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </Form.Control>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseMode}>
                            Close
                        </Button>
                        <Button
                            variant="success"
                            disabled={newMode === data?.session?.mode ? true : false}
                            onClick={() => {
                                updateSessionMode({
                                    variables: {
                                        id: data?.session?.id,
                                        mode: newMode
                                    }
                                });
                            }}
                        >
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
            {
                <Modal show={showCancelStatus} onHide={handleCloseStatus} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Class Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <h4>Current Status: {data?.Session_booking_status}</h4>
                        </div>
                        <div className="text-center">
                            <Button
                                variant="success"
                                disabled={
                                    data?.Session_booking_status === 'Canceled' ? false : true
                                }
                                onClick={() => {
                                    setClassCancel('Booked');
                                }}
                            >
                                Active
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                                variant="danger"
                                disabled={
                                    data?.Session_booking_status !== 'Canceled' ? false : true
                                }
                                onClick={() => {
                                    setClassCancel('Canceled');
                                }}
                            >
                                Cancel Class
                            </Button>
                        </div>
                        {classCancel !== 'Booked' && (
                            <div className="text-center m-4">
                                <span>Reason for Cancellation</span>
                                <br />
                                <textarea
                                    rows={3}
                                    cols={50}
                                    className="shadow-lg mt-3"
                                    value={classCancellationReason}
                                    onChange={(e: any) => {
                                        setClassCancellationReason(e.target.value);
                                    }}
                                    style={{ border: 'none', borderRadius: '15px' }}
                                ></textarea>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseStatus}>
                            Close
                        </Button>
                        {classCancel !== 'Booked' && (
                            <Button
                                variant="success"
                                disabled={
                                    classCancel !== 'Booked' &&
                                    classCancel !== '' &&
                                    classCancellationReason !== ''
                                        ? false
                                        : true
                                }
                                onClick={() => {
                                    updateSessionClassStatus({
                                        variables: {
                                            id: data?.id,
                                            status: classCancel
                                        }
                                    });
                                }}
                            >
                                Submit
                            </Button>
                        )}
                        {classCancel === 'Booked' && (
                            <Button
                                variant="success"
                                onClick={() => {
                                    updateSessionClassStatus({
                                        variables: {
                                            id: data?.id,
                                            status: classCancel
                                        }
                                    });
                                }}
                            >
                                Submit
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            }
            {
                <Modal show={showRescheduleDate} onHide={handleCloseDate} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Reschedule Date</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <h4>Reschedule Date</h4>
                        </div>
                        <div className="text-center">
                            <input
                                min={moment().subtract(3, 'months').format('YYYY-MM-DD')}
                                max={moment().add(3, 'months').format('YYYY-MM-DD')}
                                className="p-1 mt-3 rounded shadow-sm mb-3"
                                type="date"
                                style={{
                                    border: 'none',
                                    backgroundColor: 'rgba(211,211,211,0.8)'
                                }}
                                value={newDate}
                                onChange={(e: any) =>
                                    setNewDate(moment(e.target.value).format('YYYY-MM-DD'))
                                }
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseDate}>
                            Close
                        </Button>
                        <Button
                            variant="success"
                            disabled={newDate === data?.session?.session_date ? true : false}
                            onClick={() => {
                                updateSessionDate({
                                    variables: {
                                        id: data?.session?.id,
                                        date: newDate
                                    }
                                });
                            }}
                        >
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
};

export default RosterSettings;
