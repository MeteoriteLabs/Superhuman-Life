import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DeleteSvg from '../assets/delete.svg';

const EventEditModal = (props: any) => {
     const [showModal, setShowModal] = useState(false);

     const handleClose = () => setShowModal(false);
     const handleShow = () => setShowModal(true);

     return (
          <>
               <img src={DeleteSvg} onClick={handleShow} alt="edit" style={{ cursor: 'pointer' }} height="16px" />

               <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                         <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                         <Button variant="secondary" onClick={handleClose}>
                              Close
                         </Button>
                         <Button variant="primary" onClick={handleClose}>
                              Save Changes
                         </Button>
                    </Modal.Footer>
               </Modal>
          </>
     )
}

export default EventEditModal;