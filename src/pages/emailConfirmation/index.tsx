import React, { useState, useEffect } from "react";
import { Button, Modal, Row } from "react-bootstrap";
import { useMutation, gql } from '@apollo/client';
import { useLocation } from "react-router-dom";

export default function ForgotPassword() {

    let query = new URLSearchParams(useLocation().search);
    const confirmation = query.get("confirmation");
    const [emailSent, setEmailSent] = useState(false);
    const [errorVerification, setErrorVerification] = useState(false);

    const CONFIRM_ACCOUNT = gql`
      mutation accountConfirmation($confirmation: String!) {
        emailConfirmation(confirmation: $confirmation) {
            jwt
          }
      }
    `;

    const [confirmAccount] = useMutation(CONFIRM_ACCOUNT, { onCompleted: () => { setEmailSent(true) }, onError: () => {setErrorVerification(true)} });

    useEffect(() => {
      confirmAccount({ variables: {
        confirmation: confirmation
      }});
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <>
    {emailSent && <Modal.Dialog>
      <Modal.Body>
      {emailSent && 
            <div>
                <Row style={{ justifyContent: 'center', justifyItems: 'center'}}>
                    <h1 style={{color: '#30962E'}}><img src="/assets/confirmed.svg" alt="confirmed"></img>Email Verified</h1>
                </Row>
                <blockquote className="blockquote text-right">
                    <p className="text-danger blockquote-footer">Do not share your password with others</p>
                </blockquote>
                <Row style={{ justifyContent: 'center', justifyItems: 'center'}}>
                    <Button onClick={() => window.location.href = '/login'} size="sm" variant="danger">
                        Login
                    </Button>
                </Row>
            </div>
        }
      </Modal.Body>
    </Modal.Dialog>}

    {errorVerification && <Modal.Dialog>
      <Modal.Body>
        <div>
            <Row style={{ justifyContent: 'center', justifyItems: 'center'}}>
                <h1 style={{color: 'red'}}><img src="/assets/confirmed.svg" alt="confirmed"></img>Email Not Verified</h1>
            </Row>
            <blockquote className="blockquote text-right">
                <p className="text-danger blockquote-footer">Link Not Valid</p>
            </blockquote>
        </div>
      </Modal.Body>
    </Modal.Dialog>}
    </>
  );
}