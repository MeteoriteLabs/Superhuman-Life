import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { withTheme } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, ProgressBar, Row } from "react-bootstrap";

export default function Register() {
    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);
    const [formValues, setFormValues] = useState<any>({});
    const registerSchema: any = require("./register.json");
    const subtitles = [
        " Take a moment to fill in the details",
        " Fill your qualification details",
        " Tell us more about yourself"
    ];
    const uiSchema: any = {
        "password": {
            "ui:widget": "password",
            "ui:help": "Hint: Make it strong!"
        },
        "confirm": {
            "ui:widget": "password"
        },
        "gender": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "contact": {
            "ui:options": {
                "inputType": "tel"
            }
        },
        "specification": {
            "ui:placeholder": "e.g. Yoga Trainer or General Physician"
        },
        "education": {
            "ui:placeholder": "e.g. Masters in Yoga Therapy"
        },
        "about": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "challenge": {
            "ui:widget": "textarea",
            "ui:placeholder": "Try to explain the challenges you are facing (if any)",
            "ui:options": {
                "rows": 3
            }
        },
        "message": {
            "ui:widget": "textarea",
            "ui:placeholder": "Anything that you want us to know!",
            "ui:options": {
                "rows": 3
            }
        }
    }

    function submitHandler(formData: any) {
        if (step < 3) {
            console.log("Data submitted: ", formData);
            setStep(step + 1);
            setFormValues({ ...formValues, ...formData });
        } else {
            console.log("Values submitted: " + JSON.stringify(formValues, null, 2));
        }
    }

    return (
        <Modal.Dialog size="xl" scrollable={true}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Sapien Dashboard | Register</title>
                <link rel="canonical" href="https://sapien.systems/" />
            </Helmet>
            <Modal.Body className="show-grid">
                <Row noGutters>
                    <Col xs={12} md={8}>
                        <img src="/assets/exercise-1.jpg" alt="sapien-exercise" />
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col xs={3} md={3} lg={3}>
                                <ProgressBar
                                    max={1}
                                    now={step - 1}
                                    style={{ height: "5px" }}
                                    variant="danger"
                                />
                                <small className="text-muted">Step 1</small>
                            </Col>
                            <Col xs={3} md={3} lg={3}>
                                <ProgressBar
                                    max={1}
                                    now={step - 2}
                                    style={{ height: "5px" }}
                                    variant="danger"
                                />
                                <small className="text-muted">Step 2</small>
                            </Col>
                            <Col xs={3} md={3} lg={3}>
                                <ProgressBar
                                    max={1}
                                    now={step - 3}
                                    style={{ height: "5px" }}
                                    variant="danger"
                                />
                                <small className="text-muted">Step 3</small>
                            </Col>
                            <Col xs={3} md={3} lg={3}>
                                <ProgressBar
                                    max={1}
                                    now={step - 4}
                                    style={{ height: "5px" }}
                                    variant="danger"
                                />
                                <small className="text-muted">Step 4</small>
                            </Col>
                        </Row>
                        <h4 className="mt-5">Registration</h4>
                        <p className="text-danger blockquote-footer">{subtitles[step - 1]}</p>
                        <Form
                            uiSchema={uiSchema}
                            schema={registerSchema[step]}
                            ref={formRef}
                            onSubmit={({ formData }: any) => submitHandler(formData)}
                            formData={formValues}
                        >
                            <div></div>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
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
                    {(step < 3)
                        ? <>Next<i className="ml-4 fas fa-arrow-right"></i></>
                        : <>Complete<i className="ml-4 fas fa-check"></i></>
                    }
                </Button>
            </Modal.Footer>
        </Modal.Dialog>
    );
}
