import React, { useState } from 'react';
import { Col, Container, Row, Form, Button, Modal } from "react-bootstrap";

function CustomEducationForm(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    let formValues = { ...props.value };
    props.onChange(JSON.stringify({ ...formValues, [name]: value }));
  };

  console.log(props);
  return (
    <>
      {/* <Button variant="outline" onClick={handleShow}>
        Launch static backdrop modal
      </Button> */}
      <Button variant="outline-dark d-flex" onClick={handleShow}><b>New Qualification</b> <img src="assets/plusIcon.svg" alt="add" height="25" style={{marginLeft: '5px'}} /></Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="mt-3">
            <h6>New Qualification</h6>
            <hr />
            <Form>
              <Row>
                <Col>
                  {" "}
                  <Form.Group className="mb-3" controlId="instituteId">
                    <Form.Label>Institute Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Institute"
                      onChange={handleChange}
                      name="Institute_Name"
                      value={props.value.Institute_Name}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  {" "}
                  <Form.Group className="mb-3" controlId="degreeId">
                    <Form.Label>Type Of Degree</Form.Label>
                    <Form.Control
                      as="select"
                      type="text"
                      name="Type_of_degree"
                      onChange={handleChange}
                      aria-label="Default select example"
                      style={{ width: "80%" }}
                      value={props.value.Type_of_degree}
                    >
                      <option>Select type of degree</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Master">Master</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  {" "}
                  <Form.Group className="mb-3" controlId="specializationId">
                    <Form.Label>Specialization</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Specialization"
                      onChange={handleChange}
                      name="Specialization"
                      value={props.value.Specialization}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  {" "}
                  <Form.Group className="mb-3" controlId="yearIds">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Year you Graduated"
                      onChange={handleChange}
                      name="Year"
                      value={props.value.Year}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomEducationForm;
