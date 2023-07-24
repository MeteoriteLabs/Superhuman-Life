import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_TRANSACTION, FETCH_CHANGEMAKER, FETH_CLIENTPACKAGES } from '../Outflow/queries';
import { flattenObj } from 'components/utils/responseFlatten';

function Receipt(): JSX.Element {
    const printReciept = () => {
        window.print();
    };
    const [receiptData, setReceiptData] = useState<any>([]);
    const [userProfile, setUserProfile] = useState<any>([]);
    const [clientPackages, setClientPackages] = useState<any>([]);

    const getIDFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };
    const transactionId = getIDFromURL();

    useQuery(GET_TRANSACTION, {
        variables: { id: transactionId },
        onCompleted: (data) => {
            const flattenReceiptData = flattenObj({ ...data.transaction });
            setReceiptData(flattenReceiptData);
            // console.log('setReceiptData', flattenReceiptData);
            fethclientPackages({
                variables: { id: transactionId }
            });

            if (flattenReceiptData.SenderType == 'Changemaker') {
                fetchChangeMakerQuery({
                    variables: { id: flattenReceiptData.ReceiverID }
                });
            } else if (flattenReceiptData.SenderType == 'Client') {
                fetchChangeMakerQuery({
                    variables: { id: flattenReceiptData.SenderID }
                });
            }
        }
    });

    const [fetchChangeMakerQuery] = useLazyQuery(FETCH_CHANGEMAKER, {
        onCompleted: (data) => {
            const flattenUserProfileData = flattenObj({ ...data.usersPermissionsUser });
            // console.log('flattenUserProfileData', flattenUserProfileData);
            setUserProfile(flattenUserProfileData);
        }
    });
    const [fethclientPackages] = useLazyQuery(FETH_CLIENTPACKAGES, {
        onCompleted: (data) => {
            const flattenClientPackages = flattenObj({ ...data.clientPackage });
            setClientPackages(flattenClientPackages);
        }
    });

    const timestamp = receiptData.TransactionDateTime;
    const dateObj = new Date(timestamp);
    const DateofPayment = dateObj.toLocaleDateString('en-US');

    return (
        <div>
            <div className="text-right mt-2 mb-1">
                <Button variant="dark" onClick={printReciept}>
                    Print
                </Button>
            </div>
            <div className="shadow">
                <div
                    className="ml-1"
                    style={{
                        backgroundColor: 'ButtonFace',
                        height: '50px',
                        fontSize: '30px',
                        fontWeight: '700',
                        borderBottom: '1px solid black'
                    }}
                >
                    Receipt
                </div>
                <div className="d-flex justify-content-between flex-wrap mt-2">
                    <div className="ml-2">
                        <p style={{ textTransform: 'capitalize' }}>
                            <b>Name of Recipient</b> :{' '}
                            {userProfile && userProfile.First_Name && userProfile.Last_Name
                                ? userProfile.First_Name + ' ' + userProfile.Last_Name
                                : null}
                        </p>
                        <p>
                            <b>Phone Number</b> :{' '}
                            {userProfile && userProfile.Phone_Number
                                ? userProfile.Phone_Number
                                : null}
                        </p>
                        <p>
                            <b>Email</b> :{' '}
                            {userProfile && userProfile.email ? userProfile.email : null}
                        </p>
                        <p>
                            <b>Entity</b> : N/A
                        </p>
                    </div>
                    <div className="mr-3">
                        <p>
                            <b>Date of Payment</b> : {DateofPayment}
                        </p>
                        <p style={{ display: 'flex' }}>
                            <b>Status</b> :{' '}
                            {receiptData.SenderType === 'Changemaker' ? (
                                <p
                                    style={{
                                        width: '100px',
                                        height: '28px',
                                        flexShrink: 0,
                                        borderRadius: '20px',
                                        backgroundColor:
                                            receiptData.TransactionStatus == 'Success'
                                                ? '#339B31'
                                                : '#dc3545',
                                        marginLeft: '5px',
                                        color: 'white',
                                        textAlign: 'center',
                                        fontWeight: '500'
                                    }}
                                >
                                    {receiptData.TransactionStatus}
                                </p>
                            ) : (
                                <p
                                    style={{
                                        width: '100px',
                                        height: '28px',
                                        flexShrink: 0,
                                        borderRadius: '20px',
                                        backgroundColor:
                                            receiptData.TransactionStatus == 'SUCCESS'
                                                ? '#339B31'
                                                : '#dc3545',
                                        marginLeft: '5px',
                                        color: 'white',
                                        textAlign: 'center',
                                        fontWeight: '500'
                                    }}
                                >
                                    {receiptData.TransactionStatus}
                                </p>
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h5 style={{ fontWeight: '700' }}>Payment Details</h5>

                <Table striped bordered responsive className="text-center">
                    <thead>
                        <tr>
                            <th>Payment Cycle</th>
                            {receiptData.SenderType === 'Changemaker' ? (
                                <th>Payment Frequency</th>
                            ) : null}
                            <th>Type of Payment</th>
                            <th>Department</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            {clientPackages && clientPackages.package_duration ? (
                                <td>{clientPackages.package_duration}</td>
                            ) : null}

                            <td>N/A</td>
                            {receiptData.SenderType === 'Changemaker' ? (
                                <td>
                                    {receiptData && receiptData.PaymentMode
                                        ? receiptData.PaymentMode
                                        : null}
                                </td>
                            ) : null}
                            <td>N/A</td>
                            <td>
                                {receiptData &&
                                receiptData.Currency &&
                                receiptData.TransactionAmount
                                    ? receiptData.Currency + ' ' + receiptData.TransactionAmount
                                    : null}
                            </td>
                        </tr>
                    </thead>

                    <tbody className="flex">
                        <tr>
                            <td>
                                <b>Net Amount</b>
                            </td>
                            {receiptData.SenderType === 'Changemaker' ? <td></td> : null}
                            <td></td>
                            <td></td>

                            <td>
                                <b>
                                    {receiptData &&
                                    receiptData.Currency &&
                                    receiptData.TransactionAmount
                                        ? receiptData.Currency + ' ' + receiptData.TransactionAmount
                                        : null}
                                </b>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <hr />
            </div>
        </div>
    );
}

export default Receipt;
