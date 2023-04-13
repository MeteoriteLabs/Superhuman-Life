import React from "react";
import { Button, Col, Modal, Row } from 'react-bootstrap';

const StatusModal: React.FC<{
  onClick: () => void;
  onHide: () => void;
  modalBody: string;
  show: boolean;
  modalTitle: string;
  buttonLeft: string;
  buttonRight: string;
}> = (props) => {
  function handleClick() {
    props.onClick();
    props.onHide();
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{props.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <div>
          <h5>{props.modalBody}</h5>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <Row>
            <Col xs={4} md={4} className="ml-4">
              <Button variant="danger" onClick={props.onHide}>
                {props.buttonLeft}
              </Button>
            </Col>
            <Col xs={4} md={5} className="ml-4">
              <Button variant="success" onClick={handleClick}>
                {props.buttonRight}
              </Button>
            </Col>
          </Row>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusModal;
