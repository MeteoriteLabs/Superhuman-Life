import { useRef, useState } from "react";
import { withTheme } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Card, Col, Modal, ProgressBar, Row } from "react-bootstrap";

export default function ModalView({ name, formUISchema, formSubmit, formSchema, formData, isStepper }: any) {
    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);
    const [show, setShow] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<any>(formData);
    const stepper: string[] = ["Creator", "Details", "Program", "Schedule", "Pricing"];

    function submitHandler(formData: any) {
        if (isStepper && step < 5) {
            console.log("Data submitted: ", formData);
            setStep(step + 1);
            setFormValues({ ...formValues, ...formData });
        } else {
            formSubmit(formValues);
        }
    }

    return (
        <>
            <Button variant="outline-secondary" size="sm" onClick={() => setShow(true)}>
                <i className="fas fa-plus-circle"></i>{" "}{name}
            </Button>
            <Modal size="xl" show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title as={Row}>
                        <Col xs={12} md={12} lg={12}>
                            <p className="lead">New {name} Package</p>
                        </Col>
                        {isStepper && stepper.map((item: string, id: number) => (
                            <Col xs={2} md={2} lg={2} key={id}>
                                <ProgressBar
                                    max={1}
                                    now={step - (id + 1)}
                                    style={{ height: '5px' }}
                                    variant="danger"
                                />
                                <small className="text-muted">{`${id + 1}. ${item}`}</small>
                            </Col>
                        ))}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid bg-light">
                    <Row>
                        <Col xs={6} md={6} lg={6}>
                            <div style={{ height: '400px', overflowX: 'hidden', overflowY: 'auto' }}>
                                <Form
                                    uiSchema={formUISchema}
                                    schema={formSchema[step.toString()]}
                                    ref={formRef}
                                    onSubmit={({ formData }: any) => submitHandler(formData)}
                                    formData={formValues}
                                >
                                    <div></div>
                                </Form>
                            </div>
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                            <Card className="shadow-sm" border="light">
                                <Card.Body>This is some text for card preview.</Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {isStepper ?
                        <>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => setStep(step - 1)}
                                disabled={step === 1 ? true : false}
                            >
                                <i className="mr-2 fas fa-arrow-left"></i>
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={(event) => formRef.current.onSubmit(event)}
                            >
                                {(step < 5)
                                    ? <>Next<i className="ml-4 fas fa-arrow-right"></i></>
                                    : <>Create<i className="ml-4 fas fa-check"></i></>
                                }
                            </Button>
                        </> :
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={(event) => formRef.current.onSubmit(event)}
                        >
                            Submit<i className="ml-4 fas fa-arrow-right"></i>
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}