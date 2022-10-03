import React, { useState, useContext } from "react";
import Form from "@rjsf/bootstrap-4";
import { Button, Modal, Row } from "react-bootstrap";
import { useMutation, gql } from '@apollo/client';
import AuthContext from "../../context/auth-context";

export default function ChangePassword(props: any) {

  const auth = useContext(AuthContext);
  const [emailSent, setEmailSent] = useState(false);

  const loginSchema: any = require("./changePassword.json");
  const uiSchema: any = {
    "oldPassword": {
      "ui:widget": "password",
      "ui:help": "Hint: Enter your existing password."
    },
    "password": {
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong! minimum password length should be 8."
    },
    "confirm": {
      "ui:widget": "password"
    },
  }


  const UPDATE_PASSWORD = gql`
      mutation updatePassword($userid: ID!, $password: String!) {
        updateUsersPermissionsUser(id: $userid, data: {
          password: $password
        }){
          data{
            id
          }
        }
      }
    `

  const [updatePassword] = useMutation(UPDATE_PASSWORD, { onCompleted: () => { setEmailSent(true) } });


  function onSubmit(formData: any) {
    updatePassword({ variables: { password: formData.confirm, userid: auth.userid } });
  }

  function Validate(formData, errors) {
    if (formData.password !== formData.confirm) {
      errors.confirm.addError("Passwords don't match");
    }
    return errors;
  }

  return (
    <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {emailSent &&
          <div>
            <Row style={{ justifyContent: 'center', justifyItems: 'center' }}>
              <h1><img src="/assets/confirmed.svg" alt="confirmed"></img>Password Changed</h1>
            </Row>
            <Row style={{ justifyContent: 'center', justifyItems: 'center' }}>
              <blockquote className="blockquote text-right">
                <p className="text-danger blockquote-footer">Use your new password to login</p>

              </blockquote>
            </Row>
          </div>
        }
        {!emailSent && <><div>
          <h4>Change Password</h4>
          <p className="text-danger blockquote-footer">Enter New Password</p>
          <hr />
          <Form uiSchema={uiSchema} validate={Validate} schema={loginSchema} showErrorList={false} onSubmit={({ formData }) => onSubmit(formData)}>


            <Row className="mb-2" style={{ justifyContent: 'center' }}>
              <Button type="submit" size="sm" variant="danger">
                Change Password
              </Button>
            </Row>
          </Form>
        </div></>}
      </Modal.Body>
    </Modal>
  );
}