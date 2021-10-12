import React, { useState } from 'react'
import { Button, Modal, Form, Container } from 'react-bootstrap'

export default function CreateVoucherModal(props) {

    const { modalTrigger } = props


    const [show, setShow] = useState<boolean>(false);

    modalTrigger.subscribe((res: boolean) => {
        setShow(res);
    });


    const handleSubmit = () => {


    }

    return (
        <div  >
            <Modal size="lg" show={show} onHide={() => setShow(false)} centered  >
                <Modal.Header closeButton>
                    <Modal.Title>Create Voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form onSubmit={handleSubmit}>
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
                </Modal.Body>


            </Modal>
        </div>
    )
}
