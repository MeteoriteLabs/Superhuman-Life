import React, { useState } from 'react';
import Form from '@rjsf/bootstrap-4';
import { Link } from 'react-router-dom';
import { Button, Modal, Row } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import EmailForm from './email';

const ForgotPassword: React.FC = () =>  {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const loginSchema: any = require('./forgotPassword.json');
  const uiSchema: any = {
    email: {
      'ui:widget': (props) => {
        return <EmailForm {...props} />;
      }
    }
  };

  const FORGOT_PASSWORD = gql`
    mutation forgotPasswordMutation($email: String!) {
      forgotPassword(email: $email) {
        ok
      }
    }
  `;

  const [forgotPassword] = useMutation(FORGOT_PASSWORD, {
    onCompleted: () => {
      setEmailSent(true);
    }
  });

  function onSubmit(formData: any) {
    forgotPassword({ variables: { email: formData.email } });
  }

  function Validate(formData, errors) {
    const ele = document.getElementsByClassName('invalidEmail');
    if (formData.email) {
      if (ele.length !== 0) {
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
        {emailSent && (
          <div>
            <Row style={{ justifyContent: 'center', justifyItems: 'center' }}>
              <h1>
                <img src="/assets/confirmed.svg" alt="confirmed"></img>Email Sent
              </h1>
            </Row>
            <blockquote className="blockquote text-right">
              <p className="text-danger blockquote-footer">Happens to the best of us</p>
              {/* <footer className="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer> */}
            </blockquote>
            <ul>
              <li>You will receive an email with a link to update your password</li>
              <li>Please update the password and try signing into your account</li>
            </ul>
            <Row style={{ justifyContent: 'center', justifyItems: 'center' }}>
              <Button onClick={() => (window.location.href = '/login')} size="sm" variant="danger">
                Sign in
              </Button>
            </Row>
          </div>
        )}
        {!emailSent && (
          <>
            <h4>Forgot Password</h4>
            <p className="text-danger blockquote-footer">Enter the registered email ID</p>
            <hr />
            <Form
              uiSchema={uiSchema}
              validate={Validate}
              schema={loginSchema}
              onSubmit={({ formData }) => onSubmit(formData)}>
              {/* { error &&
            <p className="text-danger">Incorrect email or password</p>
          } */}

              <Row className="mb-2" style={{ justifyContent: 'center' }}>
                <Button type="submit" size="sm" variant="danger">
                  Reset Password
                </Button>
              </Row>
              <Row className="mb-2" style={{ justifyContent: 'center' }}>
                <span>Or</span>
              </Row>

              <Row style={{ justifyContent: 'center' }}>
                <p>
                  No Account?&nbsp;
                  <Link style={{ color: 'red' }} className="float-right" to="/register">
                    Signup NOW
                  </Link>
                </p>
              </Row>
            </Form>{' '}
          </>
        )}
      </Modal.Body>
    </Modal.Dialog>
  );
}

export default ForgotPassword;
