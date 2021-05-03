import Form from "@rjsf/bootstrap-4";
import { Card } from "react-bootstrap";
import message from "./message.json";

export default function AddMessagePage() {
    const onSubmit = ({ formData }) => {
        console.log("Data submitted: ", formData);
    };

    return (
        <Card>
            <Card.Body>
                <Form schema={message} onSubmit={onSubmit} />
            </Card.Body>
        </Card>
    );
}