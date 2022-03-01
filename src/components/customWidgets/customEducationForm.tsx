import { Col, Container, Row, Form, Button } from "react-bootstrap";

function CustomEducationForm(props) {
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    let formValues = { ...props.value };
    props.onChange(JSON.stringify({ ...formValues, [name]: value }));
  };

  console.log(props);
  return (
    <Container className="mt-3">
      <h6>Education</h6>

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
  );
}

export default CustomEducationForm;
