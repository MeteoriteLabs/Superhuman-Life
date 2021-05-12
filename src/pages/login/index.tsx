import { useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Helmet } from "react-helmet";
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
      "ui:help": "Hint: Make it strong!"
    }
  }

  function onSubmit(formData: any) {
    console.log("Data submitted: ", formData);
    setAlert({ response: 200, msg: "Sign In Success!" });
  };

  return (
    <Modal.Dialog>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sapien Dashboard | Login</title>
        <link rel="canonical" href="https://sapien.systems/" />
      </Helmet>
      <Modal.Body>
        <h4>Sign In</h4>
        <hr />
        {(alert.msg) && (
          <Alert variant={alert.response === 200 ? "success" : "danger"}>
            {alert.msg}
          </Alert>
        )}
        <Form uiSchema={uiSchema} schema={loginSchema} onSubmit={({ formData }) => onSubmit(formData)}>
          <Button type="submit" size="sm" variant="danger">
            Sign In<i className="ml-4 fas fa-arrow-right"></i>
          </Button>
          <Link className="float-right" to="/register">
            Don't have an account? Sign Up
          </Link>
        </Form>
      </Modal.Body>
    </Modal.Dialog>
  );
}
