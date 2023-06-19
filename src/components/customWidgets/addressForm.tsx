import React, { ChangeEvent } from 'react';
import { Col, Row, Form } from 'react-bootstrap';

const AddressForm: React.FC<{
  value: {
    city: string;
    address1: string;
    type: string;
    address2: string;
    state: string;
    country: string;
    zipcode: string;
  };
  onChange: (params: string | null) => void;
}> = ({value, onChange}) => {

  const handleChange = (e) => {
    console.log(e, e.target);
    const { name, value } = e.target;

    let formValues = { ...value };
    onChange(JSON.stringify({ ...formValues, [name]: value }));
  };

  return (
    <>
      <h6>Address</h6>

      <Row>
        <Col>
          {' '}
          <Form autoComplete="off">
            <Form.Group className="mb-3" controlId="typeId">
              <Form.Label>Type</Form.Label>
              <Form.Control
                autoComplete="off"
                autoCorrect="off"
                type="text"
                placeholder="Type"
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event)}
                name="type"
                value={value.type}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          {' '}
          <Form.Group className="mb-3" controlId="address1Id">
            <Form.Label>Address1</Form.Label>
            <Form.Control
              autoComplete="off"
              type="text"
              name="address1"
              onChange={handleChange}
              value={value.address1}></Form.Control>
          </Form.Group>
        </Col>
        <Col>
          {' '}
          <Form.Group className="mb-3" controlId="address2Id">
            <Form.Label>Address2</Form.Label>
            <Form.Control
              autoComplete="off"
              type="text"
              placeholder="Address2"
              onChange={handleChange}
              name="address2"
              value={value.address2}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          {' '}
          <Form.Group className="mb-3" controlId="cityIds">
            <Form.Label>City</Form.Label>
            <Form.Control
              autoComplete="off"
              type="text"
              placeholder="City"
              onChange={handleChange}
              name="city"
              value={value.city}
            />
          </Form.Group>
        </Col>
        <Col>
          {' '}
          <Form.Group className="mb-3" controlId="stateIds">
            <Form.Label>State</Form.Label>
            <Form.Control
              autoComplete="off"
              type="text"
              placeholder="State"
              onChange={handleChange}
              name="state"
              value={value.state}
            />
          </Form.Group>
        </Col>
        <Col>
          {' '}
          <Form.Group className="mb-3" controlId="countryIds">
            <Form.Label>Country</Form.Label>
            <Form.Control
              autoComplete="off"
              type="text"
              placeholder="Country"
              onChange={handleChange}
              name="country"
              value={value.country}
            />
          </Form.Group>
        </Col>
        <Col>
          {' '}
          <Form.Group className="mb-3" controlId="cityIds">
            <Form.Label>Zipcode</Form.Label>
            <Form.Control
              autoComplete="off"
              type="text"
              placeholder="Zipcode"
              onChange={handleChange}
              name="zipcode"
              value={value.zipcode}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default AddressForm;
