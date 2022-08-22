import { useState } from 'react';
import { Card, Container, Row, Button, Col } from "react-bootstrap";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from "@rjsf/bootstrap-4";
import { schema, widgets } from '../../profileSchema';
import Form from '@rjsf/core';

export default function EducationDetails() {
    const registry = utils.getDefaultRegistry();
    const educationJson: { [name: string]: any } = require("./Education.json");
    const defaultFileWidget = registry.widgets["FileWidget"];
    (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;
    const Form: any = withTheme(Bootstrap4Theme);

    return (
        <Container className="mt-5">
            {/* <Row className="mt-3 ml-3 inline">
              <Col lg={10}><h5>Education</h5></Col>
            </Row> */}
            {/* <hr /> */}
            {/* <Row className="justify-content-end pr-3">
                <Button variant="outline-dark d-flex"><b>New Qualification</b> <img src="assets/plusIcon.svg" alt="add" height="25" style={{marginLeft: '5px'}} /></Button>
            </Row> */}
            <Form
                  uiSchema={schema}
                  schema={educationJson}
                //   ref={formRef}
                //   onSubmit={({ formData }: any) => submitHandler(formData)}
                //   formData={webpageDetails}
                  widgets={widgets}
            />
            
            
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
