import React, { useState } from 'react';
import { Button, Col, Container, Row } from "react-bootstrap";
import Form from "@rjsf/core";

export default function SocialAccount() {
    const profileJson: { [name: string]: any } = require("../../Profile.json");
    const [step] = useState<number>(4);

    return (
        <Container className="mt-5">
            <Row className="mt-3 ml-3 inline">
            <Col lg={10}><h5>Social Accounts</h5></Col>
            <Col lg={2}><Button variant="outline-dark">Edit</Button></Col>
          </Row>
          <hr />
        {/* <Form className="m-5">
            <Form.Row>
                <Form.Group as={Col} controlId="formBasicName">
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control type="text" placeholder="Instagram" />
                </Form.Group>

                <Form.Group as={Col} controlId="formBasicLastName">
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control type="text" placeholder="Facebook" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="formGridContact">
                    <Form.Label>Youtube</Form.Label>
                    <Form.Control type="text" placeholder="Youtube" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control type="text" placeholder="Twitter" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="formGridContact">
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control type="text" placeholder="LinkedIn" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Clubhouse</Form.Label>
                    <Form.Control type="text" placeholder="Clubhouse" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="formGridContact">
                    <Form.Label>Spotify</Form.Label>
                    <Form.Control type="text" placeholder="Spotify" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Pintrest</Form.Label>
                    <Form.Control type="text" placeholder="Pinterest" />
                </Form.Group>
            </Form.Row>  */}

            {/* <Button variant="success" type="submit">
                Save
            </Button> */}
        {/* </Form> */}
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
