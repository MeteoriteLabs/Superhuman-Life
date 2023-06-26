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
  // eslint-disable-next-line
  const editClientJson: { [name: string]: any } = require('./EditClientJson.json');

  const formData: UserDetail = {
    firstname: Client[0].First_Name,
    lastname: Client[0].Last_Name,
    email: Client[0].email,
    phone: Client[0].Phone_Number
  };

  const [updateUser] = useMutation(UPDATE_USER);

  const onSubmit = (formData: UserDetail) => {
    updateUser({
      variables: {
        userid: Client[0].id,
        fname: formData.firstname,
        lname: formData.lastname,
        email: formData.email,
        password: `${formData.phone}${formData.firstname}`,
        phone: formData.phone,
        uname: `${formData.firstname}${formData.lastname}`
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
          onSubmit={(form) => {
            onSubmit(form.formData);
          }}
          formData={formData}
          uiSchema={schema}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditClient;
