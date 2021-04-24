import { useRef, useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Button, Card, Col, Container, Modal, ProgressBar, Row } from "react-bootstrap";

export default function ModalView({ name, formUISchema, formSubmit, formSchema, formData }) {
    const formRef = useRef();
    const [now, setNow] = useState([0, 0, 0, 0]);
    const [step, setStep] = useState(1);
    const [show, setShow] = useState(false);
    const [formValues, setFormValues] = useState(formData);

    function submitHandler(formData) {
        if (step < 5) {
            let temp = [...now];
            console.log("Data submitted: ", formData);
            setStep(step + 1);
            temp[step - 1] = 1;
            setNow(temp);
            setFormValues({ ...formValues, ...formData });
        } else {
            formSubmit(formValues);
        }
    }

    return (
        <>
            <Button variant="secondary" size="sm" onClick={() => setShow(true)}>
                <i className="fas fa-plus-circle"></i>{" "}{name}
            </Button>
            <Modal size="lg" show={show} scrollable={true} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create {name} Package</Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    <Container>
                        <Row noGutters>
                            <Col xs={3} md={3} lg={3}>
                                <ProgressBar max={1} now={now[0]} />
                                <small className="text-muted">1. Creator</small>
                            </Col>
                            <Col xs={3} md={3} lg={3}>
                                <ProgressBar max={1} now={now[1]} />
                                <small className="text-muted">2. Details</small>
                            </Col>
                            <Col xs={3} md={3} lg={3}>
                                <ProgressBar max={1} now={now[2]} />
                                <small className="text-muted">3. Program</small>
                            </Col>
                            <Col xs={3} md={3} lg={3}>
                                <ProgressBar max={1} now={now[3]} />
                                <small className="text-muted">4. Pricing</small>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md={8} lg={8} className="border-right">
                                <Form
                                    uiSchema={formUISchema}
                                    schema={formSchema[step.toString()]}
                                    ref={formRef}
                                    onSubmit={({ formData }) => submitHandler(formData)}
                                    formData={formValues}
                                >
                                    <div></div>
                                </Form>
                            </Col>
                            <Col md={4} lg={4}>
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
                        disabled={step === 1 ? true : false}
                    >
                        Back
                    </Button>
                    <Button variant="primary" onClick={(event) => formRef.current.onSubmit(event)}>
                        {step < 5 ? "Next" : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}