import React from 'react';
import { Modal } from 'react-bootstrap';
import { schema, widgets } from './EditOfferingSchema';
import Form from '@rjsf/core';
import { UPDATE_CLIENT_BOOKING } from '../queries';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { PackageDetails } from '../Interface.tsx';

interface DefaultClientBooking {
  offerings: string;
  packageDuration: number;
  effectiveDate: string;
}

const EditOffering: React.FC<{ show: boolean; onHide: () => void; Offering: PackageDetails }> = ({
  show,
  onHide,
  Offering
}) => {
  // eslint-disable-next-line
  const editOfferingJson: { [name: string]: any } = require('./EditOffering.json');
  const formData: DefaultClientBooking = {
    offerings: Offering.fitnesspackages[0].packagename,
    packageDuration: Offering.package_duration,
    effectiveDate: moment.utc(Offering.effective_date).format('DD/MM/YYYY,h:mm:ss a ')
  };

  const [updateUser] = useMutation(UPDATE_CLIENT_BOOKING);

  const onSubmit = (formData: {
    packageDuration: number;
    effectiveDate: string;
    offerings: string;
  }) => {
    updateUser({
      variables: {
        id: Offering.id,
        data: {
          package_duration: formData.packageDuration,
          effective_date: formData.effectiveDate
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
          onSubmit={(form) => {
            onSubmit(form.formData);
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
