import React from "react";
import { Col, Container, Row, Form } from "react-bootstrap";

function AddressForm(props) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    let formValues = { ...props.value };
    props.onChange(JSON.stringify({ ...formValues, [name]: value }));
  };

  console.log(props);
  return (
    <Container className="mt-3">
      <h6>Address</h6>

      <Form>
        <Row>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="typeId">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type"
                onChange={handleChange}
                name="type"
                value={props.value.type}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="address1Id">
              <Form.Label>Address1</Form.Label>
              <Form.Control
                type="text"
                name="address1"
                onChange={handleChange}
                value={props.value.address1}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="address2Id">
              <Form.Label>Address2</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address2"
                onChange={handleChange}
                name="address2"
                value={props.value.address2}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="cityIds">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                onChange={handleChange}
                name="city"
                value={props.value.city}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="stateIds">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="State"
                onChange={handleChange}
                name="state"
                value={props.value.state}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="countryIds">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country"
                onChange={handleChange}
                name="country"
                value={props.value.country}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="cityIds">
              <Form.Label>Zipcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="Zipcode"
                onChange={handleChange}
                name="zipcode"
                value={props.value.zipcode}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AddressForm;
