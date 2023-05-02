import React, { useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import Icon from '../../../components/Icons';
import moment from 'moment';
import EditOffering from './EditOfferingDetails';

interface ClientBooking{
  fitnesspackages: any[];
  package_duration: number;
  effective_date: Date;
  id: string|number;
}

const OfferingDetails: React.FC<{ Offering: ClientBooking }> = ({ Offering }) => {
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

  return (
    <Col lg={3} sm={12}>
    <Card className="border p-3 rounded mt-5" style={{height: "60%"}}>
      <div className="d-flex justify-content-between">
        <h4 className="col-lg-11 col-11">Offering&apos;s details</h4>
        <div className='col-lg-11 col-sm-1' onClick={() => setShowBookingModal(true)} style={{cursor: "pointer"}}><Icon name="edit" /></div>
      </div>
      <table style={{position: "absolute", top: "50%"}}>
        <tbody>
          <tr>
            <td>
              <b>Offering Name</b>
            </td>
            <td>{Offering.fitnesspackages[0].packagename}</td>
          </tr>
          <tr>
            <td>
              <b>Package Duration</b>
            </td>
            <td>{Offering.package_duration}</td>
          </tr>
          <tr>
            <td>
              <b>Effective date</b>
            </td>
            <td>{moment(Offering.effective_date).format('DD/MM/YYYY,h:mm:ss a ')}</td>
          </tr>
        </tbody>
      </table>
      {showBookingModal ? (
        <EditOffering show={showBookingModal} onHide={() => setShowBookingModal(false)} Offering={Offering} />
      ) : null}
    </Card>
    </Col>
  );
};

export default OfferingDetails;
