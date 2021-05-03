import { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Form from "@rjsf/bootstrap-4";
import register from "./register.json";

export default function Register() {
    const [alert, setAlert] = useState(null);
    const onSubmit = ({ formData }) => {
        console.log("Data submitted: ", formData);
        setAlert({ response: 200, msg: "Sign In Success!" });
    };

    return (
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Sapien Systems</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h>Please Sign Up</h>
                <hr />
                {alert && (
                    <Alert variant={alert.response === 200 ? "success" : "danger"}>
                        {alert.msg}
                    </Alert>
                )}
                <Form schema={register} onSubmit={onSubmit}>
                    <Button variant="danger">
                        Sign Up<i className="ml-2 fas fa-sign-in-alt"></i>
                    </Button>
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
