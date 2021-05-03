import { Card, Col, Row } from "react-bootstrap";
import Bread from "../../../components/bread";

export default function KnowledgePage() {
    return (
        <>
            <Card.Title>Knowledge Bank</Card.Title>
            <Bread mod="Resources" page="Knowledge" />
            <div>
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg="4">
                                <Card.Img variant="top" src="/assets/article-1.jpeg" />
                            </Col>
                            <Col lg="8">
                                <Card.Title>Article Name</Card.Title>
                                <Card.Text className="text-muted">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Card.Text>
                                <Card.Text className="text-muted">
                                    <small>Last updated 3 mins ago</small>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg="4">
                                <Card.Img variant="top" src="/assets/article-1.jpeg" />
                            </Col>
                            <Col lg="8">
                                <Card.Title>Article Name</Card.Title>
                                <Card.Text className="text-muted">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Card.Text>
                                <Card.Text className="text-muted">
                                    <small>Last updated 3 mins ago</small>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}
