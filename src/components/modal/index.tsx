import { useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, ProgressBar, Row } from "react-bootstrap";
import _ from "lodash"


export default function ModalView({ name, formUISchema, formSubmit, formSchema, formData, isStepper, userData, setUserData, widgets, setRender, fitness_package_type, PTProps, actionType, pricingDetailRef, classicProps, groupProps, customProps }: any) {

    const registry = utils.getDefaultRegistry();
    const defaultFileWidget = registry.widgets["FileWidget"];
    (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;

    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [step, setStep] = useState<number>(1);
    const [show, setShow] = useState<boolean>(true);

    const [formValues, setFormValues] = useState<any>(formData);
    const stepper: string[] = ["Creator", "Details", "Program", "Schedule", "Pricing", "Preview"];





    const updatePrice = (formData: { fitness_package_type: string; mode: string; fitnesspackagepricing: { duration: number; voucher: string; mrp: number }; }, actionType: string) => {

        let updateFinesspackagepricing: any = ''
        if (pricingDetailRef.current.getFitnessPackagePricing?.()) {

            updateFinesspackagepricing = pricingDetailRef.current.getFitnessPackagePricing?.();

            if (formData.fitness_package_type === "60e045867df648b0f5756c32" || formData.mode === "Online Workout" || formData.mode === "Offline Workout") {
                updateFinesspackagepricing = updateFinesspackagepricing.slice(0, 1)
            }
        }

        if (actionType === "edit") {

            if (formData) {
                updateFinesspackagepricing = _.cloneDeep(formData?.fitnesspackagepricing);
                if (pricingDetailRef.current.getFitnessPackagePricing?.()) {
                    updateFinesspackagepricing[0].packagepricing = pricingDetailRef.current.getFitnessPackagePricing?.();
                    delete updateFinesspackagepricing[0].__typename;

                }
            }
        }

        return updateFinesspackagepricing
    }


    const updateModeName = (formData: { mode: string; }) => {
        let { mode } = formData;

        if (formData.mode) {
            if (mode === "Online Workout") {
                mode = "Online_workout"
            } else if (mode === "Offline Workout") {
                mode = "Offline_workout"
            }
        }
        return mode
    }


    const updateFormDuration = (formData: { mode: "Online Workout" | "Offline Workout"; duration?: number; }) => {
        let { duration, mode } = formData;
        if (formData.mode) {
            if (mode === "Online Workout" || mode === "Offline Workout") {
                duration = 1
            } else {
                duration = 30
            }
        }
        return duration
    }




    const resetClassesValue = (userData: { ptonline: number; ptoffline: number; grouponline: number; groupoffline: number; recordedclasses: number; duration: number; mode: string; fitness_package_type: string; restdays: number; }) => {
        let { ptonline, ptoffline, grouponline, groupoffline, recordedclasses, duration, mode, fitness_package_type, restdays } = userData;

        PTProps.properties.ptonlineClasses.value = ptonline;
        PTProps.properties.ptofflineClasses.value = ptoffline;
        groupProps.properties.grouponlineClasses.value = grouponline;
        groupProps.properties.groupofflineClasses.value = groupoffline;
        PTProps.properties.restDay.value = restdays
        groupProps.properties.restDay.value = restdays
        customProps.properties.restDay.value = restdays


        if (PTProps.properties.duration.value === 1 || groupProps.properties.duration.value === 1) {
            PTProps.properties.restDay.maximum = 0;
            groupProps.properties.restDay.maximum = 0;
        }

        if (mode === "Online Workout" || mode === "Offline Workout") {
            duration = 1
        } if (fitness_package_type !== "60e045867df648b0f5756c32") {
            duration = 30
        }
        // duration = (mode === "Online Workout" || mode === "Offline Workout") ? 1 : 30;
        setUserData({ ...userData, duration, recordedclasses })
        setFormValues({ ...formValues, duration, recordedclasses })
    }



    const updateInputValue = (formData: { ptonline: number, ptoffline: number, groupoffline: number, grouponline: number }) => {
        const update = { ...formData };
        if (userData.mode === "Online") {
            update.ptoffline = 0
            update.groupoffline = 0
        } else if (userData.mode === "Offline") {
            update.ptonline = 0
            update.grouponline = 0
        } else if (userData.mode === "Online Workout") {
            update.ptoffline = 0
        } else if (userData.mode === "Offline Workout") {
            update.ptonline = 0
        }

        return update
    }

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
                                onClick={(event) => { formRef.current.onSubmit(event) }}
                            >
                                {(step < 6)
                                    ? <>Next<i className="ml-4 fas fa-arrow-right"></i></>
                                    :
                                    <div className='d-flex align-items-center justify-content-center'>
                                        {handleSubmitName(actionType)}
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