import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Bread from "../../../components/bread";

export default function JourneyPage() {
    return (
        <>
            <Row>
                <Col lg="3">
                    <h4>Custom Journey</h4>
                </Col>
                <Col lg="3">
                    <Link className="btn btn-info btn-sm" to="/packages/journey/add">
                        Create New
                    </Link>
                </Col>
                <Col>
                    <Bread mod="Packages" page="Journey" />
                </Col>
            </Row>
            <div className="pt-3">
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg="4">
                                <Card.Img variant="top" src="/assets/journey-1.jpeg" />
                            </Col>
                            <Col lg="8">
                                <Card.Title>Custom</Card.Title>
                                <Card.Text className="text-muted">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Card.Text>
                                <Card.Text>
                                    <Badge variant="warning">Zumba</Badge>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <Row>
                            <Col className="text-info">10 Onlilne</Col>
                            <Col className="text-danger">10 Offline</Col>
                            <Col className="text-secondary">5 Videos</Col>
                            <Col className="text-success">1000 INR</Col>
                        </Row>
                    </Card.Footer>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg="4">
                                <Card.Img variant="top" src="/assets/journey-1.jpeg" />
                            </Col>
                            <Col lg="8">
                                <Card.Title>Custom</Card.Title>
                                <Card.Text className="text-muted">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Card.Text>
                                <Card.Text>
                                    <Badge variant="warning">Yoga</Badge>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <Row>
                            <Col className="text-info">10 Onlilne</Col>
                            <Col className="text-danger">10 Offline</Col>
                            <Col className="text-secondary">5 Videos</Col>
                            <Col className="text-success">2000 INR</Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </div>
        </>
    );
}
