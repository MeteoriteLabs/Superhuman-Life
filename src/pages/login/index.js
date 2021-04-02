import { useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import Form from "@rjsf/bootstrap-4";
import login from "./login.json";

export default function Login() {
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
        <h>Please Sign In</h>
        <hr />
        {alert && (
          <Alert variant={alert.response === 200 ? "success" : "danger"}>
            {alert.msg}
          </Alert>
        )}
        <Form schema={login} onSubmit={onSubmit} />
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
