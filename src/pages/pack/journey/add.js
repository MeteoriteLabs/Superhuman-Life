import { useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Card } from "react-bootstrap";

import step1 from "./journey-1.json";
import step2 from "./journey-2.json";
import step3 from "./journey-3.json";
import step4 from "./journey-4.json";

export default function AddEventPage() {
    const steps = [step1, step2, step3, step4];
    const [step, setStep] = useState(0);
    const [formValues, setFormValues] = useState({});

    const onSubmit = ({ formData }) => {
        if (step < 3) {
            console.log("Data submitted: ", formData);
            setStep(step + 1);
            setFormValues({ ...formValues, ...formData });
        } else {
            alert("Values submitted: " + JSON.stringify(formValues, null, 2));
        }
    };

    return (
        <Card>
            <Card.Body>
                <Form schema={steps[step]} onSubmit={onSubmit} />
            </Card.Body>
        </Card>
    );
}