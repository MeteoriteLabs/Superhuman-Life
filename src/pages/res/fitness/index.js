import { Card, CardColumns, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Bread from "../../../components/bread";

export default function ResFitnessPage() {
    return (
        <>
            <Row>
                <Col lg="2">
                    <h4>Fitness</h4>
                </Col>
                <Col lg="3">
                    <Link className="btn btn-info btn-sm" to="/resources/fitness/add">
                        Add Exercise
                    </Link>
                </Col>
                <Col>
                    <Bread mod="Resources" page="Fitness" />
                </Col>
            </Row>
            <CardColumns>
                <Card>
                    <Card.Img variant="top" src="/assets/exercise-1.jpg" />
                    <Card.Body>
                        <Card.Title>Exercise Name</Card.Title>
                        <Card.Subtitle className="text-muted">Lorem Ipsum</Card.Subtitle>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src="/assets/exercise-1.jpg" />
                    <Card.Body>
                        <Card.Title>Exercise Name</Card.Title>
                        <Card.Subtitle className="text-muted">Lorem Ipsum</Card.Subtitle>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src="/assets/exercise-1.jpg" />
                    <Card.Body>
                        <Card.Title>Exercise Name</Card.Title>
                        <Card.Subtitle className="text-muted">Lorem Ipsum</Card.Subtitle>
                    </Card.Body>
                </Card>
            </CardColumns>
        </>
    );
}
