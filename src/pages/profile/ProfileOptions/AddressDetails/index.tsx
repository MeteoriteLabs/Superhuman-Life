import React from 'react';
import { Card, Container, Row, Button, Col } from "react-bootstrap";

export default function AddressDetails() {
    return (
        <Container className="mt-5">
            <Row className="mt-3 ml-3 inline">
              <Col lg={10}><h5>Addresses</h5></Col>
            </Row>
            <hr />
            <Row className="justify-content-end pr-3">
                <Button variant="outline-dark d-flex"><b>New Address</b> <img src="assets/plusIcon.svg" alt="add" height="25" style={{marginLeft: '5px'}} /></Button>
            </Row>
            <Row className="mt-4">
                <Col>
                <Card>
                    <Card.Body>
                        <Row className='justify-content-end'>
                          <img src="assets/kebabcase.svg" style={{margin:'5px'}} alt="edit" height="15"/>
                        </Row>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>This is some text within a card body.</Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                <Col>
                <Card>
                    <Card.Body>
                        <Row className='justify-content-end'>
                            <img src="assets/kebabcase.svg" style={{margin:'5px'}} alt="edit" height="15"/>
                        </Row>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>This is some text within a card body.</Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                <Col>
                <Card>
                    <Card.Body>
                        <Row className='justify-content-end'>
                          <img src="assets/kebabcase.svg" style={{margin:'5px'}} alt="edit" height="15"/>
                        </Row>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>This is some text within a card body.</Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
    )
}
