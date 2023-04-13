import React, { useState } from 'react';
import Form from '@rjsf/bootstrap-4';
import { Button, Modal, Row } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const code = query.get('code');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const loginSchema = require('./resetPassword.json');
  const uiSchema = {
    password: {
      'ui:widget': 'password',
      'ui:help': 'Hint: Make it strong! minimum password length should be 8.'
    },
    confirm: {
      'ui:widget': 'password'
    }
  };

  const RESET_PASSWORD = gql`
    mutation resetPasswordMutation($pass: String!, $confirmPass: String!, $code: String!) {
      resetPassword(password: $pass, passwordConfirmation: $confirmPass, code: $code) {
        jwt
      }
    }
  `;

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      setEmailSent(true);
    }
  });

  function onSubmit(formData) {
    resetPassword({
      variables: { pass: formData.password, confirmPass: formData.confirm, code: code }
    });
  }

  function Validate(formData, errors) {
    if (formData.password !== formData.confirm) {
      errors.confirm.addError("Passwords don't match");
    }
    return errors;
  }

  return (
    <Modal.Dialog>
      <Modal.Body>
        {emailSent && (
          <div>
            <Row style={{ justifyContent: 'center', justifyItems: 'center' }}>
              <h1 style={{ color: '#30962E' }}>
                <img src="/assets/confirmed.svg" alt="confirmed"></img>Password Updated
              </h1>
            </Row>
            <blockquote className="blockquote text-right">
              <p className="text-danger blockquote-footer">
                Do not share your password with others
              </p>
            </blockquote>
            <Row style={{ justifyContent: 'center', justifyItems: 'center' }}>
              <Button onClick={() => (window.location.href = '/login')} size="sm" variant="danger">
                Login
              </Button>
            </Row>
          </div>
        )}
        {!emailSent && (
          <>
            <h4>Forgot Password</h4>
            <p className="text-danger blockquote-footer">Enter New Password</p>
            <hr />
            <Form
              uiSchema={uiSchema}
              validate={Validate}
              schema={loginSchema}
              onSubmit={({ formData }) => onSubmit(formData)}>
              <Row className="mb-2" style={{ justifyContent: 'center' }}>
                <Button type="submit" size="sm" variant="danger">
                  Update
                </Button>
              </Row>
            </Form>{' '}
          </>
        )}
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default ForgotPassword;
