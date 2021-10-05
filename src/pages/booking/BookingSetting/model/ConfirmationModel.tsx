import { useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, FormControl, Modal } from 'react-bootstrap'
import authContext from '../../../../context/auth-context';
import { UPDATE_BOOKING_CONFIG } from '../../graphQL/mutation';
import { BOOKING_CONFIG } from '../../graphQL/queries';


interface FormValue {
    id: string,
    isAuto: boolean,
    BookingsPerMonth: number,
    bookingsPerDay: number,
}

export default function ConfirmationModel(props: { render: boolean; setRender: any; formData: any }) {
    const { render, setRender, formData,  } = props;
    const auth = useContext(authContext);

    const [isSwitchOn, setIsSwitchOn] = useState<boolean>(false);

    const [formValue, setFormValue] = useState<FormValue>({
        id: formData.id,
        isAuto: isSwitchOn,
        BookingsPerMonth: formData.bookingPerMonth,
        bookingsPerDay: formData.bookingPerDay,
    })


    const onSwitchAction = () => {
        setIsSwitchOn(!isSwitchOn);
        setFormValue({
            ...formValue,
            isAuto: isSwitchOn
        })
    };



    const [updateBooking] = useMutation(UPDATE_BOOKING_CONFIG);



    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        updateBooking({
            variables: formValue
        })


    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: Number(value)
        })

    }


    useEffect(() => {
        if (formData.confirmations === "Auto Accept") {
            setIsSwitchOn(false)
        } else {
            setIsSwitchOn(true)
        }
    }, [formData])


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

                <Form onSubmit={handleSubmit}>
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
                        <Form.Label className='font-weight-bold'>Package Name:</Form.Label>
                        <p>{formData.packageName}</p>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Maximum booking/per month</Form.Label>
                        <FormControl type='number' name='BookingsPerMonth' defaultValue={formData.bookingPerMonth} onChange={(e) => handleChange(e)} />
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Maximum booking/per day</Form.Label>
                        <FormControl name='bookingsPerDay' defaultValue={formData.bookingPerDay} onChange={(e) => handleChange(e)} />
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
