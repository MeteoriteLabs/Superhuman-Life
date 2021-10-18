import { useState } from "react";
import { Modal, Col, Row, Container, Button } from "react-bootstrap";

function DomainModal(props) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header className="p-0 d-flex justify-content-center bg-dark">
        <Modal.Title id="contained-modal-title-vcenter" className=" text-white">
          How to connect to custom domain?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container className="ml-2">
          <Row className="py-2">
            <Col md={{ span: 2, offset: 0 }}>
              <span>
                {" "}
                <b>Step 1</b>
              </span>
            </Col>
            <Col md={{ span: 9, offset: 0 }}>Buy domain</Col>
          </Row>
          <Row className="py-2">
            <Col md={{ span: 2, offset: 0 }}>
              <span>
                {" "}
                <b>Step 2</b>
              </span>
            </Col>
            <Col md={{ span: 9, offset: 0 }}>
              Find setting for redirecting URL
            </Col>
          </Row>
          <Row className="py-2">
            <Col md={{ span: 2, offset: 0 }}>
              <span>
                {" "}
                <b>Step 3</b>
              </span>
            </Col>
            <Col md={{ span: 9, offset: 0 }}>Enter your Sapien URL</Col>
          </Row>
          <Row className="py-2">
            <Col md={{ span: 2, offset: 0 }}>
              <span>
                {" "}
                <b>Step 4</b>
              </span>
            </Col>
            <Col md={{ span: 9, offset: 0 }}>Check settings</Col>
          </Row>
          <Row className="py-2">
            <Col md={{ span: 2, offset: 0 }}>
              <span>
                {" "}
                <b>Step 5</b>
              </span>
            </Col>
            <Col md={{ span: 9, offset: 0 }}>
              Save settings & test your custom domain
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="py-2" md={{ span: 10, offset: 1 }}>
              <small className="font-weight-normal">
                Contact us if you are not able to do it. We will help you do it.
              </small>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="d-flex justify-content-center">
              <Button className="px-5" variant="danger" onClick={props.onHide}>
                Close
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default function DomainModalComponent() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button
        variant="dark"
        className="m-0 border"
        onClick={() => setModalShow(true)}
      >
        Help
      </Button>

      <DomainModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
