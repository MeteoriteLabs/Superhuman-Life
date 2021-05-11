import { useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Link } from "react-router-dom";
import { Alert, Button, Modal } from "react-bootstrap";

type StateProps = {
  response: number,
  msg: string | null
}

export default function Login() {
  const [alert, setAlert] = useState<StateProps>({ response: 0, msg: null });
  const loginSchema: any = require("./login.json");
  const uiSchema: any = {
    "password": {
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!",
      classNames: "test"
    }
  }

  function onSubmit(formData: any) {
    console.log("Data submitted: ", formData);
    setAlert({ response: 200, msg: "Sign In Success!" });
  };

  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Sapien Systems</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Sign In</h4>
        <hr />
        {(alert.msg) && (
          <Alert variant={alert.response === 200 ? "success" : "danger"}>
            {alert.msg}
          </Alert>
        )}
        <Form uiSchema={uiSchema} schema={loginSchema} onSubmit={({ formData }) => onSubmit(formData)}>
          <Button type="submit" variant="danger">
            Sign In<i className="ml-2 fas fa-sign-in-alt"></i>
          </Button>
          <Link className="float-right" to="/register">
            Don't have an account? Sign Up
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
