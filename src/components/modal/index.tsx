import { useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, ProgressBar, Row } from "react-bootstrap";
import _ from "lodash"

export default function ModalView({ name, formUISchema, formSubmit, formSchema, formData, isStepper,userData, setUserData, arrPlan,widgets }: any) {
    const registry = utils.getDefaultRegistry();
    const defaultFileWidget = registry.widgets["FileWidget"];
    (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;

    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);
    const [show, setShow] = useState<boolean>(true);
    const [formValues, setFormValues] = useState<any>(formData);
    const stepper: string[] = ["Creator", "Details", "Program", "Schedule", "Pricing", "Preview"];

  
    function submitHandler(formData: any) {
        if (isStepper && step < 6) {
            // console.log("Data submitted: ", formData);
            setStep(step + 1);
            setFormValues({ ...formValues, ...formData });
            setUserData({ ...formValues, ...formData })
        } else {
            if(typeof formData.discipline !== "object"){
                formData.discipline = JSON.parse(formData.discipline)
            }
            // Object.assign(formData, arrPrice)
            formData = {...formData, arrPlan}
            formSubmit(formData);
            // console.log("Data submitted: ", formData);
        }
    }


    return (
        <>
            {/* <Button variant={name === "Create New"?"outline-secondary":"light"}  size="sm" onClick={() => setShow(true)}>
                {name === "Create New"?<i className="fas fa-plus-circle"></i>:" "}{" "}{name}
            </Button> */}
            <Modal size="xl" show={show} onHide={() => setShow(false)} centered >
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
                                    formData={formValues}
                                    widget={widgets}
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
                                onClick={() =>{
                                    let {number_classes_offline, number_classes_online,number_of_rests} = userData
                                    setStep(step - 1);
                                    if(step === 4) {
                                        number_classes_offline = 0;
                                        number_classes_online = 0;
                                        number_of_rests = 0
                                        setUserData({...userData,number_classes_offline,number_classes_online,number_of_rests})
                                        setFormValues({...formValues,number_classes_offline,number_classes_online,number_of_rests})
                                    }
                             
                                    // console.log(`userData ${step}`, userData)
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
                                {(step < 6)
                                    ? <>Next<i className="ml-4 fas fa-arrow-right"></i></>
                                    : <>Create<i className="ml-4 fas fa-check"></i></>
                                }
                            </Button>
                        </> :
                        <>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => { setShow(false) }}
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