import React from 'react';
import { Button, Col, Dropdown, Container, Row } from "react-bootstrap";
import Form from "@rjsf/core";
import { schema, widgets } from "../../profileSchema";

export default function SocialAccount() {
    const accountVerificationJson: { [name: string]: any } = require("./AccountVerification.json");

    return (
        <Container className="m-5">
            <Form
                uiSchema={schema}
                schema={accountVerificationJson}
                //   ref={formRef}
                //   onSubmit={({ formData }: any) => submitHandler(formData)}
                //   formData={webpageDetails}
                widgets={widgets}
            />
        </Container>
    )
}
