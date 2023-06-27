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
    const [showClientModal, setShowClientModal] = useState(false);

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
                    <b>Client Name:</b>{' '}
                    {Client && Client.length
                        ? `${Client[0].First_Name} ${Client[0].Last_Name}`
                        : null}
                    <br />
                    <b>Phone number:</b> {Client && Client.length ? Client[0].Phone_Number : null}
                    <br />
                    <b>Email:</b> {Client && Client.length ? Client[0].email : null}
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
    );
};

export default ClientDetailsCard;
