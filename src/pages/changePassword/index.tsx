import React, { useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Button, Modal, Row } from "react-bootstrap";
import { useMutation, gql } from '@apollo/client';

export default function ChangePassword() {

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

    const FORGOT_PASSWORD = gql`
      mutation forgotPasswordMutation($email: String!) {
        forgotPassword(email: $email){
          ok
        }
      }
    `

    const [forgotPassword] = useMutation(FORGOT_PASSWORD, { onCompleted: () => { setEmailSent(true) } });

  
    function onSubmit(formData: any) {
        console.log(formData.email);
        console.log(formData);
        forgotPassword({ variables: { email: formData.email } });
    }

    function Validate(formData, errors) {
        var ele = document.getElementsByClassName("invalidEmail");
        if(formData.email) {
            if(ele.length !== 0){
                errors.email.addError('Please enter a valid email address');
            }
        }
        return errors;
    }

  return (
    <Modal.Dialog>
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>Sapien Dashboard | Login</title>
        <link rel="canonical" href="https://sapien.systems/" />
      </Helmet> */}
      <Modal.Body>
        {emailSent && 
            <div>
                <Row style={{ justifyContent: 'center', justifyItems: 'center'}}>
                    <h1><img src="/assets/confirmed.svg" alt="confirmed"></img>Password Reset</h1>
                </Row>
                <blockquote className="blockquote text-right">
                    <p className="text-danger blockquote-footer">Use your new password to login</p>
                    {/* <footer className="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer> */}
                </blockquote>
                <ul>
                    <li>You will receive an email with a link to update your password</li>
                    <li>Please update the password and try signing into your account</li>
                </ul>
                <Row style={{ justifyContent: 'center', justifyItems: 'center'}}>
                    <Button onClick={() => window.location.href = '/login'} size="sm" variant="danger">
                        Sign in
                    </Button>
                </Row>
            </div>
        }
        {!emailSent && <><h4>Reset Password</h4>
        <p className="text-danger blockquote-footer">Enter New Password</p>
        <hr />
        <Form uiSchema={uiSchema} validate={Validate} schema={loginSchema} onSubmit={({ formData }) => onSubmit(formData)}>
          {/* { error &&
            <p className="text-danger">Incorrect email or password</p>
          } */}

          <Row className="mb-2" style={{justifyContent: 'center'}}>
            <Button type="submit" size="sm" variant="danger">
                Reset Password
            </Button>
          </Row>
        </Form> </>}
      </Modal.Body>
    </Modal.Dialog>
  );
}