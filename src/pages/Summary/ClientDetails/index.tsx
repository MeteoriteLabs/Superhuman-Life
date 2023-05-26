import React, { useState } from 'react';
import { Card, Row, Button } from 'react-bootstrap';
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
    <Card className="mb-2">
      <Card.Body>
        <Row className="justify-content-end">
          {' '}
          <Button variant="outline-light" onClick={() => setShowClientModal(true)}>
            <img src="/assets/edit.svg" alt="edit" />
          </Button>
        </Row>
        <Card.Title>Client Details</Card.Title>
        <Card.Text>
          <b>Client Name:</b> {`${Client[0].First_Name} ${Client[0].Last_Name}`}
          <br />
          <b>Phone number:</b> {Client[0].Phone_Number}
          <br />
          <b>Email:</b> {Client[0].email}
        </Card.Text>
      </Card.Body>
      {showClientModal ? (
          <EditClient
            show={showClientModal}
            onHide={() => setShowClientModal(false)}
            Client={Client}
          />
        ) : null}
    </Card>

      // <Card className="border p-3 rounded mt-5">
      //   <div className="d-flex">
      //     <h4 className="col-lg-11 col-11">Client&apos;s details</h4>
      //     <div
      //       className="col-lg-11 col-sm-1"
      //       onClick={() => setShowClientModal(true)}
      //       style={{ cursor: 'pointer' }}>
      //       <Icon name="edit" />
      //     </div>
      //   </div>
      //   <table style={{ position: 'absolute', top: '50%' }}>
      //     <tbody>
      //       <tr>
      //         <td>
      //           <b className='mr-2'>Name </b>
      //         </td>
      //         <td>{`${Client[0].First_Name} ${Client[0].Last_Name}`}</td>
      //       </tr>
      //       <tr>
      //         <td>
      //           <b className='mr-2'>Phone no.</b>
      //         </td>
      //         <td>{Client[0].Phone_Number}</td>
      //       </tr>
      //       <tr>
      //         <td>
      //           <b className='mr-2'>Email</b>
      //         </td>
      //         <td>{Client[0].email}</td>
      //       </tr>
      //     </tbody>
      //   </table>
      //   {showClientModal ? (
      //     <EditClient
      //       show={showClientModal}
      //       onHide={() => setShowClientModal(false)}
      //       Client={Client}
      //     />
      //   ) : null}
      // </Card>
  );
};

export default ClientDetailsCard;
