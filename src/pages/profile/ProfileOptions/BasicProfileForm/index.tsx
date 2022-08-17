import React, { useState } from 'react';
import Form from "@rjsf/core";
import { Button, Col, Container, Row } from 'react-bootstrap';

export default function BasicProfileForm() {
    const profileJson: { [name: string]: any } = require("./BasicProfile.json");
    // const BasicProfile = require("./BasicProfile.json");
    const [step] = useState<number>(1);
    return (
        <Container className="mt-5">
          <Row className="mt-3 ml-3 inline">
            <Col lg={10}><h5>Basic Profile</h5></Col>
            <Col lg={2}><Button variant="outline-dark">Edit</Button></Col>
          </Row>
          <hr />
        {/* <Form className="m-5">
            <Form.Row>
                <Form.Group as={Col} controlId="formBasicName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" />
                </Form.Group>

                <Form.Group as={Col} controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" />
                </Form.Group>
            </Form.Row>

            <Form.Group controlId="formBasicDesignation">
                <Form.Label>Designation</Form.Label>
                <Form.Control type="text" placeholder="Designation" />
            </Form.Group>

            <Form.Group controlId="formBasicAbout">
                <Form.Label>About</Form.Label>
                <FormControl as="textarea" aria-label="With textarea" />
            </Form.Group>
            
            <Form.Row>
                <Form.Group as={Col} controlId="formGridContact">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control type="number" placeholder="Contact" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
            </Form.Row>

            <Form.Group controlId="formBasicWebsite">
                <Form.Label>Website</Form.Label>
                <Form.Control type="text" placeholder="Website" />
            </Form.Group>

            <Button variant="success" type="submit">
                Save
            </Button>
        </Form> */}


            <Form
            //   schema={BasicProfile}
              schema={profileJson[step.toString()]}
            //   uiSchema={uiSchema}
            //   formData={formData}
            >
            </Form>
            
        </Container>
    )
}

