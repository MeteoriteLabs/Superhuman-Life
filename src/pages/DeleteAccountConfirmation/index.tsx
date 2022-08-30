import React, { useState } from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import Form from "@rjsf/core";

function DeleteAccountConfirmation(props: any) {
  const deleteAccountJson: { [name: string]: any } = require("./DeleteAccountVerification.json");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
    {/* Confirmation modal */}
      <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you wish to delete the account?</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleShow} >
            Yes
          </Button>
          <Button variant="danger" >
            No
          </Button>
        </Modal.Footer>
      </Modal>

     {/* Deleting account modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Account Deletion- Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete your account?</h5>
          <Form
                // ref={formRef}
                schema={deleteAccountJson}
                // formData={webpageDetails}
                // onSubmit={(frm: any) => { OnSubmit(frm); }}
          >
                <Row className="mb-2" style={{ justifyContent: 'center' }}>
              <Button type="submit" size="sm" variant="danger">
                Delete Permanently
              </Button>
              </Row>
          </Form>
            

        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Delete Permanently
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  )
}

export default DeleteAccountConfirmation;
