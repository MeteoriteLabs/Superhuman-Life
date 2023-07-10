import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import { UPDATE_BOOKING_CONFIG } from '../../GraphQL/mutation';

interface FormValue {
    id: string;
    isAuto: boolean;
    BookingsPerMonth: number;
    bookingsPerDay: number;
}

const ConfirmationModel = (props: any) => {
    // const { formData, modalTrigger } = props;
    const [isSwitchOn, setIsSwitchOn] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    props.modalTrigger.subscribe((res: boolean) => {
        setShow(res);
    });

    const [formValue, setFormValue] = useState<FormValue>({
        id: props.formData.id,
        isAuto: isSwitchOn,
        BookingsPerMonth: props.formData.bookingPerMonth,
        bookingsPerDay: props.formData.bookingPerDay
    });

    const onSwitchAction = () => {
        setIsSwitchOn(!isSwitchOn);
        setFormValue({
            ...formValue,
            isAuto: isSwitchOn
        });
    };

    const [updateBooking] = useMutation(UPDATE_BOOKING_CONFIG, {
        onCompleted: () => props.modalTrigger.next(false)
    });

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        updateBooking({
            variables: formValue
        });
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: Number(value)
        });
    };

    useEffect(() => {
        props.formData.confirmations === 'Auto Accept' ? setIsSwitchOn(false) : setIsSwitchOn(true);
    }, [props.formData]);

    return (
        <>
            <Modal size="xl" show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Confirmations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="font-weight-bold">Confirmations</Form.Label>
                            <div className="d-flex">
                                <p>Manual</p>
                                <Form.Switch
                                    checked={!isSwitchOn}
                                    className="mx-4"
                                    onChange={onSwitchAction}
                                />
                                <p>Auto</p>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="font-weight-bold">Package Name:</Form.Label>
                            <p>{props.formData.packageName}</p>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="font-weight-bold">
                                Maximum booking/per month
                            </Form.Label>
                            <FormControl
                                type="number"
                                name="BookingsPerMonth"
                                defaultValue={props.formData.bookingPerMonth}
                                onChange={(e) => handleChange(e)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="font-weight-bold">
                                Maximum booking/per day
                            </Form.Label>
                            <FormControl
                                name="bookingsPerDay"
                                defaultValue={props.formData.bookingPerDay}
                                onChange={(e) => handleChange(e)}
                            />
                        </Form.Group>

                        <Modal.Footer>
                            <Button
                                type="submit"
                                onClick={() => {
                                    props.modalTrigger.next(false);
                                }}
                            >
                                Submit
                            </Button>
                            <Button
                                className="btn btn-danger"
                                onClick={() => {
                                    props.modalTrigger.next(false);
                                }}
                            >
                                Close
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ConfirmationModel;
