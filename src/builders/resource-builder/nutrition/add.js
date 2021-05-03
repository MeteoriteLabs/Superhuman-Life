import Form from "@rjsf/bootstrap-4";
import { Card } from "react-bootstrap";
import nutrition from "./nutrition.json";

export default function ResAddNutritionPage() {
    const onSubmit = ({ formData }) => {
        console.log("Data submitted: ", formData);
    };

    return (
        <Card>
            <Card.Body>
                <Form schema={nutrition} onSubmit={onSubmit} />
            </Card.Body>
        </Card>
    );
}