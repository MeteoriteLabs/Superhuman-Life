import { useState } from "react";
import "./templateModal.css";
import { Container, Row, Col, Button, Modal, Image } from "react-bootstrap";
import { templateModalData } from "./TemplateModalData";

function ModalComp(props) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" size="lg">
      <Modal.Header className="d-flex justify-content-center p-0 bg-dark">
        <Modal.Title
          as="h2"
          id="contained-modal-title-vcenter"
          className=" fw-bold text-white "
        >
          Web Template
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container className="p-2">
          {/* start of filter button */}
          <Row>
            <Col className="d-flex justify-content-center p-3">
              <Button variant="outline-success" className="px-5 rounded-pill">
                Filter
              </Button>
            </Col>
          </Row>
          {/* end of filter button */}

          <Row className="p-0">
            {templateModalData.map((data) => (
              <Col
                key={data.id}
                className="p-3 m-0 hover-effect"
                md={{ span: 4, offset: 0 }}
              >
                <Image fluid src={data.image} />
                <div className="button-wrapper">
                  <Button className="border rounded">{data.btnName}</Button>
                </div>
                <Col className="d-flex justify-content-center mt-3">
                  <h5>{data.title}</h5>
                </Col>
              </Col>
            ))}
          </Row>

          <Row className="mt-2">
            <Col
              className="d-flex justify-content-around"
              md={{ span: 4, offset: 4 }}
            >
              <Button variant="outline-success">1</Button>
              <Button variant="outline-success">2</Button>
              <Button variant="outline-success">3</Button>
              <Button variant="outline-success">4</Button>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col className="p-0" md={{ span: 4, offset: 4 }}>
              <span>Don't like the template?</span> <br />
              <span>Contact us for customized website </span>
            </Col>
            <Col md={{ span: 3, offset: 1 }} className="px-1 ">
              <Button variant="success" className="m-0">
                Select Template
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default function WebsiteModalComponent() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button
        className="px-2 border"
        variant="dark"
        onClick={() => setModalShow(true)}
      >
        Show Templates
      </Button>

      <ModalComp show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
