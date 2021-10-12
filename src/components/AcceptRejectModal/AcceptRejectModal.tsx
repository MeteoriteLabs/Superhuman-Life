import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function AcceptRejectModal(props) {

    const { modalTrigger } = props


    const [show, setShow] = useState<boolean>(false);

    modalTrigger.subscribe((res: boolean) => {
        setShow(res);
    });


    function handleClick() {
        props.onClick();
        modalTrigger.next(false)
    }

    return (
        <div  >
            <Modal  show={show} onHide={() => setShow(false)} centered  >
                <Modal.Header closeButton>
                    <Modal.Title>  {props.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <h5>{props.modalBody}</h5 >
                    <p>{props.modalBodyDetail}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClick}>{props.buttonLeft}</Button>
                    <Button variant="danger" onClick={() => modalTrigger.next(false)}>
                        {props.buttonRight}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
