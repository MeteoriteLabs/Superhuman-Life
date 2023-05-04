import React from 'react';
import { Modal } from 'react-bootstrap';
import { schema, widgets } from './EditOfferingSchema';
import Form from '@rjsf/core';
import { UPDATE_CLIENT_BOOKING } from '../queries';
import { useMutation } from '@apollo/client';
import moment from 'moment';

interface ClientBooking {
  fitnesspackages: any[];
  package_duration: number;
  effective_date: Date;
  id: string | number;
}

interface DefaultClientBooking {
  offerings: any;
  packageDuration: number;
  effectiveDate: string;
}

const EditOffering: React.FC<{ show: boolean; onHide: () => void; Offering: ClientBooking }> = ({
  show,
  onHide,
  Offering
}) => {
  
  const editOfferingJson: { [name: string]: any } = require('./EditOffering.json');
  const formData: DefaultClientBooking = {
    offerings: Offering.fitnesspackages[0].packagename,
    packageDuration: Offering.package_duration,
    effectiveDate: moment.utc(Offering.effective_date).format('DD/MM/YYYY,h:mm:ss a ')
  };

  const [updateUser] = useMutation(UPDATE_CLIENT_BOOKING);

  const onSubmit = (frm) => {
    updateUser({
      variables: {
        id: Offering.id,
        data: {
          package_duration: frm.formData.packageDuration,
          effective_date: frm.formData.effectiveDate
        }
      }
    });

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Client Booking Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          schema={editOfferingJson}
          onSubmit={(frm: any) => {
            onSubmit(frm);
          }}
          widgets={widgets}
          formData={formData}
          uiSchema={schema}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditOffering;
