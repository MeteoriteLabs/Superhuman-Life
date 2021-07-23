import { Fragment, useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, ProgressBar, Row } from "react-bootstrap";
import _ from "lodash"

export default function ModalView({ name, formUISchema, formSubmit, formSchema, formData, isStepper, userData, setUserData, fitnesspackagepricing, widgets, setRender, fitness_package_type, classesValidation, actionType, pricingDetailRef }: any) {

    const registry = utils.getDefaultRegistry();
    const defaultFileWidget = registry.widgets["FileWidget"];
    (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;

    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);
    const [show, setShow] = useState<boolean>(true);
    const [formValues, setFormValues] = useState<any>(formData);
    const stepper: string[] = ["Creator", "Details", "Program", "Schedule", "Pricing", "Preview"];

  




    const updatePrice = () => {
        let updateFinesspackagepricing: any = ''
        if (formData) {
            updateFinesspackagepricing = _.cloneDeep(formData?.fitnesspackagepricing);
            if (pricingDetailRef.current.getFitnessPackagePricing?.()) {
                updateFinesspackagepricing[0].packagepricing = pricingDetailRef.current.getFitnessPackagePricing?.();
                delete updateFinesspackagepricing[0].__typename;
                updateFinesspackagepricing = updateFinesspackagepricing[0]
            }
        } else {
            updateFinesspackagepricing = pricingDetailRef.current.getFitnessPackagePricing?.();
        }
        console.log(updateFinesspackagepricing)
        return updateFinesspackagepricing

    }


    function submitHandler(formData: any) {
        const updateFinesspackagepricing = updatePrice()
        if (isStepper && step < 6) {
            setStep(step + 1);
            setFormValues({ ...formValues, ...formData, fitness_package_type, fitnesspackagepricing: updateFinesspackagepricing });
            setUserData({ ...formValues, ...formData, fitness_package_type, fitnesspackagepricing: updateFinesspackagepricing })
            console.log('formData before submit', formValues);
            console.log("userData", userData);
        } else {
            if (typeof formData.disciplines !== "object") {
                formData.disciplines = JSON.parse(formData.disciplines).map(item => item.id)
            }
            formData = { ...formData, fitnesspackagepricing: updateFinesspackagepricing }
            formSubmit(formData);
            // console.log("userData", userData)
            console.log("Data submitted: ", formData);
        }
    }

    const handleFormConfirmationName = (actionType: string) => {
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
            {/* <Button variant={name === "Create New"?"outline-secondary":"light"}  size="sm" onClick={() => setShow(true)}>
                {name === "Create New"?<i className="fas fa-plus-circle"></i>:" "}{" "}{name}
            </Button> */}
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
                                    widget={widgets}
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
                                            const { properties } = classesValidation;
                                            let { ptonline, ptoffline, restdays } = userData;
                                            properties.onlineClasses.value = "";
                                            properties.offlineClasses.value = "";
                                            properties.restDay.value = "";
                                            ptoffline = 0;
                                            ptonline = 0;
                                            restdays = 0;
                                            setUserData({ ...userData, ptoffline, ptonline, restdays })
                                            setFormValues({ ...formValues, ptoffline, ptonline, restdays })
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
                                onClick={(event) => {
                                    actionType === "view" && setRender(false)
                                    formRef.current.onSubmit(event)
                                } }
                            >
                                {(step < 6)
                                    ? <>Next<i className="ml-4 fas fa-arrow-right"></i></>
                                    :
                                    <div className='d-flex align-items-center justify-content-center'>
                                        {handleFormConfirmationName(actionType)}
                                        <i className="ml-4 fas fa-check"></i>
                                    </div>

                                }
                            </Button>
                        </>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}