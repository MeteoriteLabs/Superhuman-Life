import Form from "@rjsf/bootstrap-4";
import { Card } from "react-bootstrap";
import fitness from "./fitness.json";

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