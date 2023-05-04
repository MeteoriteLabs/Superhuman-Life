import React from 'react';
import { Modal } from 'react-bootstrap';
import { schema } from './EditClientSchema';
import Form from '@rjsf/core';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../register/mutations';

interface UserDetail {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
}

const EditClient: React.FC<{
  show: boolean;
  onHide: () => void;
  Client: {
    First_Name: string;
    Last_Name: string;
    Phone_Number: string;
    email: string;
    id: string | number;
  }[];
}> = ({ show, onHide, Client }) => {
  const editClientJson: { [name: string]: any } = require('./EditClientJson.json');

  const formData: UserDetail = {
    firstname: Client[0].First_Name,
    lastname: Client[0].Last_Name,
    email: Client[0].email,
    phone: Client[0].Phone_Number
  };

  const [updateUser] = useMutation(UPDATE_USER);

  const onSubmit = (frm) => {
    updateUser({
      variables: {
        userid: Client[0].id,
        fname: frm.formData.firstname,
        lname: frm.formData.lastname,
        email: frm.formData.email,
        password: `${frm.formData.phone}${frm.formData.firstname}`,
        phone: frm.formData.phone,
        uname: `${frm.formData.firstname}${frm.formData.lastname}`
      }
    });

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Client Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          schema={editClientJson}
          onSubmit={(frm: any) => {
            onSubmit(frm);
          }}
          formData={formData}
          uiSchema={schema}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditClient;
