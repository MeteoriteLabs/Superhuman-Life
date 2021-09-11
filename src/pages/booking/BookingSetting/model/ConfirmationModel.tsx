import React, { useState } from 'react'
import { Button, Form, FormControl, Modal } from 'react-bootstrap'

export default function ConfirmationModel(props) {
    const { render, setRender } = props;

    const [isSwitchOn, setIsSwitchOn] = useState(false);


    const onSwitchAction = () => {
        setIsSwitchOn(!isSwitchOn);
    };


    const HandleSubmit = (e) => {
        e.preventDefault();
    }

    const handleChange = (e) => {


    }

    return (
        <Modal
            show={render}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setRender(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Booking Confirmations
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form onSubmit={HandleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Confirmations</Form.Label>
                        <div className='d-flex'>
                            <p>Manual</p>
                            <Form.Switch
                                checked={!isSwitchOn}
                                className='mx-4'
                                onChange={onSwitchAction} />
                            <p>Auto</p>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Program Name:</Form.Label>
                        <p>123</p>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Maximum booking/per month</Form.Label>
                        <FormControl onChange={(e) => handleChange(e)} name='description' />
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Maximum booking/per day</Form.Label>
                        <FormControl onChange={(e) => handleChange(e)} name='description' />
                    </Form.Group>

                    
                    <Modal.Footer>
                        <Button type='submit' onClick={() => {
                            // setRender(false)
                        }}>Submit</Button>
                        <Button className="btn btn-danger" onClick={() => {
                            setRender(false)
                        }}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
