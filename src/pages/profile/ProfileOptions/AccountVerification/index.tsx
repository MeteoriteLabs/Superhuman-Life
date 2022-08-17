import React from 'react';
import { Form, Button, Col, Dropdown, Container, Row } from "react-bootstrap";

export default function SocialAccount() {
    return (
        <Container className="mt-5">
            <Row className="mt-3 ml-3 inline">
            <Col lg={10}><h5>Account Verification</h5></Col>
            <Col lg={2}><Button variant="outline-dark">Edit</Button></Col>
          </Row>
          <hr />
        <Form className="m-5">
            <Form.Row>
                <Form.Group as={Col} controlId="formBasicName">
                    <Form.Label>Type of Identity</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            Select Identity
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group as={Col} controlId="formBasicLastName">
                    <Form.Control type="file" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="formGridContact">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control type="file" accept="image/png, image/jpeg" />
                </Form.Group>
            </Form.Row>

            {/* <Button variant="success" type="submit">
                Save
            </Button> */}
        </Form>
        </Container>
    )
}
