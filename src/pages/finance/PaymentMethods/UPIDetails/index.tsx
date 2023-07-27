import React, { useRef, useContext, useState } from 'react';
import { Button, Row, Col, Card, Dropdown, Badge } from 'react-bootstrap';
import PaymentMethodsAction from '../PaymentMethodsAction';
import Loader from 'components/Loader/Loader';
import { useQuery } from '@apollo/client';
import { GET_UPI_DETAILS } from '../queries';
import { flattenObj } from 'components/utils/responseFlatten';
import AuthContext from 'context/auth-context';

const UPIDetails: React.FC = () => {
    const paymentMethodActionRef = useRef<any>(null);
    const auth = useContext(AuthContext);
    const [upiDetails, setUpiDetails] = useState<Record<string, unknown>[]>([]);

    const { refetch: refetch_upi } = useQuery(GET_UPI_DETAILS, {
        variables: { id: auth.userid },
        onCompleted: (data) => {
            const flattenUPIData = flattenObj({ ...data.upiDetailsChangemakers });
            setUpiDetails(flattenUPIData);
        }
    });

    //Delete User's Education Data function
    const deleteHandler = (data: any) => {
        paymentMethodActionRef.current.TriggerForm({
            id: data.id,
            actionType: 'deleteUPI'
        });
    };

    // calling modal for update option
    function updateUPI(data: any) {
        paymentMethodActionRef.current.TriggerForm({
            id: data.id,
            actionType: 'editUPI',
            modal_status: true
        });
    }

    return (
        <div>
            <PaymentMethodsAction ref={paymentMethodActionRef} callback={refetch_upi} />
            <Row className="mt-3">
                <Col md={{ offset: 10 }}>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                            paymentMethodActionRef.current.TriggerForm({ actionType: 'upi' });
                        }}
                    >
                        <i className="fas fa-plus-circle"></i> Add UPI
                    </Button>
                </Col>
            </Row>
            <Row className="mt-4 pb-3">
                {upiDetails ? (
                    upiDetails.map((currValue: any, index: number) => (
                        <Col lg={12} key={currValue.id}>
                            <Card className="m-2" key={currValue.id}>
                                <Card.Body key={currValue.id}>
                                    <Row className="mt-2" key={currValue.id}>
                                        <Col xs={9} lg={11}>
                                            {currValue.Is_Primary ? (
                                                <Badge pill variant="primary" className="p-2">
                                                    {' '}
                                                    Primary{' '}
                                                </Badge>
                                            ) : null}
                                        </Col>
                                        <Col xs={2} lg={1}>
                                            <Dropdown key={currValue.id}>
                                                <Dropdown.Toggle
                                                    variant="bg-light"
                                                    id="dropdown-basic"
                                                >
                                                    <img
                                                        src="/assets/kebabcase.svg"
                                                        alt="notification"
                                                        className="img-responsive "
                                                        style={{ height: '20px', width: '20px' }}
                                                    />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu key={currValue.id}>
                                                    {upiDetails.length > 1 ? (
                                                        <Dropdown.Item
                                                            key={1}
                                                            onClick={() => deleteHandler(currValue)}
                                                        >
                                                            Delete
                                                        </Dropdown.Item>
                                                    ) : null}
                                                    <Dropdown.Item
                                                        key={2}
                                                        onClick={() => updateUPI(currValue)}
                                                    >
                                                        Edit
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        key={3}
                                                        onClick={() => {
                                                            paymentMethodActionRef.current.TriggerForm(
                                                                {
                                                                    id: currValue.id,
                                                                    actionType: 'viewUPIDetails'
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        View
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col sm={12} lg={4}>
                                            <b>Full Name: </b>
                                            {currValue.Full_Name ? currValue.Full_Name : null}
                                        </Col>
                                        <Col sm={12} lg={4}>
                                            <b>UPI ID : </b>
                                            {currValue.UPI_ID && currValue.UPI_ID}
                                        </Col>
                                        <Col sm={12} lg={4}>
                                            <b>Phone no. : </b>
                                            {currValue.phone_number && currValue.phone_number}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Loader msg={'UPI Details loading'} />
                )}
            </Row>
        </div>
    );
};

export default UPIDetails;
