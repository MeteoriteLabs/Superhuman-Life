import { useContext } from "react";
import Form from "@rjsf/bootstrap-4";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import authContext from "../../context/auth-context";

export default function Login() {
  const auth = useContext(authContext);
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
    auth.login("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", formData.email);
  }

  return (
    <Modal.Dialog>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sapien Dashboard | Login</title>
        <link rel="canonical" href="https://sapien.systems/" />
      </Helmet>
      <Modal.Body>
        <h4>Welcome Back!</h4>
        <p className="text-danger blockquote-footer">Sign In Using</p>
        <hr />
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
