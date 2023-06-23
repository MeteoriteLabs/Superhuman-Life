import React, { useState } from 'react';
import { Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import EditOffering from './EditOfferingDetails';
import {ClientUserType} from '../interface';

// interface ClientBooking {
//   fitnesspackages: any[];
//   package_duration: number;
//   effective_date: Date;
//   id: string | number;
// }

const OfferingDetails: React.FC<{ Offering: ClientUserType }> = ({ Offering }) => {
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

  return (
    <Card className="mb-2">
      <Card.Body>
        <Row className="justify-content-end">
          {' '}
          <Button variant="outline-light" onClick={() => setShowBookingModal(true)}>
            <img src="/assets/edit.svg" alt="edit" />
          </Button>
        </Row>
        <Card.Title>Offering Details</Card.Title>
        <Card.Text>
          <b>Offering Name:</b> {Offering.fitnesspackages[0].packagename}
          <br />
          <b>Package Duration:</b> {Offering.package_duration}
          {Offering.package_duration === 1 ? ' day' : ' days'}
          <br />
          <b>Effective date:</b> {moment(Offering.effective_date).format('DD/MM/YYYY,h:mm:ss a ')}
        </Card.Text>
      </Card.Body>
      {showBookingModal ? (
        <EditOffering
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          Offering={Offering}
        />
      ) : null}
    </Card>
  );
};

export default OfferingDetails;
