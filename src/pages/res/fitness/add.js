import { Card } from "react-bootstrap";
import Form from "@rjsf/core";
import fitness from "../../../schemas/fitness.json";

export default function ResAddFitnessPage() {
    const onSubmit = ({ formData }) => {
        console.log("Data submitted: ", formData);
    };

    return (
        <Card>
            <Card.Body>
                <Form schema={fitness} onSubmit={onSubmit} />
            </Card.Body>
        </Card>
    );
}