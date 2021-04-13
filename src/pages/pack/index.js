import { useMemo, useRef, useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Badge, Button, Card, Container, Col, Modal, ProgressBar, Row } from "react-bootstrap";
import Table from "../../components/table";
import step1 from "./creator.json";
import step2 from "./details.json";
import step3 from "./program.json";
import step4 from "./schedule.json";
import step5 from "./pricing.json";

export default function PackagePage() {
    const steps = [step1, step2, step3, step4, step5];
    const [step, setStep] = useState(0);
    const [show, setShow] = useState(false);
    const [now, setNow] = useState(0);
    const [formValues, setFormValues] = useState({});
    const formRef = useRef();
    const columns = useMemo(() => [
        { accessor: "id", Header: "#" },
        {
            accessor: "image",
            Header: "",
            Cell: v => <img src={v.value} height="32" alt="thumbnail" />
        },
        { accessor: "name", Header: "Name" },
        { accessor: "type", Header: "Type" },
        { accessor: "mode", Header: "Mode" },
        { accessor: "clients", Header: "Clients" },
        { accessor: "program", Header: "Program" },
        {
            accessor: "status",
            Header: "Status",
            Cell: v => <Badge variant="success">{v.value}</Badge>
        },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }) => (
                <Button variant="white">
                    <i className="far fa-edit"></i>
                </Button>
            ),
        }
    ], []);
    const data = useMemo(() => [
        {
            "id": 1,
            "image": "/assets/recipe-1.jpg",
            "name": "Nutrition",
            "type": "Recipe",
            "mode": "Online",
            "clients": "",
            "program": "",
            "status": "Active"
        },
        {
            "id": 2,
            "image": "/assets/exercise-1.jpg",
            "name": "Fitness",
            "type": "Classic",
            "mode": "Offline",
            "clients": "",
            "program": "",
            "status": "Active"
        }
    ], []);

    function onSubmit({ formData }) {
        if (step < 4) {
            console.log("Data submitted: ", formData);
            setStep(step + 1);
            setNow(now + 20);
            setFormValues({ ...formValues, ...formData });
        } else {
            alert("Values submitted: " + JSON.stringify(formValues, null, 2));
        }
    }

    return (
        <Card>
            <Card.Header>
                <h4 className="float-left">Packages</h4>
                <Button className="float-right" onClick={() => setShow(true)}>
                    <i className="fas fa-plus-circle mr-sm-2"></i>
                    Package
                </Button>
                <Modal size="xl" show={show} scrollable={true} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Package</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid">
                        <Container>
                            <Row>
                                <Col xs={6} md={6} lg={6} className="border-right">
                                    <Form
                                        schema={steps[step]}
                                        ref={formRef}
                                        onSubmit={({ formData }) => onSubmit(formData)}
                                    >
                                        <div></div>
                                    </Form>
                                </Col>
                                <Col xs={6} md={6} lg={6}>
                                    <ProgressBar now={now} />
                                    <Row>
                                        <Col xs={2} md={2} lg={2}>
                                            <small>1. Creator</small>
                                        </Col>
                                        <Col xs={2} md={2} lg={2}>
                                            <small>2. Details</small>
                                        </Col>
                                        <Col xs={3} md={3} lg={3}>
                                            <small>3. Program</small>
                                        </Col>
                                        <Col xs={3} md={3} lg={3}>
                                            <small>4. Schedule</small>
                                        </Col>
                                        <Col xs={2} md={2} lg={2}>
                                            <small>5. Pricing</small>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Card>
                                        <Card.Body>This is some text for card preview.</Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setStep(step - 1);
                                setNow(now - 20);
                            }}
                            disabled={step === 0 ? true : false}
                        >
                            Back
                        </Button>
                        <Button variant="primary" onClick={(event) => formRef.current.onSubmit(event)}>
                            {step < 4 ? "Next" : "Create"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Header>
            <Card.Body>
                <Table columns={columns} data={data} />
            </Card.Body>
        </Card>
    );
}
