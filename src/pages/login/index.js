import { useState } from "react";
import { Alert, Modal } from "react-bootstrap";
// import {
//   DropdownMenu,
//   DropdownItem,
//   UncontrolledDropdown,
//   DropdownToggle,
//   FormGroup,
//   InputGroupAddon,
//   InputGroupText,
//   Input,
//   InputGroup,
//   Navbar,
//   Nav,
//   Container,
//   Media,
// } from "reactstrap";
import Form from "@rjsf/bootstrap-4";
import login from "./login.json";
import "./login.css";

export default function Login() {
  const [alert, setAlert] = useState(null);
  const onSubmit = ({ formData }) => {
    console.log("Data submitted: ", formData);
    setAlert({ response: 200, msg: "Sign In Success!" });
  };

  return (
    <div>
      <div className="bg-custom-2 ">
        <div className="header">
          <h1>#BeAChangemaker</h1>
        </div>
      </div>
      <Modal.Dialog className="box stack-top ">
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
    </div>
  );
}
