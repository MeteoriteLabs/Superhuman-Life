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
            Change Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
            <div className="p-3">
            <h5>Do you want to change the Status?</h5   >
            </div>  
        </Modal.Body>   
        <Modal.Footer>
        <Container>
            <Row>
              <Col xs={6} md={8}>
              <Button variant="danger" onClick={() => setShow(false)}>Cancel</Button>
              </Col>
              <Col xs={6} md={4}>
              <Button variant="success" onClick={() => setShow(false)}>Yes</Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer> 
          
        
      </Modal>
    </>
  );
}

export default StatusModal
