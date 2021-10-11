import { useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, ProgressBar, Row } from "react-bootstrap";

export default function SessionModal({ name, formUISchema, formSubmit, formSchema, formData, isStepper, widgets, stepperValues, modalTrigger }: any) {

    const registry = utils.getDefaultRegistry();
    const defaultFileWidget = registry.widgets["FileWidget"];
    (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;

    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);
    const [formValues, setFormValues] = useState<any>(formData);
    const stepper: string[] = stepperValues;
    const [show, setShow] = useState<boolean>(false);

    modalTrigger.subscribe((res: boolean) => {
        setShow(res);
    });


    function submitHandler(formData: any) {


        if (isStepper && step < 2) {
            // console.log("Data submitted: ", formData);
            setStep(step + 1);
            setFormValues({ ...formValues, ...formData });
        } else {
            formSubmit(formData);
        }
    }



    return (
        <>
            <Modal size="xl" show={show} onHide={() => setShow(false)} centered  >
                <Modal.Header closeButton>
                    <Modal.Title as={Row}>
                        <Col xs={12} md={12} lg={12}>
                            <p className="lead">{name}</p>
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
                        <Col lg={12}>
                            <div style={{ height: '400px', overflowX: 'hidden', overflowY: 'auto' }}>
                                <Form
                                    uiSchema={formUISchema}
                                    schema={formSchema[step.toString()]}
                                    ref={formRef}
                                    onSubmit={({ formData }: any) => submitHandler(formData)}
                                    formData={formData}
                                    widgets={widgets}
                                >
                                    <div></div>
                                </Form>
                            </div>
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
                                {(step < 2)
                                    ? <>Next<i className="ml-4 fas fa-arrow-right"></i></>
                                    : <>Create<i className="ml-4 fas fa-check"></i></>
                                }
                            </Button>
                        </> :
                        <>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>  modalTrigger.next(false)}
                                className={name === 'View' ? "d-none" : ""}
                            >
                                Close
                            </Button>
                            <Button
                                variant="success"
                                size="sm"
                                onClick={(event) => { formRef.current.onSubmit(event) }}
                            >
                                {name === 'View' ? "Close" : "Submit"}
                            </Button>

                        </>


                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}