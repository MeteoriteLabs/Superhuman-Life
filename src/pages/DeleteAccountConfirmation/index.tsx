import React, { useState, useContext } from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import Form from "@rjsf/core";
import AuthContext from "../../context/auth-context";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_USER_PROFILE_DATA,
  CREATE_DELETE_ACCOUNT,
  FETCH_USER_PROFILE_DATA
} from "./queries";

const emptyAccountDeleteState = {
  Reason_to_Delete: '',
  username: '',
  typeDelete: ''
};

function DeleteAccountConfirmation(props: any) {

  const auth = useContext(AuthContext);
  const [username, setUsername] = useState(null);
  const deleteAccountJson: { [name: string]: any } = require("./DeleteAccountVerification.json");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const uiSchema: any = {
    "typeDelete": {
      "ui:help": "Hint: Enter DELETE in capital letters."
    },
    "username": {
      "ui:help": "Hint: Enter your username"
    },
  }

  const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
    onCompleted: (r: any) => { 
      
    },
  });

  useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      console.log(r.usersPermissionsUser.data.attributes.username);
      setUsername(r.usersPermissionsUser.data.attributes.username);
    },
  });

  function Validate(frm: any, errors: any) {
    console.log(frm);
    if (frm.typeDelete !== "DELETE") {
      errors.typeDelete.addError("Need to enter delete in capital");
    }
    else if(frm.username !== username){
      errors.username.addError("Enter correct username");
    }
    return errors;
  }

  const [createDeleteAccount] = useMutation(CREATE_DELETE_ACCOUNT, {
    onCompleted: (r: any) => {
      updateProfile({
        variables: {
             id: auth.userid,
             data: {
              confirmed: false
             },
        },
   });
    },
  });

  // delete account function
  function deleteAccount(frm: any) {
    console.log(frm.formData);
    if (frm.formData.typeDelete === "DELETE" && frm.formData.username === username) {
      createDeleteAccount({
        variables: {
          data: {
            Reason_to_Delete: frm.formData.Reason_to_Delete,
            users_permissions_user: auth.userid,
          }
        },
      });
    }
    else{
      if(frm.formData.typeDelete !== "DELETE"){
        console.log("Enter DELETE in capital");
      }
      else if (frm.formData.username !== username){
        console.log("Enter correct username");
      }
    }
  }

  function OnSubmit(frm: any) {
    deleteAccount(frm);
  }

  return (
    <>
      {/* Confirmation modal */}
      <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you wish to delete the account?</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleShow} >
            Yes
          </Button>
          <Button variant="danger" >
            No
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Deleting account modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Account Deletion- Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete your account?</h5>
          <Form
            schema={deleteAccountJson}
            onSubmit={(frm: any) => { OnSubmit(frm); }}
            formData={emptyAccountDeleteState}
            uiSchema={uiSchema}
            validate={Validate}
          >
            <Row className="mb-2" style={{ justifyContent: 'center' }}>
              <Button type="submit" size="sm" variant="danger" >
                Delete Permanently
              </Button>
            </Row>
          </Form>

        </Modal.Body>

      </Modal>
    </>
  )
}

export default DeleteAccountConfirmation;
