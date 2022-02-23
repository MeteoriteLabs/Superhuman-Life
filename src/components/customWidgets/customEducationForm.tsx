import React from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";

function CustomEducationForm(props) {
  const initialValues = {
    Institute_Name: props.value ? props.value.Institute_Name : "",
    Type_of_degree: props.value ? props.value.Type_of_degree : "",
    Specialization: props.value ? props.value.Specialization : "",
    Year: props.value ? props.value.Year : "",
    id: props.value ? props.value.id : "",
  };

  const [formValues, setFormValues] = React.useState(initialValues);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  props.onChange(JSON.stringify(formValues));
  console.log(formValues);

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
                value={props.value ? props.value.Institute_Name : ""}
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
                value={props.value ? props.value.Type_of_degree : ""}
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
                value={props.value ? props.value.Specialization : ""}
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
                value={props.value ? props.value.Year : ""}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default CustomEducationForm;

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
