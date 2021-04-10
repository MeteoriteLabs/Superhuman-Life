import { useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Button, Card, CardColumns, Modal } from "react-bootstrap";
import Bread from "../../../components/bread";
import fitness from "./fitness.json";

export default function ResFitnessPage() {
    const [show, setShow] = useState(false);

    return (
        <>
            <h4>Fitness</h4>
            <Bread mod="Resources" page="Fitness" />
            <Button variant="primary" onClick={() => setShow(true)} className="mb-3">
                Add Exercise
            </Button>

            <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
                <Modal.Body>
                    <Form schema={fitness} onSubmit={({ formData }) => console.log("Data submitted: ", formData)} />
                </Modal.Body>
            </Modal>
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
