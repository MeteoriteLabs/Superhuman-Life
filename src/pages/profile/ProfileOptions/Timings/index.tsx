import { useState } from 'react';
import { Form, Container, Row, Col, Button } from "react-bootstrap";
// import Form from "@rjsf/core";

export default function Timings() {
    const profileJson: { [name: string]: any } = require("../../Profile.json");
    const [step] = useState<number>(2);

    return (
        <Container className="mt-5">
            <Row className="mt-3 ml-3 inline">
            <Col lg={10}><h5>General Timings</h5></Col>
            <Col lg={2}><Button variant="outline-dark">Edit</Button></Col>
          </Row>
          <hr />
        
        <Form inline className="mt-5 ml-5">
            <Form.Group>
                <Form.Label htmlFor="inputPassword6">Opening</Form.Label>
                <Form.Control
                    type="text"
                    className="mx-sm-3"
                    id="inputPassword6"
                    aria-describedby="passwordHelpInline"
                />
                <Form.Label className=" ml-5" htmlFor="inputPassword6">Closing</Form.Label>
                <Form.Control
                    type="text"
                    className="mx-sm-3"
                    id="inputPassword6"
                    aria-describedby="passwordHelpInline"
                />
            </Form.Group>
        </Form> 
        {/* <Form
                // schema={BasicProfile}
                schema={profileJson[step.toString()]}
                // uiSchema={uiSchema}
                // formData={formData}
            >
            </Form> */}
        </Container>
    )
}
