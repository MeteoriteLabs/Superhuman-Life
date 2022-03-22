import React, { useState } from "react";
import { Button, Modal, Row } from "react-bootstrap";
import { useMutation, gql } from '@apollo/client';
import { useLocation } from "react-router-dom";

export default function ForgotPassword() {

    let query = new URLSearchParams(useLocation().search);
    const confirmation = query.get("confirmation");
    const [emailSent, setEmailSent] = useState(false);

    const CONFIRM_ACCOUNT = gql`
      mutation accountConfirmation($confirmation: String!) {
        emailConfirmation(confirmation: $confirmation) {
            jwt
          }
      }
    `;

    const [confirmAccount] = useMutation(CONFIRM_ACCOUNT, { onCompleted: () => { setEmailSent(true) } });

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
                    <h1 style={{color: '#30962E'}}><img src="/assets/confirmed.svg" alt="confirmed"></img>Email Verified</h1>
                </Row>
                <blockquote className="blockquote text-right">
                    <p className="text-danger blockquote-footer">Do not share your password with others</p>
                    {/* <footer className="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer> */}
                </blockquote>
                <Row style={{ justifyContent: 'center', justifyItems: 'center'}}>
                    <Button onClick={() => window.location.href = '/login'} size="sm" variant="danger">
                        Login
                    </Button>
                </Row>
            </div>
        }
        {!emailSent && <><h4>Email Verification</h4>
        <p className="text-danger blockquote-footer">Verify to use the application</p>
        <hr />

          <Row className="mb-2" style={{justifyContent: 'center'}}>
            <Button onClick={() => { confirmAccount({ variables: {
                confirmation: confirmation
            }})}} type="submit" size="sm" variant="danger">
                Verify Email
            </Button>
          </Row>
         </>}
      </Modal.Body>
    </Modal.Dialog>
  );
}