import { useState } from 'react'
import { Button, Col, Modal, Row } from "react-bootstrap";


function StatusModal(props: any) {
  const [show, setShow] = useState<boolean>(true);
  function handleClick() {
    props.onClick();
    setShow(false);
  }
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <div>
            <h5>{props.modalBody}</h5 >
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Row>
              <Col xs={4} md={4} className="ml-4">
                <Button variant="danger" onClick={() => setShow(false)}>{props.buttonLeft}</Button>
              </Col>
              <Col xs={4} md={5} className="ml-4">
                <Button variant="success" onClick={handleClick}>{props.buttonRight}</Button>
              </Col>
            </Row>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StatusModal
