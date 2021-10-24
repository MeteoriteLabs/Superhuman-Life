import { useEffect, useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, Row } from "react-bootstrap";

export default function FinanceModal(props) {

    const { name, formSubmit, formSchema, formData, modalTrigger, actionType, widgets, formUISchema } = props

    const registry = utils.getDefaultRegistry();
    const defaultFileWidget = registry.widgets["FileWidget"];
    (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;


    const Form: any = withTheme(Bootstrap4Theme);
    const formRef = useRef<any>(null);
    const [show, setShow] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<any>("");


    useEffect(() => {
        (actionType === "view" || actionType === "edit") ? setFormValues(formData) : setFormValues("")
    }, [formData, actionType])


    modalTrigger.subscribe((res: boolean) => {
        setShow(res);
    });

    function submitHandler(formData: any) {
        setFormValues({ ...formValues, ...formData });

        formSubmit(formData);
    }

    return (
        <div  >
            <Modal size="lg" show={show} onHide={() => setShow(false)} centered  >
                <Modal.Header closeButton>
                    <Modal.Title as={Row}>
                        <Col xs={12} md={12} lg={12}>
                            <p className="lead">{name}</p>
                        </Col>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="show-grid bg-light">
                    <Row>
                        <Col lg={12}>
                            <div style={{ height: '400px', overflowX: 'hidden', overflowY: 'auto' }}>
                                <Form
                                    uiSchema={formUISchema}
                                    disabled={actionType === 'view' ? true : false}
                                    schema={formSchema}
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
                <Modal.Footer className='justify-content-center'>
                    <Button
                        style={{ padding: '5px 40px' }}
                        variant={actionType === "view" ? "danger" : "success"}
                        size="sm"
                        onClick={(event) => {
                            (actionType === "view" ? modalTrigger.next(false) : formRef.current.onSubmit(event))
                        }}
                    >
                        {actionType === "view" ? "Close" : "Save"}
                    </Button>
                </Modal.Footer>










                {/* <Modal.Body>
                    <Container>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3">
                                <Form.Label>Voucher Name</Form.Label>
                                <Form.Control type="text" placeholder="Voucher name ..." />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Discount</Form.Label>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Form.Control type="number" placeholder="Discount ..." className="w-75" />
                                    <p className='mb-0'>Percentage (%) on MRP</p>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="text" placeholder="Start Date ..." />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Expiry Date</Form.Label>
                                <Form.Control type="text" placeholder="Expiry Date ..." />
                            </Form.Group>


                            <Form.Group className="mb-3">
                                <Form.Label>Usage Restriction/Per User</Form.Label>
                                <Form.Control type="number" placeholder="Usage Restriction ..." />
                            </Form.Group>


                            <div className="mb-0 d-flex justify-content-center">
                                <Button className='px-5' variant="success" onClick={() => {
                                    modalTrigger.next(false)
                                }}>Save</Button>
                            </div>
                        </Form>
                    </Container>
                </Modal.Body> */}


            </Modal>
        </div>
    )
}
