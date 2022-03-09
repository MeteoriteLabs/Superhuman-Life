import { useRef, useState } from "react";
import { withTheme } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Carousel, Col, Container, Modal, ProgressBar, Row } from "react-bootstrap";
import SocialLogin from "./SocialLogin";
import ChangeMakerSelect from '../../components/customWidgets/changeMakerList';
import LanguageSelect from '../../components/customWidgets/languagesList';
import OrganizationSelect from '../../components/customWidgets/organizationTypeList';
import LocationForm from './Location';

export default function Register() {
    const registerSchema: any = require("./register.json");
    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const carouselRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);
    const [formValues, setFormValues] = useState<any>({});
    const uiSchema: any = {
        "password": {
            "ui:widget": "password",
            "ui:help": "Hint: Make it strong! minimum password length should be 8."
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
        "changemaker" : {
            "specialist": {
                "ui:widget": (props) => {
                    return <ChangeMakerSelect {...props} />
                }
            },
        },
        "language": {
            "ui:widget": (props) => {
                return <LanguageSelect {...props} />
            }
        },
        "education": {
            "ui:options": {
                "orderable": false
            },
            "items": {
              "ui:emptyValue": "",
              "ui:placeholder": "e.g. Masters in Yoga Therapy",
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
        "aboutMe": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "multipleChoicesList": {
            "ui:widget": "checkboxes"
        },
        "organization": {
            "ui:widget": "radio",
        },
        "organizationType": {
            "ui:widget": (props) => {
                return <OrganizationSelect {...props} />
            }
        },
        "location": {
            "ui:widget": (props) => {
                return <LocationForm {...props} />
            }
        },
        "challenge": {
            "ui:widget": "textarea",
            "ui:placeholder": "Try to explain the challenges you are facing (if any)",
            "ui:options": {
                "rows": 3
            }
        },
        "aboutOrganization": {
            "ui:widget": "textarea",
            "ui:placeholder": "Anything that you want us to know!",
            "ui:options": {
                "rows": 3
            }
        },
        "socialLogins": {
            "ui:widget": (props) => {
                return <SocialLogin {...props} />
            }
        }
    }

    function submitHandler(formData: any) {
        if (step < 4) {
            // console.log("Data submitted: ", formData);
            setStep(step + 1);
            carouselRef.current.next();
            setFormValues({ ...formValues, ...formData });
        } else {
            console.log("Values submitted: " + JSON.stringify(formValues, null, 2));
        }
    }

    function validate(formData, errors) {
        if (formData.password !== formData.confirm) {
            errors.confirm.addError("Passwords don't match");
        }
        return errors;
    }

    return (
        <Row noGutters>
            {/* <Helmet>
                <meta charSet="utf-8" />
                <title>Sapien Dashboard | Register</title>
                <link rel="canonical" href="https://sapien.systems/" />
            </Helmet> */}
            <Col>
                <Container>
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
                    <Modal.Dialog scrollable>
                        <Modal.Body className="bg-light">
                            <Form
                                uiSchema={uiSchema}
                                schema={registerSchema[step]}
                                ref={formRef}
                                validate={validate}
                                onSubmit={({ formData }: any) => submitHandler(formData)}
                                formData={formValues}
                            >
                                <div></div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="bg-light">
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => {
                                    setStep(step - 1);
                                    carouselRef.current.prev();
                                }}
                                disabled={step === 1 ? true : false}
                            >
                                <i className="mr-2 fas fa-arrow-left"></i>
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={(event) => formRef.current.onSubmit(event)}
                            >
                                {(step < 4)
                                    ? <>Next<i className="ml-4 fas fa-arrow-right"></i></>
                                    : <>Complete<i className="ml-4 fas fa-check"></i></>
                                }
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Container>
            </Col>
            <Col className="d-none d-lg-block">
                <Carousel ref={carouselRef} interval={600000} indicators={false} fade={true} controls={false}>
                    <Carousel.Item>
                        <img
                            src="/assets/step-1.svg"
                            // style={{ height: "90vh" }}
                            height="700px"
                            className="d-block w-100"
                            alt="sapien-exercise"
                        />
                        {/* <Carousel.Caption>
                            <h3>Get Early Access</h3>
                            <p>
                                You will be able to try the BETA, get our constant support and
                                guidance on your journey.
                            </p>
                            <p className="text-white blockquote-footer">No String Attached</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            src="/assets/step-2.svg"
                            // style={{ height: "90vh" }}
                            height="700px"
                            className="d-block w-100"
                            alt="sapien-exercise"
                        />
                        {/* <Carousel.Caption>
                            <h3>Embark on your journey</h3>
                            <p>In a gentle way, you can shake the world.</p>
                            <p className="text-white blockquote-footer">Mahatma Gandhi</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            src="/assets/step-3.svg"
                            // style={{ height: "90vh" }}
                            height="700px"
                            className="d-block w-100"
                            alt="sapien-exercise"
                        />
                        {/* <Carousel.Caption>
                            <h3>We got your back</h3>
                            <p>
                                The greatest glory in living lies not in never falling,
                                but in rising every time we fall.
                            </p>
                            <p className="text-white blockquote-footer">Nelson Mandela</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            src="/assets/step-4.svg"
                            // style={{ height: "90vh" }}
                            height="700px"
                            className="d-block w-100"
                            alt="sapien-exercise"
                        />
                        {/* <Carousel.Caption>
                            <h3>#BeAChangemaker</h3>
                            <p>You must be the change you wish to see in the world.</p>
                            <p className="text-white blockquote-footer">Mahatma Gandhi</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                </Carousel>
            </Col>
        </Row>
    );
}
