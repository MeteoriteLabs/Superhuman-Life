import React from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";

function AddressForm(props) {
  // const initalValues = {
  //   address1: props.value ? props.value.address1 : "",
  //   type: props.value ? props.value.type : "",
  //   address2: props.value ? props.value.address2 : "",
  //   city: props.value ? props.value.city : "",
  //   state: props.value ? props.value.state : "",
  //   country: props.value ? props.value.country : "",
  //   zipcode: props.value ? props.value.zipcode : "",
  //   id: props.value ? props.value.id : "",
  // };

  // const [formValues, setFormValues] = React.useState(initalValues);
  const handleChange = (e) => {
    const { name, value } = e.target;
    // setFormValues({ ...formValues, [name]: value });
    let formValues = { ...props.values };
    props.onChange(JSON.stringify({ ...formValues, [name]: value }));
  };
  // props.onChange(JSON.stringify(formValues));
  // console.log(formValues);

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

// <form>
//         <Row>
//           <Col className="p-0 mb-4">
//             <Row>
//               <Col md={12} className="px-3">
//                 <label>Institute Name</label>
//               </Col>
//               <Col>
//                 <input type="text" name="Institute_Name" />
//               </Col>
//             </Row>
//           </Col>
//           <Col className="p-0 mb-4">
//             {" "}
//             <Row>
//               <Col md={12} className="px-3">
//                 <label for="Type_of_degree">Type Of Degree</label>
//               </Col>
//               <Col>
//                 <select style={{ width: "70%" }} name="Type_of_degree" id="Type_of_degree">
//                   <option value="bachelors">Bachelors</option>
//                   <option value="master">Master</option>
//                 </select>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//         <Row>
//           <Col className="p-0 ">
//             <Row>
//               <Col md={12} className="px-3">
//                 <label>Specialization</label>
//               </Col>
//               <Col xs={{ offset: 0, span: 5 }}>
//                 <input type="text" name="Specialization" />
//               </Col>
//             </Row>
//           </Col>
//           <Col className="p-0 ">
//             <Row>
//               <Col md={12} className="px-3">
//                 <label>Year</label>
//               </Col>
//               <Col>
//                 <input type="text" name="Year" />
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </form>
