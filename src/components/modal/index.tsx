import { Fragment, useEffect, useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, ProgressBar, Row } from "react-bootstrap";
import _ from "lodash"


export default function ModalView({ name, formUISchema, formSubmit, formSchema, formData, isStepper, userData, setUserData, widgets, setRender, fitness_package_type, PTProps, actionType, pricingDetailRef, classicProps }: any) {

    const registry = utils.getDefaultRegistry();
    const defaultFileWidget = registry.widgets["FileWidget"];
    (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;

    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);
    const [show, setShow] = useState<boolean>(true);

    const [formValues, setFormValues] = useState<any>(formData);
    const stepper: string[] = ["Creator", "Details", "Program", "Schedule", "Pricing", "Preview"];





    const updatePrice = (formData, actionType) => {
        console.log(formData)
        let updateFinesspackagepricing: any = ''
        if (pricingDetailRef.current.getFitnessPackagePricing?.()) {
            console.log(pricingDetailRef.current.getFitnessPackagePricing?.())
            updateFinesspackagepricing = pricingDetailRef.current.getFitnessPackagePricing?.();

            if (formData.fitness_package_type === "60e045867df648b0f5756c32" || formData.mode === "Workout") {
                updateFinesspackagepricing = updateFinesspackagepricing.slice(0, 1)
            }
        }

        if (actionType === "edit") {
            console.log(formData)
            if (formData) {
                updateFinesspackagepricing = _.cloneDeep(formData?.fitnesspackagepricing);
                if (pricingDetailRef.current.getFitnessPackagePricing?.()) {
                    updateFinesspackagepricing[0].packagepricing = pricingDetailRef.current.getFitnessPackagePricing?.();
                    delete updateFinesspackagepricing[0].__typename;
                    console.log(updateFinesspackagepricing)
                    // updateFinesspackagepricing = updateFinesspackagepricing[0]

                    // if (fitness_package_type === "60e045867df648b0f5756c32") {
                    //     updateFinesspackagepricing.packagepricing[0].duration = userData.duration
                    //     console.log(updateFinesspackagepricing)
                    // }
                }

            }
            // else {
            //     updateFinesspackagepricing = pricingDetailRef.current.getFitnessPackagePricing?.();
            // }
        }

        console.log(updateFinesspackagepricing)
        return updateFinesspackagepricing
    }

    // const updateTimeDuration = (formData) => {
    //     let updateFinesspackagepricing: any = '';
    //     console.log(pricingDetailRef.current.getFitnessPackagePricing?.())
    //     if (formData) {
    //         updateFinesspackagepricing = _.cloneDeep(formData?.fitnesspackagepricing);
    //         if (pricingDetailRef.current.getFitnessPackagePricing?.()) {
    //             updateFinesspackagepricing = pricingDetailRef.current.getFitnessPackagePricing?.();
    //             console.log(updateFinesspackagepricing)
    //             if (fitness_package_type === "60e045867df648b0f5756c32") {
    //                 updateFinesspackagepricing[0].duration = formData.duration
    //                 console.log(updateFinesspackagepricing)
    //             }
    //         }
    //     }
    // }

    const resetClassesValue = (userData) => {
        let { ptonline, ptoffline, restdays, grouponline, groupoffline, recordedclasses, duration, mode } = userData;

        PTProps.properties.ptonlineClasses.value = "";
        PTProps.properties.ptofflineClasses.value = "";
        PTProps.properties.restDay.value = "";
        PTProps.properties.dayAvailable.value = mode === "Workout" ? 1 : 30;
        PTProps.properties.duration.value = mode === "Workout" ? 1 : 30;
        PTProps.properties.duration.default = mode === "Workout" ? 1 : 30;
        classicProps.properties.duration.default = 30;
        ptoffline = 0;
        ptonline = 0;
        grouponline = 0;
        groupoffline = 0;
        recordedclasses = 0;
        restdays = 0;
        duration = mode === "Workout" ? 1 : 30;
        setUserData({ ...userData, ptoffline, ptonline, grouponline, groupoffline, recordedclasses, duration, restdays })
        setFormValues({ ...formValues, ptoffline, ptonline, grouponline, groupoffline, recordedclasses, duration, restdays })
    }

    function submitHandler(formData: any, userData) {

        const updateFinesspackagepricing = updatePrice(formData, actionType);
        // const updateDuration = updateTimeDuration(formData)
        // console.log(updateFinesspackagepricing.slice(0, 1))
        if (isStepper && step < 6) {
            setStep(step + 1);
            setFormValues({ ...formValues, ...formData, fitness_package_type, fitnesspackagepricing: updateFinesspackagepricing });
            setUserData({ ...formValues, ...formData, fitness_package_type, fitnesspackagepricing: updateFinesspackagepricing })
            console.log('formData before submit', formData);
            // console.log('formValues', formValues)
            console.log("userData", userData);
        } else {
            if (typeof formData.disciplines !== "object") {
                formData.disciplines = JSON.parse(formData.disciplines).map(item => item.id)
            }
            formData = { ...formData, fitnesspackagepricing: updateFinesspackagepricing }
            formSubmit(formData);
            // console.log("userData", userData)
            actionType === "view" && setRender(false)
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
                                    onSubmit={({ formData }: any) => submitHandler(formData, userData)}
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
                                onClick={(event) => {

                                    formRef.current.onSubmit(event)
                                }}
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