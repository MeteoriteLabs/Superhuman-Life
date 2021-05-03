import { Card, CardColumns } from "react-bootstrap";
import Bread from "../../../components/bread";

export default function ResFitnessPage() {
    return (
        <>
            <h4>Fitness</h4>
            <Bread mod="Resources" page="Fitness" />
            <CardColumns>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/assets/exercise-1.jpg" />
                    <Card.Body>
                        <Card.Title>Exercise Name</Card.Title>
                        <Card.Subtitle className="text-muted">Lorem Ipsum</Card.Subtitle>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/assets/exercise-1.jpg" />
                    <Card.Body>
                        <Card.Title>Exercise Name</Card.Title>
                        <Card.Subtitle className="text-muted">Lorem Ipsum</Card.Subtitle>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/assets/exercise-1.jpg" />
                    <Card.Body>
                        <Card.Title>Exercise Name</Card.Title>
                        <Card.Subtitle className="text-muted">Lorem Ipsum</Card.Subtitle>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/assets/exercise-1.jpg" />
                    <Card.Body>
                        <Card.Title>Exercise Name</Card.Title>
                        <Card.Subtitle className="text-muted">Lorem Ipsum</Card.Subtitle>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/assets/exercise-1.jpg" />
                    <Card.Body>
                        <Card.Title>Exercise Name</Card.Title>
                        <Card.Subtitle className="text-muted">Lorem Ipsum</Card.Subtitle>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
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
