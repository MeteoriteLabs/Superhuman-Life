import React, { useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import Icon from '../../../components/Icons';
import EditClient from './EditClient';

const ClientDetailsCard: React.FC<{
  Client: {
    First_Name: string;
    Last_Name: string;
    Phone_Number: string;
    email: string;
    id: string | number;
  }[];
}> = ({ Client }) => {
  
  const [showClientModal, setShowClientModal] = useState<boolean>(false);

  return (
    <Col lg={3} sm={12}>
      <Card className="border p-3 rounded mt-5" style={{ height: '60%' }}>
        <div className="d-flex">
          <h4 className="col-lg-11 col-11">Client&apos;s details</h4>
          <div
            className="col-lg-11 col-sm-1"
            onClick={() => setShowClientModal(true)}
            style={{ cursor: 'pointer' }}>
            <Icon name="edit" />
          </div>
        </div>
        <table style={{ position: 'absolute', top: '50%' }}>
          <tbody>
            <tr>
              <td>
                <b>Name</b>
              </td>
              <td>{`${Client[0].First_Name} ${Client[0].Last_Name}`}</td>
            </tr>
            <tr>
              <td>
                <b>Phone no.</b>
              </td>
              <td>{Client[0].Phone_Number}</td>
            </tr>
            <tr>
              <td>
                <b>Email</b>
              </td>
              <td>{Client[0].email}</td>
            </tr>
          </tbody>
        </table>
        {showClientModal ? (
          <EditClient
            show={showClientModal}
            onHide={() => setShowClientModal(false)}
            Client={Client}
          />
        ) : null}
      </Card>
    </Col>
  );
};

export default ClientDetailsCard;
