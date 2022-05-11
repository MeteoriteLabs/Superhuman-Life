import React, { useState, useContext } from "react";
import Form from "@rjsf/bootstrap-4";
import { Button, Modal, Row } from "react-bootstrap";
import { useMutation, gql } from '@apollo/client';
import AuthContext from "../../context/auth-context";

export default function ChangePassword() {

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
        // console.log(formData);
        updatePassword({ variables: { password: formData.confirm, userid: auth.userid } });
    }

    function Validate(formData, errors) {
      if (formData.password !== formData.confirm) {
        errors.confirm.addError("Passwords don't match");
      }
      return errors;
    }

  return (
    <>
    {/* <Modal.Dialog> */}
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>Sapien Dashboard | Login</title>
        <link rel="canonical" href="https://sapien.systems/" />
      </Helmet> */}
      <Modal.Body>
        {emailSent && 
            <div>
                <Row style={{ justifyContent: 'center', justifyItems: 'center'}}>
                    <h1><img src="/assets/confirmed.svg" alt="confirmed"></img>Password Changed</h1>
                </Row>
                <Row style={{ justifyContent: 'center', justifyItems: 'center'}}>
                <blockquote className="blockquote text-right">
                    <p className="text-danger blockquote-footer">Use your new password to login</p>
                    {/* <footer className="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer> */}
                </blockquote>
                </Row>
            </div>
        }
        {!emailSent && <><div>
          <h4>Change Password</h4>
        <p className="text-danger blockquote-footer">Enter New Password</p>
        <hr />
        <Form uiSchema={uiSchema} validate={Validate} schema={loginSchema} onSubmit={({ formData }) => onSubmit(formData)}>
          {/* { error &&
            <p className="text-danger">Incorrect email or password</p>
          } */}

          <Row className="mb-2" style={{justifyContent: 'center'}}>
            <Button type="submit" size="sm" variant="danger">
                Change Password
            </Button>
          </Row>
        </Form> 
          </div></>}
      </Modal.Body>
    {/* </Modal.Dialog> */}
    </>
  );
}