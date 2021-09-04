import { useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, ProgressBar, Row } from "react-bootstrap";
import _ from "lodash"


export default function ModalView({ name, formUISchema, formSubmit, formSchema, formData, isStepper, userData, setUserData, widgets, setRender, fitness_package_type, PTProps, actionType, pricingDetailRef, classicProps, groupProps, customProps }: any) {


export default function ModalView({ name, formUISchema, formSubmit, formSchema, formData, isStepper, widgets, modalTrigger }: any) {

    const registry = utils.getDefaultRegistry();
    const defaultFileWidget = registry.widgets["FileWidget"];
    (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;

    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);

    const [show, setShow] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<any>(formData);
    const stepper: string[] = ["Creator", "Details", "Program", "Schedule", "Pricing"];
    
    modalTrigger.subscribe((res: boolean) => {
        setShow(res);
    });
    

    function submitHandler(formData: any) {

        const updateFinesspackagepricing = updatePrice(formData, actionType);


        const updateMode = updateModeName(formData)
        const updateDuration = updateFormDuration(formData)

        if (isStepper && step < 6) {
            const update = updateInputValue(formData)

            setStep(step + 1);
            setFormValues({ ...formValues, ...update, fitness_package_type, fitnesspackagepricing: updateFinesspackagepricing, duration: updateDuration });
            setUserData({ ...formValues, ...update, fitness_package_type, fitnesspackagepricing: updateFinesspackagepricing, duration: updateDuration })


        } else {
            if (typeof formData.disciplines !== "object") {
                formData.disciplines = JSON.parse(formData.disciplines).map(item => item.id)
            }
            formData = { ...formData, fitnesspackagepricing: updateFinesspackagepricing, mode: updateMode }
            formSubmit(formData);

            actionType === "view" && setRender(false)

        }
    }

    const handleSubmitName = (actionType: string) => {
        let action = ''
        switch (actionType) {
            case 'create':
                action = "Create"
                break

            case 'edit':
                action = "Update"
                break

            case 'view':
                action = "Looks Good"
                break
        }
        return action
    }


    return (
        <>
            <Modal size="xl" show={show} onHide={() => setShow(false)} centered >
                <Modal.Header closeButton onClick={() => setRender(false)}>
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
                                    disabled={actionType === "view" ? true : false}
                                    uiSchema={formUISchema}
                                    schema={formSchema[step.toString()]}
                                    ref={formRef}
                                    onSubmit={({ formData }: any) => submitHandler(formData)}
                                    formData={formValues}

                                    widgets={widgets}

                                >
                                    <div></div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {isStepper &&
                        <>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => {
                                    setStep(step - 1);
                                    if (step === 4) {
                                        if (actionType === "create") {
                                            resetClassesValue(userData)
                                        }
                                    }
                                }}
                                disabled={step === 1 ? true : false}
                            >
                                <i className="mr-2 fas fa-arrow-left"></i>
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={(event) => { formRef.current.onSubmit(event) }}
                            >
                                {(step < 6)
                                    ? <>Next<i className="ml-4 fas fa-arrow-right"></i></>
                                    :
                                    <>
                                        {handleSubmitName(actionType)}
                                        <i className="ml-4 fas fa-check"></i>
                                    </>
                                }
                            </Button>
                        </>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}