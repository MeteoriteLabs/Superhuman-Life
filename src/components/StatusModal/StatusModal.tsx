import { useState } from 'react'
import { Button, Col, Modal, Row } from "react-bootstrap";


function StatusModal({ modalTitle, modalBody, buttonLeft, buttonRight, modalTrigger, onClick }: any) {
  const [show, setShow] = useState<boolean>(false);

  function handleClick() {
    onClick();
    setShow(false);
  }

  modalTrigger.subscribe((res: boolean) => {
    setShow(res);
  });

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <div>
            <h5>{modalBody}</h5 >
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Row>
              <Col xs={4} md={4} className="ml-4">
                <Button variant="danger" onClick={() => setShow(false)}>{buttonLeft}</Button>
              </Col>
              <Col xs={4} md={5} className="ml-4">
                <Button variant="success" onClick={handleClick}>{buttonRight}</Button>
              </Col>
            </Row>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StatusModal
