import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function AcceptRejectModal(props) {

    const { render, setRender } = props



    function handleClick() {
        props.onClick();
        setRender(false);
    }

    return (
        <div>
            <Modal
                show={render}
                onHide={() => setRender(false)}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>  {props.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <h5>{props.modalBody}</h5 >
                    <p>{props.modalBodyDetail}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClick}>{props.buttonLeft}</Button>
                    <Button variant="danger" onClick={() => setRender(false)}>
                        {props.buttonRight}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
