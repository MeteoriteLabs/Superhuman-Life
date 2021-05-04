import { useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Link } from "react-router-dom";
import { Alert, Button, Modal } from "react-bootstrap";

type StateProps = {
    response: number,
    msg: string | null
}

export default function Register() {
    const [alert, setAlert] = useState<StateProps>({ response: 0, msg: null });
    const registerSchema: any = require("./register.json");
    const uiSchema: any = {
        "gender": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "contact": {
            "ui:options": {
                inputType: 'tel'
            }
        }
    }

    function onSubmit(formData: any) {
        console.log("Data submitted: ", formData);
        setAlert({ response: 200, msg: "Sign Up Success!" });
    };

    return (
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Sapien Systems</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Sign Up</h4>
                <hr />
                {(alert.msg) && (
                    <Alert variant={alert.response === 200 ? "success" : "danger"}>
                        {alert.msg}
                    </Alert>
                )}
                <Form uiSchema={uiSchema} schema={registerSchema} onSubmit={({ formData }) => onSubmit(formData)}>
                    <Button type="submit" variant="danger">
                        Sign Up<i className="ml-2 fas fa-sign-in-alt"></i>
                    </Button>
                    <Link className="float-right" to="/login">
                        Already have an account? Sign in
                    </Link>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <p className="text-muted">
                    2021 ©{" "}
                    <a href="https://sapien.systems/" target="_blank" rel="noreferrer">
                        Sapien
                    </a>{" "}
                    - Partner Dashboard
                </p>{" "}
            </Modal.Footer>
        </Modal.Dialog>
    );
}
