import Form from '@rjsf/bootstrap-4';
import { Button, Card, Col, Row } from "react-bootstrap";

export default function AddEvent() {
    const eventSchema: any = require("./event.json");
    const uiSchema: any = {
        "summary": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "description": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "items": {
            "about": {
                "ui:widget": "textarea",
                "ui:options": {
                    "rows": 3
                }
            }
        }
    }

    function onSubmit(formData: any) {
        alert("Values submitted: " + JSON.stringify(formData, null, 2));
    }

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <Form uiSchema={uiSchema} schema={eventSchema[1]} onSubmit={onSubmit} formData={{}}>
                            <Button variant="danger" type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card>
                    <Card.Body>This is some text within a card body.</Card.Body>
                </Card>
            </Col>
        </Row>
    );
}