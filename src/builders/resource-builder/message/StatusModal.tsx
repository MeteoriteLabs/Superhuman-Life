import {useState} from 'react'
import { Button, Col, Modal, Container, Row } from "react-bootstrap";


function StatusModal() {
    const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <Button variant="light" onClick={() => setShow(true)}>
        Status
      </Button>

      <Modal show={show} onHide={() => setShow(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>
              <Col xs={12} md={8}>
              <Button variant="success" onClick={() => setShow(false)}>Active</Button>
              </Col>
              <Col xs={6} md={4}>
              <Button variant="danger" onClick={() => setShow(false)}>Inactive</Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Update Now</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StatusModal
