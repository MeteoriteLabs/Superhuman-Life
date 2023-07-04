import { Link } from 'react-router-dom';
import { Card, Form } from 'react-bootstrap';
import WorkHours from './workHours/workHours';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_BOOKING_TIME } from '../graphql/mutations';
import AuthContext from '../../../context/auth-context';
import { Modal } from 'react-bootstrap';

const Availability = () => {
    const auth = useContext(AuthContext);
    const [userOfflineTime, setUserOfflineTime]: any = useState(45);
    const [userOnlineTime, setUserOnlineTime]: any = useState(45);
    const [updateUserBookingTime] = useMutation(UPDATE_USER_BOOKING_TIME);
    const [showDatesModal, setShowDatesModal] = useState<boolean>(false);

    function handleBookingTimeUpdate(newOnline: number, newOffline: number) {
        updateUserBookingTime({
            variables: {
                id: auth.userid,
                booking_Online_time: newOnline,
                booking_Offline_time: newOffline
            }
        });
    }

    return (
        <>
            <div className="mb-3">
                <span style={{ fontSize: '30px' }}>
                    <Link to="/schedule">
                        <i className="fa fa-arrow-circle-left" style={{ color: 'black' }}></i>
                    </Link>
                    <b> Availability</b>
                </span>
            </div>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <WorkHours />
                </Card.Body>
            </Card>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body className="mt-2">
                    <Row className="mt-1" style={{ textAlign: 'start' }}>
                        <Col lg={12}>
                            <span
                                style={{ fontSize: '21px', display: 'flex', alignItems: 'center' }}
                            >
                                <b>Booking Lead Time</b>
                                <span style={{ marginLeft: 'auto' }}>
                                    <Button
                                        variant="outline-dark"
                                        onClick={() => {
                                            setShowDatesModal(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </span>
                            </span>
                            <br />
                            <div className="mt-0">
                                Slots will be only shown after the lead time, For examples if the
                                online session starts 6:00 pm, and the lead time is 15 mins. So
                                users can book only till 5:45 pm. Your users wont be able to book
                                after the lead time
                            </div>
                        </Col>
                    </Row>
                    <Row
                        className="mt-3"
                        style={{ textAlign: 'start', display: 'flex', justifyContent: 'center' }}
                    >
                        <Col lg={3}>
                            <span style={{ display: 'flex', justifyContent: 'center' }}>
                                <span
                                    style={{
                                        height: '10px',
                                        width: '10px',
                                        backgroundColor: '#339B31',
                                        borderRadius: '50%',
                                        marginTop: '8px',
                                        marginRight: '5px'
                                    }}
                                ></span>
                                Online Mode
                            </span>
                            <div>
                                <Form.Control
                                    as="select"
                                    onChange={(e) => {
                                        setUserOnlineTime(e.target.value);
                                    }}
                                    className="p-2 shadow-sm mt-2"
                                    style={{
                                        backgroundColor: 'whitesmoke',
                                        borderRadius: '10px',
                                        border: '1px solid gray',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <option value={45}>45 min</option>
                                    <option value={90}>90 min</option>
                                    <option value={120}>120 min</option>
                                    <option value={180}>180 min</option>
                                </Form.Control>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <span style={{ display: 'flex', justifyContent: 'center' }}>
                                <span
                                    style={{
                                        height: '10px',
                                        width: '10px',
                                        backgroundColor: '#D33325',
                                        borderRadius: '50%',
                                        marginTop: '8px',
                                        marginRight: '5px'
                                    }}
                                ></span>
                                Offline Mode
                            </span>

                            <div>
                                <Form.Control
                                    as="select"
                                    onChange={(e) => {
                                        setUserOfflineTime(e.target.value);
                                    }}
                                    className="p-2 shadow-sm mt-2"
                                    style={{
                                        backgroundColor: 'whitesmoke',
                                        borderRadius: '10px',
                                        border: '1px solid gray',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <option value={45}>45 min</option>
                                    <option value={90}>90 min</option>
                                    <option value={120}>120 min</option>
                                    <option value={180}>180 min</option>
                                </Form.Control>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={showDatesModal}
                centered
            >
                <Modal.Header
                    closeButton
                    onHide={() => {
                        setShowDatesModal(false);
                    }}
                >
                    <Modal.Title id="contained-modal-title-vcenter">Booking Time</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <h4>
                            <b>Client can book session time prior to?</b>
                        </h4>
                        <Form.Group>
                            <label>Online Mode</label>
                            <div>
                                <Form.Control
                                    as="select"
                                    onChange={(e) => {
                                        setUserOnlineTime(e.target.value);
                                    }}
                                >
                                    <option value={45}>45 min</option>
                                    <option value={90}>90 min</option>
                                    <option value={120}>120 min</option>
                                    <option value={180}>180 min</option>
                                </Form.Control>
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <label>Offline Mode</label>
                            <div>
                                <Form.Control
                                    as="select"
                                    onChange={(e) => {
                                        setUserOfflineTime(e.target.value);
                                    }}
                                >
                                    <option value={45}>45 min</option>
                                    <option value={90}>90 min</option>
                                    <option value={120}>120 min</option>
                                    <option value={180}>180 min</option>
                                </Form.Control>
                            </div>
                        </Form.Group>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setShowDatesModal(false);
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => {
                            handleBookingTimeUpdate(
                                parseInt(userOnlineTime),
                                parseInt(userOfflineTime)
                            );
                            setShowDatesModal(false);
                        }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Availability;
