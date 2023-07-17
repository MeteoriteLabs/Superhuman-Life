import { useRef, useContext, useState } from 'react';
import { Button, Row, Col, Card, Dropdown, Badge } from 'react-bootstrap';
import PaymentMethodsAction from '../PaymentMethodsAction';
import Loader from 'components/Loader/Loader';
import { useQuery } from '@apollo/client';
import { GET_BANK_DETAILS } from '../queries';
import { flattenObj } from 'components/utils/responseFlatten';
import AuthContext from 'context/auth-context';

function BankAccount() {
    const paymentMethodActionRef = useRef<any>(null);
    const auth = useContext(AuthContext);
    const [bankDetails, setBankDetails] = useState<Record<string, unknown>[]>([]);

    const { refetch: refetch_bank_details } = useQuery(GET_BANK_DETAILS, {
        variables: { id: auth.userid },
        onCompleted: (data) => {
            const flattenBankData = flattenObj({ ...data.bankDetails });
            setBankDetails(flattenBankData);
        }
    });

    //Delete Bank Details function
    const deleteHandler = (data: any) => {
        paymentMethodActionRef.current.TriggerForm({
            id: data.id,
            actionType: 'deleteBankDetails'
        });
    };

    // calling modal for update option
    function updateBankDetails(data: any) {
        paymentMethodActionRef.current.TriggerForm({
            id: data.id,
            actionType: 'editBankDetails',
            modal_status: true
        });
    }

    return (
        <div>
            <PaymentMethodsAction ref={paymentMethodActionRef} callback={refetch_bank_details} />
            <Row className="mt-3">
                <Col md={{ offset: 10 }}>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                            paymentMethodActionRef.current.TriggerForm({
                                actionType: 'bank'
                            });
                        }}
                    >
                        <i className="fas fa-plus-circle"></i> Add Bank Account
                    </Button>
                </Col>
            </Row>
            <Row className="mt-4 pb-3">
                {bankDetails ? (
                    bankDetails.map((currValue: any) => (
                        <Col lg={12} key={currValue.id}>
                            <Card className="m-2" key={currValue.id}>
                                <Card.Body key={currValue.id}>
                                    <Row className="justify-content-end mt-2" key={currValue.id}>
                                        <Col lg={11} xs={10}>
                                            <Badge className="p-2" pill variant="primary">
                                                {currValue.Is_Primary ? 'Primary' : null}
                                            </Badge>
                                        </Col>
                                        <Col lg={1} xs={2}>
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
                                                    {bankDetails.length > 1 ? (
                                                        <Dropdown.Item
                                                            key={1}
                                                            onClick={() => deleteHandler(currValue)}
                                                        >
                                                            Delete
                                                        </Dropdown.Item>
                                                    ) : null}

                                                    <Dropdown.Item
                                                        key={2}
                                                        onClick={() => updateBankDetails(currValue)}
                                                    >
                                                        Edit
                                                    </Dropdown.Item>

                                                    <Dropdown.Item
                                                        key={3}
                                                        onClick={() => {
                                                            paymentMethodActionRef.current.TriggerForm(
                                                                {
                                                                    id: currValue.id,
                                                                    actionType: 'viewBankDetails'
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
                                        <Col sm={12} lg={3}>
                                            <b>Full Name: </b>
                                            {currValue.Full_Name ? currValue.Full_Name : null}
                                        </Col>
                                        <Col sm={12} lg={3}>
                                            <b>Bank Name : </b>
                                            {currValue.Bank_Name && currValue.Bank_Name}
                                        </Col>
                                        <Col sm={12} lg={3}>
                                            <b>IFSC code : </b>
                                            {currValue.IFSC_Code && currValue.IFSC_Code}
                                        </Col>
                                        <Col sm={12} lg={3}>
                                            <b>Account No. : </b>
                                            {currValue.Account_Number && currValue.Account_Number}
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
}

export default BankAccount;
