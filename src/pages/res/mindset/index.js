import { Badge, Card, Col, Row } from "react-bootstrap";
import Bread from "../../../components/bread";

export default function MindsetPage() {
    return (
        <>
            <h4>Mental Wellbeing</h4>
            <Bread mod="Resources" page="Mindset" />
            <div>
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg="4">
                                <Card.Img variant="top" src="/assets/podcast-1.jpeg" />
                            </Col>
                            <Col lg="8">
                                <Card.Title>Podcast Name</Card.Title>
                                <Card.Text className="text-muted">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Card.Text>
                                <Card.Text>
                                    <Badge variant="secondary" className="mr-3">Mindfulness</Badge>
                                    <Badge variant="secondary">Calmness</Badge>
                                </Card.Text>
                                <Card.Text>
                                    <small>Episode Details</small>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg="4">
                                <Card.Img variant="top" src="/assets/podcast-1.jpeg" />
                            </Col>
                            <Col lg="8">
                                <Card.Title>Podcast Name</Card.Title>
                                <Card.Text className="text-muted">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Card.Text>
                                <Card.Text>
                                    <Badge variant="secondary" className="mr-3">Mindfulness</Badge>
                                    <Badge variant="secondary">Calmness</Badge>
                                </Card.Text>
                                <Card.Text>
                                    <small>Episode Details</small>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}
