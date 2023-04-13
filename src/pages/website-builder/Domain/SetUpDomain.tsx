import React, { useState } from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import './SetUpDomain.css';

const HelpModal: React.FC<{ show?: boolean; onHide?: () => void }> = (props) => {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header className="p-0 d-flex justify-content-center bg-dark">
        <Modal.Title id="contained-modal-title-vcenter" className=" text-white">
          Domains
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Form>
          <Form.Group>
            <Row>
              <Col md={{ span: 4, offset: 0 }} className="d-flex align-items-center">
                <Form.Label>Sapien Address</Form.Label>
              </Col>
              <Col md={{ span: 8, offset: 0 }}>
                <Form.Control
                  type="text"
                  placeholder="https://                        .sapienlife.app"
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col md={{ span: 4, offset: 0 }} className="d-flex align-items-center">
                <Form.Label>Web Address</Form.Label>
              </Col>
              <Col md={{ span: 8, offset: 0 }}>
                <Form.Control type="text" />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="success" className="px-5">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const SetUpDomain: React.FC = () => {
  const [modalShow, setModalShow] = useState<boolean>(false);

  return (
    <>
      <p onClick={() => setModalShow(true)} className="edit_tag">
        Edit
      </p>

      <HelpModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default HelpModal;
