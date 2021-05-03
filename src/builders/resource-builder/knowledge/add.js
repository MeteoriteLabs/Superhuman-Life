import Form from "@rjsf/bootstrap-4";
import { Card } from "react-bootstrap";
import knowledge from "./knowledge.json";

export default function AddKnowledgePage() {
    const onSubmit = ({ formData }) => {
        console.log("Data submitted: ", formData);
    };

    return (
        <Card>
            <Card.Body>
                <Form schema={knowledge} onSubmit={onSubmit} />
            </Card.Body>
        </Card>
    );
}