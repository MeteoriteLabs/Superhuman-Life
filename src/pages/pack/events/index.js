import { Badge, Card, Col, Row } from "react-bootstrap";
import Bread from "../../../components/bread";

export default function EventsPage() {
    return (
        <>
            <h4>Events</h4>
            <Bread mod="Packages" page="Events" />
            <div>
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg="4">
                                <Card.Img variant="top" src="/assets/event-1.jpeg" />
                            </Col>
                            <Col lg="8">
                                <Card.Title>Event 1</Card.Title>
                                <Card.Text className="text-muted">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Card.Text>
                                <Card.Text>
                                    <Badge variant="warning">Zumba</Badge>
                                    <Badge variant="success" className="ml-3">Online</Badge>
                                    <Badge variant="primary" className="float-right">
                                        Timings: 7:00 AM - 8:00 AM
                                    </Badge>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        Participants
                        <span className="float-right">Price: 1000 INR</span>
                    </Card.Footer>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg="4">
                                <Card.Img variant="top" src="/assets/event-1.jpeg" />
                            </Col>
                            <Col lg="8">
                                <Card.Title>Event 2</Card.Title>
                                <Card.Text className="text-muted">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Card.Text>
                                <Card.Text>
                                    <Badge variant="warning">Yoga</Badge>
                                    <Badge variant="success" className="ml-3">Offline</Badge>
                                    <Badge variant="primary" className="float-right">
                                        Timings: 9:00 AM - 11:00 AM
                                    </Badge>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        Participants
                        <span className="float-right">Price: 2000 INR</span>
                    </Card.Footer>
                </Card>
            </div>
        </>
    );
}
